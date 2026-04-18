import { m } from 'framer-motion'
import fbtiLogo from '../assets/fbti-logo.png'
import ScenicBackdrop from '../components/ScenicBackdrop'
import { getPersonalityArtwork } from '../data/personalityArtworks'
import { personalities } from '../data/personalities'
import { questions } from '../data/questions'
import './Home.css'

interface HomeProps {
  onStart: () => void
}

const dimensionCards = [
  {
    id: 'I',
    title: '投入强度',
    value: '狂热 / 松弛',
    description: '看你会不会为了鱼口调整生活节奏，把钓鱼当成要认真安排的正事，还是一个轻松插入生活的爱好。'
  },
  {
    id: 'S',
    title: '相处方式',
    value: '社交 / 独处',
    description: '判断你更享受组局、交流和带节奏，还是把水边当作自己的安静区域。'
  },
  {
    id: 'T',
    title: '偏好路径',
    value: '技术 / 装备',
    description: '区分你更相信手法、判断和复盘，还是更依赖器材配置、系统搭建和 setup。'
  },
  {
    id: 'R',
    title: '价值取向',
    value: '结果 / 体验',
    description: '衡量你更在意鱼获和胜负，还是把舒服、氛围和当天状态放在更前面。'
  }
]

const testHighlights = [
  `共 ${questions.length} 题，四个维度各 5 题，整体作答约 3 分钟。`,
  '每题都是 3 个真实场景选项，不再逼你在两个极端里硬选一个。',
  '自动保存答题进度，中途退出后再次进入可以继续。',
  '结果会给出 16 型主人格、四轴落点、典型场景和本次命中的动态行为标签。',
  '支持一键生成分享图，适合发到钓友群或朋友圈。',
  '结果仅供娱乐，不构成心理学或行为学专业判断。'
]

const faqItems = [
  {
    question: 'FBTI 是什么？',
    answer:
      'FBTI 是 Fishing Behavior Type Indicator 的缩写，用四组钓鱼行为偏好来判断你更像哪一型钓鱼人。它是娱乐向测试，不是专业人格量表。'
  },
  {
    question: '测试需要多久？',
    answer:
      `当前版本一共 ${questions.length} 题，正常情况下 3 分钟左右可以做完。`
  },
  {
    question: '结果是怎么得出的？',
    answer:
      '每道题都会同时影响四轴主分和行为标签分。系统先判断四个维度的落点，再结合强偏好次数和平分裁决，最后给出 16 型人格和本次最明显的 3 个行为标签。'
  },
  {
    question: '答题数据会上传吗？',
    answer:
      '数据本地保存与恢复，不会上传任何数据到服务器，绝对保证用户数据隐私。'
  },
  {
    question: '为什么适合先凭直觉作答？',
    answer:
      '这个测试测的是你在真实钓鱼场景里的稳定倾向，不是理想中的自己。按第一反应选，结果通常会更贴近你的平时状态。'
  }
]

