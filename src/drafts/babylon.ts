import {
  ArcRotateCamera,
  Engine,
  Mesh,
  PointLight,
  Scene,
  StandardMaterial,
  Vector3,
  MeshBuilder,
} from 'babylonjs';
import { NumericVector } from '../vector/types';

export function testBabylon() {
  setTimeout(() => startBabylon(), 100);
}

function createAtomMesh(scene: Scene, radius: number, coords: NumericVector, color: NumericVector): Mesh {
  // eslint-disable-next-line new-cap
  const atomMesh = Mesh.CreateSphere('origin', 10, radius*2, scene);
  atomMesh.position.x = coords[0];
  atomMesh.position.y = coords[1];
  atomMesh.position.z = coords[2];

  const material = new StandardMaterial('material', scene);
  material.diffuseColor.r = color[0];
  material.diffuseColor.g = color[1];
  material.diffuseColor.b = color[2];
  atomMesh.material = material;

  return atomMesh;
}

function createLinkMesh(scene: Scene, lhs: Mesh, rhs: Mesh, instance?: Mesh): Mesh {
  // eslint-disable-next-line new-cap
  return MeshBuilder.CreateTube('tube', {
    path: [lhs.position, rhs.position],
    updatable: true,
    radius: 3,
    instance,
  }, scene);
}

function createLight(scene: Scene, coords: NumericVector, intensity: number): PointLight {
  const light = new PointLight('Omni', new Vector3(coords[0], coords[1], coords[2]), scene);
  light.intensity = intensity;
  return light;
}

function startBabylon() {
  const domElement: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
  domElement.width = domElement.clientWidth;
  domElement.height = domElement.clientHeight;
  const engine = new Engine(domElement, true);
  const scene = new Scene(engine);
  new ArcRotateCamera(
    'Camera',
    1,
    1,
    1000,
    new Vector3(444, 530, 698),
    scene,
  );
  scene.activeCamera.attachControl(domElement);
  createLight(scene, [1000, 1000, 1000], 0.003);
  createLight(scene, [-200, -630, -598], 0.003);

  // eslint-disable-next-line new-cap
  const atomMesh1 = createAtomMesh(scene, 50, [0, 0, 0], [255, 0, 0]);
  const atomMesh2 = createAtomMesh(scene, 30, [100, 100, 100], [0, 0, 255]);
  const linkMesh = createLinkMesh(scene, atomMesh1, atomMesh2);

  let alpha1 = 0;
  let alpha2 = 0;

  const tick = () => {
    atomMesh1.position.x += 2 * Math.cos(alpha1);
    atomMesh1.position.z += 1 * Math.sin(alpha1);
    alpha1 += 0.02;

    atomMesh2.position.y += 2 * Math.cos(alpha2);
    atomMesh2.position.z += 2 * Math.sin(alpha2);
    alpha2 += 0.02;

    if (!linkMesh.isDisposed()) {
      createLinkMesh(scene, atomMesh1, atomMesh2, linkMesh);
    }

    setTimeout(tick, 10);
  };

  setTimeout(() => {
    linkMesh.dispose();
  }, 3000);

  tick();

  engine.runRenderLoop(() => {
    scene.render();
  });
}
