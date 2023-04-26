import {
  Drawer3dConfigInterface,
  DrawerInterface,
  ViewConfigInterface
} from '../types/drawer';
import { TypesConfig, WorldConfig } from '../types/config';
import { AtomInterface } from '../types/atomic';
import { LinkManagerInterface } from '../types/helpers';
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
  Color3,
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
  private readonly coordsMultiplier: number = 10;

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
      this.createLight([1000, 1000, 1000], 0.003),
      this.createLight([-200, -630, -598], 0.003),
    ];
    this.engine.runRenderLoop(() => {
      this.normalizeFrame();
      this.scene.render();
    });
  }

  clear(): void {
  }

  draw(atoms: Iterable<AtomInterface>, links: LinkManagerInterface): void {
    for (const atom of atoms) {
      const drawObject = this.getAtomDrawObject(atom);
      drawObject.position.x = 500; // atom.position[0] * this.coordsMultiplier;
      drawObject.position.y = 500; // atom.position[1] * this.coordsMultiplier;
      drawObject.position.z = 500; // atom.position[2] * this.coordsMultiplier;
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

  private getAtomDrawObject(atom: AtomInterface): Mesh {
    return this.map.get(atom) ?? this.addAtomToMap(atom);
  }

  private addAtomToMap(atom: AtomInterface): Mesh {
    // eslint-disable-next-line new-cap
    const drawObject: Mesh = Mesh.CreateSphere(
      `atom-${atom.id}`,
      10,
      this.WORLD_CONFIG.ATOM_RADIUS*2*this.coordsMultiplier,
      this.scene,
    );
    const material = new StandardMaterial(`material-${atom.id}`, this.scene);
    const color = material.diffuseColor;
    drawObject.material = material;
    color.r = 255;
    color.g = 0;
    color.b = 0;
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
