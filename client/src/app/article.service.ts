import { Injectable } from '@angular/core';
import { Article } from './interfaces/article';
import { ARTICLES } from './mock-articles';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor() { }

  getArticles(): Observable<Article[]> {
    return of(ARTICLES);
  }
}
