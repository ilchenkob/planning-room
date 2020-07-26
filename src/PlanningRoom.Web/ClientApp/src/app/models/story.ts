import { VotingResult } from './voting-result';

export interface Story {
  id: string;
  storyId: string;
  title: string;
  link: string;
  storyPoints?: number;
  votes: VotingResult[];
}
