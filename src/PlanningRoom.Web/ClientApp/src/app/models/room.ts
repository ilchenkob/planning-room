import { Story } from './story';
import { RoomSettings } from './room-settings';
import { TeamMember } from './team-member';

export interface Room {
  roomId: string;
  adminRoomId: string;
  title: string;
  isVoting: boolean;
  participants: TeamMember[];
  currentStory: Story;
  stories: Story[];
  settings: RoomSettings;
}
