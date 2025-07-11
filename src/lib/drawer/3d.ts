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
  Light,
  PointLight,
  Mesh,
  StandardMaterial,
  MeshBuilder,
} from 'babylonjs';
import type { NumericVector } from '../math/types';
import type { LinkManagerInterface } from '../simulation/types/utils';
import { EventManager } from '../drawer/utils';

export class Drawer3d implements DrawerInterface {
  public readonly eventManager: EventManagerInterface;
  private readonly WORLD_CONFIG: WorldConfig;
  private readonly TYPES_CONFIG: TypesConfig;
  private readonly domElement: HTMLCanvasElement;
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly lights: Light[];
  private readonly atomsMap: Map<AtomInterface, Mesh> = new Map();
  private readonly linksMap: Map<LinkInterface, Mesh> = new Map();
  private readonly bufVectors: Vector3[] = [
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
  ];
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
    for (const atom of atoms) {
      const radius = this.TYPES_CONFIG.RADIUS[atom.type];
      const drawObject = this.getAtomDrawObject(atom);

      if (drawObject.position.x !== radius) {
        drawObject.scaling.x = radius;
        drawObject.scaling.y = radius;
        drawObject.scaling.z = radius;
      }

      drawObject.position.x = atom.position[0];
      drawObject.position.y = atom.position[1];
      drawObject.position.z = atom.position[2];

      if (atom.isTypeChanged) {
        this.updateAtomColor(atom, drawObject);
      }
    }

    if (!this.WORLD_CONFIG.SIMPLIFIED_VIEW_MODE) {
      for (const [link, drawObject] of this.linksMap) {
        if (!links.has(link)) {
          drawObject.dispose();
          drawObject.material?.dispose();
          this.linksMap.delete(link);
        }
      }

      for (const link of links) {
        this.getLinkDrawObject(link);
      }
    }
  }

  public clear() {
    this.atomsMap.forEach((item) => this.scene.removeMesh(item));
    this.linksMap.forEach((item) => this.scene.removeMesh(item));
    this.atomsMap.clear();
    this.linksMap.clear();
  }

  private updateAtomColor(atom: AtomInterface, drawObject: Mesh): void {
    const color = this.TYPES_CONFIG.COLORS[atom.newType!];
    const material = new StandardMaterial('material', this.scene);
    material.diffuseColor.r = color[0];
    material.diffuseColor.g = color[1];
    material.diffuseColor.b = color[2];
    material.freeze();

    drawObject.material?.dispose();
    drawObject.material = material;
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

  private createAtomMesh(radius: number, coords: NumericVector, color: NumericVector, id: number): Mesh {
    const atomMesh = MeshBuilder.CreateSphere(`atom_${id}`, {
      segments: 8,
      diameter: radius * 2,
      updatable: false,
    }, this.scene);
    atomMesh.position.x = coords[0];
    atomMesh.position.y = coords[1];
    atomMesh.position.z = coords[2];

    const material = new StandardMaterial('material', this.scene);
    material.diffuseColor.r = color[0];
    material.diffuseColor.g = color[1];
    material.diffuseColor.b = color[2];
    material.freeze();

    atomMesh.material = material;
    atomMesh.freezeNormals();
    // atomMesh.isPickable = false;
    atomMesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;

    return atomMesh;
  }

  private createLinkMesh(lhsCoords: NumericVector, rhsCoords: NumericVector, link: LinkInterface, mesh?: Mesh): Mesh {
    const radius = this.getLinkWidth(link)/4;

    this.bufVectors[0].x = lhsCoords[0];
    this.bufVectors[0].y = lhsCoords[1];
    this.bufVectors[0].z = lhsCoords[2];

    this.bufVectors[1].x = rhsCoords[0];
    this.bufVectors[1].y = rhsCoords[1];
    this.bufVectors[1].z = rhsCoords[2];

    if (mesh) {
      if (link.lhs.isTypeChanged || link.rhs.isTypeChanged) {
        this.updateLinkColor(link, mesh);
      }
      return this.createLinkMeshFromInstance(this.bufVectors, radius, mesh);
    }

    const newMesh = this.createNewLinkMesh(this.bufVectors, radius, link.id);

    const color = this.getLinkColor(link);
    const material = new StandardMaterial('material', this.scene);
    material.diffuseColor.r = color[0];
    material.diffuseColor.g = color[1];
    material.diffuseColor.b = color[2];
    material.freeze();

    newMesh.material = material;
    newMesh.receiveShadows = false;
    newMesh.freezeWorldMatrix();
    newMesh.isPickable = false;
    newMesh.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION;

    return newMesh;
  }

  private updateLinkColor(link: LinkInterface, mesh: Mesh) {
    const color = this.getLinkColor(link);
    const material = new StandardMaterial('material', this.scene);
    material.diffuseColor.r = color[0];
    material.diffuseColor.g = color[1];
    material.diffuseColor.b = color[2];
    material.freeze();
    mesh.material?.dispose();
    mesh.material = material;
  }

  private createNewLinkMesh(path: Vector3[], radius: number, id: string): Mesh {
    return MeshBuilder.CreateTube(`link_${id}`, {
      path: [
        path[0],
        path[1],
      ],
      updatable: true,
      radius: radius,
      tessellation: 6,
    }, this.scene);
  }

  private createLinkMeshFromInstance(path: Vector3[], radius: number, mesh: Mesh): Mesh {
    return MeshBuilder.CreateTube(mesh.name, {
      path: [
        path[0],
        path[1],
      ],
      radius: radius,
      instance: mesh,
    }, this.scene);
  }

  private getAtomDrawObject(atom: AtomInterface): Mesh {
    return this.atomsMap.get(atom) ?? this.addAtomToMap(atom);
  }

  private addAtomToMap(atom: AtomInterface): Mesh {
    const drawObject = this.createAtomMesh(
      this.WORLD_CONFIG.ATOM_RADIUS,
      atom.position,
      this.TYPES_CONFIG.COLORS[atom.type],
      atom.id,
    );
    this.atomsMap.set(atom, drawObject);

    return drawObject;
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
        const pos = pickResult.pickedMesh.getAbsolutePosition();
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
