import { createVector } from '../math';
import type { NumericVector } from '../math/types';
import type {
  Drawer2dConfigInterface,
  DrawerInterface,
  EventManagerInterface,
  MouseEventListenerCallback,
  ViewConfigInterface,
} from './types';
import type { ColorVector, TypesConfig, WorldConfig } from '../types/config';
import type { AtomInterface, LinkInterface } from '../types/atomic';
import type { LinkManagerInterface } from '../types/utils';
import { EventManager } from '../drawer/utils';

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
  public readonly eventManager: EventManagerInterface;
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
    this.context = domElement.getContext('2d') as CanvasRenderingContext2D;
    this.eventManager = new EventManager();
    this.refresh();
    this.initEventHandlers();
  }

  public draw(atoms: Array<AtomInterface>, links: LinkManagerInterface): void {
    this.clear();
    this.context.save();
    this.context.translate(this.viewConfig.offset[0], this.viewConfig.offset[1]);
    this.context.scale(this.viewConfig.scale[0], this.viewConfig.scale[1]);

    for (const link of links) {
      this.drawLine(
        link.lhs.position,
        link.rhs.position,
        this.getLinkWidth(link),
        `rgb(${this.getLinkColor(link).join(', ')})`,
      );
    }

    for (let i=0; i<atoms.length; ++i) {
      const atom = atoms[i];
      this.drawCircle(
        atom.position,
        this.TYPES_CONFIG.RADIUS[atom.type] * this.WORLD_CONFIG.ATOM_RADIUS,
        this.TYPES_CONFIG.COLORS[atom.type],
      );
    }

    this.context.restore();
  }

  public clear(): void {
    this.context.fillStyle = 'rgb(51, 51, 76, 0.8)';
    this.context.rect(0, 0, this.width, this.height);
    this.context.fill();
  }

  private drawCircle(position: NumericVector, radius: number, color: ColorVector) {
    this.context.beginPath();
    this.context.fillStyle = `rgb(${color.join(', ')})`;
    this.context.ellipse(position[0], position[1], radius, radius, 0, 0, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();
  }

  private drawLine(from: NumericVector, to: NumericVector, width: number, color: string) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.lineWidth = width;
    this.context.moveTo(...from as [number, number]);
    this.context.lineTo(...to as [number, number]);
    this.context.stroke();
    this.context.closePath();
  }

  private getLinkColor(link: LinkInterface): ColorVector {
    const lhsColor = this.TYPES_CONFIG.COLORS[link.lhs.type];
    const rhsColor = this.TYPES_CONFIG.COLORS[link.rhs.type];
    return [
      Math.round((lhsColor[0]+rhsColor[0])/2),
      Math.round((lhsColor[1]+rhsColor[1])/2),
      Math.round((lhsColor[2]+rhsColor[2])/2),
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

  private refresh(): void {
    if (this.domElement.width !== this.width) {
      this.domElement.width = this.width;
    }

    if (this.domElement.height !== this.height) {
      this.domElement.height = this.height;
    }

    this.clear();
  }

  private initEventHandlers(): void {
    const resizeObserver = new ResizeObserver(() => {
      this.refresh();
    });
    resizeObserver.observe(this.domElement);

    let keyDown: number | undefined = undefined;
    let mouseDownVector: NumericVector | undefined = undefined;

    document.body.addEventListener('keydown', (event: KeyboardEvent) => {
      const key = parseInt(event.key);
      if (key > 0 && key < 10) {
        keyDown = key;
      }
    });

    document.body.addEventListener('keyup', () => {
      keyDown = undefined;
    });

    this.domElement.addEventListener('click', (event: MouseEvent) => {
      const coords = createVector(
        transposeCoordsBackward([event.offsetX, event.offsetY], this.viewConfig.offset, this.viewConfig.scale),
      );
      this.eventManager.triggerClick({
        coords,
        extraKey: keyDown,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
      });
    });

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

    const mouseDownHandler = (event: MouseEvent | TouchEvent) => {
      const coords = (event instanceof MouseEvent)
        ? createVector([event.offsetX, event.offsetY])
        : createVector([event.touches[0].clientX, event.touches[0].clientY]);
      document.body.style.cursor = 'grabbing';

      try {
        this.eventManager.triggerMouseDown({
          coords: transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale),
          extraKey: keyDown,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
        });
      } catch (e) {
        return;
      }

      mouseDownVector = coords;
    };
    const mouseUpHandler = (event: MouseEvent | TouchEvent) => {
      const coords = (event instanceof MouseEvent)
        ? createVector([event.offsetX, event.offsetY])
        : createVector([event.touches[0].clientX, event.touches[0].clientY]);
      mouseDownVector = undefined;
      document.body.style.cursor = 'auto';

      this.eventManager.triggerMouseUp({
        coords: transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale),
        extraKey: keyDown,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
      });
    };
    const mouseMoveHandler = (event: MouseEvent | TouchEvent) => {
      const coords = (event instanceof MouseEvent)
        ? createVector([event.offsetX, event.offsetY])
        : createVector([event.touches[0].clientX, event.touches[0].clientY]);

      this.eventManager.triggerMouseMove({
        coords: transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale),
        extraKey: keyDown,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
      });

      if (mouseDownVector === undefined) {
        return;
      }

      this.eventManager.triggerMouseGrab({
        coords: transposeCoordsBackward(coords, this.viewConfig.offset, this.viewConfig.scale),
        extraKey: keyDown,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
      });

      const diff = coords.clone().sub(mouseDownVector);

      this.viewConfig.offset[0] += diff[0];
      this.viewConfig.offset[1] += diff[1];
      mouseDownVector = coords;
    };

    this.domElement.addEventListener('mousedown', mouseDownHandler);
    document.body.addEventListener('mouseup', mouseUpHandler);
    document.body.addEventListener('mouseleave', mouseUpHandler);
    this.domElement.addEventListener('mousemove', mouseMoveHandler);

    this.domElement.addEventListener('touchstart', mouseDownHandler);
    document.body.addEventListener('touchend', mouseUpHandler);
    this.domElement.addEventListener('touchmove', mouseMoveHandler);
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
