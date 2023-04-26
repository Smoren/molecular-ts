import { ArcRotateCamera, Engine, Mesh, PointLight, Scene, StandardMaterial, Vector3 } from 'babylonjs';
import { NumericVector } from '../vector/types';

export function testBabylon() {
  setTimeout(() => startBabylon(), 100);
}

function createOrigin(scene: Scene, radius: number, coords: NumericVector, color: NumericVector): Mesh {
  // eslint-disable-next-line new-cap
  const origin = Mesh.CreateSphere('origin', 10, radius*2, scene);
  origin.position.x = coords[0];
  origin.position.y = coords[1];
  origin.position.z = coords[2];

  const material = new StandardMaterial('material', scene);
  material.diffuseColor.r = color[0];
  material.diffuseColor.g = color[1];
  material.diffuseColor.b = color[2];
  origin.material = material;

  return origin;
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
  const origin = createOrigin(scene, 50, [0, 0, 0], [255, 0, 0]);
  const origin1 = createOrigin(scene, 30, [100, 100, 100], [0, 0, 255]);

  let alpha = 0;
  let alpha1 = 0;

  const tick = () => {
    origin.position.x += 2 * Math.cos(alpha);
    origin.position.z += 1 * Math.sin(alpha);
    alpha += 0.02;

    origin1.position.y += 2 * Math.cos(alpha1);
    origin1.position.z += 2 * Math.sin(alpha1);
    alpha1 += 0.02;

    setTimeout(tick, 10);
  };

  tick();

  engine.runRenderLoop(() => {
    scene.render();
  });
}
