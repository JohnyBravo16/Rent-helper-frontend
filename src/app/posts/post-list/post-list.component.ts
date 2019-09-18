import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
 posts: Post[] = [];
 mainPosts: Post[] = [];
 filteredPosts: Post[] = [];
 isLoading = false;
 totalPosts = 0;
 postsPerPage = 2;
 mainPostsPerPage: number;
 pageSizeOptions = [1, 2, 5, 10];
 currentPage = 1;
 userIsAuthenticated = false;
 userId: string;
 rating: string;
 userEmail: string;
 formSearch: FormGroup;
 searchValue = '';
 isFiltered = false;
 numberFilteredPosts = 20;

 private postsSub: Subscription;
 private authStatusSub: Subscription;

 constructor(
  public postsService: PostsService,
  private authService: AuthService,
  public router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.userEmail = this.authService.getUserEmail();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.mainPostsPerPage = postData.postCount;
        this.posts = postData.posts;
        this.mainPosts = [...this.posts];
    });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
    this.formSearch = new FormGroup({
      searchValue: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onFindPosts(searchAddress: string) {
    this.isLoading = true;
    this.postsService.findPosts(this.searchValue);
  }

  onReset() {
    this.isFiltered = false;
    this.isLoading = true;
    this.formSearch.get('searchValue').setValue('');
    this.postsService.getPosts(this.postsPerPage, 1);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.mainPostsPerPage = postData.postCount;
        this.posts = postData.posts;
    });
  }


  onFilterPosts() {
    if (!this.formSearch.get('searchValue').value) {
      return;
    } else {
      this.isFiltered = true;
      this.isLoading = true;
      this.postsService.getPosts(this.numberFilteredPosts, this.currentPage);
      this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((postData: {posts: Post[], postCount: number}) => {
          this.isLoading = false;
          this.posts = [];
          this.posts = postData.posts.filter(el => {
            return el.address === this.formSearch.get('searchValue').value;
          });
      });
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
