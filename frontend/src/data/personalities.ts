export interface PersonalityType {
  id: string
  name: string
  emoji: string
  title: string
  description: string
  traits: string[]
  suitableBait: string
  suitableSpot: string
}

export const personalities: PersonalityType[] = [
  {
    id: 'A',
    name: '竞技大师',
    emoji: '🏆',
    title: '追求极致的上鱼狂人',
    description: '你是钓鱼圈的技术派代表，对饵料配方、浮标调校有着近乎偏执的追求。每一次扬竿都追求完美弧线，空军的日子会让你辗转难眠。你享受与鱼博弈的过程，更享受战胜鱼的成就感。',
    traits: ['技术流', '追求完美', '不服输', '爱钻研'],
    suitableBait: '商品饵+秘制小药',
    suitableSpot: '黑坑正钓池'
  },
  {
    id: 'B',
    name: 'DIY达人',
    emoji: '🛠️',
    title: '自己动手丰衣足食',
    description: '你信奉钓鱼的最高境界是用最简单的工具钓最多的鱼。泡酒米、配饵料都是你亲力亲为，市售产品在你眼里总有改进空间。你享受DIY的过程，更享受用自己作品上鱼的喜悦。',
    traits: ['动手能力强', '节俭', '有耐心', '喜欢折腾'],
    suitableBait: '自制酒米+蚯蚓',
    suitableSpot: '野河岔口'
  },
  {
    id: 'C',
    name: '社交达人',
    emoji: '🎉',
    title: '钓鱼圈的气氛组组长',
    description: '你是钓鱼群里的开心果，永远有说不完的段子，聊不完的天。钓不钓到鱼不重要，重要的是和一帮兄弟在一起开心的时光。你的人脉就是你的鱼获，你的快乐感染着每一个人。',
    traits: ['外向开朗', '人缘好', '善于社交', '重情重义'],
    suitableBait: '红虫+一切能聚鱼的饵料',
    suitableSpot: '任意有钓友的地方'
  },
  {
    id: 'D',
    name: '佛系钓手',
    emoji: '🧘',
    title: '钓的是心境不是鱼',
    description: '你钓鱼追求的是内心的平静，远离城市的喧嚣，独自坐在水边发呆是你最享受的时光。渔获对你来说只是副产品，你享受的是水边微风、鸟鸣和那份难得的宁静。',
    traits: ['内心平静', '不争不抢', '享受当下', '随遇而安'],
    suitableBait: '蚯蚓，简单就好',
    suitableSpot: '人少的野塘水库'
  },
  {
    id: 'E',
    name: '路亚侠客',
    emoji: '⚔️',
    title: '主动出击的掠食者',
    description: '你不喜欢被动等待，而是主动去找鱼。你享受的是寻找目标、判断鱼层、精准抛投、一击即中的全过程。你的钓鱼包里永远有一把路亚竿，你相信最好的饵料就是那条假饵。',
    traits: ['主动出击', '热爱运动', '判断力强', '勇于挑战'],
    suitableBait: '各种路亚假饵',
    suitableSpot: '江河湖海的标点'
  },
  {
    id: 'F',
    name: '装备玩家',
    emoji: '🎒',
    title: '装备党的快乐你不懂',
    description: '你买装备不一定是为了钓鱼，而是享受开箱和研究的快感。最新款的钓竿、最先进的电子设备、最潮流的钓鱼服饰，你永远走在时尚前沿。你的装备库比你的渔获更值得炫耀。',
    traits: ['追求品质', '喜欢购物', '懂装备', '有品位'],
    suitableBait: '高端商品饵',
    suitableSpot: '高端黑坑、私家钓点'
  },
  {
    id: 'G',
    name: '冒险家',
    emoji: '🗺️',
    title: '探索未知水域的先驱',
    description: '你不喜欢走寻常路，你喜欢探索新的钓点、尝试新的钓法。你可能是那个发现某个隐秘钓点的第一人，也可能是那个把海钓带到内地的引路人。你的钓鱼日记就是一幅钓鱼地图。',
    traits: ['爱探索', '勇敢', '有冒险精神', '善于发现'],
    suitableBait: '根据目标鱼种随机应变',
    suitableSpot: '新发现的神秘钓点'
  },
  {
    id: 'H',
    name: '渔获达人',
    emoji: '🐟',
    title: '以量服人的实在人',
    description: '你钓鱼的最大乐趣就是爆护！渔获是你实力的证明，也是你炫耀的资本。你可能是那个每次钓鱼都能稳定上鱼的人，也可能是那个能用小鱼钓到大收获的高手。你信奉能上岸的才是高手。',
    traits: ['务实', '稳定输出', '经验丰富', '善于总结'],
    suitableBait: '一切能上鱼的饵料',
    suitableSpot: '收费合理的好钓点'
  }
]
