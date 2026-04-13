export type Axis = 'I' | 'S' | 'T' | 'R'
export type ScoreKey = 'H' | 'C' | 'S' | 'O' | 'T' | 'G' | 'R' | 'E'
export type OptionPosition = 'left' | 'middle' | 'right'
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
  scores: Partial<Record<ScoreKey, number>>
  facetScores: Partial<Record<FacetTag, number>>
}

export interface Question {
  id: number
  axis: Axis
  text: string
  options: QuestionOption[]
}

export const axisScoreKeys: Record<Axis, { left: ScoreKey; right: ScoreKey }> = {
  I: { left: 'H', right: 'C' },
  S: { left: 'S', right: 'O' },
  T: { left: 'T', right: 'G' },
  R: { left: 'R', right: 'E' }
}

export const axisFacetTags: Record<Axis, { left: FacetTag; middle: FacetTag; right: FacetTag }> = {
  I: { left: '抢口', middle: '复盘', right: '随缘' },
  S: { left: '组局', middle: '搭子', right: '守界' },
  T: { left: '调校', middle: '省事', right: '配装' },
  R: { left: '胜负', middle: '氛围', right: '舒服' }
}

function buildOption(axis: Axis, position: OptionPosition, text: string, id: number): QuestionOption {
  const scoreKeys = axisScoreKeys[axis]
  const facetTags = axisFacetTags[axis]

  if (position === 'left') {
    return {
      id,
      position,
      text,
      scores: { [scoreKeys.left]: 2 },
      facetScores: { [facetTags.left]: 2 }
    }
  }

  if (position === 'right') {
    return {
      id,
      position,
      text,
      scores: { [scoreKeys.right]: 2 },
      facetScores: { [facetTags.right]: 2 }
    }
  }

  return {
    id,
    position,
    text,
    scores: {
      [scoreKeys.left]: 1,
      [scoreKeys.right]: 1
    },
    facetScores: { [facetTags.middle]: 2 }
  }
}

function createQuestion(id: number, axis: Axis, text: string, optionTexts: [string, string, string]): Question {
  return {
    id,
    axis,
    text,
    options: [
      buildOption(axis, 'left', optionTexts[0], 1),
      buildOption(axis, 'middle', optionTexts[1], 2),
      buildOption(axis, 'right', optionTexts[2], 3)
    ]
  }
}

