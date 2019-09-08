import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { PostListComponent } from './posts/post-list/post-list.component';
// import { PostCreateComponent } from './posts/post-create/post-create.component';
// import { LoginComponent } from './auth/login/login.component';
// import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: '', loadChildren: () => import('../app/posts/posts.module').then(data => data.PostsModule)},
  {path: 'auth', loadChildren: () => import('../app/auth/auth.module').then(data => data.AuthModule)},
  // {path: 'login', component: LoginComponent},
  // {path: 'signup', component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
