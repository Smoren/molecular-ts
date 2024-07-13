import type { EventManagerInterface, MouseEventData, MouseEventListenerCallback } from '../types/drawer';

type ListenersStorage = {
  onClick: MouseEventListenerCallback[];
  onMouseDown: MouseEventListenerCallback[];
  onMouseMove: MouseEventListenerCallback[];
  onMouseUp: MouseEventListenerCallback[];
};

export class EventManager implements EventManagerInterface {
  private listeners: ListenersStorage = {
    onClick: [],
    onMouseDown: [],
    onMouseMove: [],
    onMouseUp: [],
  };
  onClick(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onClick', callback);
  }

  onMouseDown(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseDown', callback);
  }

  onMouseMove(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseMove', callback);
  }

  onMouseUp(callback: MouseEventListenerCallback): EventManagerInterface {
    return this.add('onMouseUp', callback);
  }

  triggerClick(event: MouseEventData): void {
    this.trigger('onClick', event);
  }

  triggerMouseDown(event: MouseEventData): void {
    this.trigger('onMouseDown', event);
  }

  triggerMouseMove(event: MouseEventData): void {
    this.trigger('onMouseMove', event);
  }

  triggerMouseUp(event: MouseEventData): void {
    this.trigger('onMouseUp', event);
  }

  private add(type: keyof ListenersStorage, callback: MouseEventListenerCallback): EventManagerInterface {
    this.listeners[type].push(callback);
    return this;
  }

  private trigger(type: keyof ListenersStorage, event: MouseEventData): void {
    for (const callback of this.listeners[type]) {
      callback(event);
    }
  }
}
