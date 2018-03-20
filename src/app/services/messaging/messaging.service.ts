import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class MessagingService {
  private onMessage: EventEmitter<object> = new EventEmitter<object>();

  constructor() {}

  emit(eventName: string, message: string) {
    this.onMessage.emit({ event: eventName, message: message });
  }
  on(event: string, callback: Function) {
    this.onMessage.subscribe(evt => {
      if (evt.event == event) {
        callback(evt.message);
      }
    });
  }
  destroy() {
    this.onMessage.unsubscribe();
  }
}
