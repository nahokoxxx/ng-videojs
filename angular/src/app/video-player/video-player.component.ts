import {
  Component,
  type ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { type Observable, forkJoin } from 'rxjs';
import { VideoService } from '../service/video.service';

declare var videojs: any;

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('target', { static: true }) target!: ElementRef;

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.videoService.videoUrlObservable().subscribe((videoUrl) => {
      const player = videojs(this.target.nativeElement, {
        html5: {
          vhs: {
            overrideNative: true
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false
        },
        controls: true,
        logo: { enabled: false },
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4],
        autoplay: false,
        controlBar: {
          pictureInPictureToggle: false
        },
        sources: [
          {
            src: videoUrl,
            type: 'application/x-mpegURL'
          }
        ]
      });
      player.httpSourceSelector();

      this.videoService.vttTextObservable().subscribe((vttText) => {
        const lines: string[] = vttText.split(/\r?\n/);
        const thumbnailObservables: Observable<Blob>[] = [];
        const timeList: number[] = [];
        const xywhList: string[] = [];

        for (var i = 0; i < lines.length; i++) {
          if (lines[i].includes('.jpg') || lines[i].includes('.png')) {
            const seconds = this.videoService.convertDurationtoSeconds(
              lines[i - 1].substring(0, 8)
            );
            timeList.push(seconds);

            const imgFileName =
              lines[i].split('/')[lines[i].split('/').length - 1];
            if (lines[i].includes('#xywh=')) {
              const xywhText = imgFileName.split('#xywh=');
              const xywh = xywhText[xywhText.length - 1];
              xywhList.push(xywh);
            }
            const thumbnailUrl = `http://localhost:3000/${imgFileName}`;

            const thumbnailObservable = this.videoService.thumbnailBlobObservable(
              thumbnailUrl
            );
            thumbnailObservables.push(thumbnailObservable);
          }
        }

        forkJoin(thumbnailObservables).subscribe((thumbnailBlobs) => {
          const thumbnails: { [time: number]: { src?: string; style?: any } } =
            {};
          thumbnailBlobs.forEach((blob, index) => {
            const time = timeList[index];
            const thumbnailUrl = URL.createObjectURL(blob);
  
            if (xywhList.length == timeList.length && xywhList.length > 0) {
              const xywh = xywhList[index].split(',');
              const styleJson = {
                background:
                  "url('" +
                  thumbnailUrl +
                  "') " +
                  -xywh[0] +
                  'px ' +
                  -xywh[1] +
                  'px',
                width: xywh[2] + 'px',
                height: xywh[3] + 'px',
                top: -xywh[3] + 'px',
              };
              thumbnails[time] = {
                style: styleJson,
              };
            } else {
              thumbnails[time] = {
                src: thumbnailUrl,
              };
            }
          });
          player.thumbnails(thumbnails);
        });
      });
    });
  }
}
