import {
  Component,
  type ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true }) target!: ElementRef;

  player?: Player;

  ngOnInit() {
    this.videoUrlObservable().subscribe((videoUrl) => {
      this.player = videojs(this.target.nativeElement, {
        sources: [
          {
            src: videoUrl,
            type: 'application/x-mpegURL',
          },
        ],
      });
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  videoUrlObservable() {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(
          'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
        );
      }, 2000);
    });
  }
}
