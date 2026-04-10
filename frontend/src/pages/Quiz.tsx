import { questions, QuizAnswer } from '../data/questions'
import './Quiz.css'

interface QuizProps {
  currentQuestion: number
  answers: QuizAnswer[]
  onAnswer: (questionId: number, answerId: number) => void
  onFinish: () => void
}

function Quiz({ currentQuestion, answers, onAnswer, onFinish }: QuizProps) {
  const question = questions[currentQuestion]
  const progress = ((currentQuestion) / questions.length) * 100
  const isAnswered = answers.some(a => a.questionId === question.id)

  const handleOptionClick = (optionId: number) => {
    onAnswer(question.id, optionId)
  }

  const handleNext = () => {
    if (currentQuestion >= questions.length - 1) {
      onFinish()
    }
  }

  if (currentQuestion >= questions.length) {
    return null
  }

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="question-counter">
          <span className="current">{currentQuestion + 1}</span>
          <span className="separator">/</span>
          <span className="total">{questions.length}</span>
        </div>
      </div>

      <div className="quiz-content">
        <h2 className="question-text">{question.text}</h2>

        <div className="options">
          {question.options.map((option) => {
            const isSelected = answers.some(
              a => a.questionId === question.id && a.answerId === option.id
            )
            return (
              <button
                key={option.id}
                className={`option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option.id)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + option.id - 1)}
                </span>
                <span className="option-text">{option.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="quiz-footer">
          <button className="next-btn" onClick={handleNext}>
            {currentQuestion >= questions.length - 1 ? '查看结果' : '下一题'}
            <span className="arrow">→</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Quiz
