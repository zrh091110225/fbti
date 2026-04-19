import { ReactNode } from 'react'
import { m } from 'framer-motion'
import AxisRadarChart from './AxisRadarChart'
import { getPersonalityArtwork } from '../data/personalityArtworks'
import { PersonalityType } from '../data/personalities'
import { AxisBreakdown } from '../utils/calculate'
import { getTagPalette } from '../utils/tagPalette'

interface ResultPageContentProps {
  personality: PersonalityType
  axisBreakdown: AxisBreakdown[]
  dynamicTags: string[]
  extraContent?: ReactNode
  actions?: ReactNode
  enableMotion?: boolean
}

function ResultPageContent({
  personality,
  axisBreakdown,
  extraContent,
  actions,
  enableMotion = true
}: ResultPageContentProps) {
  const artwork = getPersonalityArtwork(personality.id)

  const artworkCard = (
    <div className="result-artwork-frame">
      <div className="result-artwork-visual">
        <img
          src={artwork}
          alt={`${personality.name}的场景插画`}
          className="result-artwork-image"
        />
        <p className="result-signature">{personality.signature}</p>
      </div>
    </div>
  )

  const identityContent = (
    <>
      <span className="result-overline">钓鱼人格</span>
      <div className="result-name-row">
        <div>
          <h1 className="personality-type">{personality.name} · {personality.id} </h1>
          <p className="personality-title">{personality.title}</p>
        </div>
      </div>

      <div className="result-chip-group result-chip-group-secondary">
        {personality.traits.map((trait, index) => {
          const palette = getTagPalette(index)
          return (
            <span
              key={trait}
              className="trait trait-secondary"
              style={{
                background: palette.mistBg,
                borderColor: palette.mistBorder,
                color: palette.mistText
              }}
            >
              {trait}
            </span>
          )
        })}
      </div>
    </>
  )

  return (
    <div className="page-shell result-shell">
      <section className="result-canvas">
        <div className="result-header">
          <span className="result-kicker">FBTI Result</span>
          <span className="result-stamp">{personality.id}</span>
        </div>

        <div className="result-hero">
          {enableMotion ? (
            <m.figure
              className="result-artwork-card"
              initial={{ opacity: 0, y: 24, rotate: -1.2 }}
              animate={{ opacity: 1, y: 0, rotate: -1.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {artworkCard}
            </m.figure>
          ) : (
            <figure className="result-artwork-card">
              {artworkCard}
            </figure>
          )}

          {enableMotion ? (
            <m.div
              className="result-identity"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {identityContent}
            </m.div>
          ) : (
            <div className="result-identity">
              {identityContent}
            </div>
          )}
        </div>

        <div className="result-detail-grid">
          <article className="result-note result-note-reading">
            <span className="content-label">性格解读</span>
            <p>{personality.description}</p>
          </article>

          <article className="result-note result-note-scene">
            <span className="content-label">代表场景</span>
            <p>{personality.scene}</p>
          </article>

          <article className="result-note result-note-profile">
            <span className="content-label">人格坐标</span>

            <AxisRadarChart axisBreakdown={axisBreakdown} />
          </article>
        </div>

        {extraContent}
        {actions}
      </section>
    </div>
  )
}

export default ResultPageContent
