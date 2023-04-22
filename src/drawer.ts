import {
  DrawerConfigInterface,
  DrawerInterface,
  ViewConfigInterface,
  AtomInterface,
  CommonConfig, TypesConfig,
} from './types';
import { createVector } from './vector';
import { NumericVector } from './vector/types';

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
  return [(x - offset[0])/scale[0], (y - offset[1])/scale[1]];
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
  return [x*scale[0] + offset[0], y*scale[1] + offset[1]];
}

export class Drawer implements DrawerInterface {
  readonly domElement: HTMLCanvasElement;
  readonly viewConfig: ViewConfigInterface;
  readonly context: CanvasRenderingContext2D;
  readonly commonConfig: CommonConfig;
  readonly typesConfig: TypesConfig;

  constructor({
    domElement,
    viewConfig,
    commonConfig,
    typesConfig,
  }: DrawerConfigInterface) {
    this.domElement = domElement;
    this.viewConfig = viewConfig;
    this.commonConfig = commonConfig;
    this.typesConfig = typesConfig;
    this.context = domElement.getContext('2d');
    this.refresh();
  }

  public draw(atoms: Iterable<AtomInterface>, links: Map<string, [AtomInterface, AtomInterface]>): void {
    this.context.save();
    this.context.translate(...this.viewConfig.offset as [number, number]);
    this.context.scale(...this.viewConfig.scale as [number, number]);
    for (const [, [from, to]] of links) {
      this.drawLine(
        from.position,
        to.position,
        'ffffff',
      );
    }
    for (const atom of atoms) {
      this.drawCircle(
        atom.position,
        this.commonConfig.atomRadius,
        this.typesConfig[atom.type].color,
      );
    }
    this.context.restore();
  }

  drawCircle(position: NumericVector, radius: number, color: string) {
    this.context.beginPath();
    this.context.fillStyle = `#${color}`;
    this.context.ellipse(...position as [number, number], radius, radius, 0, 0, 2*Math.PI);
    this.context.fill();
    this.context.closePath();
  }

  drawLine(from: NumericVector, to: NumericVector, color: string) {
    this.context.beginPath();
    this.context.strokeStyle = `#${color}`;
    this.context.moveTo(...from as [number, number]);
    this.context.lineTo(...to as [number, number]);
    this.context.stroke();
    this.context.closePath();
  }

  public refresh(): void {
    if (this.domElement.width !== this.width) {
      this.domElement.width = this.width;
    }

    if (this.domElement.height !== this.height) {
      this.domElement.height = this.height;
    }

    this.clear();
  }

  public clear(): void {
    this.context.fillStyle = 'black';
    this.context.rect(0, 0, this.width, this.height);
    this.context.fill();
  }

  public initEventHandlers(
    getAtoms: () => Iterable<AtomInterface>,
    getLinks: () => Map<string, [AtomInterface, AtomInterface]>,
  ): void {
    const resizeObserver = new ResizeObserver(() => {
      this.refresh();
      this.draw(getAtoms(), getLinks());
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

      this.clear();
      this.draw(getAtoms(), getLinks());
      event.preventDefault();
    });
  }

  // public getBound(): BoundInterface {
  //   return new RectangularBound({
  //     position: this._viewConfig.transposeBackward([0, 0]),
  //     size: this._viewConfig.transposeBackward([this.width, this.height]),
  //   });
  // }

  get width(): number {
    return this.domElement.clientWidth;
  }

  get height(): number {
    return this.domElement.clientHeight;
  }
}
