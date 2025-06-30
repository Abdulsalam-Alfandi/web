import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragOver = false;
  uploadProgress = 0;
  isUploading = false;

  // Video metadata
  videoTitle = '';
  videoDescription = '';
  videoTags = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFileSelection(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  private handleFileSelection(file: File) {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    // Validate file size (60MB max for 1 minute video)
    const maxSize = 60 * 1024 * 1024; // 60MB
    if (file.size > maxSize) {
      alert('File size too large. Please select a video under 60MB');
      return;
    }

    this.selectedFile = file;
    this.createPreview(file);
  }

  private createPreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.videoTitle = '';
    this.videoDescription = '';
    this.videoTags = '';
  }

  simulateUpload() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress += Math.random() * 15;

      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);

        setTimeout(() => {
          this.isUploading = false;
          alert('Video uploaded successfully! (This is just a simulation)');
          this.removeFile();
        }, 500);
      }
    }, 200);
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getVideoDuration(event: any) {
    const video = event.target;
    const duration = Math.round(video.duration);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    // Check if video is longer than 1 minute
    if (duration > 60) {
      alert('Video must be 1 minute or shorter');
      this.removeFile();
      return;
    }

    console.log(`Video duration: ${minutes}:${seconds.toString().padStart(2, '0')}`);
  }
}
