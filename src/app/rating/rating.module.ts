import { NgModule } from '@angular/core';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    StarRatingComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ]
})
export class RatingModule {}
