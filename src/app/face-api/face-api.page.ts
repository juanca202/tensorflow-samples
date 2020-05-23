import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';

import * as faceapi from 'face-api.js';

import { OverlayService } from '../overlay.service';

@Component({
  selector: 'app-face-api',
  templateUrl: './face-api.page.html',
  styleUrls: ['./face-api.page.scss']
})
export class FaceApiPage implements OnInit, OnDestroy {
  @ViewChild('video', { static: true })
  video: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay', { static: true })
  overlay: ElementRef<HTMLCanvasElement>;
  animationFrame;
  metadata: any = {};
  faceDetectorOptions = new faceapi.TinyFaceDetectorOptions({
    inputSize: 224,
    scoreThreshold: 0.5
  });
  modelsUri = 'assets/weights/';

  constructor(
    private overlayService: OverlayService
  ) { }

  ngOnInit(): void {
    console.log(faceapi.nets);
    this.metadata.events = {
      initApp: new Date()
    };
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(this.modelsUri),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri(this.modelsUri),
      //faceapi.nets.faceRecognitionNet.loadFromUri(this.modelsUri),
      faceapi.nets.ageGenderNet.loadFromUri(this.modelsUri),
      faceapi.nets.faceExpressionNet.loadFromUri(this.modelsUri)
    ])
      .then(() => {
        console.log('Models loaded');
      })
      .catch((error) => {
        console.log(error);
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
  ngOnDestroy(): void { }
  process(video) {
    if (video.paused || video.ended) {
      this.animationFrame = requestAnimationFrame(() => this.process(video));
      return;
    }
    if (
      faceapi.nets.tinyFaceDetector.params &&
      //faceapi.nets.faceRecognitionNet.params &&
      faceapi.nets.faceLandmark68TinyNet.params &&
      faceapi.nets.ageGenderNet.params &&
      faceapi.nets.faceExpressionNet.params
    ) {
      if (!this.metadata.events.startingEstimateFaces) {
        this.metadata.events.startingEstimateFaces = new Date();
      }
      faceapi
        .detectAllFaces(video, this.faceDetectorOptions)
        .withFaceLandmarks(true)
        .withFaceExpressions()
        .withAgeAndGender()
        .then((faces) => {
          if (!this.metadata.events.firstEstimateFacesResult) {
            this.metadata.events.firstEstimateFacesResult = new Date();
          }
          this.overlayService.clear();
          if (faces && faces.length > 0) {
            const scale = video.offsetWidth / video.videoWidth;
            this.metadata.videoScale = scale;
            this.metadata.facesCount = [];
            faces.forEach((face: any) => {
              this.metadata.facesCount.push({
                age: face.age,
                gender: face.gender,
                genderProbability: face.genderProbability,
                expressions: face.expressions
              });
              face.landmarks.positions.forEach((position) => {
                this.overlayService.drawPoint(position.x * scale, position.y * scale, 1);
              });
              face.landmarks.getRefPointsForAlignment().forEach((position) => {
                this.overlayService.drawPoint(position.x * scale, position.y * scale, 2, '#0F0');
              });
              this.overlayService.drawRect(face.alignedRect.box.x * scale, face.alignedRect.box.y * scale, face.alignedRect.box.width * scale, face.alignedRect.box.height * scale, '#0F0');
              this.overlayService.drawRect(face.detection.box.x * scale, face.detection.box.y * scale, face.detection.box.width * scale, face.detection.box.height * scale);
            });
          }
        });
    }
    this.animationFrame = requestAnimationFrame(() => this.process(video));
  }
}
