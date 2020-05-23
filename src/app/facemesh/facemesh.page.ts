import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as facemesh from '@tensorflow-models/facemesh';

import { OverlayService } from '../overlay.service';

@Component({
  selector: 'app-facemesh',
  templateUrl: './facemesh.page.html',
  styleUrls: ['./facemesh.page.scss']
})
export class FacemeshPage implements OnInit {
  @ViewChild('video', { static: true })
  video: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay', { static: true })
  overlay: ElementRef<HTMLCanvasElement>;
  facemesh;
  animationFrame;
  metadata: any = {};

  constructor(
    private overlayService: OverlayService
  ) { }

  ngOnInit(): void {
    this.metadata.events = {
      initApp: new Date()
    };
    facemesh.load().then((f) => {
      this.metadata.events.modelLoaded = new Date();
      this.facemesh = f;
    });
    const video = this.video.nativeElement;
    this.overlayService.setElement(video);
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: { min: 960, ideal: 1280 },
        height: { min: 720, ideal: 960 }
      }
    })
      .then((stream) => {
        this.metadata.events.gettingStream = new Date();
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
          this.metadata.events.startingProcessing = new Date();
          this.overlayService.setSize(video.offsetWidth, video.offsetHeight);
          this.process(video);
        });
      });
  }
  process(video) {
    if (video.paused || video.ended) {
      this.animationFrame = requestAnimationFrame(() => this.process(video));
      return;
    }
    if (this.facemesh) {
      if (!this.metadata.events.startingEstimateFaces) {
        this.metadata.events.startingEstimateFaces = new Date();
      }
      this.facemesh.estimateFaces(video).then((faces) => {
        if (!this.metadata.events.firstEstimateFacesResult) {
          this.metadata.events.firstEstimateFacesResult = new Date();
        }
        this.overlayService.clear();
        if (faces && faces.length > 0) {
          const scale = video.offsetWidth / video.videoWidth;
          this.metadata.videoScale = scale;
          this.metadata.facesCount = faces.length;
          faces.forEach((face) => {
            const p1 = face.boundingBox.topLeft[0];
            const p2 = face.boundingBox.bottomRight[0];
            const x1 = p1[0];
            const y1 = p1[1];
            const x2 = p2[0];
            const y2 = p2[1];
            const width = x2 - x1;
            const height = y2 - y1;
            face.scaledMesh.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 1);
            });
            face.annotations.silhouette.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 1, '#0F0');
            });
            face.annotations.midwayBetweenEyes.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 2, '#00F');
            });
            face.annotations.leftCheek.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 2, '#00F');
            });
            face.annotations.rightCheek.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 2, '#00F');
            });
            face.annotations.noseBottom.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 2, '#00F');
            });
            face.annotations.noseLeftCorner.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 2, '#00F');
            });
            face.annotations.noseRightCorner.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 2, '#00F');
            });
            face.annotations.noseTip.forEach((position) => {
              this.overlayService.drawPoint(position[0] * scale, position[1] * scale, 2, '#00F');
            });
            this.overlayService.drawRect(x1 * scale, y1 * scale, width * scale, height * scale);
          });
        }
      });
    }
    this.animationFrame = requestAnimationFrame(() => this.process(video));
  }
}
