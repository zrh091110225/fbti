import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import ScenicBackdrop from '../components/ScenicBackdrop'
import { questions } from '../data/questions'
import { QuizMotionState } from '../types/motion'
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
  const prefersReducedMotion = Boolean(useReducedMotion())
  const reelTimeoutRef = useRef<number | null>(null)
  const [motionState, setMotionState] = useState<QuizMotionState>({
    castOptionId: null,
    castToken: 0,
    isReeling: false
  })

  if (!question) {
    return null
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const selectedAnswer = answers.find(a => a.questionId === question.id)
  const isAnswered = Boolean(selectedAnswer)

  useEffect(() => {
    setMotionState({
      castOptionId: selectedAnswer?.answerId ?? null,
      castToken: 0,
      isReeling: false
    })
  }, [question.id, selectedAnswer?.answerId])

  useEffect(() => {
    return () => {
      if (reelTimeoutRef.current) {
        window.clearTimeout(reelTimeoutRef.current)
      }
    }
  }, [])

  const handleOptionClick = (optionId: number) => {
    if (motionState.isReeling) {
      return
    }

    onAnswer(question.id, optionId)
    setMotionState(prev => ({
      ...prev,
      castOptionId: optionId,
      castToken: prev.castToken + 1
    }))
  }

  const handleNext = () => {
    if (!isAnswered || motionState.isReeling) {
      return
    }

    setMotionState(prev => ({
      ...prev,
      isReeling: true
    }))

    reelTimeoutRef.current = window.setTimeout(() => {
      if (currentQuestion >= questions.length - 1) {
        onFinish()
        return
      }

      onNext()
    }, prefersReducedMotion ? 120 : 540)
  }

  return (
    <div className="page page-quiz">
      <ScenicBackdrop variant="quiz" />
      <div className="page-shell quiz-shell">
        <section className={`quiz-frame surface surface-strong ${motionState.isReeling ? 'is-reeling' : ''}`}>
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

          <ProgressFish progress={progress} prefersReducedMotion={prefersReducedMotion} />

          <div className="quiz-layout">
            <div className="quiz-card surface">
              <AnimatePresence>
                {motionState.isReeling && (
                  <m.div
                    className="quiz-reel-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.12 : 0.24 }}
                  >
                    <svg className="quiz-reel-line" viewBox="0 0 420 240" preserveAspectRatio="none">
                      <m.path
                        d="M18 202C84 162 176 134 252 116C319 99 364 73 402 32"
                        fill="none"
                        stroke="rgba(197, 238, 211, 0.9)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        exit={{ pathLength: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.12 : 0.42, ease: 'easeOut' }}
                      />
                    </svg>
                  </m.div>
                )}
              </AnimatePresence>

              <span className="question-label">
                第 {currentQuestion + 1} 题
              </span>
              <h2 className="question-text">{question.text}</h2>
              <p className="question-note">选择你最可能做出的反应，而不是理想答案。</p>

              <div className="options">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer?.answerId === option.id
                  const showCastEffect = isSelected && motionState.castOptionId === option.id

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
                      whileHover={motionState.isReeling ? undefined : { y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      disabled={motionState.isReeling}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + option.id - 1)}
                      </span>
                      <span className="option-copy">
                        <span className="option-text">{option.text}</span>
                        <span className="option-hint">
                          {isSelected ? '已落点，准备提竿' : '点击抛竿到这个落点'}
                        </span>
                      </span>

                      <AnimatePresence>
                        {showCastEffect && (
                          <m.span
                            key={`${option.id}-${motionState.castToken}`}
                            className="option-cast-effect"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: prefersReducedMotion ? 0.12 : 0.18 }}
                          >
                            <svg className="option-cast-line" viewBox="0 0 320 120" preserveAspectRatio="none">
                              <m.path
                                d="M18 92C96 30 168 16 278 68"
                                fill="none"
                                stroke="rgba(197, 238, 211, 0.82)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                exit={{ pathLength: 0 }}
                                transition={{
                                  duration: prefersReducedMotion ? 0.12 : 0.34,
                                  ease: 'easeOut'
                                }}
                              />
                            </svg>
                            <m.span
                              className="option-ripple"
                              initial={{ scale: 0.55, opacity: 0.6 }}
                              animate={{ scale: prefersReducedMotion ? 1 : 1.45, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: prefersReducedMotion ? 0.12 : 0.42, ease: 'easeOut' }}
                            />
                          </m.span>
                        )}
                      </AnimatePresence>
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
            <button className="primary-button next-btn" onClick={handleNext} disabled={!isAnswered || motionState.isReeling}>
              {currentQuestion >= questions.length - 1 ? '查看结果' : '下一题'}
              <span className="button-arrow">→</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

function ProgressFish({
  progress,
  prefersReducedMotion
}: {
  progress: number
  prefersReducedMotion: boolean
}) {
  return (
    <div className="fish-progress" aria-hidden="true">
      <div className="fish-progress__track">
        <div className="fish-progress__line" />
        <m.div
          className="fish-progress__swimmer"
          initial={false}
          animate={{ left: `calc(${progress}% - 24px)` }}
          transition={
            prefersReducedMotion
              ? { duration: 0.12, ease: 'linear' }
              : { type: 'spring', stiffness: 180, damping: 24 }
          }
        >
          <m.div
            className="fish-progress__body"
            animate={prefersReducedMotion ? { y: 0, rotate: 0 } : { y: [0, -3, 0, 2, 0], rotate: [0, -2, 1, 2, 0] }}
            transition={
              prefersReducedMotion
                ? { duration: 0.01 }
                : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <span className="fish-progress__wake" />
            <svg viewBox="0 0 72 42" className="fish-progress__icon">
              <path d="M7 21C14 13 25 8 37 8C46 8 54 11 61 17L66 14V28L61 25C54 31 46 34 37 34C25 34 14 29 7 21Z" fill="#BFE9CB" />
              <path d="M21 21C25 17 31 15 37 15C42 15 47 16 51 19C47 23 42 27 37 27C31 27 25 25 21 21Z" fill="#6FB98F" />
              <circle cx="49.5" cy="19.5" r="2.5" fill="#0C1C24" />
            </svg>
          </m.div>
        </m.div>
      </div>
    </div>
  )
}

export default Quiz
