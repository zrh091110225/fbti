import sceneBase from '../assets/scene-base.svg'
import sceneWaterHighlight from '../assets/scene-water-highlight.svg'
import sceneWaterMask from '../assets/scene-water-mask.svg'
import { SceneLayerConfig } from '../types/scene'
import './ScenicBackdrop.css'

interface ScenicBackdropProps {
  variant: 'home' | 'quiz'
}

const sceneLayers: SceneLayerConfig[] = [
  {
    key: 'scene-base',
    src: sceneBase,
    alt: '湖面与山景场景背景',
    className: 'scenic-backdrop__image scenic-backdrop__image--base'
  }
]

function ScenicBackdrop({ variant }: ScenicBackdropProps) {
  const waterMaskStyle = {
    maskImage: `url(${sceneWaterMask})`,
    WebkitMaskImage: `url(${sceneWaterMask})`,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskSize: 'cover',
    WebkitMaskSize: 'cover',
    maskPosition: 'center',
    WebkitMaskPosition: 'center'
  } as const

  return (
    <div className={`scenic-backdrop scenic-backdrop--${variant}`} aria-hidden="true">
      <div className="scenic-backdrop__viewport">
        {sceneLayers.map((layer) => (
          <img
            key={layer.key}
            src={layer.src}
            alt={layer.alt}
            className={layer.className}
            draggable={false}
          />
        ))}

        <div className="scenic-backdrop__water" style={waterMaskStyle}>
          <div
            className="scenic-backdrop__water-wave scenic-backdrop__water-wave--primary"
            style={{ backgroundImage: `url(${sceneWaterHighlight})` }}
          />
          <div
            className="scenic-backdrop__water-wave scenic-backdrop__water-wave--secondary"
            style={{ backgroundImage: `url(${sceneWaterHighlight})` }}
          />
          <div className="scenic-backdrop__water-sheen" />
        </div>

        <div className="scenic-backdrop__veil scenic-backdrop__veil--top" />
        <div className="scenic-backdrop__veil scenic-backdrop__veil--bottom" />
        <div className="scenic-backdrop__veil scenic-backdrop__veil--side" />
        <div className="scenic-backdrop__grain" />
      </div>
    </div>
  )
}

export default ScenicBackdrop