export const questions: Question[] = [
  createQuestion(1, 'I', '周末只有半天空着，你前一晚通常会怎么准备？', [
    '前一晚就把闹钟、钓位和装备全安排好，最好一睁眼就能走。',
    '大方向先想好，真出门前再看天气和精神状态决定细节。',
    '先睡饱再说，醒来有感觉就去，没感觉就改天。'
  ]),
  createQuestion(2, 'I', '工作日突然出现一个傍晚黄金鱼口，你更像哪种人？', [
    '能推的局就推，饭也能晚点吃，先去占这个窗口。',
    '如果本来没硬安排，我会去；真有事也不会为了鱼口硬改。',
    '算了，今天就按原计划走，钓鱼留给更从容的时候。'
  ]),
  createQuestion(3, 'I', '连续两次空军回来，你回家后的状态更像：', [
    '越想越上头，回去就开始查天气、水情和别人怎么打的。',
    '会回想一下哪里不对，但不会立刻把自己拧进复盘模式。',
    '先放着，空军就空军，过两天想去了再说。'
  ]),
  createQuestion(4, 'I', '明知第二天可能降温走水，但有人说清晨会有短口，你会：', [
    '还是去，哪怕只赌那一小段时间，也值得试。',
    '看起床状态，起来了就去，不起来也不强求自己。',
    '直接不折腾，天气都这样了，不如等更稳的天。'
  ]),
  createQuestion(5, 'I', '一场钓完回到家，什么最容易让你忍不住继续想着这件事？', [
    '哪个环节差一点就能更好，我会反复琢磨。',
    '会顺手记一下感受，但不会让它占满后半天。',
    '洗完装备这事基本就翻篇了，今天过去就过去。'
  ]),

  createQuestion(6, 'S', '你到钓点刚把车停好，第一反应通常是：', [
    '先看看熟人都在哪，顺便打个招呼，场子热起来再说。',
    '跟认识的人点个头，聊两句，但还是先把自己位置安顿好。',
    '先找个安静钓位把自己放进去，不太想一到场就社交。'
  ]),
  createQuestion(7, 'S', '朋友说“明天一起钓，我跟着你走”，你一般会：', [
    '直接开始张罗时间、地点、谁带什么，顺手把局组起来。',
    '可以一起，但更像各钓各的，路上和收杆后再慢慢聊。',
    '更想分开行动，到点见或者各玩各的都行。'
  ]),
  createQuestion(8, 'S', '你发现自己这边有口，旁边朋友一直没动静，你会：', [
    '马上喊他过来，顺手把漂深、饵料和点位都讲给他。',
    '会提醒一句关键变化，剩下让他自己判断怎么接。',
    '大多时候先不打断彼此节奏，除非他主动来问。'
  ]),
  createQuestion(9, 'S', '钓着钓着，旁边人开始一直跟你聊天，你的真实反应更像：', [
    '挺好，边聊边钓更有感觉，气氛起来了口差点也无所谓。',
    '短聊没问题，但真到关键窗口我还是会把注意力收回来。',
    '会有点烦，我来水边就是想安静待着，不想一直接话。'
  ]),
  createQuestion(10, 'S', '收杆之后，如果大家说找地方坐坐继续聊，你通常会：', [
    '大概率加入，钓完再聊一轮，整天才算完整。',
    '看当天状态，有兴致就坐一会儿，没兴致就先撤。',
    '更想直接回家，今天的社交额度在水边差不多已经用完了。'
  ]),

  createQuestion(11, 'T', '陌生水域下杆半小时没动静，你最先会动哪一块？', [
    '先从线组、饵料、层次和手法一点点试，找问题在哪。',
    '先做最省事的微调，能不大拆就不大拆，边钓边试。',
    '先检查是不是装备配置不对，必要时直接换更合适的家伙。'
  ]),
  createQuestion(12, 'T', '手里突然多出一笔钓鱼预算，你第一反应是：', [
    '买些能帮我练判断和提升打法的东西，最好直接作用在技术上。',
    '先补最缺的那点，别让装备和打法哪边拖后腿。',
    '终于可以升级一直想换的竿轮箱包了，配置先到位再说。'
  ]),
  createQuestion(13, 'T', '你平时最愿意反复刷的内容，更像是：', [
    '拆鱼情、讲思路、教怎么判断的内容。',
    '那种既讲打法也讲配置，能直接抄回去用的内容。',
    '开箱、评测、器材搭配和 setup 展示。'
  ]),
  createQuestion(14, 'T', '第一次去新钓点，你开局更像哪种人？', [
    '先观察水色、风向、深浅和别人节奏，再决定怎么打。',
    '先用自己最熟的一套开局，感觉不对再逐步调整。',
    '先把最适合这个场子的装备方案上齐，别一开始就吃配置亏。'
  ]),
  createQuestion(15, 'T', '一趟钓完收拾装备时，你更容易把注意力放在：', [
    '今天哪些判断是对的，哪些动作还要修。',
    '先把东西收顺手，能复用的经验记住就够了，不用过度上纲。',
    '哪件装备顺不顺手、哪里该升级，下一次怎么搭更舒服。'
  ]),

  createQuestion(16, 'R', '天色开始暗了，今天鱼获一般，你决定收不收杆时最看重：', [
    '再守一会儿，说不定最后还能把结果拉回来。',
    '看当下感觉，今天要是已经尽兴了，早点收也没什么。',
    '差不多就行，别把自己耗得太累，舒服收工更重要。'
  ]),
  createQuestion(17, 'R', '旁边钓友突然连杆，你心里第一反应更像：', [
    '我会立刻紧起来，想知道问题出在哪，最好把差距追回来。',
    '会看看他在干嘛，也会调一调，但不至于马上进入较劲状态。',
    '替他开心一下就行，各有各的节奏，没必要把自己搞紧。'
  ]),
  createQuestion(18, 'R', '今天一直没什么口，但天气、风和人都挺舒服，你会：', [
    '舒服归舒服，没结果还是不甘心，想再咬牙试一阵。',
    '如果同行的人状态也不错，我可能就顺着这份氛围慢慢收尾。',
    '那就当出来放空了，今天待得舒服本身就算赚到。'
  ]),
  createQuestion(19, 'R', '回想一场“不错的出钓”，你最容易先记住的是：', [
    '最后到底钓了多少、有没有把目标打出来。',
    '那天整体节奏很顺，人和场子都对，回想起来很完整。',
    '那天人很松、风景很对、待着就是舒服，鱼反而没那么关键。'
  ]),
  createQuestion(20, 'R', '如果问你“下次还想不想来这个钓点”，最影响答案的是：', [
    '这里有没有机会让我把成绩再往上拉。',
    '今天这趟整体状态是不是在线，值不值得再来一次类似的局。',
    '这里待着舒不舒服、顺不顺手，愿不愿意再来放松一天。'
  ])
]

function validateQuestionBank(questionBank: Question[]) {
  const axisCounts: Record<Axis, number> = {
    I: 0,
    S: 0,
    T: 0,
    R: 0
  }

  const seenIds = new Set<number>()

  questionBank.forEach((question) => {
    if (seenIds.has(question.id)) {
      throw new Error(`Duplicate question id: ${question.id}`)
    }
    seenIds.add(question.id)
    axisCounts[question.axis] += 1

    if (question.options.length !== 3) {
      throw new Error(`Question ${question.id} must have exactly 3 options`)
    }

    const positions = new Set(question.options.map(option => option.position))
    if (positions.size !== 3) {
      throw new Error(`Question ${question.id} must contain left, middle and right options`)
    }

    question.options.forEach((option) => {
      if (!Object.keys(option.scores).length) {
        throw new Error(`Question ${question.id} option ${option.id} is missing axis scores`)
      }

      if (!Object.keys(option.facetScores).length) {
        throw new Error(`Question ${question.id} option ${option.id} is missing facet scores`)
      }
    })
  })

  Object.entries(axisCounts).forEach(([axis, count]) => {
    if (count !== 5) {
      throw new Error(`Axis ${axis} must contain exactly 5 questions, received ${count}`)
    }
  })
}

validateQuestionBank(questions)
