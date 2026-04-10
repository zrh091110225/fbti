import './Home.css'

interface HomeProps {
  onStart: () => void
}

function Home({ onStart }: HomeProps) {
  return (
    <div className="home">
      <div className="home-bg">
        <div className="bubbles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bubble" />
          ))}
        </div>
      </div>
      
      <div className="home-content">
        <div className="logo-section">
          <div className="fish-icon">🎣</div>
          <h1 className="title">FBTI</h1>
          <p className="subtitle">钓鱼人大性格测试</p>
        </div>

        <div className="intro-card">
          <h2>你是哪种钓鱼人？</h2>
          <p>
            通过12道趣味选择题，探索你的钓鱼性格类型。
            不管你是野钓高手、黑坑达人还是路亚爱好者，
            都能在这里找到属于你的性格画像。
          </p>
        </div>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-num">12</span>
            <span className="stat-label">道题目</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">8</span>
            <span className="stat-label">种人格</span>
          </div>
        </div>

        <button className="start-btn" onClick={onStart}>
          开始测试
          <span className="arrow">→</span>
        </button>

        <p className="time-hint">⏱️ 约需 2 分钟</p>
      </div>
    </div>
  )
}

export default Home
