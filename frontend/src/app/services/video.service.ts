import { Injectable } from '@angular/core';
import { Video, Comment } from '../models/video.model';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private videos: Video[] = [
    {
      id: '1',
      title: 'Sample Video 1',
      url: 'https://static.videezy.com/system/resources/previews/000/007/770/original/playing_in_the_blackboard.mp4',
      votes: { up: 10, down: 2 },
      userVote: null,
      comments: [
        {
          username: 'Geralt',
          avatarUrl: 'https://dailygame.at/wp-content/uploads/2022/08/the-witcher-3-wild-hunt-cd-projekt-765x470.jpg',
          text: 'Great!' ,
          timestamp: new Date('2025-06-01T10:00:00')
        },
        {
          username: 'Ciri',
          avatarUrl: 'https://i.ds.at/zX9N3Q/c:3834:2160:fp:0.500:0.500/rs:fill:750:0/plain/lido-images/2025/06/04/40bd7a64-7614-4724-be79-ee5437267e1b.jpeg',
          text: 'Loved it!' ,
          timestamp: new Date('2025-06-02T14:30:00')
        }
      ]
    },
    {
      id: '2',
      title: 'Sample Video 2',
      url: 'https://static.videezy.com/system/resources/previews/000/005/514/original/vinyl_disc_03.mp4',
      votes: { up: 5, down: 1 },
      userVote: null,
      comments: [
        {
          username: 'Emyhr',
          avatarUrl: 'https://assets.mycast.io/characters/emhyr-var-emreis-725933-normal.jpg?1591626019',
          text: 'Nice!' ,
          timestamp: new Date('2025-05-30T09:15:00')
        }
      ]
    }
  ];

  getVideos(): Video[] {
    return this.videos;
  }

  vote(videoId: string, direction: 'up' | 'down'): void {
    const v = this.videos.find(x => x.id === videoId);
    if (!v || v.userVote === direction) return;

    if (v.userVote === 'up') v.votes.up--;
    if (v.userVote === 'down') v.votes.down--;

    if (direction === 'up') v.votes.up++;
    if (direction === 'down') v.votes.down++;
    v.userVote = direction;
  }

  getComments(videoId: string): Comment[] {
    const v = this.videos.find(x => x.id === videoId);
    return v ? v.comments : [];
  }

  addComment(videoId: string, comment: Comment): void {
    const v = this.videos.find(x => x.id === videoId);
    if (v) v.comments.push(comment);
  }
}
