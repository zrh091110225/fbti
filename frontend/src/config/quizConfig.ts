import { parse } from 'yaml'
import quizConfigYamlRaw from './quiz-config.yaml?raw'
import {
  Axis,
  AxisConfig,
  FacetTag,
  PersonalityType,
  Question,
  QuestionType,
  QuizConfig,
  ScoreKey
} from './quizTypes'

function buildEmptyRecord<T extends string>(keys: readonly T[], initialValue: number): Record<T, number> {
  return keys.reduce<Record<T, number>>((result, key) => {
    result[key] = initialValue
    return result
  }, {} as Record<T, number>)
}

function parseQuizConfig(raw: string): QuizConfig {
  const parsed = parse(raw)

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Failed to parse quiz YAML config')
  }

  return parsed as QuizConfig
}

function getQuestionType(question: Question): QuestionType {
  return question.type ?? 'scored'
}

function validateQuizConfig(config: QuizConfig) {
  const axisMap = new Map<Axis, AxisConfig>(config.axes.map(axis => [axis.axis, axis]))
  const scoreKeys = new Set(config.rules.allowedScoreKeys)
  const facetTags = new Set(config.rules.allowedFacetTags)
  const requiredPositions = new Set(config.validation.requiredOptionPositions)
  const questionIds = new Set<number>()
  const resultTypeIds = new Set<string>()
  const axisCounts = buildEmptyRecord(config.axes.map(axis => axis.axis), 0)

  config.questions.forEach((question) => {
    const questionType = getQuestionType(question)

    if (config.validation.requireUniqueQuestionIds && questionIds.has(question.id)) {
      throw new Error(`Duplicate question id: ${question.id}`)
    }
    questionIds.add(question.id)

    if (questionType === 'scored') {
      if (!question.axis || !axisMap.has(question.axis)) {
        throw new Error(`Question ${question.id} uses unsupported axis: ${question.axis}`)
      }
      axisCounts[question.axis] += 1
    }

    if (question.options.length !== config.validation.optionsPerQuestion) {
      throw new Error(
        `Question ${question.id} must have exactly ${config.validation.optionsPerQuestion} options`
      )
    }

    const optionIds = new Set<number>()
    const optionPositions = new Set(question.options.map(option => option.position))

    if (optionPositions.size !== requiredPositions.size) {
      throw new Error(`Question ${question.id} must contain required option positions`)
    }

    requiredPositions.forEach((position) => {
      if (!optionPositions.has(position)) {
        throw new Error(`Question ${question.id} is missing option position: ${position}`)
      }
    })

    question.options.forEach((option) => {
      if (config.validation.requireUniqueOptionIdsWithinQuestion && optionIds.has(option.id)) {
        throw new Error(`Question ${question.id} has duplicate option id: ${option.id}`)
      }
      optionIds.add(option.id)

      const scoreEntries = Object.keys(option.scores ?? {})
      const facetEntries = Object.keys(option.facetScores ?? {})

      if (questionType === 'scored') {
        if (!scoreEntries.length) {
          throw new Error(`Question ${question.id} option ${option.id} is missing axis scores`)
        }

        if (!facetEntries.length) {
          throw new Error(`Question ${question.id} option ${option.id} is missing facet scores`)
        }
      }

      scoreEntries.forEach((scoreKey) => {
        if (!scoreKeys.has(scoreKey as ScoreKey)) {
          throw new Error(`Question ${question.id} option ${option.id} uses invalid score key: ${scoreKey}`)
        }
      })

      facetEntries.forEach((facetTag) => {
        if (!facetTags.has(facetTag as FacetTag)) {
          throw new Error(`Question ${question.id} option ${option.id} uses invalid facet tag: ${facetTag}`)
        }
      })
    })
  })

  Object.entries(config.validation.questionsPerAxis).forEach(([axis, expectedCount]) => {
    if (axisCounts[axis as Axis] !== expectedCount) {
      throw new Error(
        `Axis ${axis} must contain exactly ${expectedCount} questions, received ${axisCounts[axis as Axis]}`
      )
    }
  })

  if (config.resultTypes.length !== config.validation.resultTypeCount) {
    throw new Error(
      `Result type count must be ${config.validation.resultTypeCount}, received ${config.resultTypes.length}`
    )
  }

  config.resultTypes.forEach((resultType) => {
    if (resultTypeIds.has(resultType.id)) {
      throw new Error(`Duplicate result type id: ${resultType.id}`)
    }
    resultTypeIds.add(resultType.id)

    if (typeof resultType.image !== 'string' || !resultType.image.trim()) {
      throw new Error(`Result type ${resultType.id} is missing image`)
    }

    if (config.validation.resultIdMustMatchAxisCodeOrder) {
      const codeParts = resultType.id.split('')

      if (codeParts.length !== config.rules.resultIdAxisOrder.length) {
        throw new Error(`Result type id ${resultType.id} does not match axis order length`)
      }

      config.rules.resultIdAxisOrder.forEach((axis, index) => {
        const axisConfig = axisMap.get(axis)
        if (!axisConfig) {
          throw new Error(`Unknown axis in result ID order: ${axis}`)
        }

        const code = codeParts[index] as ScoreKey
        if (code !== axisConfig.leftCode && code !== axisConfig.rightCode) {
          throw new Error(`Result type id ${resultType.id} contains invalid code ${code} for axis ${axis}`)
        }
      })
    }
  })
}

export const quizConfig = parseQuizConfig(quizConfigYamlRaw)

validateQuizConfig(quizConfig)

export const axes = quizConfig.axes
export const questions = quizConfig.questions
export const personalities: PersonalityType[] = quizConfig.resultTypes

export const axisScoreKeys: Record<Axis, { left: ScoreKey; right: ScoreKey }> = axes.reduce((result, axis) => {
  result[axis.axis] = {
    left: axis.leftCode,
    right: axis.rightCode
  }
  return result
}, {} as Record<Axis, { left: ScoreKey; right: ScoreKey }>)

export const axisFacetTags: Record<Axis, { left: FacetTag; middle: FacetTag; right: FacetTag }> = axes.reduce((result, axis) => {
  result[axis.axis] = axis.facetMapping
  return result
}, {} as Record<Axis, { left: FacetTag; middle: FacetTag; right: FacetTag }>)

export const axisMap: Record<Axis, AxisConfig> = axes.reduce((result, axis) => {
  result[axis.axis] = axis
  return result
}, {} as Record<Axis, AxisConfig>)

export function getEmptyScoreTotals() {
  return buildEmptyRecord(quizConfig.rules.allowedScoreKeys, 0)
}

export function getEmptyFacetTotals() {
  return buildEmptyRecord(quizConfig.rules.allowedFacetTags, 0)
}

export function getEmptyStrongCounts() {
  return axes.reduce<Record<Axis, { left: number; right: number }>>((result, axis) => {
    result[axis.axis] = { left: 0, right: 0 }
    return result
  }, {} as Record<Axis, { left: number; right: number }>)
}

export const questionMap = new Map<number, Question>(questions.map(question => [question.id, question]))
