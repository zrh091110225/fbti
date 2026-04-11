import { m } from 'framer-motion'
import { questions } from '../data/questions'
import { QuizAnswer } from '../types/quiz'
import './Quiz.css'

interface QuizProps {
  currentQuestion: number
  answers: QuizAnswer[]
  onAnswer: (questionId: number, answerId: number) => void
  onNext: () => void
  onFinish: () => void
}

function Quiz({ currentQuestion, answers, onAnswer, onNext, onFinish }: QuizProps) {
  const question = questions[currentQuestion]

  if (!question) {
    return null
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const selectedAnswer = answers.find(a => a.questionId === question.id)
  const isAnswered = Boolean(selectedAnswer)

  const handleOptionClick = (optionId: number) => {
    onAnswer(question.id, optionId)
  }

  const handleNext = () => {
    if (currentQuestion >= questions.length - 1) {
      onFinish()
      return
    }
    onNext()
  }

  return (
    <div className="page page-quiz">
      <div className="page-shell quiz-shell">
        <section className="quiz-frame surface surface-strong">
          <div className="quiz-header">
            <div className="quiz-heading-group">
              <span className="section-label">Question Flow</span>
              <h1 className="quiz-heading">保持第一直觉，别把题目做成策略题。</h1>
              <p className="quiz-subtitle">
                每题只选一个最像你的答案，系统会自动记录当前进度。
              </p>
            </div>
            <div className="question-counter">
              <span className="current">{currentQuestion + 1}</span>
              <span className="separator">/</span>
              <span className="total">{questions.length}</span>
            </div>
          </div>

          <div className="progress-bar" aria-hidden="true">
            <m.div
              className="progress-fill"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 140, damping: 22 }}
            />
          </div>

          <div className="quiz-layout">
            <div className="quiz-card surface">
              <span className="question-label">
                第 {currentQuestion + 1} 题
              </span>
              <h2 className="question-text">{question.text}</h2>
              <p className="question-note">选择你最可能做出的反应，而不是理想答案。</p>

              <div className="options">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer?.answerId === option.id

                  return (
                    <m.button
                      key={option.id}
                      className={`option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleOptionClick(option.id)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.06 * index,
                        duration: 0.36,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + option.id - 1)}
                      </span>
                      <span className="option-text">{option.text}</span>
                    </m.button>
                  )
                })}
              </div>
            </div>

            <aside className="quiz-sidebar">
              <div className="quiz-side-card surface">
                <span className="side-card-label">当前状态</span>
                <strong>{isAnswered ? '已选择答案' : '等待选择'}</strong>
                <p>
                  {isAnswered
                    ? '可以直接进入下一题，系统已记录本题答案。'
                    : '先完成这一题，再继续后面的进度。'}
                </p>
              </div>

              <div className="quiz-side-card surface">
                <span className="side-card-label">测试节奏</span>
                <strong>{Math.round(progress)}% 已完成</strong>
                <p>共 16 题，越凭直觉作答，结果越像你真实的作钓风格。</p>
              </div>
            </aside>
          </div>

          <div className="quiz-footer">
            <p className="quiz-footer-copy">
              {currentQuestion >= questions.length - 1
                ? '这是最后一题，提交后会立即生成结果。'
                : `完成本题后，还剩 ${questions.length - currentQuestion - 1} 题。`}
            </p>
            <button className="primary-button next-btn" onClick={handleNext} disabled={!isAnswered}>
              {currentQuestion >= questions.length - 1 ? '查看结果' : '下一题'}
              <span className="button-arrow">→</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Quiz
