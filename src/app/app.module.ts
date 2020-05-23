import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceApiPage } from './face-api/face-api.page';
import { FacemeshPage } from './facemesh/facemesh.page';
import { HomePage } from './home/home.page';

@NgModule({
  declarations: [
    AppComponent,
    FaceApiPage,
    FacemeshPage,
    HomePage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
