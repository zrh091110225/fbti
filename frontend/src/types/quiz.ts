export interface QuizAnswer {
  questionId: number
  answerId: number
}

export type AppScreen = 'home' | 'quiz' | 'result'

export interface PersistedQuizState {
  screen: AppScreen
  answers: QuizAnswer[]
  currentQuestion: number
}
