import { Component, Input } from '@angular/core';
import { allCards, copyStringToClipboard } from '@app/helpers';
import { AppStates } from '@app/store';
import * as roomActions from '@app/store/actions/room.actions';
import { selectAdminRoomId, selectRoomId } from '@app/store/states/room.state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Story } from '@app/models';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent {
  public roomId$: Observable<string>;
  public adminRoomId$: Observable<string>;

  public allCards = [...allCards];

  @Input()
  public isVoting = false;

  @Input()
  public currentStory: Story = null;

  constructor(private store$: Store<AppStates>) {
    this.roomId$ = this.store$.pipe(select(selectRoomId));
    this.adminRoomId$ = this.store$.pipe(select(selectAdminRoomId));
  }

  copyRoomLink(roomId: string) {
    const url = window.location.href;

    copyStringToClipboard(`${url.substr(0, url.lastIndexOf('/'))}/${roomId}`);
  }

  copyRoomId(roomId: string) {
    copyStringToClipboard(roomId);
  }

  startTimer() {
    this.store$.dispatch(roomActions.startTimer());
  }

  stopTimer() {
    this.store$.dispatch(roomActions.stopTimer());
  }
}
