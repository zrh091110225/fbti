import { m } from 'framer-motion'
import ScenicBackdrop from '../components/ScenicBackdrop'
import { questions } from '../data/questions'
import './Home.css'

interface HomeProps {
  onStart: () => void
}

function Home({ onStart }: HomeProps) {
  return (
    <div className="page page-home">
      <ScenicBackdrop variant="home" />
      <div className="page-shell home-shell">
        <div className="home-grid">
          <m.section
            className="home-hero surface surface-strong"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-label">Fishing Behavior Type Indicator</span>

            <div className="brand-mark">FBTI</div>
            <div className="home-hero-fishing-line" />

            <h1 className="home-title">
              用 <span className="eyebrow-number">{questions.length}</span> 个问题，
              测出你的钓鱼人格。
            </h1>

            <p className="home-description">
              围绕投入方式、社交取向、玩法偏好和价值导向四个维度，
              整理出你在水边最稳定的行为模式，最后拼成一份 16 型人格画像。
            </p>

            <div className="home-metrics">
              <div className="metric-chip">
                <span className="metric-value">2 分钟</span>
                <span className="metric-label">完成测试</span>
              </div>
              <div className="metric-chip">
                <span className="metric-value">{questions.length} 题</span>
                <span className="metric-label">完整作答</span>
              </div>
              <div className="metric-chip">
                <span className="metric-value">中断可续</span>
                <span className="metric-label">自动保存</span>
              </div>
            </div>

            <div className="home-actions">
              <button className="primary-button home-start-button" onClick={onStart}>
                开始测试
                <span className="button-arrow">→</span>
              </button>
              <p className="home-footnote">建议用第一直觉作答，结果会更稳定。</p>
            </div>
          </m.section>

          <m.aside
            className="home-sidebar surface"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.58, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sidebar-block">
              <span className="section-label">What You Get</span>
              <div className="sidebar-stat-grid">
                <div className="sidebar-stat-card">
                  <span className="sidebar-stat-value">{questions.length}</span>
                  <span className="sidebar-stat-title">道问题</span>
                  <p>每个维度 4 题，专门测投入、社交、玩法和价值导向。</p>
                </div>
                <div className="sidebar-stat-card">
                  <span className="sidebar-stat-value">16</span>
                  <span className="sidebar-stat-title">种人格</span>
                  <p>从黑坑控局人到快乐搭子，每一型都由四维组合生成。</p>
                </div>
              </div>
            </div>

            <div className="sidebar-block sidebar-list">
              <div className="sidebar-list-item">
                <span>01</span>
                <p>结果页会给出你的核心标签与推荐作钓方向。</p>
              </div>
              <div className="sidebar-list-item">
                <span>02</span>
                <p>支持一键生成分享图，方便转发到钓友群。</p>
              </div>
              <div className="sidebar-list-item">
                <span>03</span>
                <p>整体流程以移动端优先设计，单手浏览也顺畅。</p>
              </div>
            </div>
          </m.aside>
        </div>
      </div>
    </div>
  )
}

export default Home
