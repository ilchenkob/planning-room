import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import { of, EMPTY } from 'rxjs';
import { map, mergeMap, switchMap, withLatestFrom, debounce } from 'rxjs/operators';
import { AppStates } from '..';
import * as roomActions from '../actions/room.actions';

@Injectable()
export class StorageEffects {
  constructor(
      private store$: Store<AppStates>,
      private actions$: Actions,
      private storage: StorageMap) {
  }

  saveUserName$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.setUserName),
      withLatestFrom(this.store$),
      mergeMap(([_, store]) => {
        this.storage
            .set(`username`, store.roomState.currentTeamMember.name)
            .subscribe(() => {});

        return EMPTY;
      })
    ),
    { dispatch: false }
  );

  loadUserName$ = createEffect(() => this.actions$.pipe(
      ofType(roomActions.restoreUserName),
      switchMap(() => this.storage.get(`username`)
        .pipe(map(r => r ? '' + r : ''))
      ),
      switchMap(userName => {
        return of(roomActions.setUserName({ userName }));
      })
    )
  );
}
