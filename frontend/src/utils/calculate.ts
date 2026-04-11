import { questions } from '../data/questions'
import { personalities, PersonalityType } from '../data/personalities'
import { QuizAnswer } from '../types/quiz'

export function calculatePersonality(answers: QuizAnswer[]): PersonalityType {
  const scores: Record<string, number> = {
    H: 0,
    C: 0,
    S: 0,
    O: 0,
    T: 0,
    G: 0,
    R: 0,
    E: 0
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

  // 文档没有定义平分规则；当前默认平分时落到更松弛的一侧。
  const resultId = [
    scores.H > scores.C ? 'H' : 'C',
    scores.S > scores.O ? 'S' : 'O',
    scores.T > scores.G ? 'T' : 'G',
    scores.R > scores.E ? 'R' : 'E'
  ].join('')

  const personality = personalities.find(p => p.id === resultId)
  return personality || personalities[0]
}
