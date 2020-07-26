import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Story, StoryDialog } from '@app/models';
import { AppStates } from '@app/store';
import * as roomActions from '@app/store/actions/room.actions';
import { selectStories, selectCurrentStory } from '@app/store/states/room.state';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';

@Component({
  selector: 'app-stories-list',
  templateUrl: './stories-list.component.html',
  styleUrls: ['./stories-list.component.scss']
})
export class StoriesListComponent {

  public stories$: Observable<Story[]>;
  public selectedStory$: Observable<Story>;

  @Input()
  public isScrumMaster = false;
  @Input()
  public isVoting = false;

  constructor(
      private dialog: MatDialog,
      private store$: Store<AppStates>) {
    this.stories$ = this.store$.pipe(select(selectStories));
    this.selectedStory$ = this.store$.pipe(select(selectCurrentStory));
  }

  add() {
    this.showAddEditDialog({
      dialog: {
        title: 'Add story',
        actionButton: 'ADD'
      },
      story: {
        id: new Date().toLocaleTimeString() + Math.random(),
        storyId: '',
        title: '',
        link: '',
        votes: []
      }
    },
    (result) => {
      this.store$.dispatch(roomActions.addStory(result));
    });
  }

  select(storyId: string) {
    this.store$.dispatch(roomActions.selectStory({ storyId }));
  }

  edit(story: Story) {
    this.showAddEditDialog({
      dialog: {
        title: 'Edit story',
        actionButton: 'SAVE'
      },
      story
    },
    (result) => {
      this.store$.dispatch(roomActions.editStory(result));
    });
  }

  remove(story: Story) {
    this.showAddEditDialog({
      dialog: {
        title: 'Are you sure you want to delete this story?',
        actionButton: 'DELETE',
        disabled: true
      },
      story
    },
    (result) => {
      this.store$.dispatch(roomActions.deleteStory({ storyId: result.id }));
    });
  }

  private showAddEditDialog(data: StoryDialog, action: (story: Story) => void) {
    this.dialog.open<StoryDialogComponent, StoryDialog, Story>(StoryDialogComponent, {
      width: '540px',
      data
    }).afterClosed().subscribe((result: Story) => {
      if (result?.id && result?.title) {
        action(result);
      }
    });
  }
}
