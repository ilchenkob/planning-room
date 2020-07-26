import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Story } from '@app/models';
import { AppStates } from '@app/store';
import * as roomActions from '@app/store/actions/room.actions';
import {
  selectCurrentStory,
  selectIsRoomLoading,
  selectRoomTitle,
  selectIsScrumMaster,
  selectAvailableCards,
  selectUserSelectedCard,
  selectIsVoting
} from '@app/store/states/room.state';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { copyStringToClipboard } from '@app/helpers';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public currentStory$: Observable<Story>;
  public selectedCard$: Observable<number>;
  public isRoomLoading$: Observable<boolean>;
  public isScrumMaster$: Observable<boolean>;
  public isVoting$: Observable<boolean>;
  public cards$: Observable<number[]>;

  constructor(
        private store$: Store<AppStates>,
        private route: ActivatedRoute,
        private titleService: Title) {
      this.currentStory$ = this.store$.pipe(select(selectCurrentStory));
      this.selectedCard$ = this.store$.pipe(select(selectUserSelectedCard));
      this.isRoomLoading$ = this.store$.pipe(select(selectIsRoomLoading));
      this.isScrumMaster$ = this.store$.pipe(select(selectIsScrumMaster));
      this.isVoting$ = this.store$.pipe(select(selectIsVoting));
      this.cards$ = this.store$.pipe(select(selectAvailableCards));

      this.store$.dispatch(roomActions.restoreUserName());
    }

  ngOnInit() {
    this.subscription = new Subscription()
    .add(this.route.params.subscribe(params => {
      const roomId = '' + params['id'];
      this.store$.dispatch(roomId?.length > 10
          ? roomActions.askUserName({ roomId })
          : roomActions.goToStart());
    }))
    .add(this.store$.pipe(select(selectRoomTitle), filter(t => !!t)).subscribe(title => {
      this.titleService.setTitle(title);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  copyStoryLink(link: string) {
   copyStringToClipboard(link);
  }

  selectCard(card: number) {
    this.store$.dispatch(roomActions.selectCard({ card }));
  }

  setStoryPoints(storyPoints: number) {
    this.store$.dispatch(roomActions.setStoryPoints({ storyPoints }));
  }
}
