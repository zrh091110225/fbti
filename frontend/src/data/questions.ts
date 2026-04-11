export interface Question {
  id: number
  axis: 'I' | 'S' | 'T' | 'R'
  text: string
  options: {
    id: number
    text: string
    scores: { [key: string]: number }
  }[]
}

export const questions: Question[] = [
  {
    id: 1,
    axis: 'I',
    text: '周末只有一天空闲，你会：',
    options: [
      { id: 1, text: '凌晨起床抢钓位', scores: { H: 1 } },
      { id: 2, text: '睡醒再说，能钓就行', scores: { C: 1 } }
    ]
  },
  {
    id: 2,
    axis: 'I',
    text: '连续两次空军后，你更可能：',
    options: [
      { id: 1, text: '查资料、换策略，下次一定钓到', scores: { H: 1 } },
      { id: 2, text: '最近不想钓了，缓一缓', scores: { C: 1 } }
    ]
  },
  {
    id: 3,
    axis: 'I',
    text: '有朋友约你吃饭，但刚好是最佳鱼口时间：',
    options: [
      { id: 1, text: '推掉饭局', scores: { H: 1 } },
      { id: 2, text: '还是去吃饭', scores: { C: 1 } }
    ]
  },
  {
    id: 4,
    axis: 'I',
    text: '你对钓鱼的定位更像：',
    options: [
      { id: 1, text: '正事之一', scores: { H: 1 } },
      { id: 2, text: '兴趣之一', scores: { C: 1 } }
    ]
  },
  {
    id: 5,
    axis: 'S',
    text: '你更喜欢的钓鱼方式：',
    options: [
      { id: 1, text: '和朋友一起', scores: { S: 1 } },
      { id: 2, text: '一个人', scores: { O: 1 } }
    ]
  },
  {
    id: 6,
    axis: 'S',
    text: '钓鱼过程中聊天：',
    options: [
      { id: 1, text: '很重要，不然没意思', scores: { S: 1 } },
      { id: 2, text: '会影响状态', scores: { O: 1 } }
    ]
  },
  {
    id: 7,
    axis: 'S',
    text: '你更喜欢的钓点：',
    options: [
      { id: 1, text: '有熟人、热闹', scores: { S: 1 } },
      { id: 2, text: '人少甚至没人', scores: { O: 1 } }
    ]
  },
  {
    id: 8,
    axis: 'S',
    text: '你觉得钓鱼更像：',
    options: [
      { id: 1, text: '一种社交活动', scores: { S: 1 } },
      { id: 2, text: '一种独处方式', scores: { O: 1 } }
    ]
  },
  {
    id: 9,
    axis: 'T',
    text: '面对鱼不开口，你更倾向：',
    options: [
      { id: 1, text: '调整线组、饵料、手法', scores: { T: 1 } },
      { id: 2, text: '换更好的装备', scores: { G: 1 } }
    ]
  },
  {
    id: 10,
    axis: 'T',
    text: '你刷内容更爱看：',
    options: [
      { id: 1, text: '技巧教学、鱼情分析', scores: { T: 1 } },
      { id: 2, text: '装备评测、开箱', scores: { G: 1 } }
    ]
  },
  {
    id: 11,
    axis: 'T',
    text: '给你预算，你更可能：',
    options: [
      { id: 1, text: '用来优化钓法', scores: { T: 1 } },
      { id: 2, text: '升级装备', scores: { G: 1 } }
    ]
  },
  {
    id: 12,
    axis: 'T',
    text: '你更认同：',
    options: [
      { id: 1, text: '“人决定鱼获”', scores: { T: 1 } },
      { id: 2, text: '“装备决定体验”', scores: { G: 1 } }
    ]
  },
  {
    id: 13,
    axis: 'R',
    text: '一次钓鱼结束，你最在意：',
    options: [
      { id: 1, text: '钓了多少鱼', scores: { R: 1 } },
      { id: 2, text: '过程是否舒服', scores: { E: 1 } }
    ]
  },
  {
    id: 14,
    axis: 'R',
    text: '当天一直没口，你会：',
    options: [
      { id: 1, text: '不甘心，一直坚持', scores: { R: 1 } },
      { id: 2, text: '提前收杆，享受当下', scores: { E: 1 } }
    ]
  },
  {
    id: 15,
    axis: 'R',
    text: '看到别人爆护，你会：',
    options: [
      { id: 1, text: '很在意，下次要赢回来', scores: { R: 1 } },
      { id: 2, text: '觉得挺好，但无所谓', scores: { E: 1 } }
    ]
  },
  {
    id: 16,
    axis: 'R',
    text: '你更认同：',
    options: [
      { id: 1, text: '“钓鱼就是要有结果”', scores: { R: 1 } },
      { id: 2, text: '“钓鱼就是一种状态”', scores: { E: 1 } }
    ]
  }
]
