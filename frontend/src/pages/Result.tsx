import { useMemo, useRef, useState } from 'react'
import wechatGroupQr from '../assets/community/wechat-group-qr.jpg'
import ResultPageContent from '../components/ResultPageContent'
import ShareCard, { ShareCardHandle } from '../components/ShareCard'
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
  const wechatGroupName = 'FBTI 钓友群'

  const result = useMemo(() => {
    return calculatePersonality(answers)
  }, [answers])

  const { personality, axisBreakdown, topFacetTags } = result
  const dynamicTags = topFacetTags.length ? topFacetTags : personality.traits.slice(0, 3)

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
      <ResultPageContent
        personality={personality}
        axisBreakdown={axisBreakdown}
        dynamicTags={dynamicTags}
        extraContent={isCommunityOpen ? (
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
                  <h3>FBTI Telegram 群组</h3>
                  <p>点击加入 Telegram 群组，寻找志同道合的钓友。</p>
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
        actions={(
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
        )}
      />

      <ShareCard
        ref={shareCardRef}
        personality={personality}
        axisBreakdown={axisBreakdown}
        dynamicTags={dynamicTags}
        showLauncher={false}
      />
    </div>
  )
}

export default Result
