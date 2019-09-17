import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'}) // used to make Angular "aware" of service (other way to use this is via providers in app.module.ts)
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string, posts: any; maxPosts: number }>(
      BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                address: post.address,
                rating: post.rating,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe((transformedPostsData) => {
        console.log(transformedPostsData);
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  // return object copy of post of given id
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      address: string;
      rating: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
}


addPost(title: string, content: string, address: string, rating: string, image: File) {
  const postData = new FormData();
  postData.append('title', title);
  postData.append('content', content);
  postData.append('address', address);
  postData.append('rating', rating);
  postData.append('image', image, title);
  this.http
    .post<{ message: string; post: Post }>(
      BACKEND_URL,
      postData
    )
    .subscribe(responseData => {
      this.router.navigate(['/']);
    });
}

  updatePost(id: string, title: string, content: string, address: string, rating: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('address', address);
      postData.append('rating', rating);
      postData.append('image', image, title);
    } else {
      const postData: Post = {
        id: id,
        title: title,
        content: content,
        address: address,
        rating: rating,
        imagePath: image,
        creator: null
      };
    }
    // replace post data locally
    // copy posts array, replace post of given index with new values and send array over
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        // redirect user to main page after editing post
        this.router.navigate(['/']);
      });
  }

  findPosts(address: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      address: string;
      rating: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + address);
}

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
