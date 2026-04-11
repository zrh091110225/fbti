import { useMemo, useState } from 'react'
import { QuizAnswer } from '../types/quiz'
import { calculatePersonality } from '../utils/calculate'
import ShareCard from '../components/ShareCard'
import './Result.css'

interface ResultProps {
  answers: QuizAnswer[]
  onRestart: () => void
}

function Result({ answers, onRestart }: ResultProps) {
  const [showShare, setShowShare] = useState(false)
  const communityUrl = import.meta.env.VITE_COMMUNITY_URL?.trim()
  
  const personality = useMemo(() => {
    return calculatePersonality(answers)
  }, [answers])

  const handleGroupClick = () => {
    if (!communityUrl) {
      window.alert('暂未配置入群链接，请先设置 VITE_COMMUNITY_URL。')
      return
    }

    window.open(communityUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="result">
      <div className="result-header">
        <div className="personality-badge">
          <span className="emoji">{personality.emoji}</span>
        </div>
        <h1 className="personality-type">{personality.name}</h1>
        <p className="personality-title">{personality.title}</p>
      </div>

      <div className="result-content">
        <div className="description-card">
          <p>{personality.description}</p>
        </div>

        <div className="traits-section">
          <h3>性格标签</h3>
          <div className="traits">
            {personality.traits.map((trait, index) => (
              <span key={index} className="trait">{trait}</span>
            ))}
          </div>
        </div>

        <div className="suggestions">
          <div className="suggestion-card">
            <span className="suggestion-icon">🎣</span>
            <div className="suggestion-content">
              <h4>最佳饵料</h4>
              <p>{personality.suitableBait}</p>
            </div>
          </div>
          <div className="suggestion-card">
            <span className="suggestion-icon">📍</span>
            <div className="suggestion-content">
              <h4>适合钓点</h4>
              <p>{personality.suitableSpot}</p>
            </div>
          </div>
        </div>

        {showShare && (
          <div className="share-section">
            <ShareCard personality={personality} />
          </div>
        )}
      </div>

      <div className="result-footer">
        {!showShare ? (
          <button className="share-btn" onClick={() => setShowShare(true)}>
            📤 生成分享图
          </button>
        ) : (
          <button className="share-btn" onClick={() => setShowShare(false)}>
            🔙 返回结果
          </button>
        )}
        <button className="restart-btn" onClick={onRestart}>
          🔄 重新测试
        </button>
        <button className="group-btn" onClick={handleGroupClick}>
          💬 {communityUrl ? '打开入群链接' : '入群链接待配置'}
        </button>
      </div>
    </div>
  )
}

export default Result
