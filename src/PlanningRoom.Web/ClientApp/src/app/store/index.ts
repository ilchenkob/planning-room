import { ActionReducerMap } from '@ngrx/store';
import * as room from './reducers/room.reducer';
import { RoomState } from './states/room.state';

export interface AppStates {
  roomState: RoomState;
}

export const reducers: ActionReducerMap<AppStates> = {
  roomState: room.reducer
};
