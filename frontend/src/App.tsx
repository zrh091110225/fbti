import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Result from './pages/Result'
import { Question, questions } from './data/questions'
import { analytics } from './utils/analytics'
import { calculatePersonality } from './utils/calculate'
import { postQuizResult } from './utils/api'
import { generateQuestionOrder, normalizeQuestionOrder } from './utils/questionOrder'
import { clearQuizState, loadQuizState, saveQuizState } from './utils/storage'
import { AppScreen, QuizAnswer } from './types/quiz'

const pageTransition = {
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: 'blur(8px)',
    transition: {
      duration: 0.28,
      ease: [0.4, 0, 1, 1]
    }
  }
} as const

function App() {
  const initialState = useMemo(() => loadQuizState(), [])
  const [screen, setScreen] = useState<AppScreen>(initialState.screen)
  const [answers, setAnswers] = useState<QuizAnswer[]>(initialState.answers)
  const [currentQuestion, setCurrentQuestion] = useState(initialState.currentQuestion)
  const [questionOrder, setQuestionOrder] = useState<number[]>(() => normalizeQuestionOrder(initialState.questionOrder))

  const orderedQuestions = useMemo(() => {
    const questionMap = new Map<number, Question>(questions.map(question => [question.id, question]))
    return questionOrder
      .map(questionId => questionMap.get(questionId))
      .filter((question): question is Question => Boolean(question))
  }, [questionOrder])

  useEffect(() => {
    analytics.trackPageView(screen)
  }, [screen])

  useEffect(() => {
    saveQuizState({ screen, answers, currentQuestion, questionOrder })
  }, [screen, answers, currentQuestion, questionOrder])

  useEffect(() => {
    if (!orderedQuestions.length) {
      return
    }

    if (currentQuestion > orderedQuestions.length - 1) {
      setCurrentQuestion(orderedQuestions.length - 1)
    }
  }, [currentQuestion, orderedQuestions.length])

  const handleStart = () => {
    analytics.trackQuizStart()
    const nextQuestionOrder = generateQuestionOrder(questions)
    setScreen('quiz')
    setAnswers([])
    setCurrentQuestion(0)
    setQuestionOrder(nextQuestionOrder)
  }

  const handleAnswer = (questionId: number, answerId: number) => {
    analytics.trackQuestionAnswer(questionId, answerId)
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId)
      return [...filtered, { questionId, answerId }]
    })
  }

  const handleFinish = () => {
    const result = calculatePersonality(answers)
    analytics.trackQuizComplete(result.personalityId)
    void postQuizResult({
      personalityId: result.personalityId,
      answers,
      completedAt: new Date().toISOString()
    })
    setScreen('result')
  }

  const handleNextQuestion = () => {
    if (currentQuestion >= orderedQuestions.length - 1) {
      handleFinish()
      return
    }

    setCurrentQuestion(prev => prev + 1)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion <= 0) {
      return
    }

    setCurrentQuestion(prev => prev - 1)
  }

  const handleRestart = () => {
    clearQuizState()
    setScreen('home')
    setAnswers([])
    setCurrentQuestion(0)
    setQuestionOrder([])
  }

  const handleExitQuiz = () => {
    clearQuizState()
    setScreen('home')
    setAnswers([])
    setCurrentQuestion(0)
    setQuestionOrder([])
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="app-shell">
        <AnimatePresence mode="wait">
          <m.div
            key={screen}
            className={`app-screen app-screen-${screen}`}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {screen === 'home' && <Home onStart={handleStart} />}
            {screen === 'quiz' && (
              <Quiz
                questions={orderedQuestions}
                currentQuestion={currentQuestion}
                answers={answers}
                onAnswer={handleAnswer}
                onExit={handleExitQuiz}
                onPrevious={handlePreviousQuestion}
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
          </m.div>
        </AnimatePresence>
      </div>
    </LazyMotion>
  )
}

export default App
