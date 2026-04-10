export interface Question {
  id: number
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
    text: "周末钓鱼时，你通常几点出门？",
    options: [
      { id: 1, text: "天没亮就出发，抢占最佳位置", scores: { A: 3, B: 1 } },
      { id: 2, text: "睡到自然醒，悠闲出发", scores: { C: 3, D: 1 } },
      { id: 3, text: "看情况，上鱼快就早，反之则晚", scores: { E: 2, F: 2 } },
      { id: 4, text: "只要有口，随时出发", scores: { G: 3, H: 1 } }
    ]
  },
  {
    id: 2,
    text: "钓点离家很远，你会？",
    options: [
      { id: 1, text: "提前一天踩点，规划路线", scores: { A: 2, E: 1 } },
      { id: 2, text: "说走就走，迷路也是风景", scores: { C: 3, G: 1 } },
      { id: 3, text: "查攻略、问钓友，做好功课", scores: { B: 2, F: 2 } },
      { id: 4, text: "远近无所谓，有鱼就行", scores: { D: 3, H: 1 } }
    ]
  },
  {
    id: 3,
    text: "你更享受钓鱼过程中的什么？",
    options: [
      { id: 1, text: "上鱼瞬间的刺激感", scores: { A: 3, E: 1 } },
      { id: 2, text: "水边发呆、放空的时光", scores: { D: 3, G: 1 } },
      { id: 3, text: "研究饵料、钻研技术", scores: { B: 3, F: 1 } },
      { id: 4, text: "和钓友聊天吹牛的乐趣", scores: { C: 3, H: 1 } }
    ]
  },
  {
    id: 4,
    text: "如果空军（没钓到鱼）一天，你会？",
    options: [
      { id: 1, text: "分析原因，总结经验，明天再战", scores: { A: 2, B: 2 } },
      { id: 2, text: "无所谓，钓的是心情不是鱼", scores: { D: 2, G: 2 } },
      { id: 3, text: "换饵换窝换钓法，一直折腾", scores: { E: 3, F: 1 } },
      { id: 4, text: "换个地方重新开始", scores: { C: 2, H: 2 } }
    ]
  },
  {
    id: 5,
    text: "你更喜欢在什么环境钓鱼？",
    options: [
      { id: 1, text: "水库、湖泊等自然水域", scores: { A: 2, D: 2 } },
      { id: 2, text: "黑坑、赌塘，有挑战性", scores: { E: 2, F: 2 } },
      { id: 3, text: "江河、溪流，有flow", scores: { G: 3, B: 1 } },
      { id: 4, text: "海边、滩涂，玩法多样", scores: { C: 2, H: 2 } }
    ]
  },
  {
    id: 6,
    text: "你一般和谁一起钓鱼？",
    options: [
      { id: 1, text: "独自出钓，享受孤独", scores: { D: 3, A: 1 } },
      { id: 2, text: "固定钓友，默契十足", scores: { C: 2, G: 2 } },
      { id: 3, text: "人越多越热闹", scores: { H: 3, B: 1 } },
      { id: 4, text: "看情况，有时独行有时组队", scores: { E: 2, F: 2 } }
    ]
  },
  {
    id: 7,
    text: "你愿意为钓鱼投入多少？",
    options: [
      { id: 1, text: "装备无上限，该花就花", scores: { F: 3, H: 1 } },
      { id: 2, text: "够用就行，性价比第一", scores: { D: 3, G: 1 } },
      { id: 3, text: "愿意为上鱼花钱，但要值得", scores: { A: 2, E: 2 } },
      { id: 4, text: " DIY 能省则省", scores: { B: 3, C: 1 } }
    ]
  },
  {
    id: 8,
    text: "你对饵料的态度是？",
    options: [
      { id: 1, text: "商品饵为主，迷信品牌", scores: { F: 3, H: 1 } },
      { id: 2, text: "喜欢自己动手制作", scores: { B: 3, G: 1 } },
      { id: 3, text: "蚯蚓、红虫，自然才是王道", scores: { A: 2, D: 2 } },
      { id: 4, text: "什么都能用来钓鱼", scores: { C: 2, E: 2 } }
    ]
  },
  {
    id: 9,
    text: "你更喜欢哪种钓鱼方式？",
    options: [
      { id: 1, text: "台钓，精细化操作", scores: { B: 3, F: 1 } },
      { id: 2, text: "路亚，主动出击", scores: { E: 3, A: 1 } },
      { id: 3, text: "传统钓，简单粗暴", scores: { D: 3, C: 1 } },
      { id: 4, text: "海钓，挑战大物", scores: { G: 3, H: 1 } }
    ]
  },
  {
    id: 10,
    text: "如果朋友叫你喝酒但你打算钓鱼，你会？",
    options: [
      { id: 1, text: "果断拒绝，钓鱼要紧", scores: { A: 3, D: 1 } },
      { id: 2, text: "喝完再去，夜钓也很爽", scores: { G: 2, E: 2 } },
      { id: 3, text: "约朋友一起去钓点喝", scores: { C: 3, H: 1 } },
      { id: 4, text: "看情况，朋友重要还是钓鱼重要", scores: { B: 2, F: 2 } }
    ]
  },
  {
    id: 11,
    text: "你钓鱼的主要目的是？",
    options: [
      { id: 1, text: "渔获，吃自己钓的鱼更香", scores: { H: 3, B: 1 } },
      { id: 2, text: "修身养性，逃离城市喧嚣", scores: { D: 3, G: 1 } },
      { id: 3, text: "社交，认识更多钓友", scores: { C: 3, H: 1 } },
      { id: 4, text: "追求上鱼的快感与成就", scores: { A: 2, E: 2 } }
    ]
  },
  {
    id: 12,
    text: "你觉得自己在钓友眼中是？",
    options: [
      { id: 1, text: "技术流，什么都会", scores: { B: 3, F: 1 } },
      { id: 2, text: "休闲派，开心最重要", scores: { D: 3, C: 1 } },
      { id: 3, text: "社交达人，谁都认识", scores: { H: 3, G: 1 } },
      { id: 4, text: "佛系钓手，看淡输赢", scores: { A: 2, E: 2 } }
    ]
  }
]
