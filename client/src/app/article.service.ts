import { Injectable } from '@angular/core';
import { Article } from './interfaces/article';
import { ARTICLES } from './mock-articles';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articlesUrl = 'http://localhost:3000/api/articles';
  constructor(
    private http: HttpClient,
  ) { }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.articlesUrl);
  }
}
