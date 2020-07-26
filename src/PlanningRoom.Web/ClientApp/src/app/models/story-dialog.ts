import { Story } from './story';

export interface StoryDialog {
  dialog: {
    title: string;
    actionButton: string;
    disabled?: boolean;
  };
  story: Story;
}
