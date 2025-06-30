import {Component, HostListener, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VideoService } from '../services/video.service';
import { Video, Comment } from '../models/video.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'] ,
})
export class FeedComponent implements OnInit {
  videos: Video[] = [];
  currentIndex = 0;
  currentVideo: Video | null = null;
  commentsVisible = false;
  newCommentText: string = '';
  private touchStartY = 0;
  isPaused = false;
  private touchStartTime = 0;
  private isScrolling = false;

  constructor(
    public videoService: VideoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.videos = this.videoService.getVideos();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.currentIndex = id
        ? this.videos.findIndex(v => v.id === id)
        : 0;
      if (this.currentIndex < 0 || this.currentIndex >= this.videos.length) {
        this.currentIndex = 0;
      }
      this.currentVideo = this.videos[this.currentIndex];
    });
  }

  // Listen for wheel events on desktop
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
    if (this.isScrolling) return;

    this.isScrolling = true;
    setTimeout(() => this.isScrolling = false, 500);

    if (event.deltaY > 0) {
      this.nextVideo();
    } else {
      this.prevVideo();
    }
  }
  voteUp(): void {
    if (this.currentVideo) {
      this.videoService.vote(this.currentVideo.id, 'up');
    }
  }

  voteDown(): void {
    if (this.currentVideo) {
      this.videoService.vote(this.currentVideo.id, 'down');
    }
  }

  toggleComments(): void {
    this.commentsVisible = !this.commentsVisible;
  }

  postComment(): void {
    if (!this.currentVideo || !this.newCommentText.trim()) return;
    const comment: Comment = {
      username: 'CurrentUser',
      avatarUrl: 'https://static1.thegamerimages.com/wordpress/wp-content/uploads/2020/04/Witcher-3-Dettlaff.jpg',
      text: this.newCommentText.trim() ,
      timestamp: new Date()
    };
    this.videoService.addComment(this.currentVideo.id, comment);
    this.newCommentText = '';
  }

  nextVideo(): void {
    const next = (this.currentIndex + 1) % this.videos.length;
    this.router.navigate(['/feed', this.videos[next].id]);
  }

  prevVideo(): void {
    const prev =
      (this.currentIndex - 1 + this.videos.length) % this.videos.length;
    this.router.navigate(['/feed', this.videos[prev].id]);
  }

  shareVideo(): void {
    if (navigator.share && this.currentVideo) {
      navigator.share({
        title: this.currentVideo.title,
        url: window.location.href
      });
    } else {
      alert('Share API not supported in this browser.');
    }
  }
  get upCount(): number {
    return this.currentVideo?.votes.up ?? 0;
  }

  get downCount(): number {
    return this.currentVideo?.votes.down ?? 0;
  }
  // Touch events for mobile vertical scrolling
  onTouchStart(evt: TouchEvent) {
    this.touchStartY = evt.changedTouches[0].clientY;
    this.touchStartTime = Date.now();
  }

  onTouchEnd(evt: TouchEvent) {
    if (this.isScrolling) return;

    const touchEndY = evt.changedTouches[0].clientY;
    const touchEndTime = Date.now();
    const dy = this.touchStartY - touchEndY;
    const timeDiff = touchEndTime - this.touchStartTime;

    // Minimum swipe distance and maximum time for a valid swipe
    const minSwipeDistance = 50;
    const maxSwipeTime = 500;

    if (Math.abs(dy) > minSwipeDistance && timeDiff < maxSwipeTime) {
      this.isScrolling = true;
      setTimeout(() => this.isScrolling = false, 500);

      if (dy > 0) {
        // Swipe up → next video
        this.nextVideo();
      } else {
        // Swipe down → previous video
        this.prevVideo();
      }
    }
  }
  toggleVideoPlayPause(video: HTMLVideoElement) {
    if (video.paused) {
      video.play();
      this.isPaused = false;
    } else {
      video.pause();
      this.isPaused = true;
    }
  }

}
