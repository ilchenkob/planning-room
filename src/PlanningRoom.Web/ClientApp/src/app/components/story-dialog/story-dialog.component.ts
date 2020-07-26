import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Story, StoryDialog } from '@app/models';
import { AppStates } from '@app/store';
import { Store, select } from '@ngrx/store';
import { selectStoryBaseLink } from '@app/store/states/room.state';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-story-dialog',
  templateUrl: './story-dialog.component.html',
  styleUrls: ['./story-dialog.component.scss']
})
export class StoryDialogComponent {
  private baseUrl = '';

  public storyId = '';
  public title = '';
  public link = '';

  public dialogDisabled = false;
  public dialogTitle = '';
  public dialogActionButton = '';

  constructor(
    private store$: Store<AppStates>,
    private  dialogRef: MatDialogRef<StoryDialogComponent, Story>,
    @Inject(MAT_DIALOG_DATA) private data: StoryDialog) {
      if (data?.story) {
        this.storyId = data.story.storyId;
        this.title = data.story.title;
        this.link = data.story.link;
      }
      if (data?.dialog) {
        this.dialogDisabled = !!data.dialog.disabled;
        this.dialogTitle = data.dialog.title;
        this.dialogActionButton = data.dialog.actionButton;
      }

      this.store$.pipe(
        select(selectStoryBaseLink),
        take(1)
      ).subscribe(value => {
        this.baseUrl = value;
        if (!(this.data?.story?.title)) {
          this.link = this.baseUrl;
        }
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({
      id: this.data.story.id,
      storyId: this.storyId,
      title: this.title,
      link: this.link,
      votes: this.data.story.votes
    });
  }

  setStoryId(newStoryId: string) {
    this.storyId = newStoryId;
    if (this.storyId && this.baseUrl) {
      this.link = `${this.baseUrl}${this.storyId}`;
    }
  }
}
