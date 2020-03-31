import { Component, OnInit } from '@angular/core';
import { ARTICLES } from '../mock-articles';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles = ARTICLES;
  constructor() { }

  onSelect(article: Article): void {
    this.selectedArticle = article;
  }
  ngOnInit(): void {
  }

}
