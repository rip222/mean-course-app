import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from 'src/app/posts.service';
import { Observable, pipe } from 'rxjs';
import { PageEvent } from '@angular/material';
import { tap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.sass']
})
export class PostListComponent implements OnInit {
  isAuth: Observable<boolean>;
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];
  posts$: Observable<Post[]>;
  constructor(private postsService: PostsService, private authService: AuthService) {
  }

  ngOnInit() {
    // this.totalPosts = this.postsPerPage;
    this.isAuth = this.authService.getAuthStatusListener();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.posts$ = this.postsService.getPostUpdateListener().pipe(
      tap((data: any) => this.totalPosts = data.postCount),
      map(data => data.posts)
    );
  }

  onPostDelete(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangePage(pageData: PageEvent) {
    // this.totalPosts = this.postsPerPage;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
