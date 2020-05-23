import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home/home.page';
import { FacemeshPage } from './facemesh/facemesh.page';
import { FaceApiPage } from './face-api/face-api.page';

const routes: Routes = [
  {path: '', component: HomePage},
  {path: 'facemesh', component: FacemeshPage},
  {path: 'face-api', component: FaceApiPage},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
