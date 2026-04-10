import { useRef, useCallback } from 'react'
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

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#1a3a4a')
    gradient.addColorStop(1, '#0d2137')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add decorative bubbles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = Math.random() * 60 + 20
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Title
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FBTI', width / 2, 120)

    ctx.font = '24px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText('钓鱼人大性格测试', width / 2, 160)

    // Personality badge circle
    const centerX = width / 2
    const badgeY = 320
    const badgeR = 100

    ctx.beginPath()
    ctx.arc(centerX, badgeY, badgeR, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(96, 211, 148, 0.2)'
    ctx.fill()
    ctx.strokeStyle = '#60d394'
    ctx.lineWidth = 4
    ctx.stroke()

    // Emoji
    ctx.font = '80px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(personality.emoji, centerX, badgeY)

    // Personality name
    ctx.font = 'bold 44px sans-serif'
    ctx.fillStyle = '#60d394'
    ctx.fillText(personality.name, centerX, 500)

    // Personality title
    ctx.font = '28px sans-serif'
    ctx.fillStyle = '#fff'
    ctx.fillText(personality.title, centerX, 560)

    // Description
    ctx.font = '20px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    const lines = wrapText(ctx, personality.description, width - 80)
    lines.forEach((line, index) => {
      ctx.fillText(line, centerX, 640 + index * 32)
    })

    // Traits
    const traitsY = 780
    ctx.font = '18px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fillText('性格标签', centerX, traitsY)

    const traitText = personality.traits.join(' · ')
    ctx.fillStyle = '#60d394'
    ctx.fillText(traitText, centerX, traitsY + 36)

    // Bottom decoration
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(0, height - 100, width, 100)

    ctx.font = '16px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fillText('长按识别二维码测试你的钓鱼人格', centerX, height - 50)

    // Return data URL
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
      <button className="generate-btn" onClick={handleGenerate}>
        📥 保存分享图
      </button>
    </div>
  )
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
