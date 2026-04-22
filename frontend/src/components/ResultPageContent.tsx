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
  badgeMode?: boolean
}

function ResultPageContent({
  personality,
  axisBreakdown,
  extraContent,
  actions,
  enableMotion = true,
  badgeMode = false
}: ResultPageContentProps) {
  const artwork = getPersonalityArtwork(personality.id)

  // ── Badge Mode: Identity Card layout ──────────────────────
  if (badgeMode) {
    return (
      <div className="page-shell result-shell result-shell--badge">
        {/* ── Header: logo + personality code badge ── */}
        <header className="badge-header">
          <div className="badge-header__logo">
            <div className="badge-header__logo-icon">F</div>
            <span>FBTI</span>
          </div>
          <div className="badge-header__code">{personality.id}</div>
        </header>

        {/* ── Artwork ── */}
        <div className="badge-artwork-section">
          <div className="badge-artwork-frame">
            <div className="badge-artwork-visual">
              <img
                src={artwork}
                alt={`${personality.name}的场景插画`}
                className="badge-artwork-image"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>

        {/* ── Identity ── */}
        <div className="badge-identity">
          <span className="badge-identity__overline">钓鱼人格</span>
          <h1 className="badge-identity__name">{personality.name}</h1>
          <p className="badge-identity__subtitle">
            {personality.id} · {personality.title}
          </p>
        </div>

        {/* ── Trait badges ── */}
        <div className="badge-traits">
          {personality.traits.map((trait, index) => {
            const palette = getTagPalette(index)
            return (
              <span
                key={trait}
                className="badge-trait"
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

        {/* ── Signature ── */}
        <div className="badge-signature">
          <p className="badge-signature__text">{personality.signature}</p>
        </div>

        {/* ── Footer (QR + link) passed via extraContent ── */}
        {extraContent}
      </div>
    )
  }

  // ── Normal Mode: Full result page ─────────────────────────
  const artworkCard = (
    <div className="result-artwork-frame">
      <div className="result-artwork-visual">
        <img
          src={artwork}
          alt={`${personality.name}的场景插画`}
          className="result-artwork-image"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
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
          <span className="result-kicker">FBTI 钓鱼人格测试结果</span>
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