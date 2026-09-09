import type {
  Drawer3dConfigInterface,
  DrawerInterface,
  EventManagerInterface,
  MouseEventListenerCallback,
} from './types';
import type { ColorVector, TypesConfig, WorldConfig } from '../config/types';
import type { AtomInterface, LinkInterface } from '../simulation/types/atomic';
import {
  Scene,
  Engine,
  Camera,
  FreeCamera,
  UniversalCamera,
  AnaglyphFreeCamera,
  Vector3,
  Quaternion,
  Matrix,
  Light,
  PointLight,
  Mesh,
  AbstractMesh,
  StandardMaterial,
  MeshBuilder,
} from 'babylonjs';
import type { NumericVector } from '../math/types';
import type { LinkManagerInterface } from '../simulation/types/utils';
import { EventManager } from '../drawer/utils';

// Единичная ось Y: цилиндр в Babylon ориентирован вдоль неё
const UNIT_Y = new Vector3(0, 1, 0);

export class Drawer3d implements DrawerInterface {
  public readonly eventManager: EventManagerInterface;
  private readonly WORLD_CONFIG: WorldConfig;
  private readonly TYPES_CONFIG: TypesConfig;
  private readonly domElement: HTMLCanvasElement;
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly lights: Light[];
  private readonly linksMap: Map<LinkInterface, Mesh> = new Map();
  // Кэш материалов по цветовому ключу "r_g_b": материалы шарятся между
  // мешами одинакового цвета и не диспозятся вместе с мешами
  private readonly materialsCache: Map<string, StandardMaterial> = new Map();
  // Атомы рисуются одним thin-instance мешем: цвет — per-instance атрибут,
  // радиус — масштаб в матрице инстанса. Все атомы = один draw call.
  private atomMesh: Mesh | undefined;
  private atomInstanceCapacity: number = 0;
  // Буферы thin instances: матрица (16 float) и цвет (4 float) на инстанс.
  // Создаются один раз и обновляются на месте (thinInstanceBufferUpdated),
  // т.к. thinInstanceSetBuffer пересоздаёт GPU-буфер.
  private atomMatrices: Float32Array = new Float32Array(0);
  private atomColors: Float32Array = new Float32Array(0);
  // индекс инстанса -> атом: для событий мыши (пикинг thin instances).
  // Перезаписывается каждый кадр без очистки: пикинг возвращает только
  // валидные индексы (< thinInstanceCount), устаревшие записи недостижимы.
  private readonly pickedAtomByIndex: Map<number, AtomInterface> = new Map();
  private readonly bufMatrix: Matrix = Matrix.Identity();
  private readonly bufScale: Vector3 = new Vector3(1, 1, 1);
  private readonly bufTranslation: Vector3 = new Vector3(0, 0, 0);
  private static readonly IDENTITY_QUATERNION: Quaternion = Quaternion.Identity();
  // Направление связи для кватерниона ориентации (переиспользуемый буфер)
  private readonly bufDirection: Vector3 = new Vector3(0, 1, 0);
  private readonly DEFAULT_CAMERA_POSITION: NumericVector = [631, 679, 805];
  private readonly DEFAULT_CAMERA_ROTATION: NumericVector = [0.54, 97.98, 0];
  private readonly DEFAULT_CAMERA_INTERAXIAL_DISTANCE: number = 0.03;
  private camera: FreeCamera;

  constructor({
    domElement,
    worldConfig,
    typesConfig,
  }: Drawer3dConfigInterface) {
    this.domElement = domElement;
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
    this.engine = new Engine(this.domElement, false, {}, true);
    this.scene = new Scene(this.engine);
    this.camera = this.createFreeCamera(this.DEFAULT_CAMERA_POSITION, this.DEFAULT_CAMERA_ROTATION);
    this.scene.activeCamera!.attachControl(this.domElement);
    this.lights = [
      this.createLight([1000, 1000, 1000], 0.006),
      this.createLight([-200, -630, -598], 0.006),
    ];
    this.engine.runRenderLoop(() => {
      this.normalizeFrame();
      this.scene.render();
    });
    this.scene.skipPointerMovePicking = true;
    this.eventManager = new EventManager();

    this.initEventHandlers();
    (window as any).toggleCamera = () => this.toggleCamera();
  }

