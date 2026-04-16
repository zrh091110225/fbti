import { PersistedQuizState } from '../types/quiz'

const STORAGE_KEY = 'fbti_quiz_state'

const DEFAULT_STATE: PersistedQuizState = {
  screen: 'home',
  answers: [],
  currentQuestion: 0,
  questionOrder: []
}

function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function loadQuizState(): PersistedQuizState {
  if (!isStorageAvailable()) {
    return DEFAULT_STATE
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return DEFAULT_STATE
    }

    const parsed = JSON.parse(raw) as Partial<PersistedQuizState>
    const answers = Array.isArray(parsed.answers) ? parsed.answers : []
    const currentQuestion = typeof parsed.currentQuestion === 'number' ? parsed.currentQuestion : 0
    const screen = parsed.screen === 'quiz' || parsed.screen === 'result' ? parsed.screen : 'home'
    const questionOrder = Array.isArray(parsed.questionOrder)
      ? parsed.questionOrder.filter((questionId): questionId is number => typeof questionId === 'number')
      : []

    if (!answers.length && screen === 'result') {
      return DEFAULT_STATE
    }

    return {
      screen,
      answers,
      currentQuestion,
      questionOrder
    }
  } catch (error) {
    console.warn('Failed to load quiz state from storage', error)
    return DEFAULT_STATE
  }
}

export function saveQuizState(state: PersistedQuizState) {
  if (!isStorageAvailable()) {
    return
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to save quiz state to storage', error)
  }
}

export function clearQuizState() {
  if (!isStorageAvailable()) {
    return
  }
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear quiz state from storage', error)
  }
}
