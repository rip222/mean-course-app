import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from 'src/app/posts.service';
import { Observable } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.sass']
})
export class PostListComponent implements OnInit {
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [2, 5, 10];
  posts$: Observable<Post[]>;
  constructor(private postsService: PostsService) {
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.posts$ = this.postsService.getPostUpdateListener();
  }

  onPostDelete(id: string) {
    this.postsService.deletePost(id);
  }

  onPageChange(pageData: PageEvent) {

  }
}
