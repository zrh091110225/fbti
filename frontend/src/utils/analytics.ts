// Simple local tracking utility
// Events are cached locally first, then sent to the backend when available.
import { postAnalyticsEvent } from './api'

interface TrackEvent {
  event: string
  properties?: Record<string, string | number | boolean>
  timestamp: number
}

const STORAGE_KEY = 'fbti_analytics'

class Analytics {
  private events: TrackEvent[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        this.events = JSON.parse(stored)
      }
    } catch (e) {
      console.warn('Failed to load analytics from storage')
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events))
    } catch (e) {
      console.warn('Failed to save analytics to storage')
    }
  }

  track(event: string, properties?: Record<string, string | number | boolean>) {
    const trackEvent: TrackEvent = {
      event,
      properties,
      timestamp: Date.now()
    }
    
    this.events.push(trackEvent)
    this.saveToStorage()
    void postAnalyticsEvent(trackEvent)
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event, properties)
    }
  }

  // Page views
  trackPageView(page: string) {
    this.track('page_view', { page })
  }

  // Quiz events
  trackQuizStart() {
    this.track('quiz_start')
  }

  trackQuestionAnswer(questionId: number, answerId: number) {
    this.track('question_answer', { questionId, answerId })
  }

  trackQuizComplete(personalityId: string) {
    this.track('quiz_complete', { personalityId })
  }

  // Share events
  trackShareGenerate(personalityId: string) {
    this.track('share_generate', { personalityId })
  }

  trackShareDownload(personalityId: string) {
    this.track('share_download', { personalityId })
  }

  // Get all tracked events (for debugging)
  getEvents(): TrackEvent[] {
    return [...this.events]
  }

  // Clear all events
  clearEvents() {
    this.events = []
    this.saveToStorage()
  }
}

export const analytics = new Analytics()
