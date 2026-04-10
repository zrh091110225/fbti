import { questions, QuizAnswer } from '../data/questions'
import { personalities, PersonalityType } from '../data/personalities'

export function calculatePersonality(answers: QuizAnswer[]): PersonalityType {
  const scores: { [key: string]: number } = {
    A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0
  }

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId)
    if (!question) return

    const option = question.options.find(o => o.id === answer.answerId)
    if (!option) return

    Object.entries(option.scores).forEach(([key, value]) => {
      scores[key] = (scores[key] || 0) + value
    })
  })

  // Find personality with highest score
  let maxScore = 0
  let resultId = 'A'

  Object.entries(scores).forEach(([key, value]) => {
    if (value > maxScore) {
      maxScore = value
      resultId = key
    }
  })

  const personality = personalities.find(p => p.id === resultId)
  return personality || personalities[0]
}
