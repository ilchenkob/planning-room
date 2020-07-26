import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '@app/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom, tap, delay, filter } from 'rxjs/operators';
import { AppStates } from '..';
import * as roomActions from '../actions/room.actions';
import { selectAdminRoomId } from '../states/room.state';
import { MatDialog } from '@angular/material/dialog';
import { UserNameDialogComponent } from '@app/components';

@Injectable()
export class RoomEffects {
  constructor(
    private store$: Store<AppStates>,
    private actions$: Actions,
    private router: Router,
    private roomService: RoomService,
    private dialog: MatDialog) {
  }

  navigateToStart$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.goToStart, roomActions.disconnected),
      tap(() => {
        this.router.navigate(['']);
      })
    ),
    { dispatch: false }
  );

  navigateToRoom$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.goToRoom),
      tap(action => {
        this.router.navigate(['room', action.roomId]);
      })
    ),
    { dispatch: false }
  );

  createRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.createRoom),
    mergeMap((action) => this.roomService.createRoom({
          roomId: '',
          adminRoomId: '',
          title: action.title,
          isVoting: false,
          settings: action.settings,
          currentStory: null,
          stories: [],
          participants: []
        }).pipe(
            map(data => roomActions.createRoomSuccess(data)),
            catchError(() => of(roomActions.createRoomFailed()))
        )
      )
    )
  );

  updateRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.updateRoom),
    mergeMap((action) => this.roomService.updateRoom(action).pipe(
            map(data => roomActions.updateRoomSuccess()),
            catchError(() => of(roomActions.updateRoomFailed()))
        )
      )
    )
  );

  joinOnCreateRoom$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.createRoomSuccess),
      map(action => roomActions.goToRoom({ roomId: action.adminRoomId }))
    )
  );

  askName$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.askUserName),
      delay(1000), // make sure local storage had enough time to return saved value
      withLatestFrom(this.store$),
      mergeMap(([action, store]) => this.dialog.open<UserNameDialogComponent, string, string>(UserNameDialogComponent, {
          width: '440px',
          data: store.roomState.currentTeamMember?.name ? store.roomState.currentTeamMember.name : ''
        }).afterClosed().pipe(map(name => {
          return { name, roomId: action.roomId };
        }))
      ),
      switchMap((result) => {
        if (result?.name && result?.roomId) {
          return [
            roomActions.setUserName({ userName: result.name }),
            roomActions.joinRoom({ roomId: result.roomId })
          ];
        } else {
          return [
            roomActions.goToStart()
          ];
        }
      })
    )
  );

  joinRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.joinRoom),
    withLatestFrom(this.store$),
    mergeMap(([action, store]) => this.roomService.joinRoom(action.roomId, store.roomState.currentTeamMember).pipe(
            map(data => roomActions.joinRoomSuccess(data)),
            catchError(() => of(roomActions.joinRoomFailed()))
        ))
    )
  );

  showRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.joinRoomSuccess),
    withLatestFrom(this.store$),
    map(([action, store]) => {
        const id = store.roomState.adminRoomId ? store.roomState.adminRoomId : store.roomState.roomId;
        this.router.navigate(['/room', id]);
      })
    ),
    { dispatch: false }
  );

  addStory$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.addStory),
    withLatestFrom(this.store$),
    mergeMap(([action, store]) => this.roomService.addStory(selectAdminRoomId(store), action).pipe(
            map(() => roomActions.addStorySuccess()),
            catchError(() => of(roomActions.addStoryFailed()))
        ))
    )
  );

  editStory$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.editStory),
    withLatestFrom(this.store$),
    mergeMap(([action, store]) => this.roomService.editStory(selectAdminRoomId(store), action).pipe(
            map(() => roomActions.editStorySuccess()),
            catchError(() => of(roomActions.editStoryFailed()))
        ))
    )
  );

  selectStory$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.selectStory),
    withLatestFrom(this.store$),
    filter(([_, store]) => !!store.roomState.adminRoomId),
    mergeMap(([action, store]) => this.roomService.selectStory(selectAdminRoomId(store), action.storyId).pipe(
            map(() => roomActions.selectStorySuccess()),
            catchError(() => of(roomActions.selectStoryFailed()))
        ))
    )
  );

  deleteStory$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.deleteStory),
    withLatestFrom(this.store$),
    filter(([_, store]) => !!store.roomState.adminRoomId),
    mergeMap(([action, store]) => this.roomService.deleteStory(selectAdminRoomId(store), action.storyId).pipe(
            map(() => roomActions.deleteStorySuccess()),
            catchError(() => of(roomActions.deleteStoryFailed()))
        ))
    )
  );

  startTimer$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.startTimer),
    withLatestFrom(this.store$),
    filter(([_, store]) => !!store.roomState.adminRoomId),
    mergeMap(([_, store]) => this.roomService.startTimer(selectAdminRoomId(store)).pipe(
            map(() => roomActions.startTimerSuccess()),
            catchError(() => of(roomActions.startTimerFailed()))
        ))
    )
  );

  resetCardsOnTimerStart$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.startTimer),
    map(() => roomActions.resetCards())
  ));

  resetCards$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.resetCards),
    withLatestFrom(this.store$),
    mergeMap(([_, store]) => this.roomService.resetCards(selectAdminRoomId(store)).pipe(
            map(() => roomActions.resetCardsSuccess()),
            catchError(() => of(roomActions.resetCardsFailed()))
        ))
    )
  );

  stopTimer$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.stopTimer),
    withLatestFrom(this.store$),
    filter(([_, store]) => !!store.roomState.adminRoomId),
    mergeMap(([_, store]) => this.roomService.stopTimer(selectAdminRoomId(store)).pipe(
            map(() => roomActions.stopTimerSuccess()),
            catchError(() => of(roomActions.stopTimerFailed()))
        ))
    )
  );

  stopTimerOnAllVoted$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.setParticipants),
      withLatestFrom(this.store$),
      filter(([_, store]) => !!store.roomState.adminRoomId
                            && store.roomState.isVoting
                            && store.roomState.participants
                                  .filter(p => !p.isScrumMaster)
                                  .every(p => p.selectedCard !== 0)),
      map(() => roomActions.stopTimer())
    )
  );

  selectCard$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.selectCard),
    withLatestFrom(this.store$),
    mergeMap(([action, store]) => this.roomService.selectCard(
      store.roomState.roomId,
      store.roomState.currentTeamMember.id,
      action.card).pipe(
            map(() => roomActions.selectCardSuccess()),
            catchError(() => of(roomActions.selectCardFailed()))
        ))
    )
  );

  setStoryPoints$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.setStoryPoints),
    withLatestFrom(this.store$),
    mergeMap(([action, store]) => this.roomService.setStoryPoints(
      selectAdminRoomId(store),
      store.roomState.currentStory.id,
      store.roomState.currentStory.title,
      action.storyPoints).pipe(
            map(() => roomActions.setStoryPointsSuccess()),
            catchError(() => of(roomActions.setStoryPointsFailed()))
        ))
    )
  );
}
