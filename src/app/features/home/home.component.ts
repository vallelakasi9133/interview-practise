import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.categories = this.categoryService.getAll();
  }

  startInterview(category: Category): void {
    this.router.navigate(['/interview', category.slug]);
  }
}
