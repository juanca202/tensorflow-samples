import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as facemesh from '@tensorflow-models/facemesh';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tensorflowjs';
}
