import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import { analytics } from './utils/analytics'

export interface QuizAnswer {
  questionId: number
  answerId: number
}

function App() {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'result'>('home')
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)

  useEffect(() => {
    analytics.trackPageView(screen)
  }, [screen])

  const handleStart = () => {
    analytics.trackQuizStart()
    setScreen('quiz')
    setAnswers([])
    setCurrentQuestion(0)
  }

  const handleAnswer = (questionId: number, answerId: number) => {
    analytics.trackQuestionAnswer(questionId, answerId)
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId)
      return [...filtered, { questionId, answerId }]
    })
    setCurrentQuestion(prev => prev + 1)
  }

  const handleFinish = () => {
    // Calculate personality to track
    const scores: { [key: string]: number } = {}
    answers.forEach(answer => {
      // This is a simplified tracking call
      analytics.trackQuestionAnswer(answer.questionId, answer.answerId)
    })
    
    // Track completion (we'll determine personality type based on answers)
    // For now just track that quiz was completed
    analytics.track('quiz_submit', { answerCount: answers.length })
    setScreen('result')
  }

  const handleRestart = () => {
    setScreen('home')
    setAnswers([])
    setCurrentQuestion(0)
  }

  return (
    <div className="app">
      {screen === 'home' && <Home onStart={handleStart} />}
      {screen === 'quiz' && (
        <Quiz
          currentQuestion={currentQuestion}
          answers={answers}
          onAnswer={handleAnswer}
          onFinish={handleFinish}
        />
      )}
      {screen === 'result' && (
        <Result
          answers={answers}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

export default App
