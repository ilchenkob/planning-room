import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Room, TeamMember } from '@app/models';
import { AppStates } from '@app/store';
import { selectParticipants, selectCurrentUser, selectTimerValue, selectRoom } from '@app/store/states/room.state';
import * as roomActions from '@app/store/actions/room.actions';
import { RoomDialogComponent } from '../room-dialog/room-dialog.component';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent {
  public participants$: Observable<TeamMember[]>;
  public currentUser$: Observable<TeamMember>;
  public timerValue$: Observable<number>;
  public room$: Observable<Room>;

  @Input()
  public isScrumMaster = false;
  @Input()
  public isVoting = false;

  constructor(
      private dialog: MatDialog,
      private store$: Store<AppStates>) {
    this.participants$ = this.store$.pipe(select(selectParticipants));
    this.currentUser$ = this.store$.pipe(select(selectCurrentUser));
    this.timerValue$ = this.store$.pipe(select(selectTimerValue));
    this.room$ = this.store$.pipe(select(selectRoom));
  }

  removeUser(userId: string) {
    if (userId) {
      this.store$.dispatch(roomActions.removeUser({ userId }));
    }
  }

  showSettings(room: Room) {
    this.dialog.open<RoomDialogComponent, Room, Room>(RoomDialogComponent, {
      width: '440px',
      data: {
        ...room,
        settings: {
          ...room.settings,
          availableCards: [...room.settings.availableCards]
        }
      }
    }).afterClosed().subscribe((result: Room) => {
      if (result?.settings) {
        this.store$.dispatch(roomActions.updateRoom(result));
      }
    });
  }
}
