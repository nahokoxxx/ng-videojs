import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private http: HttpClient) {}

  videoUrlObservable() {
    return of(
      'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8'
    );
  }

  vttTextObservable() {
    return this.http.get('http://localhost:3000/sample.vtt', {
      responseType: 'text',
    });
  }

  thumbnailBlobObservable(url: string) {
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  convertDurationtoSeconds(duration: string) {
    const [hour, minute, second] = duration.split(':');
    return Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second);
  }
}
