import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostsService } from 'src/app/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.sass']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private id: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imgPreview: string;

  constructor(private postService: PostsService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      file: [null, [Validators.required], [mimeType]],
      content: ['', [Validators.required]],
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.isLoading = true;
        this.postService.getPost(this.id).subscribe((post: any) => {
          this.isLoading = false;
          this.post = {id: post._id, ...post, imagePath: post.imagePath};
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            file: this.post.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.get('file').setValue(file);
    this.form.get('file').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    };
    reader.readAsDataURL(file);

  }

  onSavePost() {
    if (this.form.valid) {
      this.isLoading = true;
      if (this.mode === 'create') {
        const post: Post = {id: null, title: this.form.value.title, content: this.form.value.content, imagePath: null, creator: null};
        this.postService.addPost(post, this.form.value.file);
      } else {
        const post: Post = {...this.post, title: this.form.value.title, content: this.form.value.content, imagePath: this.form.value.file};
        this.postService.updatePost(post);
      }
      this.form.reset();
    }
  }

}
