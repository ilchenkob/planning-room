import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { VotingResult } from '@app/models';
import { AppStates } from '@app/store';
import { Store, select } from '@ngrx/store';
import { selectCurrentStoryVotes, selectCurrentStoryTotalVotesNumber, selectIsAnyStory } from '@app/store/states/room.state';

@Component({
  selector: 'app-voting-results',
  templateUrl: './voting-results.component.html',
  styleUrls: ['./voting-results.component.scss']
})
export class VotingResultsComponent {
  public results$: Observable<VotingResult[]>;
  public totalVotesNumber$: Observable<number>;
  public isAnyStory$: Observable<boolean>;

  @Input()
  public isVoting = false;

  constructor(private store$: Store<AppStates>) {
    this.isAnyStory$ = this.store$.pipe(select(selectIsAnyStory));
    this.results$ = this.store$.pipe(select(selectCurrentStoryVotes));
    this.totalVotesNumber$ = this.store$.pipe(select(selectCurrentStoryTotalVotesNumber));
  }
}
