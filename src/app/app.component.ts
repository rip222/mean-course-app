import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'mean-course';
  posts = [];
  addPost(event) {
    this.posts.push(event);
  }
}
