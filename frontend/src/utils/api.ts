import { QuizAnswer } from '../types/quiz'

interface EventPayload {
  event: string
  properties?: Record<string, string | number | boolean>
  timestamp: number
}

export async function postAnalyticsEvent(payload: EventPayload) {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: true
    })
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to post analytics event', error)
    }
  }
}

export async function postQuizResult(payload: {
  personalityId: string
  answers: QuizAnswer[]
  completedAt: string
}) {
  try {
    await fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: true
    })
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to post quiz result', error)
    }
  }
}
