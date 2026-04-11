import { useCallback, useRef } from 'react'
import { PersonalityType } from '../data/personalities'
import { analytics } from '../utils/analytics'
import './ShareCard.css'

interface ShareCardProps {
  personality: PersonalityType
}

function ShareCard({ personality }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateShareImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size (9:16 ratio for mobile share)
    const width = 540
    const height = 960
    canvas.width = width
    canvas.height = height

    const background = ctx.createLinearGradient(0, 0, width, height)
    background.addColorStop(0, '#0c1620')
    background.addColorStop(1, '#071019')
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)

    const glow = ctx.createRadialGradient(width - 80, 80, 20, width - 80, 80, 260)
    glow.addColorStop(0, 'rgba(150, 216, 175, 0.24)')
    glow.addColorStop(1, 'rgba(150, 216, 175, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.lineWidth = 1
    for (let x = 0; x < width; x += 54) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 54) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    roundRect(ctx, 36, 36, width - 72, height - 72, 36)
    ctx.fillStyle = 'rgba(10, 18, 26, 0.74)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#c5eed3'
    ctx.font = '600 16px sans-serif'
    ctx.fillText('FISHING BEHAVIOR TYPE', 72, 98)

    ctx.fillStyle = '#f4f7fb'
    ctx.font = '700 54px sans-serif'
    ctx.fillText('FBTI', 72, 154)

    ctx.fillStyle = 'rgba(223, 231, 239, 0.7)'
    ctx.font = '24px sans-serif'
    ctx.fillText('钓鱼人格结果卡', 72, 194)

    roundRect(ctx, 72, 236, 132, 132, 34)
    ctx.fillStyle = 'rgba(150, 216, 175, 0.12)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(150, 216, 175, 0.28)'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.font = '72px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#f4f7fb'
    ctx.fillText(personality.emoji, 138, 302)

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.font = '700 42px sans-serif'
    ctx.fillStyle = '#f4f7fb'
    ctx.fillText(personality.name, 232, 286)

    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#96d8af'
    ctx.fillText(personality.title, 232, 326)

    ctx.fillStyle = 'rgba(223, 231, 239, 0.82)'
    ctx.font = '22px sans-serif'
    const lines = wrapText(ctx, personality.description, 396)
    lines.forEach((line, index) => {
      ctx.fillText(line, 72, 446 + index * 36)
    })

    drawInfoCard(ctx, {
      x: 72,
      y: 674,
      width: 396,
      height: 86,
      label: '人格代码',
      value: personality.id
    })

    drawInfoCard(ctx, {
      x: 72,
      y: 780,
      width: 396,
      height: 86,
      label: '维度组合',
      value: personality.dimensions.join(' · ')
    })

    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(223, 231, 239, 0.54)'
    ctx.font = '16px sans-serif'
    ctx.fillText(personality.signature, 72, 900)

    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(223, 231, 239, 0.4)'
    ctx.font = '15px sans-serif'
    ctx.fillText('保存图片，分享你的钓鱼人格结果', width / 2, 930)

    return canvas.toDataURL('image/png')
  }, [personality])

  const handleGenerate = () => {
    analytics.trackShareGenerate(personality.id)
    const dataUrl = generateShareImage()
    if (dataUrl) {
      analytics.trackShareDownload(personality.id)
      // Create download link
      const link = document.createElement('a')
      link.download = `fbti-${personality.id}.png`
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="share-card-container">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="share-card-copy">
        <span className="content-label">分享图</span>
        <p>会生成一张竖版结果卡，适合发给朋友或贴进钓友群。</p>
      </div>
      <button className="primary-button generate-btn" onClick={handleGenerate}>
        保存分享图
      </button>
    </div>
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawInfoCard(
  ctx: CanvasRenderingContext2D,
  options: { x: number; y: number; width: number; height: number; label: string; value: string }
) {
  roundRect(ctx, options.x, options.y, options.width, options.height, 24)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(223, 231, 239, 0.48)'
  ctx.font = '16px sans-serif'
  ctx.fillText(options.label, options.x + 20, options.y + 28)

  ctx.fillStyle = '#f4f7fb'
  ctx.font = '600 24px sans-serif'
  ctx.fillText(options.value, options.x + 20, options.y + 62)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split('')
  const lines: string[] = []
  let currentLine = ''

  for (const char of words) {
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.slice(0, 6) // Max 6 lines
}

export default ShareCard
