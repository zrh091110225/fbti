import { Axis, Question, questions } from '../data/questions'

const allQuestionIds = questions.map(question => question.id)

function shuffleList<T>(items: T[]): T[] {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[randomIndex]] = [next[randomIndex], next[index]]
  }

  return next
}

export function generateQuestionOrder(questionBank: Question[]): number[] {
  const grouped = questionBank.reduce<Record<Axis, Question[]>>((result, question) => {
    result[question.axis].push(question)
    return result
  }, { I: [], S: [], T: [], R: [] })

  const pools: Record<Axis, Question[]> = {
    I: shuffleList(grouped.I),
    S: shuffleList(grouped.S),
    T: shuffleList(grouped.T),
    R: shuffleList(grouped.R)
  }

  const ordered: Question[] = []

  while (ordered.length < questionBank.length) {
    const lastAxis = ordered[ordered.length - 1]?.axis
    const previousAxis = ordered[ordered.length - 2]?.axis
    const blockedAxis = lastAxis && previousAxis && lastAxis === previousAxis ? lastAxis : null

    const candidates = (Object.keys(pools) as Axis[]).filter(axis => {
      return pools[axis].length > 0 && axis !== blockedAxis
    })

    const nextAxisPool = shuffleList(candidates)
      .sort((leftAxis, rightAxis) => pools[rightAxis].length - pools[leftAxis].length)

    const nextAxis = nextAxisPool[0]

    if (!nextAxis) {
      throw new Error('Failed to generate a valid question order')
    }

    const nextQuestion = pools[nextAxis].shift()
    if (!nextQuestion) {
      throw new Error(`Question pool for axis ${nextAxis} is unexpectedly empty`)
    }

    ordered.push(nextQuestion)
  }

  return ordered.map(question => question.id)
}

export function normalizeQuestionOrder(questionOrder?: number[]): number[] {
  if (!Array.isArray(questionOrder)) {
    return generateQuestionOrder(questions)
  }

  const uniqueOrder = questionOrder.filter((questionId, index) => {
    return Number.isInteger(questionId) && questionOrder.indexOf(questionId) === index
  })

  if (uniqueOrder.length !== allQuestionIds.length) {
    return generateQuestionOrder(questions)
  }

  const knownIds = new Set(allQuestionIds)
  if (!uniqueOrder.every(questionId => knownIds.has(questionId))) {
    return generateQuestionOrder(questions)
  }

  for (let index = 2; index < uniqueOrder.length; index += 1) {
    const currentAxis = questions.find(question => question.id === uniqueOrder[index])?.axis
    const prevAxis = questions.find(question => question.id === uniqueOrder[index - 1])?.axis
    const prevPrevAxis = questions.find(question => question.id === uniqueOrder[index - 2])?.axis

    if (currentAxis && currentAxis === prevAxis && currentAxis === prevPrevAxis) {
      return generateQuestionOrder(questions)
    }
  }

  return uniqueOrder
}
