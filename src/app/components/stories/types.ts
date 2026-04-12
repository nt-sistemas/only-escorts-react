export interface StorySlide {
  id: string;
  image: string;
  duration?: number; // ms, default 5000
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  slides: StorySlide[];
  viewed: boolean;
}
