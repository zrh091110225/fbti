import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { toBlob } from 'html-to-image'
import { PersonalityType } from '../data/personalities'
import { AxisBreakdown } from '../utils/calculate'
import ResultPageContent from './ResultPageContent'
import './ShareCard.css'

interface ShareCardProps {
  personality: PersonalityType
  axisBreakdown: AxisBreakdown[]
  dynamicTags: string[]
  showLauncher?: boolean
}

export interface ShareCardHandle {
  openPreview: () => Promise<void>
}

function isIosLikeBrowser() {
  const ua = window.navigator.userAgent
  const platform = window.navigator.platform
  const isTouchMac = platform === 'MacIntel' && window.navigator.maxTouchPoints > 1

  return /iPad|iPhone|iPod/.test(ua) || isTouchMac
}

function isWechatBrowser() {
  return /MicroMessenger/i.test(window.navigator.userAgent)
}

function canShareFile(file: File) {
  if (typeof navigator.share !== 'function') {
    return false
  }

  if (typeof navigator.canShare === 'function') {
    return navigator.canShare({ files: [file] })
  }

  return false
}

const ShareCard = forwardRef<ShareCardHandle, ShareCardProps>(function ShareCard(
  { personality, axisBreakdown, dynamicTags, showLauncher = true },
  ref
) {
  const exportRef = useRef<HTMLDivElement>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const prefersManualSave = isIosLikeBrowser() || isWechatBrowser()
  const shouldUseNativeShare = prefersManualSave

  const openPreview = async () => {
    setIsPreviewOpen(true)
  }

  useImperativeHandle(ref, () => ({
    openPreview
  }))

  const handleDownload = async () => {
    if (!exportRef.current || isDownloading) return

    setIsDownloading(true)
    const fileName = `fbti-${personality.id}.png`
    const manualSaveWindow = prefersManualSave ? window.open('', '_blank') : null

    if (manualSaveWindow) {
      manualSaveWindow.document.write('<title>正在生成分享图</title><p style="font-family:-apple-system,BlinkMacSystemFont,\'PingFang SC\',sans-serif;padding:24px;">正在生成分享图，请稍候...</p>')
      manualSaveWindow.document.close()
    }

    try {
      const blob = await toBlob(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2
      })

      if (!blob) {
        throw new Error('Share image blob is empty')
      }

      const file = new File([blob], fileName, { type: 'image/png' })

      if (shouldUseNativeShare && canShareFile(file)) {
        await navigator.share({
          title: `FBTI ${personality.name}分享图`,
          files: [file]
        })

        manualSaveWindow?.close()
        setIsPreviewOpen(false)
        return
      }

      const objectUrl = URL.createObjectURL(blob)

      if (manualSaveWindow) {
        manualSaveWindow.location.href = objectUrl
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
        window.alert('分享图已在新页面打开，请长按图片保存到手机。')
      } else {
        const link = document.createElement('a')
        link.download = fileName
        link.href = objectUrl
        link.rel = 'noopener'
        document.body.append(link)
        link.click()
        link.remove()
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)
      }

      setIsPreviewOpen(false)
    } catch (error) {
      manualSaveWindow?.close()
      console.error('Failed to export share image', error)
      window.alert('生成分享图失败，请稍后重试。')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClose = () => {
    if (isDownloading) return
    setIsPreviewOpen(false)
  }

  return (
    <>
      {showLauncher && (
        <div className="share-card-container">
          <div className="share-card-copy">
            <span className="content-label">分享图</span>
            <h3>导出一张和当前结果页同结构的分享图</h3>
            <p>预览页和下载图片都直接复用结果页结构，只隐藏页面按钮，不再维护单独的说明卡片版式。</p>
          </div>
          <button className="primary-button generate-btn" onClick={openPreview}>
            查看分享图
          </button>
        </div>
      )}

      <AnimatePresence>
        {isPreviewOpen && (
          <m.div
            className="share-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          >
            <m.div
              className="share-preview-modal"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="share-preview-header">
                <div className="share-preview-header-copy">
                  <span>分享图预览</span>
                  <p>直接复用结果页结构，仅隐藏页面按钮</p>
                </div>
                <button className="share-preview-close" onClick={handleClose} aria-label="关闭">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="share-preview-stage">
                <div className="page page-result share-preview-page">
                  <ResultPageContent
                    personality={personality}
                    axisBreakdown={axisBreakdown}
                    dynamicTags={dynamicTags}
                    enableMotion={false}
                  />
                </div>
              </div>

              <div className="share-preview-actions">
                <button className="secondary-button" onClick={handleClose} disabled={isDownloading}>
                  取消
                </button>
                <button className="primary-button" onClick={handleDownload} disabled={isDownloading}>
                  {isDownloading ? '生成中...' : (prefersManualSave ? '保存图片' : '下载图片')}
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="share-export-root" aria-hidden="true">
        <div ref={exportRef} className="page page-result share-export-page">
          <ResultPageContent
            personality={personality}
            axisBreakdown={axisBreakdown}
            dynamicTags={dynamicTags}
            enableMotion={false}
          />
        </div>
      </div>
    </>
  )
})

export default ShareCard
