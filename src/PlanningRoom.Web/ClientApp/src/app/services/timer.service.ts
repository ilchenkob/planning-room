import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private timerRef: any = null;
  private value = 0;
  public tickAction: (number) => void = null;

  constructor() {
  }

  start(seconds: number) {
    this.value = seconds;
    this.timerRef = setInterval(() => this.onTick(), 1000);
  }

  stop() {
    this.value = 0;
    if (this.timerRef) {
      clearTimeout(this.timerRef);
      this.timerRef = null;
    }
  }

  private onTick() {
    if (this.value > 0) {
      this.value--;
    }

    if (this.tickAction) {
      this.tickAction(this.value);
    }
  }
}
