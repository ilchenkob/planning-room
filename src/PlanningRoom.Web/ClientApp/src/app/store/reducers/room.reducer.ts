import { Action, createReducer, on } from '@ngrx/store';
import * as roomActions from '../actions/room.actions';
import { initialRoomState, RoomState } from '../states/room.state';

const roomReducer = createReducer(
    initialRoomState,
    on(roomActions.setUserName,
      (state, action) => ({
      ...state,
      currentTeamMember: {
        id: new Date().getMilliseconds().toString() + Math.floor((Math.random() * 200) + 1),
        name: action.userName,
        isScrumMaster: false,
        selectedCard: 0
      }
    })),
    on(roomActions.joinRoomSuccess, (state, action) => ({
      ...state,
      roomId: action.roomId,
      adminRoomId: action.adminRoomId,
      title: action.title,
      currentStory: action.currentStory,
      stories: action.stories,
      participants: action.participants,
      settings: action.settings
    })),
    on(roomActions.setStories, (state, action) => ({
      ...state,
      stories: action.stories,
      currentStory: state.currentStory
        ? action.stories.find(s => s.id === state.currentStory.id)
        : state.currentStory
    })),
    on(roomActions.setParticipants, (state, action) => ({
      ...state,
      participants: action.participants
    })),
    on(roomActions.setCurrentStory, (state, action) => ({
      ...state,
      currentStory: action.story
    })),
    on(roomActions.startVoting, (state) => ({
      ...state,
      isVoting: true,
      currentTeamMember: {
        ...state.currentTeamMember,
        selectedCard: 0
      }
    })),
    on(roomActions.endVoting, (state) => ({
      ...state,
      isVoting: false
    })),
    on(roomActions.timerTick, (state, action) => ({
      ...state,
      timerSeconds: action.seconds
    })),
    on(roomActions.selectCard, (state, action) => ({
      ...state,
      currentTeamMember: {
        ...state.currentTeamMember,
        selectedCard: action.card
      }
    })),
    on(roomActions.setRoomSettings, (state, action) => ({
      ...state,
      settings: {
        ...action.settings
      }
    }))
);

export function reducer(state: RoomState | undefined, action: Action) {
    return roomReducer(state, action);
}
