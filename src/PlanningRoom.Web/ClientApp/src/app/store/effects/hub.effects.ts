import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Story, TeamMember, RoomSettings } from '@app/models';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { AppStates } from '..';
import * as roomActions from '../actions/room.actions';

@Injectable()
export class HubEffects {
  private readonly reconnectionDelay = 3000;

  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private hubConnection: HubConnection;

  constructor(
      private store$: Store<AppStates>,
      private actions$: Actions,
      private snackBar: MatSnackBar) {
  }

  connectToHub$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.joinRoomSuccess),
      tap(() => {
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
      })
    ),
    { dispatch: false }
  );

  connectedToHub$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.connectToRoomHubSuccess),
      withLatestFrom(this.store$),
      mergeMap(([action, store]) => {
        const data = {
          roomId: store.roomState.roomId,
          userId: store.roomState.currentTeamMember?.id
        };
        this.hubConnection.send('JoinRoom', data);
        return EMPTY;
      })
    ),
    { dispatch: false }
  );

  removeUser$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.removeUser),
      withLatestFrom(this.store$),
      filter(([_, store]) => !!store.roomState.adminRoomId),
      mergeMap(([action, store]) => {
        const data = {
          roomId: store.roomState.roomId,
          userId: action.userId
        };
        this.hubConnection.send('DisconnectUser', data);
        return EMPTY;
      })
    ),
    { dispatch: false }
  );

  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('/roomhub')
      .build();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        this.store$.dispatch(roomActions.connectToRoomHubSuccess());
        if (this.snackBarRef) {
          this.snackBarRef.dismiss();
          this.snackBarRef = null;
        }
      })
      .catch(error => {
        this.store$.dispatch(roomActions.connectToRoomHubFailed());
        this.snackBarRef = this.snackBar.open('Reconnecting...');

        console.log({ message: 'Error while establishing connection, retrying...', error });
        setTimeout(() => { this.startConnection(); }, this.reconnectionDelay);
      });
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('StoriesUpdate', (data: Story[]) => {
      this.store$.dispatch(roomActions.setStories({ stories: data }));
    });
    this.hubConnection.on('MembersUpdate', (data: TeamMember[]) => {
      this.store$.dispatch(roomActions.setParticipants({ participants: data }));
    });
    this.hubConnection.on('SetCurrentStory', (story: Story) => {
      this.store$.dispatch(roomActions.setCurrentStory({ story }));
    });
    this.hubConnection.on('StartTimer', () => {
      this.store$.dispatch(roomActions.startVoting());
    });
    this.hubConnection.on('StopTimer', () => {
      this.store$.dispatch(roomActions.endVoting());
    });
    this.hubConnection.on('UpdateRoomSettings', (settings: RoomSettings) => {
      this.store$.dispatch(roomActions.setRoomSettings({ settings }));
    });
    this.hubConnection.on('DisconnectMember', () => {
      this.hubConnection
          .stop()
          .then(() => {
            this.store$.dispatch(roomActions.disconnected());
          });
    });
  }
}
