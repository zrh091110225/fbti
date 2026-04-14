import {
  axisFacetTags,
  axisMap,
  getEmptyFacetTotals,
  getEmptyScoreTotals,
  getEmptyStrongCounts,
  personalities,
  questionMap,
  quizConfig
} from '../config/quizConfig'
import { Axis, FacetTag, ScoreKey, TieBreakRule } from '../config/quizTypes'
import { PersonalityType } from '../data/personalities'
import { QuizAnswer } from '../types/quiz'

type TieBreakerReason = TieBreakRule

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

function resolveAxisByRule(
  leftScore: number,
  rightScore: number,
  leftStrongCount: number,
  rightStrongCount: number,
  leftFacetScore: number,
  rightFacetScore: number,
  leftCode: ScoreKey,
  rightCode: ScoreKey,
  defaultCode: ScoreKey
) {
  let resolvedTo: ScoreKey = defaultCode
  let reason: TieBreakerReason = 'default'

  for (const tieBreakRule of quizConfig.rules.tieBreakOrder) {
    if (tieBreakRule === 'score' && leftScore !== rightScore) {
      resolvedTo = leftScore > rightScore ? leftCode : rightCode
      reason = 'score'
      break
    }

    if (tieBreakRule === 'strong' && leftStrongCount !== rightStrongCount) {
      resolvedTo = leftStrongCount > rightStrongCount ? leftCode : rightCode
      reason = 'strong'
      break
    }

    if (tieBreakRule === 'facet' && leftFacetScore !== rightFacetScore) {
      resolvedTo = leftFacetScore > rightFacetScore ? leftCode : rightCode
      reason = 'facet'
      break
    }

    if (tieBreakRule === 'default') {
      resolvedTo = defaultCode
      reason = 'default'
      break
    }
  }

  return { resolvedTo, reason }
}

export function calculatePersonality(answers: QuizAnswer[]): CalculatedPersonalityResult {
  const scores = getEmptyScoreTotals()
  const facetScores = getEmptyFacetTotals()
  const strongCounts = getEmptyStrongCounts()

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

  const axisBreakdown = quizConfig.axes.map((axisMeta) => {
    const leftScore = scores[axisMeta.leftCode]
    const rightScore = scores[axisMeta.rightCode]
    const leftStrongCount = strongCounts[axisMeta.axis].left
    const rightStrongCount = strongCounts[axisMeta.axis].right
    const axisFacets = axisFacetTags[axisMeta.axis]
    const leftFacetScore = facetScores[axisFacets.left]
    const rightFacetScore = facetScores[axisFacets.right]
    const { resolvedTo, reason } = resolveAxisByRule(
      leftScore,
      rightScore,
      leftStrongCount,
      rightStrongCount,
      leftFacetScore,
      rightFacetScore,
      axisMeta.leftCode,
      axisMeta.rightCode,
      axisMeta.defaultCode
    )

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

  const personalityId = quizConfig.rules.resultIdAxisOrder
    .map(axis => axisBreakdown.find(item => item.axis === axis)?.resolvedTo ?? axisMap[axis].defaultCode)
    .join('')
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
