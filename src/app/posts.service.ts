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
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{message: string, posts: any[]}>('http://localhost:3000/api/posts').pipe(
      map(data => data.posts.map(post => {
        return {id: post._id, ...post};
      }))
    )
      .subscribe(data => {
        this.posts = data;
        this.postsUpdated.next([...this.posts]);
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
        const postId = data.post.id;
        post.id = postId;
        post.imagePath = data.post.imagePath;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        const newPost: Post = {...post, imagePath: response.post.imagePath};
        updatedPosts[oldPostIndex] = newPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.http.delete<{message: string}>('http://localhost:3000/api/posts' + id)
      .subscribe(_ => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
