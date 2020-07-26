import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'timerFormat'
})
export class TimerFormatPipe implements PipeTransform {
  transform(seconds: number): string {
    return seconds < 10
      ? `00:0${seconds}`
      : `00:${seconds}`;
  }
}
