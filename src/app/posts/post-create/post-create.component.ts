import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { StarRatingComponent } from 'ng-starrating';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy{
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;
  rating: string;
  userEmail: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(
      authStatus => {
        this.isLoading = false;
        this.userEmail = this.authService.getUserEmail();
        console.log(this.userEmail);
    });
    // reactive approach
    this.form = new FormGroup({
      title: new FormControl(null, {
        //validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
        validators: [Validators.required]
      }),
      rating: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    // check whether url has got a post id and store it if present for editing
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            address: postData.address,
            rating: postData.rating,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          // initialize values with edited post object data
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            address: this.post.address,
            rating: this.post.rating,
            image: ''
          });
          this.rating = this.post.rating;
        });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onImagePicked(event: Event) {
    // type conversion to HTMLInputElement
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    // re-evaluate and check image value
    this.form.get('image').updateValueAndValidity();
    // convert image to a viewable value
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    // check whether post is created or is edited
    if (this.mode === 'create') {
      this.userEmail = this.authService.getUserEmail();
      this.postsService.addPost(
        //this.form.value.title,
        this.userEmail,
        this.form.value.content,
        this.form.value.address,
        this.form.value.rating,
        this.form.value.image
      );
      console.log(this.userEmail);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.address,
        this.form.value.rating,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onRate($event: {oldValue: number, newValue: number, starRating: StarRatingComponent}) {
    const ratingNumber = $event.newValue;
    this.rating = ratingNumber.toString();
    this.form.get('rating').setValue(this.rating);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
