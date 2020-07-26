import { Story, TeamMember, RoomSettings, VotingResult, Room } from '@app/models';
import { createSelector } from '@ngrx/store';
import { AppStates } from '..';
import { allCards } from '@app/helpers';

export interface RoomState {
  roomId: string;
  adminRoomId: string;
  title: string;
  timerSeconds: number;
  isVoting: boolean;
  stories: Story[];
  currentStory: Story;
  participants: TeamMember[];
  currentTeamMember: TeamMember;
  settings: RoomSettings;
  timerValue: number;
}

export const initialRoomState: RoomState = {
  roomId: '',
  adminRoomId: '',
  title: '',
  timerSeconds: 0,
  stories: [],
  isVoting: false,
  currentStory: null,
  participants: [],
  currentTeamMember: {
    id: '',
    name: '',
    isScrumMaster: false,
    selectedCard: 0
  },
  settings: {
    votingTimeSec: 30,
    storyBaseLink: '',
    availableCards: allCards.filter(c => c < 30)
  },
  timerValue: 0
};

export const selectRoomState = (store: AppStates) => store.roomState;

export const selectCurrentUser = createSelector(selectRoomState,
  (state: RoomState) => state.currentTeamMember
);
export const selectUserSelectedCard = createSelector(selectRoomState,
  (state: RoomState) => state.currentTeamMember?.selectedCard
);

export const selectRoom = createSelector(selectRoomState,
  (state: RoomState): Room => state
);

export const selectIsRoomLoading = createSelector(selectRoomState,
  (state: RoomState) => !state.roomId
);

export const selectRoomTitle = createSelector(selectRoomState,
  (state: RoomState) => state.title
);
export const selectRoomId = createSelector(selectRoomState,
  (state: RoomState) => state.roomId
);
export const selectAdminRoomId = createSelector(selectRoomState,
  (state: RoomState) => state.adminRoomId
);

export const selectIsScrumMaster = createSelector(selectRoomState,
  (state: RoomState) => !!state.adminRoomId
);

export const selectIsVoting = createSelector(selectRoomState,
  (state: RoomState) => state.isVoting
);

export const selectStories = createSelector(selectRoomState,
  (state: RoomState) => state.stories
);
export const selectIsAnyStory = createSelector(selectRoomState,
  (state: RoomState) => !!(state.stories && state.stories.length)
);
export const selectCurrentStory = createSelector(selectRoomState,
  (state: RoomState) => state.currentStory
);
export const selectCurrentStoryVotes = createSelector(selectRoomState,
  (state: RoomState) => state.currentStory
    ? state.currentStory.votes?.filter(v => v.amount)
    : []
);
export const selectCurrentStoryTotalVotesNumber = createSelector(selectCurrentStoryVotes,
  (votes: VotingResult[]) => votes
    ? votes.reduce((sum, current) => sum + current.amount, 0)
    : 0
);

export const selectParticipants = createSelector(selectRoomState,
  (state: RoomState) => state.participants
);
export const selectParticipantsAmount = createSelector(selectRoomState,
  (state: RoomState) => state.participants ? state.participants.length : 0
);

export const selectTimerValue = createSelector(selectRoomState,
  (state: RoomState) => state.timerSeconds
);

export const selectSettings = createSelector(selectRoomState,
  (state: RoomState) => state.settings
);
export const selectVotingTimeSec = createSelector(selectSettings,
  (settings: RoomSettings) => settings.votingTimeSec
);
export const selectStoryBaseLink = createSelector(selectSettings,
  (settings: RoomSettings) => settings.storyBaseLink
);
export const selectAvailableCards = createSelector(selectSettings,
  (settings: RoomSettings) => settings.availableCards
);
