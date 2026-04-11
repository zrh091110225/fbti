import { m } from 'framer-motion'
import { useMemo, useState } from 'react'
import { QuizAnswer } from '../types/quiz'
import { calculatePersonality } from '../utils/calculate'
import ShareCard from '../components/ShareCard'
import './Result.css'

interface ResultProps {
  answers: QuizAnswer[]
  onRestart: () => void
}

function Result({ answers, onRestart }: ResultProps) {
  const [showShare, setShowShare] = useState(false)
  const communityUrl = import.meta.env.VITE_COMMUNITY_URL?.trim()

  const personality = useMemo(() => {
    return calculatePersonality(answers)
  }, [answers])

  const highlights = [
    { label: '人格代码', value: personality.id },
    { label: '维度组合', value: personality.dimensions.join(' · ') },
    { label: '一句话', value: personality.signature }
  ]

  const handleGroupClick = () => {
    if (!communityUrl) {
      window.alert('暂未配置入群链接，请先设置 VITE_COMMUNITY_URL。')
      return
    }

    window.open(communityUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page page-result">
      <div className="page-shell result-shell">
        <section className="result-hero surface surface-strong">
          <div className="result-hero-main">
            <m.div
              className="personality-badge"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            >
              <span className="emoji">{personality.emoji}</span>
            </m.div>

            <div className="result-hero-copy">
              <span className="section-label">Your Result</span>
              <h1 className="personality-type">{personality.name}</h1>
              <p className="personality-title">{personality.title}</p>
            </div>
          </div>

          <div className="traits">
            {personality.traits.map((trait, index) => (
              <span key={index} className="trait">{trait}</span>
            ))}
          </div>
        </section>

        <div className="result-grid">
          <section className="description-card surface">
            <span className="content-label">性格解读</span>
            <p>{personality.description}</p>
          </section>

          <section className="description-card surface">
            <span className="content-label">代表场景</span>
            <p>{personality.scene}</p>
          </section>

          <section className="highlights-grid">
            {highlights.map((item) => (
              <article key={item.label} className="highlight-card surface">
                <span className="content-label">{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </section>
        </div>

        {showShare && (
          <section className="share-section surface">
            <ShareCard personality={personality} />
          </section>
        )}

        <div className="result-actions">
          <button className="primary-button" onClick={() => setShowShare(prev => !prev)}>
            {showShare ? '收起分享区' : '生成分享图'}
          </button>
          <button className="secondary-button" onClick={onRestart}>
            重新测试
          </button>
          <button className="ghost-button" onClick={handleGroupClick}>
            {communityUrl ? '打开入群链接' : '入群链接待配置'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Result
