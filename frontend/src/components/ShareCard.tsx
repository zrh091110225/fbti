import { useCallback, useRef } from 'react'
import { PersonalityType } from '../data/personalities'
import './ShareCard.css'

interface ShareCardProps {
  personality: PersonalityType
}

function ShareCard({ personality }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateShareImage = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 540
    const height = 960
    canvas.width = width
    canvas.height = height

    drawBackground(ctx, width, height)

    const shellX = 28
    const shellY = 28
    const shellWidth = width - 56
    const shellHeight = height - 56

    drawPaperShell(ctx, shellX, shellY, shellWidth, shellHeight)

    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'

    ctx.fillStyle = 'rgba(41, 53, 47, 0.54)'
    ctx.font = '700 13px sans-serif'
    ctx.fillText('FBTI RESULT', 56, 78)

    drawStamp(ctx, width - 118, 74, personality.id)

    const artworkX = 56
    const artworkY = 112
    const artworkWidth = 428
    const artworkHeight = 304
    drawArtworkFrame(ctx, artworkX, artworkY, artworkWidth, artworkHeight)

    try {
      const artwork = await loadImage(personality.image)
      drawCoverImage(ctx, artwork, artworkX + 14, artworkY + 14, artworkWidth - 28, artworkHeight - 28, 24)
    } catch {
      drawArtworkFallback(ctx, artworkX + 14, artworkY + 14, artworkWidth - 28, artworkHeight - 28)
    }

    const titleY = 474
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#24302b'
    const fittedNameFont = fitFontSize(ctx, personality.name, 48, 32, 380, 700)
    ctx.font = `700 ${fittedNameFont}px sans-serif`
    ctx.fillText(personality.name, 56, titleY)

    ctx.fillStyle = 'rgba(41, 53, 47, 0.72)'
    const titleLines = wrapText(ctx, personality.title, 428, {
      fontSize: 22,
      maxLines: 2,
      lineHeight: 30,
      fontWeight: 500,
      ellipsis: true
    })
    titleLines.forEach((line, index) => {
      ctx.fillText(line, 56, 514 + index * 30)
    })

    drawLeadCard(ctx, {
      x: 56,
      y: 578,
      width: 428,
      height: 106
    })

    const summary = `这份画像由「${personality.dimensions.join(' / ')}」组成，关键词是${personality.traits.slice(0, 3).join('、')}。`
    ctx.fillStyle = 'rgba(41, 53, 47, 0.82)'
    const leadLines = wrapText(ctx, summary, 380, {
      fontSize: 18,
      maxLines: 3,
      lineHeight: 30,
      fontWeight: 400,
      ellipsis: true
    })
    leadLines.forEach((line, index) => {
      ctx.fillText(line, 80, 620 + index * 30)
    })

    drawSignatureCard(ctx, {
      x: 56,
      y: 706,
      width: 428,
      height: 82
    })
    ctx.fillStyle = '#4d6358'
    const signatureLines = wrapText(ctx, `“${personality.signature}”`, 372, {
      fontSize: 20,
      maxLines: 2,
      lineHeight: 28,
      fontWeight: 500,
      ellipsis: true
    })
    signatureLines.forEach((line, index) => {
      ctx.fillText(line, 84, 742 + index * 28)
    })

    drawInfoCard(ctx, {
      x: 56,
      y: 812,
      width: 202,
      height: 90,
      label: '人格代码',
      value: personality.id,
      valueFontSize: 28,
      valueLineHeight: 30,
      maxLines: 1
    })

    drawInfoCard(ctx, {
      x: 282,
      y: 812,
      width: 202,
      height: 90,
      label: '核心标签',
      value: personality.traits.slice(0, 2).join(' / '),
      valueFontSize: 18,
      valueLineHeight: 24,
      maxLines: 2
    })

    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(41, 53, 47, 0.42)'
    ctx.font = '15px sans-serif'
    ctx.fillText('保存图片，分享你的钓鱼人格结果', width / 2, 924)

    return canvas.toDataURL('image/png')
  }, [personality])

  const handleGenerate = async () => {
    const dataUrl = await generateShareImage()
    if (dataUrl) {
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
        <h3>导出一张和结果页同源的竖版人格海报</h3>
        <p>会保留插画、人格名、短导语和金句，适合直接发给朋友或贴进钓友群。</p>
      </div>
      <button className="primary-button generate-btn" onClick={handleGenerate}>
        保存分享图
      </button>
    </div>
  )
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const background = ctx.createLinearGradient(0, 0, width, height)
  background.addColorStop(0, '#f8efe4')
  background.addColorStop(0.52, '#f1e8dc')
  background.addColorStop(1, '#e8ded1')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, width, height)

  const glowTop = ctx.createRadialGradient(112, 96, 24, 112, 96, 280)
  glowTop.addColorStop(0, 'rgba(255, 219, 194, 0.48)')
  glowTop.addColorStop(1, 'rgba(255, 219, 194, 0)')
  ctx.fillStyle = glowTop
  ctx.fillRect(0, 0, width, height)

  const glowRight = ctx.createRadialGradient(width - 92, 140, 24, width - 92, 140, 240)
  glowRight.addColorStop(0, 'rgba(188, 208, 183, 0.24)')
  glowRight.addColorStop(1, 'rgba(188, 208, 183, 0)')
  ctx.fillStyle = glowRight
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      ctx.fillRect(x, y, 1, 1)
    }
  }
}

