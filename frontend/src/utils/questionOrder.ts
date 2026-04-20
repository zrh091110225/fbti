import { Axis, Question, questions } from '../data/questions'

type QuestionGroup = Axis | 'neutral'

function getQuestionGroup(question: Question): QuestionGroup {
  if ((question.type ?? 'scored') === 'neutral') {
    return 'neutral'
  }

  if (!question.axis) {
    throw new Error(`Scored question ${question.id} is missing axis`)
  }

  return question.axis
}

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
  const grouped = questionBank.reduce<Record<QuestionGroup, Question[]>>((result, question) => {
    result[getQuestionGroup(question)].push(question)
    return result
  }, { I: [], S: [], T: [], R: [], neutral: [] })

  const pools: Record<QuestionGroup, Question[]> = {
    I: shuffleList(grouped.I),
    S: shuffleList(grouped.S),
    T: shuffleList(grouped.T),
    R: shuffleList(grouped.R),
    neutral: shuffleList(grouped.neutral)
  }

  const ordered: Question[] = []

  while (ordered.length < questionBank.length) {
    const lastGroup = ordered[ordered.length - 1] ? getQuestionGroup(ordered[ordered.length - 1]) : null
    const previousGroup = ordered[ordered.length - 2] ? getQuestionGroup(ordered[ordered.length - 2]) : null
    const blockedAxis =
      lastGroup && previousGroup && lastGroup === previousGroup && lastGroup !== 'neutral'
        ? lastGroup
        : null

    const candidates = (Object.keys(pools) as QuestionGroup[]).filter(group => {
      return pools[group].length > 0 && group !== blockedAxis
    })

    const nextAxisPool = shuffleList(candidates)
      .sort((leftGroup, rightGroup) => pools[rightGroup].length - pools[leftGroup].length)

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
    const currentQuestion = questions.find(question => question.id === uniqueOrder[index])
    const prevQuestion = questions.find(question => question.id === uniqueOrder[index - 1])
    const prevPrevQuestion = questions.find(question => question.id === uniqueOrder[index - 2])

    if (!currentQuestion || !prevQuestion || !prevPrevQuestion) {
      return generateQuestionOrder(questions)
    }

    const currentAxis = getQuestionGroup(currentQuestion)
    const prevAxis = getQuestionGroup(prevQuestion)
    const prevPrevAxis = getQuestionGroup(prevPrevQuestion)

    if (currentAxis !== 'neutral' && currentAxis === prevAxis && currentAxis === prevPrevAxis) {
      return generateQuestionOrder(questions)
    }
  }

  return uniqueOrder
}
