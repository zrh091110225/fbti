import {
  Axis,
  axisFacetTags,
  FacetTag,
  Question,
  questions,
  ScoreKey
} from '../data/questions'
import { personalities, PersonalityType } from '../data/personalities'
import { QuizAnswer } from '../types/quiz'

type TieBreakerReason = 'score' | 'strong' | 'facet' | 'default'

interface AxisMeta {
  axis: Axis
  title: string
  leftCode: ScoreKey
  rightCode: ScoreKey
  leftLabel: string
  rightLabel: string
  defaultCode: ScoreKey
}

export interface AxisBreakdown {
  axis: Axis
  title: string
  leftCode: ScoreKey
  rightCode: ScoreKey
  leftLabel: string
  rightLabel: string
  leftScore: number
  rightScore: number
  leftStrongCount: number
  rightStrongCount: number
  leftFacetScore: number
  rightFacetScore: number
  resolvedTo: ScoreKey
  resolvedLabel: string
  reason: TieBreakerReason
}

export interface CalculatedPersonalityResult {
  personalityId: string
  personality: PersonalityType
  axisBreakdown: AxisBreakdown[]
  topFacetTags: FacetTag[]
  facetScores: Record<FacetTag, number>
}

const axisMetaList: AxisMeta[] = [
  {
    axis: 'I',
    title: '投入强度',
    leftCode: 'H',
    rightCode: 'C',
    leftLabel: '狂热型',
    rightLabel: '松弛型',
    defaultCode: 'C'
  },
  {
    axis: 'S',
    title: '相处方式',
    leftCode: 'S',
    rightCode: 'O',
    leftLabel: '群体型',
    rightLabel: '独处型',
    defaultCode: 'O'
  },
  {
    axis: 'T',
    title: '偏好路径',
    leftCode: 'T',
    rightCode: 'G',
    leftLabel: '技术流',
    rightLabel: '装备流',
    defaultCode: 'T'
  },
  {
    axis: 'R',
    title: '价值取向',
    leftCode: 'R',
    rightCode: 'E',
    leftLabel: '结果派',
    rightLabel: '体验派',
    defaultCode: 'E'
  }
]

const questionMap = new Map<number, Question>(questions.map(question => [question.id, question]))

const emptyFacetScores = (): Record<FacetTag, number> => ({
  抢口: 0,
  复盘: 0,
  随缘: 0,
  组局: 0,
  搭子: 0,
  守界: 0,
  调校: 0,
  配装: 0,
  省事: 0,
  胜负: 0,
  舒服: 0,
  氛围: 0
})

const emptyAxisStrongCounts = (): Record<Axis, { left: number; right: number }> => ({
  I: { left: 0, right: 0 },
  S: { left: 0, right: 0 },
  T: { left: 0, right: 0 },
  R: { left: 0, right: 0 }
})

const emptyScores = (): Record<ScoreKey, number> => ({
  H: 0,
  C: 0,
  S: 0,
  O: 0,
  T: 0,
  G: 0,
  R: 0,
  E: 0
})

export function calculatePersonality(answers: QuizAnswer[]): CalculatedPersonalityResult {
  const scores = emptyScores()
  const facetScores = emptyFacetScores()
  const strongCounts = emptyAxisStrongCounts()

  answers.forEach((answer) => {
    const question = questionMap.get(answer.questionId)
    if (!question) return

    const option = question.options.find(candidate => candidate.id === answer.answerId)
    if (!option) return

    Object.entries(option.scores).forEach(([key, value]) => {
      scores[key as ScoreKey] += value ?? 0
    })

    Object.entries(option.facetScores).forEach(([key, value]) => {
      facetScores[key as FacetTag] += value ?? 0
    })

    if (option.position === 'left') {
      strongCounts[question.axis].left += 1
    }

    if (option.position === 'right') {
      strongCounts[question.axis].right += 1
    }
  })

  const axisBreakdown = axisMetaList.map((axisMeta) => {
    const leftScore = scores[axisMeta.leftCode]
    const rightScore = scores[axisMeta.rightCode]
    const leftStrongCount = strongCounts[axisMeta.axis].left
    const rightStrongCount = strongCounts[axisMeta.axis].right
    const axisFacets = axisFacetTags[axisMeta.axis]
    const leftFacetScore = facetScores[axisFacets.left]
    const rightFacetScore = facetScores[axisFacets.right]

    let resolvedTo: ScoreKey = axisMeta.defaultCode
    let reason: TieBreakerReason = 'default'

    if (leftScore !== rightScore) {
      resolvedTo = leftScore > rightScore ? axisMeta.leftCode : axisMeta.rightCode
      reason = 'score'
    } else if (leftStrongCount !== rightStrongCount) {
      resolvedTo = leftStrongCount > rightStrongCount ? axisMeta.leftCode : axisMeta.rightCode
      reason = 'strong'
    } else if (leftFacetScore !== rightFacetScore) {
      resolvedTo = leftFacetScore > rightFacetScore ? axisMeta.leftCode : axisMeta.rightCode
      reason = 'facet'
    }

    return {
      axis: axisMeta.axis,
      title: axisMeta.title,
      leftCode: axisMeta.leftCode,
      rightCode: axisMeta.rightCode,
      leftLabel: axisMeta.leftLabel,
      rightLabel: axisMeta.rightLabel,
      leftScore,
      rightScore,
      leftStrongCount,
      rightStrongCount,
      leftFacetScore,
      rightFacetScore,
      resolvedTo,
      resolvedLabel: resolvedTo === axisMeta.leftCode ? axisMeta.leftLabel : axisMeta.rightLabel,
      reason
    }
  })

  const personalityId = axisBreakdown.map(axis => axis.resolvedTo).join('')
  const personality = personalities.find(candidate => candidate.id === personalityId) ?? personalities[0]

  const topFacetTags = (Object.entries(facetScores) as [FacetTag, number][])
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1]
      }
      return left[0].localeCompare(right[0], 'zh-Hans-CN')
    })
    .filter(([, score]) => score > 0)
    .slice(0, 3)
    .map(([tag]) => tag)

  return {
    personalityId,
    personality,
    axisBreakdown,
    topFacetTags,
    facetScores
  }
}
