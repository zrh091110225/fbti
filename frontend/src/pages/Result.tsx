import { m } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import wechatGroupQr from '../assets/community/wechat-group-qr.jpg'
import ShareCard, { ShareCardHandle } from '../components/ShareCard'
import { getPersonalityArtwork } from '../data/personalityArtworks'
import { QuizAnswer } from '../types/quiz'
import { calculatePersonality } from '../utils/calculate'
import './Result.css'

interface ResultProps {
  answers: QuizAnswer[]
  onRestart: () => void
}

function Result({ answers, onRestart }: ResultProps) {
  const [isShareGenerating, setIsShareGenerating] = useState(false)
  const [isCommunityOpen, setIsCommunityOpen] = useState(false)
  const shareCardRef = useRef<ShareCardHandle>(null)
  const communitySectionRef = useRef<HTMLElement>(null)
  const telegramGroupUrl = 'https://t.me/+I8zUibGR0FswMTQ5'
  const wechatGroupName = 'FBIT 钓友群'

  const result = useMemo(() => {
    return calculatePersonality(answers)
  }, [answers])

  const { personality, axisBreakdown, topFacetTags } = result
  const dynamicTags = topFacetTags.length ? topFacetTags : personality.traits.slice(0, 3)
  const artwork = getPersonalityArtwork(personality.id)

  const profileRows = [
    { label: '人格', value: personality.id },
    { label: '四轴', value: axisBreakdown.map((axis) => axis.resolvedLabel).join(' · ') },
    { label: '标签', value: dynamicTags.join(' / ') }
  ]

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleCommunityToggle = () => {
    setIsCommunityOpen((prev) => {
      const next = !prev
      if (next) {
        window.requestAnimationFrame(() => {
          communitySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
      return next
    })
  }

  const handleSharePreview = async () => {
    if (!shareCardRef.current || isShareGenerating) return

    setIsShareGenerating(true)
    try {
      await shareCardRef.current.openPreview()
    } finally {
      setIsShareGenerating(false)
    }
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
              {/*<figcaption className="result-artwork-caption">*/}
              {/*  你的人格状态：不是高声解释自己而是整个人坐进水边的气氛里。*/}
              {/*</figcaption>*/}
            </m.figure>

            <m.div
              className="result-identity"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="result-overline">钓鱼人格</span>
              <div className="result-name-row">
                <div>
                  <h1 className="personality-type">{personality.name}</h1>
                  <p className="personality-title">{personality.title}</p>
                </div>
              </div>

              <blockquote className="result-signature">
                “{personality.signature}”
              </blockquote>

              {/*<div className="result-chip-group">*/}
              {/*  {dynamicTags.map((trait) => (*/}
              {/*    <span key={trait} className="trait">{trait}</span>*/}
              {/*  ))}*/}
              {/*</div>*/}

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
              {/*<h2>你在水边最稳定的状态</h2>*/}
              <p>{personality.description}</p>
            </article>

            <article className="result-note result-note-scene">
              <span className="content-label">代表场景</span>
              {/*<h2>最像你的那一幕</h2>*/}
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

          {isCommunityOpen ? (
            <section className="community-section" aria-label="入群方式" ref={communitySectionRef}>
              <div className="community-section__header">
                <span className="content-label">找到组织</span>
                <h2>直接进群，聊鱼情和战绩</h2>
                <p>微信扫码加入，Telegram 点击跳转</p>
              </div>

              <div className="community-grid">
                <article className="community-card community-card-wechat">
                  <div className="community-card__body">
                    <span className="community-card__eyebrow">微信群</span>
                    <h3>{wechatGroupName}</h3>
                    <p>长按或截图保存二维码，用微信扫一扫加入鱼友群。</p>
                    <button
                      className="ghost-button community-card__button"
                      onClick={() => openExternalLink(wechatGroupQr)}
                    >
                      查看二维码大图
                    </button>
                  </div>

                  <button
                    type="button"
                    className="community-qr-button"
                    onClick={() => openExternalLink(wechatGroupQr)}
                    aria-label={`查看 ${wechatGroupName} 二维码大图`}
                  >
                    <img src={wechatGroupQr} alt={`${wechatGroupName}微信群二维码`} className="community-qr-image" />
                  </button>
                </article>

                <article className="community-card community-card-telegram">
                  <div className="community-card__body">
                    <span className="community-card__eyebrow">Telegram</span>
                    <h3>FBIT Telegram 群组</h3>
                    <p>适合直接点击加入，也方便把结果页转给海外或常用 Telegram 的朋友。</p>
                  </div>

                  <button
                    className="primary-button community-card__button"
                    onClick={() => openExternalLink(telegramGroupUrl)}
                  >
                    打开 Telegram 群组
                  </button>
                </article>
              </div>
            </section>
          ) : null}

          <div className="result-actions">
            <button className="primary-button" onClick={handleSharePreview} disabled={isShareGenerating}>
              {isShareGenerating ? '生成中...' : '查看分享图'}
            </button>
            <button className="secondary-button" onClick={onRestart}>
              重新测试
            </button>
            <button className="ghost-button" onClick={handleCommunityToggle}>
              {isCommunityOpen ? '收起钓友组织' : '寻找钓友组织'}
            </button>
          </div>

          <ShareCard ref={shareCardRef} personality={personality} showLauncher={false} />
        </section>
      </div>
    </div>
  )
}

export default Result
