import { createVector } from '../vector';
import { NumericVector } from '../vector/types';
import { Drawer2dConfigInterface, DrawerInterface, ViewConfigInterface } from '../types/drawer';
import { TypesConfig, WorldConfig } from '../types/config';
import { AtomInterface } from '../types/atomic';
import { LinkManagerInterface } from '../types/helpers';

/**
 * Transpose coords with backward applying offset and scale
 * @param coords - coords to transpose
 * @param offset - offset vector
 * @param scale - scale vector
 */
export function transposeCoordsBackward(
  coords: NumericVector, offset: NumericVector, scale: NumericVector = [1, 1],
): NumericVector {
  const [x, y] = coords;
  return [(x - offset[0]) / scale[0], (y - offset[1]) / scale[1]];
}

/**
 * Transpose coords with forward applying offset and scale
 * @param coords - coords to transpose
 * @param offset - offset vector
 * @param scale - scale vector
 */
export function transposeCoordsForward(
  coords: NumericVector, offset: NumericVector, scale: NumericVector = [1, 1],
): NumericVector {
  const [x, y] = coords;
  return [x * scale[0] + offset[0], y * scale[1] + offset[1]];
}

export class Drawer2d implements DrawerInterface {
  private readonly WORLD_CONFIG: WorldConfig;
  private readonly TYPES_CONFIG: TypesConfig;
  private readonly domElement: HTMLCanvasElement;
  private readonly viewConfig: ViewConfigInterface;
  private readonly context: CanvasRenderingContext2D;

  constructor({
    domElement,
    viewConfig,
    worldConfig,
    typesConfig,
  }: Drawer2dConfigInterface) {
    this.domElement = domElement;
    this.viewConfig = viewConfig;
    this.WORLD_CONFIG = worldConfig;
    this.TYPES_CONFIG = typesConfig;
    this.context = domElement.getContext('2d');
    this.refresh();
    this.initEventHandlers();
  }

  public draw(atoms: Iterable<AtomInterface>, links: LinkManagerInterface): void {
    this.clear();
    this.context.save();
    this.context.translate(...this.viewConfig.offset as [number, number]);
    this.context.scale(...this.viewConfig.scale as [number, number]);
    for (const atom of atoms) {
      this.drawCircle(
        atom.position,
        this.WORLD_CONFIG.ATOM_RADIUS,
        this.TYPES_CONFIG.COLORS[atom.type],
      );
    }
    for (const link of links) {
      this.drawLine(
        link.lhs.position,
        link.rhs.position,
        'rgb(255, 255, 255)',
      );
    }
    this.context.restore();
  }

  private drawCircle(position: NumericVector, radius: number, color: string) {
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.ellipse(...position as [number, number], radius, radius, 0, 0, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();
  }

  private drawLine(from: NumericVector, to: NumericVector, color: string) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.moveTo(...from as [number, number]);
    this.context.lineTo(...to as [number, number]);
    this.context.stroke();
    this.context.closePath();
  }

  private refresh(): void {
    if (this.domElement.width !== this.width) {
      this.domElement.width = this.width;
    }

    if (this.domElement.height !== this.height) {
      this.domElement.height = this.height;
    }

    this.clear();
  }

  private clear(): void {
    this.context.fillStyle = 'rgb(20, 55, 75)';
    this.context.rect(0, 0, this.width, this.height);
    this.context.fill();
  }

  private initEventHandlers(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.refresh();
    });
    resizeObserver.observe(this.domElement);

    this.domElement.addEventListener('wheel', (event: WheelEvent) => {
      if (event.ctrlKey) {
        let scale = this.viewConfig.scale[0];
        scale += event.deltaY * -0.002;
        scale = Math.min(Math.max(0.001, scale), 100);

        const oldScalePosition = createVector(
          transposeCoordsBackward([event.offsetX, event.offsetY], this.viewConfig.offset, this.viewConfig.scale),
        );
        this.viewConfig.scale = [scale, scale];
        const newScalePosition = createVector(
          transposeCoordsBackward([event.offsetX, event.offsetY], this.viewConfig.offset, this.viewConfig.scale),
        );
        const difference = newScalePosition.clone().sub(oldScalePosition);
        this.viewConfig.offset = transposeCoordsForward(
          difference,
          this.viewConfig.offset,
          this.viewConfig.scale,
        );
      } else if (event.shiftKey) {
        this.viewConfig.offset[0] -= event.deltaY;
      } else {
        this.viewConfig.offset[1] -= event.deltaY;
      }

      event.preventDefault();
    });
  }

  get width(): number {
    return this.domElement.clientWidth;
  }

  get height(): number {
    return this.domElement.clientHeight;
  }
}

export function create2dDrawer(
  canvasId: string,
  worldConfig: WorldConfig,
  typesConfig: TypesConfig,
) {
  return new Drawer2d({
    domElement: document.getElementById(canvasId) as HTMLCanvasElement,
    viewConfig: {
      offset: [0, 0],
      scale: [1, 1],
    },
    worldConfig,
    typesConfig,
  });
}