function Home({ onStart }: HomeProps) {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }

  return (
    <div className="page page-home">
      <ScenicBackdrop variant="home" />
      <div className="page-shell home-shell">
        <div className="home-stack">
          <header className="home-topbar surface">
            <button className="home-brand" type="button" onClick={() => scrollToSection('hero')}>
              <img className="home-brand-logo" src={fbtiLogo} alt="FBTI logo" />
              <span className="home-brand-copy">
                <strong>FBTI</strong>
                <span>钓鱼人大性格测试</span>
              </span>
            </button>

            <nav className="home-nav" aria-label="首页导航">
              <button type="button" onClick={() => scrollToSection('dimensions')}>
                测试维度
              </button>
              <button type="button" onClick={() => scrollToSection('overview')}>
                关于测试
              </button>
              <button type="button" onClick={() => scrollToSection('atlas')}>
                人格图谱
              </button>
              <button type="button" onClick={() => scrollToSection('faq')}>
                常见问题
              </button>
            </nav>
          </header>

          <m.section
            id="hero"
            className="home-hero surface surface-strong"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="home-hero-copy">
              <span className="section-label">Fishing Behavior Type Indicator</span>

              <h1 className="home-title">FBTI 专为钓鱼人打造的人格测试</h1>

              <p className="home-description">
                钓了这么久的鱼，想不想知道你是哪种钓鱼佬？用 {questions.length} 道问题，准确识别你是 16 中钓鱼人格中的哪一种，快试试吧。
              </p>

              <div className="home-actions">
                <button className="primary-button home-start-button" type="button" onClick={onStart}>
                  开始测试
                  <span className="button-arrow">→</span>
                </button>
                <button
                  className="secondary-button home-preview-button"
                  type="button"
                  onClick={() => scrollToSection('atlas')}
                >
                  查看人格图谱
                  <span className="button-arrow">→</span>
                </button>
              </div>

              <p className="home-footnote">建议按第一直觉作答，结果会更准确。</p>
            </div>

            <div className="home-hero-panel">
              <div className="home-metrics">
                <div className="metric-chip">
                  <span className="metric-value">{questions.length} 题</span>
                  <span className="metric-label">完整作答</span>
                </div>
                <div className="metric-chip">
                  <span className="metric-value">4 维度</span>
                  <span className="metric-label">交叉判断</span>
                </div>
                <div className="metric-chip">
                  <span className="metric-value">{personalities.length} 型</span>
                  <span className="metric-label">人格结果</span>
                </div>
              </div>

              <div className="hero-note-card">
                <span className="content-label">你会得到什么</span>
                <ul>
                  <li>专属的人格标签与一句话总结</li>
                  <li>四个维度得分和三个行为标签</li>
                  <li>可直接分享给钓友的测试结果海报</li>
                  <li>加入社群寻找志同道合的钓友</li>
                </ul>
              </div>
            </div>
          </m.section>

          <m.section
            id="dimensions"
            className="home-section surface"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-heading">
              {/*<span className="section-label">四大维度</span>*/}
              <h2>四大维度全面分析</h2>
              <p>
                系统会从投入强度/相处方式/偏好路径/价值取向了解你钓鱼行为里识别你的稳定倾向，测试结果一定会让你更了解你是哪种钓鱼佬。
              </p>
            </div>

            <div className="dimension-grid">
              {dimensionCards.map(card => (
                <article key={card.id} className="dimension-card">
                  <span className="dimension-id">{card.id}</span>
                  <h3>{card.title}</h3>
                  <strong>{card.value}</strong>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </m.section>

          <m.section
            id="overview"
            className="home-section surface"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-heading">
              {/*<span className="section-label">关于测试</span>*/}
              <h2>关于测试</h2>
            </div>

            <div className="overview-grid">
              <div className="overview-card">
                <span className="content-label">测试说明</span>
                <ul className="overview-list">
                  {testHighlights.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="overview-card overview-card-strong">
                <span className="content-label">结果结构</span>
                <div className="result-formula">
                  <span>投入强度</span>
                  <span>×</span>
                  <span>相处方式</span>
                  <span>×</span>
                  <span>偏好路径</span>
                  <span>×</span>
                  <span>价值取向</span>
                </div>
                <p>
                  主结果仍然由四个维度组合成 {personalities.length} 种类型，但这次还会附带动态行为标签，让结果更像“你这次是怎么钓的”，而不只是一个固定代号。
                </p>
                <button className="ghost-button overview-cta" type="button" onClick={onStart}>
                  直接开始测试
                </button>
              </div>
            </div>
          </m.section>

          <section
            id="atlas"
            className="home-section surface"
          >
            <div className="section-heading">
              {/*<span className="section-label">人格图谱</span>*/}
              <h2>钓鱼人格图鉴</h2>
              <p>下面是{personalities.length} 种人图鉴预览，先猜猜你自己属于哪种？</p>
            </div>

            <div className="personality-grid">
              {personalities.map(personality => (
                <article key={personality.id} className="personality-card">
                  <div className="personality-card-head">
                    <div className="personality-card-title-row">
                      <h3>{personality.name}</h3>
                      <span className="personality-code">{personality.id}</span>
                    </div>
                    <div>
                      <p>{personality.title}</p>
                    </div>
                  </div>

                  <div className="personality-visual">
                    <img
                      src={getPersonalityArtwork(personality.id)}
                      alt={`${personality.name}的人格插画`}
                      className="personality-visual-image"
                      loading="lazy"
                      decoding="async"
                    />
                    <p className="personality-signature">{personality.signature}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <m.section
            id="faq"
            className="home-section surface"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-heading">
              {/*<span className="section-label">常见问题</span>*/}
              <h2>常见问题</h2>
            </div>

            <div className="faq-list">
              {faqItems.map(item => (
                <details key={item.question} className="faq-item">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </m.section>

          <footer className="home-footer surface">
            <div>
              <strong>FBTI 钓鱼人格测试</strong>
              <p>准备好就开始测试吧~</p>
            </div>

            <div className="home-footer-links">
              <button type="button" onClick={() => scrollToSection('dimensions')}>
                测试维度
              </button>
              <button type="button" onClick={() => scrollToSection('atlas')}>
                人格图谱
              </button>
              <button type="button" onClick={onStart}>
                开始测试
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Home
