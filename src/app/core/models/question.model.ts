export interface Question {
  id: number;
  categoryId: number;
  categoryName: string;
  questionText: string;
  answer?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionType: string;
}
