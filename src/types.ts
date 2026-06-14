/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum QuestionType {
  MCQ = "mcq",          // Multiple Choice
  TRUE_FALSE = "tf",    // True or False
  FILL_BLANK = "blank", // Fill in the blank
  MATCH = "match",      // Matching pairs
}

export interface Question {
  id: string;
  unitId: number;
  lessonId?: string; // Optional link to a specific lesson ID
  type: QuestionType;
  text: string;
  options?: string[]; // Used for MCQ
  correctAnswer: string; // For MCQ, TF, Blank
  explanation?: string;
  matchPairs?: { left: string; right: string }[]; // Used for MATCH
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  illustration?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string[];
  keyPoints: string[];
  illustration: string;
}

export interface Unit {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  themeColor: string; // tailwind class prefix (e.g., 'emerald', 'sky')
  icon: string; // Lucide icon name
  lessons: Lesson[];
  timeline: TimelineEvent[];
  flashcards: Flashcard[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  condition: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}