  draw(atoms: Array<AtomInterface>, links: LinkManagerInterface): void {
    this.drawAtomsThinstanced(atoms);

    if (!this.WORLD_CONFIG.SIMPLIFIED_VIEW_MODE) {
      for (const [link, drawObject] of this.linksMap) {
        if (!links.has(link)) {
          drawObject.dispose();
          // Материал не диспозим: он кэширован и может использоваться
          // другими мешами
          this.linksMap.delete(link);
        }
      }

      for (const link of links) {
        this.getLinkDrawObject(link);
      }
    }
  }

  // Атомы через thin instances: один меш, один draw call на все атомы.
  // Буферы матриц/цветов создаются один раз и обновляются на месте.
  private drawAtomsThinstanced(atoms: Array<AtomInterface>): void {
    if (this.atomMesh === undefined) {
      this.atomMesh = this.createAtomMesh();
    }

    // Расширение буферов при росте числа атомов (с запасом 1.5x,
    // чтобы не пересоздавать GPU-буфер каждый кадр)
    if (atoms.length > this.atomInstanceCapacity) {
      this.atomInstanceCapacity = Math.ceil(atoms.length * 1.5);
      this.atomMatrices = new Float32Array(this.atomInstanceCapacity * 16);
      this.atomColors = new Float32Array(this.atomInstanceCapacity * 4);
      // staticBuffer=false: буфер обновляемый, данные заливаются
      // через thinInstanceBufferUpdated
      this.atomMesh.thinInstanceSetBuffer('matrix', this.atomMatrices, 16, false);
      this.atomMesh.thinInstanceSetBuffer('color', this.atomColors, 4, false);
    }

    const matrices = this.atomMatrices;
    const colors = this.atomColors;
    const lookup = this.pickedAtomByIndex;
    const radiusBase = this.WORLD_CONFIG.ATOM_RADIUS;
    const radiusMap = this.TYPES_CONFIG.RADIUS;
    const colorsMap = this.TYPES_CONFIG.COLORS;

    for (let i=0; i<atoms.length; ++i) {
      const atom = atoms[i];
      const position = atom.position;

      this.bufScale.setAll(radiusBase * radiusMap[atom.type]);
      this.bufTranslation.set(position[0], position[1], position[2]);
      Matrix.ComposeToRef(this.bufScale, Drawer3d.IDENTITY_QUATERNION, this.bufTranslation, this.bufMatrix);
      this.bufMatrix.copyToArray(matrices, i * 16);

      const color = colorsMap[atom.type];
      const c = i * 4;
      colors[c] = color[0];
      colors[c+1] = color[1];
      colors[c+2] = color[2];
      colors[c+3] = 1;

      lookup.set(i, atom);
    }

    this.atomMesh.thinInstanceCount = atoms.length;
    // Заливка обновлённых данных в GPU-буферы без их пересоздания
    this.atomMesh.thinInstanceBufferUpdated('matrix');
    this.atomMesh.thinInstanceBufferUpdated('color');
    // Актуализация bounding info для пикинга thin instances
    this.atomMesh.thinInstanceRefreshBoundingInfo();
  }

  private createAtomMesh(): Mesh {
    const mesh = MeshBuilder.CreateSphere('atoms', {
      segments: 8,
      diameter: 2,
      updatable: false,
    }, this.scene);
    // Диаметр 2 (радиус 1): реальный радиус задаётся масштабом в матрице
    // инстанса
    mesh.material = this.getWhiteMaterial();
    mesh.thinInstanceEnablePicking = true;
    mesh.alwaysSelectAsActiveMesh = true;
    return mesh;
  }

  // Единый белый материал: итоговый цвет задаётся per-instance атрибутом
  // (INSTANCESCOLOR умножает diffuse на цвет инстанса)
  private getWhiteMaterial(): StandardMaterial {
    const key = '1_1_1';
    let material = this.materialsCache.get(key);
    if (material === undefined) {
      material = new StandardMaterial('material_' + key, this.scene);
      material.diffuseColor.r = 1;
      material.diffuseColor.g = 1;
      material.diffuseColor.b = 1;
      material.freeze();
      this.materialsCache.set(key, material);
    }
    return material;
  }

  public clear() {
    this.atomMesh?.dispose();
    this.atomMesh = undefined;
    this.atomInstanceCapacity = 0;
    this.atomMatrices = new Float32Array(0);
    this.atomColors = new Float32Array(0);
    this.pickedAtomByIndex.clear();
    this.linksMap.forEach((item) => this.scene.removeMesh(item));
    this.linksMap.clear();
  }

