import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  element;
  overlay;

  constructor() { }

  setElement(element) {
    const wrapper = document.createElement('div');
    wrapper.id = 'overlay-wrapper';
    wrapper.style.position = 'relative';
    this.element = element;
    this.element.style.display = 'block';
    // Add element to wrapper
    this.element.parentNode.insertBefore(wrapper, element);
    this.element.parentNode.removeChild(element);
    wrapper.appendChild(element);
    // Add canvas overlay
    this.overlay = document.createElement('canvas');
    this.overlay.style.position = 'absolute';
    this.overlay.style.top = 0;
    this.overlay.style.left = 0;
    wrapper.appendChild(this.overlay);
  }
  setSize(width, height) {
    this.overlay.width = width;
    this.overlay.height = height;
  }
  clear() {
    const ctx = this.overlay.getContext('2d');
    ctx.clearRect(0, 0, this.overlay.width, this.overlay.height);
  }
  drawLine(x1: number, y1: number, x2: number, y2: number) {
    const ctx = this.overlay.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  drawPoint(x: number, y: number, size: number, color?:string) {
    const ctx = this.overlay.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = color || '#F00';
    ctx.arc(x, y, size, 0, Math.PI * 2, true);
    ctx.fill();
  }
  drawRect(x: number, y: number, width: number, height: number, color?:string) {
    const ctx = this.overlay.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = color || '#F00';
    ctx.strokeRect(x, y, width, height);
  }
}