function drawPaperShell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  roundRect(ctx, x, y, width, height, 34)
  ctx.fillStyle = 'rgba(255, 252, 247, 0.9)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(93, 111, 102, 0.12)'
  ctx.lineWidth = 1
  ctx.stroke()

  roundRect(ctx, x + 12, y + 12, width - 24, height - 24, 26)
  ctx.strokeStyle = 'rgba(93, 111, 102, 0.08)'
  ctx.stroke()
}

function drawStamp(ctx: CanvasRenderingContext2D, x: number, y: number, code: string) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, 36, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.44)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(93, 111, 102, 0.18)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#4d6358'
  ctx.font = '700 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(code, x, y + 1)
  ctx.restore()
}

function drawArtworkFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  roundRect(ctx, x, y, width, height, 28)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.48)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(93, 111, 102, 0.12)'
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawArtworkFallback(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.save()
  roundRect(ctx, x, y, width, height, 24)
  ctx.fillStyle = 'rgba(169, 193, 154, 0.14)'
  ctx.fill()

  ctx.fillStyle = 'rgba(77, 99, 88, 0.86)'
  ctx.font = '700 44px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('FBTI', x + width / 2, y + height / 2)
  ctx.restore()
}

function drawLeadCard(
  ctx: CanvasRenderingContext2D,
  options: { x: number; y: number; width: number; height: number }
) {
  ctx.save()
  roundRect(ctx, options.x, options.y, options.width, options.height, 24)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.34)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(93, 111, 102, 0.1)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = 'rgba(41, 53, 47, 0.5)'
  ctx.font = '700 12px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('结果导语', options.x + 24, options.y + 26)
  ctx.restore()
}

function drawSignatureCard(
  ctx: CanvasRenderingContext2D,
  options: { x: number; y: number; width: number; height: number }
) {
  ctx.save()
  roundRect(ctx, options.x, options.y, options.width, options.height, 22)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(93, 111, 102, 0.1)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = 'rgba(93, 111, 102, 0.22)'
  ctx.fillRect(options.x + 20, options.y + 18, 2, options.height - 36)
  ctx.restore()
}

function drawInfoCard(
  ctx: CanvasRenderingContext2D,
  options: {
    x: number
    y: number
    width: number
    height: number
    label: string
    value: string
    valueFontSize: number
    valueLineHeight: number
    maxLines: number
  }
) {
  ctx.save()
  roundRect(ctx, options.x, options.y, options.width, options.height, 20)
  ctx.fillStyle = 'rgba(255, 251, 246, 0.7)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(93, 111, 102, 0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = 'rgba(41, 53, 47, 0.46)'
  ctx.font = '700 12px sans-serif'
  ctx.fillText(options.label, options.x + 18, options.y + 26)

  const lines = wrapText(ctx, options.value, options.width - 36, {
    fontSize: options.valueFontSize,
    maxLines: options.maxLines,
    lineHeight: options.valueLineHeight,
    fontWeight: 600,
    ellipsis: true
  })

  ctx.fillStyle = '#2e3a34'
  ctx.font = `600 ${options.valueFontSize}px sans-serif`
  lines.forEach((line, index) => {
    ctx.fillText(line, options.x + 18, options.y + 56 + index * options.valueLineHeight)
  })
  ctx.restore()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    image.src = src
  })
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

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const scale = Math.max(width / image.width, height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const offsetX = x + (width - drawWidth) / 2
  const offsetY = y + (height - drawHeight) / 2

  ctx.save()
  roundRect(ctx, x, y, width, height, radius)
  ctx.clip()
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
  ctx.restore()
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  initialSize: number,
  minSize: number,
  maxWidth: number,
  fontWeight: number
) {
  let fontSize = initialSize

  while (fontSize > minSize) {
    ctx.font = `${fontWeight} ${fontSize}px sans-serif`
    if (ctx.measureText(text).width <= maxWidth) {
      return fontSize
    }
    fontSize -= 1
  }

  return minSize
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  options: {
    fontSize: number
    maxLines: number
    lineHeight: number
    fontWeight: number
    ellipsis?: boolean
  }
): string[] {
  ctx.font = `${options.fontWeight} ${options.fontSize}px sans-serif`

  const chars = text.split('')
  const lines: string[] = []
  let currentLine = ''

  for (const char of chars) {
    const testLine = currentLine + char
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = char

      if (lines.length === options.maxLines - 1) {
        break
      }
    } else {
      currentLine = testLine
    }
  }

  const remainingText = chars.slice(lines.join('').length).join('')
  const lastLine = lines.length === options.maxLines - 1 ? remainingText || currentLine : currentLine

  if (lastLine) {
    lines.push(options.ellipsis ? clampLineWithEllipsis(ctx, lastLine, maxWidth) : lastLine)
  }

  return lines.slice(0, options.maxLines)
}

function clampLineWithEllipsis(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) {
    return text
  }

  let output = text
  while (output.length > 0 && ctx.measureText(`${output}…`).width > maxWidth) {
    output = output.slice(0, -1)
  }

  return `${output}…`
}

export default ShareCard
