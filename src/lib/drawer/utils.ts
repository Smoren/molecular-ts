import type { EventManagerInterface, MouseEventData, MouseEventListenerCallback } from '../types/drawer';
import type { NumericVector } from "../math/types";

type ListenersStorage = {
  onClick: MouseEventListenerCallback[];
  onMouseDown: MouseEventListenerCallback[];
  onMouseMove: MouseEventListenerCallback[];
  onMouseGrab: MouseEventListenerCallback[];
  onMouseUp: MouseEventListenerCallback[];
};

export class PreventException extends Error {
}

export class EventManager implements EventManagerInterface {
  private listeners: ListenersStorage = {
    onClick: [],
    onMouseDown: [],
    onMouseMove: [],
    onMouseGrab: [],
    onMouseUp: [],
  };
  private lastPoint: NumericVector | undefined;
  private mouseGrabTick: ReturnType<typeof setInterval> | undefined;

  onClick(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onClick', callback);
  }

  onMouseDown(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseDown', callback);
  }

  onMouseMove(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseMove', callback);
  }

  onMouseGrab(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseGrab', callback);
  }

  onMouseUp(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseUp', callback);
  }

  triggerClick(event: MouseEventData): void {
    this.trigger('onClick', event);
  }

  triggerMouseDown(event: MouseEventData): void {
    this.startMouseGrabTick();
    this.trigger('onMouseDown', event);
  }

  triggerMouseMove(event: MouseEventData): void {
    this.trigger('onMouseMove', event);
  }

  triggerMouseGrab(event: MouseEventData): void {
    this.trigger('onMouseGrab', event);
  }

  triggerMouseUp(event: MouseEventData): void {
    this.stopMouseGrabTick();
    this.trigger('onMouseUp', event);
  }

  private add(type: keyof ListenersStorage, callback: MouseEventListenerCallback): EventManagerInterface {
    this.listeners[type].push(callback);
    return this;
  }

  private trigger(type: keyof ListenersStorage, event: MouseEventData, throwException: boolean = true): void {
    this.lastPoint = event.coords;
    try {
      for (const callback of this.listeners[type]) {
        callback(event);
      }
    } catch (e) {
      if (throwException) {
        throw e;
      }
    }
  }

  private startMouseGrabTick() {
    this.mouseGrabTick = setInterval(() => {
      this.trigger('onMouseGrab', {
        coords: this.lastPoint as NumericVector,
        extraKey: undefined,
        ctrlKey: false,
      }, false);
    }, 30);
  }

  private stopMouseGrabTick() {
    if (this.mouseGrabTick) {
      clearInterval(this.mouseGrabTick);
    }
  }
}
