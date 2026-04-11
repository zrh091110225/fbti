import { PersistedQuizState } from '../types/quiz'

const STORAGE_KEY = 'fbti_quiz_state'

const DEFAULT_STATE: PersistedQuizState = {
  screen: 'home',
  answers: [],
  currentQuestion: 0
}

export function loadQuizState(): PersistedQuizState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return DEFAULT_STATE
    }

    const parsed = JSON.parse(raw) as Partial<PersistedQuizState>
    const answers = Array.isArray(parsed.answers) ? parsed.answers : []
    const currentQuestion = typeof parsed.currentQuestion === 'number' ? parsed.currentQuestion : 0
    const screen = parsed.screen === 'quiz' || parsed.screen === 'result' ? parsed.screen : 'home'

    if (!answers.length && screen === 'result') {
      return DEFAULT_STATE
    }

    return {
      screen,
      answers,
      currentQuestion
    }
  } catch (error) {
    console.warn('Failed to load quiz state from storage', error)
    return DEFAULT_STATE
  }
}

export function saveQuizState(state: PersistedQuizState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save quiz state to storage', error)
  }
}

export function clearQuizState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear quiz state from storage', error)
  }
}
