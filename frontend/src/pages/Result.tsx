import { m } from 'framer-motion'
import { useMemo, useState } from 'react'
import ShareCard from '../components/ShareCard'
import { getPersonalityArtwork } from '../data/personalityArtworks'
import { QuizAnswer } from '../types/quiz'
import { calculatePersonality } from '../utils/calculate'
import './Result.css'

interface ResultProps {
  answers: QuizAnswer[]
  onRestart: () => void
}

function Result({ answers, onRestart }: ResultProps) {
  const [showShare, setShowShare] = useState(false)
  const communityUrl = import.meta.env.VITE_COMMUNITY_URL?.trim()

  const result = useMemo(() => {
    return calculatePersonality(answers)
  }, [answers])

  const { personality, axisBreakdown, topFacetTags } = result
  const dynamicTags = topFacetTags.length ? topFacetTags : personality.traits.slice(0, 3)
  const artwork = getPersonalityArtwork(personality.id)
  const resultLead = `这份画像由「${personality.dimensions.join(' / ')}」组成，这次更明显的行为标签是${dynamicTags.join('、')}。`

  const profileRows = [
    { label: '人格代码', value: personality.id },
    { label: '四轴落点', value: axisBreakdown.map((axis) => axis.resolvedLabel).join(' · ') },
    { label: '本次标签', value: dynamicTags.join(' / ') }
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
        <section className="result-canvas">
          <div className="result-header">
            <span className="result-kicker">FBTI Result</span>
            <span className="result-stamp">{personality.id}</span>
          </div>

          <div className="result-hero">
            <m.figure
              className="result-artwork-card"
              initial={{ opacity: 0, y: 24, rotate: -1.2 }}
              animate={{ opacity: 1, y: 0, rotate: -1.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="result-artwork-frame">
                <img
                  src={artwork}
                  alt={`${personality.name}的场景插画`}
                  className="result-artwork-image"
                />
              </div>
              <figcaption className="result-artwork-caption">
                这类人格最像的状态，不是高声解释自己，而是整个人坐进水边的气氛里。
              </figcaption>
            </m.figure>

            <m.div
              className="result-identity"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="result-overline">你的钓鱼人格</span>
              <div className="result-name-row">
                <div>
                  <h1 className="personality-type">{personality.name}</h1>
                  <p className="personality-title">{personality.title}</p>
                </div>
              </div>

              <p className="result-summary">{resultLead}</p>

              <blockquote className="result-signature">
                “{personality.signature}”
              </blockquote>

              <div className="result-chip-group">
                {dynamicTags.map((trait) => (
                  <span key={trait} className="trait">{trait}</span>
                ))}
              </div>

              <div className="result-chip-group result-chip-group-secondary">
                {personality.traits.map((trait) => (
                  <span key={trait} className="trait trait-secondary">{trait}</span>
                ))}
              </div>
            </m.div>
          </div>

          <div className="result-detail-grid">
            <article className="result-note result-note-reading">
              <span className="content-label">性格解读</span>
              <h2>你在水边最稳定的状态</h2>
              <p>{personality.description}</p>
            </article>

            <article className="result-note result-note-scene">
              <span className="content-label">代表场景</span>
              <h2>最像你的那一幕</h2>
              <p>{personality.scene}</p>
            </article>

            <article className="result-note result-note-profile">
              <span className="content-label">人格坐标</span>
              <div className="result-profile-list">
                {profileRows.map((item) => (
                  <div key={item.label} className="result-profile-row">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="axis-breakdown-list">
                {axisBreakdown.map((axis) => (
                  <div key={axis.axis} className="axis-breakdown-row">
                    <div className="axis-breakdown-row__header">
                      <span>{axis.title}</span>
                      <strong>{axis.resolvedLabel}</strong>
                    </div>
                    <p>
                      {axis.leftLabel} {axis.leftScore} 分 / {axis.rightLabel} {axis.rightScore} 分
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {showShare && (
            <section className="share-section">
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
        </section>
      </div>
    </div>
  )
}

export default Result
