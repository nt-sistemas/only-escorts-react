export interface StorySlide {
  id: string;
  image: string;
  duration: number;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  slides: StorySlide[];
  viewed: boolean;
}
