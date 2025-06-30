import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

export const routes: Routes = [{
  path: '',
  redirectTo: '/feed',
  pathMatch: 'full'
},
  {
    path: 'feed',
    loadComponent: () => import('./feed/feed.component').then(m => m.FeedComponent)
  },
  {
    path: 'feed/:id',
    loadComponent: () => import('./feed/feed.component').then(m => m.FeedComponent)
  },
  {
    path: 'upload',
    loadComponent: () => import('./upload/upload.component').then(m => m.UploadComponent)
  },
  {
    path: 'user',
    loadComponent: () => import('./user/user.component').then(m => m.UserComponent)
  },
  {
    path: '**',
    redirectTo: '/feed'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