  private applyMeshColor(mesh: Mesh, color: NumericVector): void {
    // Материалы кэшируются по цвету и переиспользуются всеми мешами:
    // раньше каждый меш имел собственный StandardMaterial, и при смене
    // цвета (трансформации атомов меняют типы) материал пересоздавался,
    // а Material.freeze() внутри вызывает markDirty — обход ВСЕХ мешей
    // сцены. Теперь новый материал создаётся только для нового цвета.
    const key = color[0] + '_' + color[1] + '_' + color[2];

    let material = this.materialsCache.get(key);
    if (material === undefined) {
      material = new StandardMaterial('material_' + key, this.scene);
      material.diffuseColor.r = color[0];
      material.diffuseColor.g = color[1];
      material.diffuseColor.b = color[2];
      material.freeze();
      this.materialsCache.set(key, material);
    }

    if (mesh.material !== material) {
      mesh.material = material;
    }
  }

  private normalizeFrame(): void {
    if (this.domElement.width !== this.domElement.clientWidth) {
      this.domElement.width = this.domElement.clientWidth;
    }
    if (this.domElement.height !== this.domElement.clientHeight) {
      this.domElement.height = this.domElement.clientHeight;
    }
  }

  private toggleCamera(): void {
    const [position, rotation] = [this.camera.position, this.camera.rotation];
    this.camera.detachControl();
    this.camera.dispose();
    if (this.camera instanceof AnaglyphFreeCamera) {
      this.camera = this.createFreeCamera([position.x, position.y, position.z], [rotation.x, rotation.y, rotation.z]);
    } else {
      this.camera = this.createAnaglyphCamera([position.x, position.y, position.z], [rotation.x, rotation.y, rotation.z]);
    }
    this.scene.activeCamera = this.camera;
    this.scene.activeCamera.attachControl(this.domElement);
  }

  private createFreeCamera(position: NumericVector, rotation: NumericVector): FreeCamera {
    const camera = new FreeCamera('Camera', new Vector3(...position), this.scene);
    camera.rotation = new Vector3(...rotation);
    camera.speed = 15;
    return camera;
  }

  private createAnaglyphCamera(position: NumericVector, rotation: NumericVector): FreeCamera {
    const camera = new AnaglyphFreeCamera('AnaglyphCamera', new Vector3(...position), this.DEFAULT_CAMERA_INTERAXIAL_DISTANCE, this.scene);
    camera.rotation = new Vector3(...rotation);
    camera.speed = 15;
    return camera;
  }

  private createLight(coords: NumericVector, intensity: number): PointLight {
    const light = new PointLight('Omni', new Vector3(coords[0], coords[1], coords[2]), this.scene);
    light.intensity = intensity;
    return light;
  }

  private createLinkMesh(lhsCoords: NumericVector, rhsCoords: NumericVector, link: LinkInterface, mesh?: Mesh): Mesh {
    const radius = this.getLinkWidth(link)/4;

    if (mesh) {
      this.applyMeshColor(mesh, this.getLinkColor(link));
      return this.updateLinkMeshTransform(lhsCoords, rhsCoords, radius, mesh);
    }

    const newMesh = this.createNewLinkMesh(radius, link.id);
    this.updateLinkMeshTransform(lhsCoords, rhsCoords, radius, newMesh);
    this.applyMeshColor(newMesh, this.getLinkColor(link));
    newMesh.receiveShadows = false;
    newMesh.isPickable = false;
    newMesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;

    return newMesh;
  }

  // Статичная геометрия цилиндра (единичная высота, диаметр 2), каждый кадр
  // меняется только трансформ: позиция середины, ориентация вдоль связи,
  // масштаб (толщина и длина). Раньше здесь был MeshBuilder.CreateTube с
  // instance — он пересобирал vertex-буферы и нормали каждой связи каждый
  // кадр, что доминировало в профиле кадра.
  private updateLinkMeshTransform(lhsCoords: NumericVector, rhsCoords: NumericVector, radius: number, mesh: Mesh): Mesh {
    const dx = rhsCoords[0] - lhsCoords[0];
    const dy = rhsCoords[1] - lhsCoords[1];
    const dz = rhsCoords[2] - lhsCoords[2];
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    if (dist < 1e-9) {
      mesh.scaling.setAll(0);
      return mesh;
    }

    this.bufDirection.set(dx/dist, dy/dist, dz/dist);
    if (mesh.rotationQuaternion === null) {
      mesh.rotationQuaternion = new Quaternion();
    }
    Quaternion.FromUnitVectorsToRef(UNIT_Y, this.bufDirection, mesh.rotationQuaternion);

    mesh.position.set(
      (lhsCoords[0] + rhsCoords[0]) / 2,
      (lhsCoords[1] + rhsCoords[1]) / 2,
      (lhsCoords[2] + rhsCoords[2]) / 2,
    );
    mesh.scaling.x = radius;
    mesh.scaling.y = dist;
    mesh.scaling.z = radius;

    return mesh;
  }

  private createNewLinkMesh(radius: number, id: string): Mesh {
    return MeshBuilder.CreateCylinder(`link_${id}`, {
      height: 1,
      diameter: 2,
      tessellation: 6,
      updatable: false,
    }, this.scene);
  }

  private getLinkDrawObject(link: LinkInterface): Mesh {
    const mesh = this.linksMap.get(link) ?? false;
    if (mesh) {
      return this.createLinkMesh(link.lhs.position, link.rhs.position, link, mesh);
    }
    return this.addLinkToMap(link);
  }

  private addLinkToMap(link: LinkInterface): Mesh {
    const drawObject = this.createLinkMesh(link.lhs.position, link.rhs.position, link);
    this.linksMap.set(link, drawObject);

    return drawObject;
  }

  private getLinkColor(link: LinkInterface): ColorVector {
    const lhsColor = this.TYPES_CONFIG.COLORS[link.lhs.newType ?? link.lhs.type];
    const rhsColor = this.TYPES_CONFIG.COLORS[link.rhs.newType ?? link.rhs.type];
    return [
      (lhsColor[0]+rhsColor[0])/2,
      (lhsColor[1]+rhsColor[1])/2,
      (lhsColor[2]+rhsColor[2])/2,
    ];
  }

  private getLinkWidth(link: LinkInterface): number {
    const maxValue = this.WORLD_CONFIG.ATOM_RADIUS;
    const maxLength = this.WORLD_CONFIG.MAX_LINK_RADIUS;

    const dist = Math.sqrt(
      (link.rhs.position[0] - link.lhs.position[0])**2 +
      (link.rhs.position[1] - link.lhs.position[1])**2,
    );

    if (dist > maxLength) {
      return 1;
    }

    return (1-maxValue)/maxLength * dist + maxValue;
  }

  // Позиция точки пикинга: для thin instances — позиция конкретного атома,
  // для обычных мешей (связи) — позиция меша
  private getPickedAtomPosition(mesh: AbstractMesh, thinInstanceIndex: number): Vector3 {
    if (thinInstanceIndex >= 0) {
      const atom = this.pickedAtomByIndex.get(thinInstanceIndex);
      if (atom) {
        return new Vector3(atom.position[0], atom.position[1], atom.position[2]);
      }
    }
    return mesh.getAbsolutePosition();
  }

  private initEventHandlers(): void {
    let keyDown: number | undefined = undefined;

    document.body.addEventListener('keydown', (event: KeyboardEvent) => {
      const key = parseInt(event.key);
      if (key > 0 && key < 10) {
        keyDown = key;
      }
    });

    document.body.addEventListener('keyup', () => {
      keyDown = undefined;
    });

    this.scene.onPointerDown = (event, pickResult) => {
      if (pickResult.pickedMesh) {
        // Для thin instances позиция базового меша не имеет смысла —
        // берём позицию конкретного атома-инстанса
        const pos = this.getPickedAtomPosition(pickResult.pickedMesh, pickResult.thinInstanceIndex);
        try {
          if (event.ctrlKey) {
            this.camera.detachControl();
          }
          this.eventManager.triggerMouseDown({
            coords: [pos.x, pos.y, pos.z],
            extraKey: keyDown,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
          });
        } catch (e) {
        }
        return;
      }

      if (event.button == 0) {
        const pos = this.camera.position.add(pickResult.ray!.direction.multiplyByFloats(500, 500, 500));

        this.eventManager.triggerClick({
          coords: [pos.x, pos.y, pos.z],
          extraKey: keyDown,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
        });
      }
    };

    this.scene.onPointerUp = (event, pickResult) => {
      const pos = this.camera.position.add(pickResult!.ray!.direction.multiplyByFloats(500, 500, 500));
      try {
        this.eventManager.triggerMouseUp({
          coords: [pos.x, pos.y, pos.z],
          extraKey: keyDown,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
        });
      } catch (e) {
      }
      this.camera.attachControl();
    };
  }
}

export function create3dDrawer(
  canvasId: string,
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
) {
  return new Drawer3d({
    domElement: document.getElementById(canvasId) as HTMLCanvasElement,
    worldConfig,
    typesConfig,
  });
}
