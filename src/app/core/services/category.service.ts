import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { CATEGORIES_DATA } from '../data/categories.data';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categories = CATEGORIES_DATA;

  getAll(): Category[] {
    return this.categories.filter(c => c.isActive);
  }

  getById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id);
  }

  getBySlug(slug: string): Category | undefined {
    return this.categories.find(c => c.slug === slug);
  }
}
