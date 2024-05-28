import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.css']
})
export class NewsDetailComponent implements OnInit {
  top3News: any[] = [];
  news: any = {};
  relatedNews: any[] = [];
  classpath: string = '';

  newsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newsForm = this.fb.group({
      id: ['']
    });
  }

  ngOnInit(): void {
    // Initialize your data here
    this.fetchNewsData();
  }

  fetchNewsData(): void {
    // Fetch your data and populate the arrays
    // Example:
    // this.top3News = [...];
    // this.news = {...};
    // this.relatedNews = [...];
    // this.classpath = '...';
  }

  onSubmit(): void {
    // Handle form submission
  }
}
