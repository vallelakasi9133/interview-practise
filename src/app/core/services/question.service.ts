import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { QUESTIONS_DATA } from '../data/questions.data';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private questions = QUESTIONS_DATA;

  getQuestionsByCategory(categoryId: number): Question[] {
    return this.questions.filter(q => q.categoryId === categoryId);
  }

  getRandomQuestion(categoryId: number, excludedIds: number[]): Question | null {
    let pool: Question[];

    if (categoryId === 13) {
      // Full Stack: mix from .NET ecosystem + frontend
      pool = this.questions.filter(q => !excludedIds.includes(q.id));
    } else if (categoryId === 14) {
      // Mixed: all categories
      pool = this.questions.filter(q => !excludedIds.includes(q.id));
    } else {
      pool = this.questions.filter(q => q.categoryId === categoryId && !excludedIds.includes(q.id));
    }

    if (pool.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  getQuestionCountForCategory(categoryId: number): number {
    if (categoryId === 13 || categoryId === 14) return 20;
    return this.questions.filter(q => q.categoryId === categoryId).length;
  }
}
