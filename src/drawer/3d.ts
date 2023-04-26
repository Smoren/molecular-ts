import {
  Drawer3dConfigInterface,
  DrawerInterface,
  ViewConfigInterface,
} from '../types/drawer';
import { TypesConfig, WorldConfig } from '../types/config';
import { AtomInterface } from '../types/atomic';
// import { LinkManagerInterface } from '../types/helpers';
import {
  Scene,
  Engine,
  Camera,
  ArcRotateCamera,
  Vector3,
  Light,
  PointLight,
  Mesh,
  StandardMaterial,
  // Color3,
} from 'babylonjs';
import { NumericVector } from '../vector/types';

export class Drawer3d implements DrawerInterface {
  private readonly WORLD_CONFIG: WorldConfig;
  private readonly TYPES_CONFIG: TypesConfig;
  private readonly domElement: HTMLCanvasElement;
  private readonly viewConfig: ViewConfigInterface;
  private readonly engine: Engine;
  private readonly scene: Scene;
  private readonly camera: Camera;
  private readonly lights: Light[];
  private readonly map: Map<AtomInterface, Mesh> = new Map();

  constructor({
    domElement,
    worldConfig,
    typesConfig,
  }: Drawer3dConfigInterface) {
    this.domElement = domElement;
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
    this.engine = new Engine(this.domElement, true);
    this.scene = new Scene(this.engine);
    this.camera = this.createCamera(1000, [444, 530, 698]);
    this.scene.activeCamera.attachControl(this.domElement);
    this.lights = [
      this.createLight([1000, 1000, 1000], 0.006),
      this.createLight([-200, -630, -598], 0.006),
    ];
    this.engine.runRenderLoop(() => {
      this.normalizeFrame();
      this.scene.render();
    });
  }

  // , links: LinkManagerInterface
  draw(atoms: Iterable<AtomInterface>): void {
    for (const atom of atoms) {
      const drawObject = this.getAtomDrawObject(atom);
      drawObject.position.x = atom.position[0];
      drawObject.position.y = atom.position[1];
      drawObject.position.z = atom.position[2];
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

  private createCamera(radius: number, position: NumericVector): ArcRotateCamera {
    return new ArcRotateCamera(
      'Camera',
      1,
      1,
      radius,
      new Vector3(...position),
      this.scene,
    );
  }

  private createLight(coords: NumericVector, intensity: number): PointLight {
    const light = new PointLight('Omni', new Vector3(coords[0], coords[1], coords[2]), this.scene);
    light.intensity = intensity;
    return light;
  }

  private createAtomMesh(radius: number, coords: NumericVector, color: NumericVector): Mesh {
    // eslint-disable-next-line new-cap
    const atomMesh = Mesh.CreateSphere('origin', 10, radius*2, this.scene);
    atomMesh.position.x = coords[0];
    atomMesh.position.y = coords[1];
    atomMesh.position.z = coords[2];

    const material = new StandardMaterial('material', this.scene);
    material.diffuseColor.r = color[0];
    material.diffuseColor.g = color[1];
    material.diffuseColor.b = color[2];
    atomMesh.material = material;

    return atomMesh;
  }

  private getAtomDrawObject(atom: AtomInterface): Mesh {
    return this.map.get(atom) ?? this.addAtomToMap(atom);
  }

  private addAtomToMap(atom: AtomInterface): Mesh {
    // eslint-disable-next-line new-cap
    const drawObject = this.createAtomMesh(
      this.WORLD_CONFIG.ATOM_RADIUS,
      atom.position,
      this.TYPES_CONFIG.COLORS[atom.type],
    );
    this.map.set(atom, drawObject);

    return drawObject;
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
