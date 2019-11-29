import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocUploadComponent } from './doc-upload/doc-upload.component';

const routes: Routes = [{ path: '', pathMatch: 'full', component: DocUploadComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }