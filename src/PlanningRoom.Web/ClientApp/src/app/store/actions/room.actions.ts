import { createAction, props } from '@ngrx/store';
import { Room, Story, TeamMember, RoomSettings } from '@app/models';

export const goToStart = createAction(
  '[room] Go to start'
);
export const goToRoom = createAction(
  '[room] Go to room',
  props<{ roomId: string }>()
);

export const setUserName = createAction(
  '[room] Set user name',
  props<{ userName: string }>()
);

export const createRoom = createAction(
  '[room] Create room',
  props<{ title: string, settings: RoomSettings }>()
);
export const createRoomFailed = createAction(
  '[room] Create room failed'
);
export const createRoomSuccess = createAction(
  '[room] Create room success',
  props<{ roomId: string, adminRoomId: string, title: string }>()
);

export const updateRoom = createAction(
  '[room] Update room',
  props<Room>()
);
export const updateRoomFailed = createAction(
  '[room] Update room failed'
);
export const updateRoomSuccess = createAction(
  '[room] Update room success'
);

export const setRoomSettings = createAction(
  '[room] Set room settings',
  props<{ settings: RoomSettings }>()
);

export const restoreUserName = createAction(
  '[room] Restore user name'
);
export const askUserName = createAction(
  '[room] Ask user name',
  props<{ roomId: string }>()
);

export const joinRoom = createAction(
  '[room] Join room',
  props<{ roomId: string }>()
);
export const joinRoomFailed = createAction(
  '[room] Join room failed'
);
export const joinRoomSuccess = createAction(
  '[room] Join room success',
  props<Room>()
);

export const connectToRoomHubFailed = createAction(
  '[room] Connect room to hub failed'
);
export const connectToRoomHubSuccess = createAction(
  '[room] Connect room to hub success'
);

export const addStory = createAction(
  '[room] Add story',
  props<Story>()
);
export const addStoryFailed = createAction(
  '[room] Add story failed'
);
export const addStorySuccess = createAction(
  '[room] Add story success'
);

export const editStory = createAction(
  '[room] Edit story',
  props<Story>()
);
export const editStoryFailed = createAction(
  '[room] Edit story failed'
);
export const editStorySuccess = createAction(
  '[room] Edit story success'
);

export const deleteStory = createAction(
  '[room] Delete story',
  props<{ storyId: string }>()
);
export const deleteStoryFailed = createAction(
  '[room] Delete story failed'
);
export const deleteStorySuccess = createAction(
  '[room] Delete story success'
);

export const removeUser = createAction(
  '[room] Remove user',
  props<{ userId: string }>()
);
export const disconnected = createAction(
  '[room] Disconnected'
);

export const setStories = createAction(
  '[room] Set stories',
  props<{ stories: Story[] }>()
);

export const setParticipants = createAction(
  '[room] Set participants',
  props<{ participants: TeamMember[] }>()
);

export const selectStory = createAction(
  '[room] Select story',
  props<{ storyId: string }>()
);
export const selectStoryFailed = createAction(
  '[room] Select story failed'
);
export const selectStorySuccess = createAction(
  '[room] Select story success'
);

export const setStoryPoints = createAction(
  '[room] Set story points',
  props<{ storyPoints: number }>()
);
export const setStoryPointsFailed = createAction(
  '[room] Set story points failed'
);
export const setStoryPointsSuccess = createAction(
  '[room] Set story points success'
);

export const setCurrentStory = createAction(
  '[room] Set current story',
  props<{ story: Story }>()
);

export const selectCard = createAction(
  '[room] Select card',
  props<{ card: number }>()
);
export const selectCardFailed = createAction(
  '[room] Select card failed'
);
export const selectCardSuccess = createAction(
  '[room] Select card success'
);

export const startTimer = createAction(
  '[room] Start timer'
);
export const startTimerFailed = createAction(
  '[room] Start timer failed'
);
export const startTimerSuccess = createAction(
  '[room] Start timer success'
);

export const stopTimer = createAction(
  '[room] Stop timer'
);
export const stopTimerFailed = createAction(
  '[room] Stop timer failed'
);
export const stopTimerSuccess = createAction(
  '[room] Stop timer success'
);

export const startVoting = createAction(
  '[room] Start voting'
);
export const endVoting = createAction(
  '[room] End voting'
);
export const timerTick = createAction(
  '[room] Timer tick',
  props<{ seconds: number }>()
);

export const resetCards = createAction(
  '[room] Reset cards'
);
export const resetCardsFailed = createAction(
  '[room] Reset cards failed'
);
export const resetCardsSuccess = createAction(
  '[room] Reset cards success'
);
