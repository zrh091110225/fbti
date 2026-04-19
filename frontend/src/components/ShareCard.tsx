import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { toBlob, toPng } from 'html-to-image'
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

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(message))
    }, timeoutMs)

    promise
      .then((value) => {
        window.clearTimeout(timer)
        resolve(value)
      })
      .catch((error) => {
        window.clearTimeout(timer)
        reject(error)
      })
  })
}

async function waitForImagesReady(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'))

  await Promise.all(
    images.map(async (image) => {
      if (image.complete && image.naturalWidth > 0) {
        if (typeof image.decode === 'function') {
          try {
            await image.decode()
          } catch {
            // ignore decode failures and let export try anyway
          }
        }
        return
      }

      await new Promise<void>((resolve) => {
        const cleanup = () => {
          image.removeEventListener('load', cleanup)
          image.removeEventListener('error', cleanup)
          resolve()
        }

        image.addEventListener('load', cleanup, { once: true })
        image.addEventListener('error', cleanup, { once: true })
      })
    })
  )
}

const ShareCard = forwardRef<ShareCardHandle, ShareCardProps>(function ShareCard(
  { personality, axisBreakdown, dynamicTags, showLauncher = true },
  ref
) {
  const exportRef = useRef<HTMLDivElement>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [isRenderingCaptureNode, setIsRenderingCaptureNode] = useState(false)
  const prefersManualSave = isIosLikeBrowser() || isWechatBrowser()

  const openPreview = async () => {
    setGeneratedImageUrl(null)
    setIsPreviewOpen(true)
  }

  useImperativeHandle(ref, () => ({
    openPreview
  }))

  const handleDownload = async () => {
    if (!exportRef.current || isDownloading) return

    setIsDownloading(true)
    setGeneratedImageUrl(null)
    const fileName = `fbti-${personality.id}.png`
    const exportNode = exportRef.current

    try {
      if (prefersManualSave) {
        setIsRenderingCaptureNode(true)
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
      }

      await waitForImagesReady(exportNode)
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))

      if (prefersManualSave) {
        const dataUrl = await withTimeout(
          toPng(exportNode, {
            cacheBust: true,
            pixelRatio: 1
          }),
          12000,
          'Export timed out on mobile Safari'
        )

        setGeneratedImageUrl(dataUrl)
        return
      }

      const blob = await withTimeout(
        toBlob(exportNode, {
          cacheBust: true,
          pixelRatio: 2
        }),
        12000,
        'Export timed out'
      )

      if (!blob) {
        throw new Error('Share image blob is empty')
      }

      const objectUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.download = fileName
      link.href = objectUrl
      link.rel = 'noopener'
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000)

      setIsPreviewOpen(false)
    } catch (error) {
      console.error('Failed to export share image', error)
      window.alert(prefersManualSave ? '生成分享图失败。请重试；若仍失败，可长按预览图或使用截图保存。' : '生成分享图失败，请稍后重试。')
    } finally {
      setIsRenderingCaptureNode(false)
      setIsDownloading(false)
    }
  }

  const handleClose = () => {
    if (isDownloading) return
    setGeneratedImageUrl(null)
    setIsPreviewOpen(false)
  }

  const handleOpenGeneratedImage = () => {
    if (!generatedImageUrl) return

    const openedWindow = window.open(generatedImageUrl, '_blank', 'noopener,noreferrer')

    if (!openedWindow) {
      window.alert('浏览器拦截了新页面打开。你也可以直接长按当前图片保存。')
    }
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

              <div className={`share-preview-stage${generatedImageUrl ? ' share-preview-stage--generated' : ''}`}>
                {generatedImageUrl ? (
                  <div className="share-generated-card">
                    <div className="share-generated-copy">
                      <strong>分享图已生成</strong>
                      <p>直接长按下方图片即可保存到相册。若长按不方便，再点右下角“打开原图”。</p>
                    </div>
                    <img
                      className="share-generated-image"
                      src={generatedImageUrl}
                      alt={`${personality.name}分享图成品`}
                    />
                  </div>
                ) : (
                  <div className="page page-result share-preview-page">
                    <ResultPageContent
                      personality={personality}
                      axisBreakdown={axisBreakdown}
                      dynamicTags={dynamicTags}
                      enableMotion={false}
                    />
                  </div>
                )}
              </div>

              <div className="share-preview-actions">
                {generatedImageUrl ? (
                  <>
                    <button className="secondary-button" onClick={handleClose} disabled={isDownloading}>
                      关闭
                    </button>
                    <button className="primary-button" onClick={handleOpenGeneratedImage} disabled={isDownloading}>
                      打开原图
                    </button>
                  </>
                ) : (
                  <>
                    <button className="secondary-button" onClick={handleClose} disabled={isDownloading}>
                      取消
                    </button>
                    <button className="primary-button" onClick={handleDownload} disabled={isDownloading}>
                      {isDownloading ? '生成中...' : (prefersManualSave ? '保存图片' : '下载图片')}
                    </button>
                  </>
                )}
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <div
        className={`share-export-root${isRenderingCaptureNode ? ' share-export-root--capture' : ''}`}
        aria-hidden="true"
      >
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
