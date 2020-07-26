import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { initialRoomState } from '../../store/states/room.state';
import * as roomActions from '../../store/actions/room.actions';
import { RoomDialogComponent } from '../room-dialog/room-dialog.component';
import { Room } from 'src/app/models';
import { AppStates } from 'src/app/store';

@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss']
})
export class EntranceComponent {
  public roomId = '';

  constructor(private dialog: MatDialog, private store$: Store<AppStates>) {
  }

  setUserName(userName: string) {
    this.store$.dispatch(roomActions.setUserName({ userName }));
  }

  joinRoom() {
    this.store$.dispatch(roomActions.goToRoom({ roomId: this.roomId }));
  }

  createRoom() {
    this.dialog.open<RoomDialogComponent, Room, Room>(RoomDialogComponent, {
      width: '440px',
      data: {
        roomId: '',
        adminRoomId: '',
        title: '',
        isVoting: false,
        stories: [],
        participants: [],
        currentStory: null,
        settings: {
          votingTimeSec: 0,
          storyBaseLink: '',
          availableCards: [...initialRoomState.settings.availableCards]
        }
      }
    }).afterClosed().subscribe((result: Room) => {
      if (result?.title && result?.settings) {
        this.store$.dispatch(roomActions.createRoom({
          title: result.title,
          settings: result.settings
        }));
      }
    });
  }
}
