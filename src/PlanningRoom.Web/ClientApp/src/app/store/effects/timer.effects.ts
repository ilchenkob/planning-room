import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TimerService } from '@app/services';
import { Actions, createEffect, ofType, act } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { AppStates } from '..';
import * as roomActions from '../actions/room.actions';
import { selectRoomTitle } from '../states/room.state';

@Injectable()
export class TimerEffects {
  constructor(
      private store$: Store<AppStates>,
      private actions$: Actions,
      private titleService: Title,
      private timer: TimerService) {
    this.timer.tickAction = (seconds) => {
      this.store$.dispatch(seconds
        ? roomActions.timerTick({ seconds })
        : roomActions.stopTimer());
    };
  }

  startTimer$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.startVoting),
      withLatestFrom(this.store$),
      mergeMap(([_, store]) => {
        const seconds = store.roomState.settings.votingTimeSec;
        this.timer.start(seconds);
        return of(roomActions.timerTick({ seconds }));
      })
    )
  );

  stopTimer$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.endVoting),
      mergeMap(() => {
        this.timer.stop();
        return of(roomActions.timerTick({ seconds: 0 }));
      })
    )
  );

  updateTabTitle$ = createEffect(() => this.actions$.pipe(
    ofType(roomActions.timerTick),
    withLatestFrom(this.store$),
    tap(([action, store]) => {
      const roomTitle = selectRoomTitle(store);
      const seconds = action.seconds > 9 ? `00:${action.seconds}` : `00:0${action.seconds}`;
      this.titleService.setTitle(action.seconds > 0
        ? `${seconds} - ${roomTitle}`
        : roomTitle);
    })
  ),
  { dispatch: false }
);
}
