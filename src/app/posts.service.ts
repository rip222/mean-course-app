import { Injectable } from '@angular/core';
import { Post } from './posts/post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any[], maxPosts: number}>('http://localhost:3000/api/posts' + queryParams).pipe(
      map(data => {
        return {
          posts: data.posts.map(post => {
            return {id: post._id, ...post};
            }),
          maxPosts: data.maxPosts
        };
      })
    )
      .subscribe(data => {
        this.posts = data.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: data.maxPosts});
      });
    // return [...this.posts];
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.http.post<{message: string; post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe(data => {
        this.router.navigate(['/']);
      });
    }

    updatePost(post: Post) {
    let postData: Post | FormData;
    if (typeof post.imagePath === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.imagePath);
    } else {
      postData = post;
    }
    this.http.put<{message: string, post: Post}>('http://localhost:3000/api/posts' + post.id, postData)
      .subscribe(response => {

        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete<{message: string}>('http://localhost:3000/api/posts' + id);
  }
}
