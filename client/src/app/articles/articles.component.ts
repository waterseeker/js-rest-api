import { ArticleService } from './../article.service';
import { Component, OnInit } from '@angular/core';
import { Article } from '../interfaces/article';
import { ARTICLES } from '../mock-articles';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];
  selectedArticle: Article;
  constructor(private articleService: ArticleService) { }

  onSelect(article: Article): void {
    this.selectedArticle = article;
  }
  getArticles(): void {
    this.articleService.getArticles()
        .subscribe(articles => this.articles = articles);
  }
  ngOnInit(): void {
    this.getArticles();
  }

}
