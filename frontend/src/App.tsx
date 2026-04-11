import { useEffect, useMemo, useState } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import { questions } from './data/questions'
import { analytics } from './utils/analytics'
import { calculatePersonality } from './utils/calculate'
import { postQuizResult } from './utils/api'
import { clearQuizState, loadQuizState, saveQuizState } from './utils/storage'
import { AppScreen, QuizAnswer } from './types/quiz'

function App() {
  const initialState = useMemo(() => loadQuizState(), [])
  const [screen, setScreen] = useState<AppScreen>(initialState.screen)
  const [answers, setAnswers] = useState<QuizAnswer[]>(initialState.answers)
  const [currentQuestion, setCurrentQuestion] = useState(initialState.currentQuestion)

  useEffect(() => {
    analytics.trackPageView(screen)
  }, [screen])

  useEffect(() => {
    saveQuizState({ screen, answers, currentQuestion })
  }, [screen, answers, currentQuestion])

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
  }

  const handleFinish = () => {
    const personality = calculatePersonality(answers)
    analytics.trackQuizComplete(personality.id)
    void postQuizResult({
      personalityId: personality.id,
      answers,
      completedAt: new Date().toISOString()
    })
    setScreen('result')
  }

  const handleNextQuestion = () => {
    if (currentQuestion >= questions.length - 1) {
      handleFinish()
      return
    }

    setCurrentQuestion(prev => prev + 1)
  }

  const handleRestart = () => {
    clearQuizState()
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
          onNext={handleNextQuestion}
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
