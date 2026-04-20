import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
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
  exportAndShare: () => Promise<void>
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

  return true
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

function dataUrlToFile(dataUrl: string, fileName: string) {
  const [header, base64Payload = ''] = dataUrl.split(',')
  const mimeMatch = header.match(/data:(.*?);base64/)
  const mimeType = mimeMatch?.[1] ?? 'image/png'
  const binary = window.atob(base64Payload)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], fileName, { type: mimeType })
}

const ShareCard = forwardRef<ShareCardHandle, ShareCardProps>(function ShareCard(
  { personality, axisBreakdown, dynamicTags, showLauncher = true },
  ref
) {
  const exportRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isRenderingCaptureNode, setIsRenderingCaptureNode] = useState(false)
  const prefersManualSave = isIosLikeBrowser() || isWechatBrowser()
  const prefersNativeShare = isIosLikeBrowser() && !isWechatBrowser()

  useImperativeHandle(ref, () => ({
    exportAndShare: async () => {
      await handleDownload()
    }
  }))

  const handleDownload = async () => {
    if (!exportRef.current || isDownloading) return

    setIsDownloading(true)
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

        if (prefersNativeShare) {
          const file = dataUrlToFile(dataUrl, fileName)

          if (canShareFile(file)) {
            try {
              await navigator.share({
                title: `FBTI ${personality.name}分享图`,
                files: [file]
              })

              return
            } catch (error) {
              if (error instanceof DOMException && error.name === 'AbortError') {
                return
              }

              console.warn('Native share failed, falling back to opening the generated image', error)
            }
          }
        }

        const openedWindow = window.open(dataUrl, '_blank', 'noopener,noreferrer')

        if (!openedWindow) {
          window.location.assign(dataUrl)
        }

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
    } catch (error) {
      console.error('Failed to export share image', error)
      window.alert(prefersManualSave ? '生成分享图失败。请重试。' : '生成分享图失败，请稍后重试。')
    } finally {
      setIsRenderingCaptureNode(false)
      setIsDownloading(false)
    }
  }

  return (
    <>
      {showLauncher && (
        <div className="share-card-container">
          <div className="share-card-copy">
            <span className="content-label">分享图</span>
            <h3>导出一张和当前结果页同结构的分享图</h3>
            <p>点击后直接执行分享或下载，不再进入单独的预览页。</p>
          </div>
          <button className="primary-button generate-btn" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? '生成中...' : '结果分享'}
          </button>
        </div>
      )}

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
