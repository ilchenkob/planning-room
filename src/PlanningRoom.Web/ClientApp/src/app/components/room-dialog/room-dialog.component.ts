import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Room } from 'src/app/models';
import { allCards } from '@app/helpers';

@Component({
  selector: 'app-room-dialog',
  templateUrl: './room-dialog.component.html',
  styleUrls: ['./room-dialog.component.scss']
})
export class RoomDialogComponent {

  public readonly minTimerValue = 5;
  public readonly maxTimerValue = 60;

  public newRoom = false;
  public title = '';
  public storyBaseLink = '';
  public timerSeconds = 30;

  public cards: { selected: boolean, value: number }[] = [];

  constructor(
    private  dialogRef: MatDialogRef<RoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Room) {
      this.newRoom = !this.data.roomId;

      this.cards = allCards.map(i => {
        return {
          selected: this.data.settings.availableCards.some(c => c === i),
          value: i
        };
      });

      this.title = this.data.title;
      this.storyBaseLink = this.data.settings.storyBaseLink;
    }

  cancel() {
    this.dialogRef.close();
  }

  apply() {
    this.data.title = this.title;
    this.data.settings = {
      storyBaseLink: this.storyBaseLink,
      availableCards: this.cards.filter(c => c.selected).map(c => c.value),
      votingTimeSec: this.timerSeconds
    };

    this.dialogRef.close(this.data);
  }

  canApply(): boolean {
    return this.title
      && this.timerSeconds >= this.minTimerValue
      && this.timerSeconds <= this.maxTimerValue
      && !!this.cards.filter(c => c.selected).length;
  }
}
