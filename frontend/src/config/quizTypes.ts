export type Axis = 'I' | 'S' | 'T' | 'R'
export type ScoreKey = 'H' | 'C' | 'S' | 'O' | 'T' | 'G' | 'R' | 'E'
export type OptionPosition = 'left' | 'middle' | 'right'
export type TieBreakRule = 'score' | 'strong' | 'facet' | 'default'
export type QuestionType = 'scored' | 'neutral'

export type FacetTag =
  | '抢口'
  | '复盘'
  | '随缘'
  | '组局'
  | '搭子'
  | '守界'
  | '调校'
  | '配装'
  | '省事'
  | '胜负'
  | '舒服'
  | '氛围'

export interface QuestionOption {
  id: number
  position: OptionPosition
  text: string
  scores?: Partial<Record<ScoreKey, number>>
  facetScores?: Partial<Record<FacetTag, number>>
}

export interface Question {
  id: number
  type?: QuestionType
  axis?: Axis
  text: string
  options: QuestionOption[]
}

export interface PersonalityType {
  id: string
  name: string
  image: string
  emoji: string
  title: string
  description: string
  traits: string[]
  dimensions: string[]
  signature: string
  scene: string
}

export interface MetaConfig {
  version: number
  name: string
  locale: string
  description: string
}

export interface FacetMapping {
  left: FacetTag
  middle: FacetTag
  right: FacetTag
}

export interface AxisConfig {
  axis: Axis
  title: string
  leftCode: ScoreKey
  rightCode: ScoreKey
  leftLabel: string
  rightLabel: string
  defaultCode: ScoreKey
  facetMapping: FacetMapping
}

export interface RulesConfig {
  resultIdAxisOrder: Axis[]
  tieBreakOrder: TieBreakRule[]
  allowedScoreKeys: ScoreKey[]
  allowedFacetTags: FacetTag[]
  optionPositions: OptionPosition[]
}

export interface ResultTypeConfig extends PersonalityType {}

export interface ValidationConfig {
  requireUniqueQuestionIds: boolean
  requireUniqueOptionIdsWithinQuestion: boolean
  optionsPerQuestion: number
  requiredOptionPositions: OptionPosition[]
  questionsPerAxis: Record<Axis, number>
  resultTypeCount: number
  resultIdMustMatchAxisCodeOrder: boolean
}

export interface QuizConfig {
  meta: MetaConfig
  axes: AxisConfig[]
  rules: RulesConfig
  questions: Question[]
  resultTypes: ResultTypeConfig[]
  validation: ValidationConfig
}
