export interface Comment {
  username: string;
  avatarUrl: string;
  text: string;
  timestamp: Date;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  votes: { up: number; down: number };
  userVote: 'up' | 'down' | null;
  comments: Comment[];
}
