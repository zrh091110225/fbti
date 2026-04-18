import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import processFish from '../assets/landing-fish.png'
import landingFish from '../assets/landing-fish.png'
import ScenicBackdrop from '../components/ScenicBackdrop'
import { Question } from '../data/questions'
import { QuizMotionState } from '../types/motion'
import { QuizAnswer } from '../types/quiz'
import './Quiz.css'

interface QuizProps {
  questions: Question[]
  currentQuestion: number
  answers: QuizAnswer[]
  onAnswer: (questionId: number, answerId: number) => void
  onExit: () => void
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
}

function Quiz({ questions, currentQuestion, answers, onAnswer, onExit, onPrevious, onNext, onFinish }: QuizProps) {
  const question = questions[currentQuestion]
  const prefersReducedMotion = Boolean(useReducedMotion())
  const timeoutRefs = useRef<number[]>([])
  const [isExitPromptOpen, setIsExitPromptOpen] = useState(false)
  const [motionState, setMotionState] = useState<QuizMotionState>({
    isReeling: false,
    isReleasing: false,
    isLanding: false,
    reelToken: 0,
    releaseToken: 0
  })

  if (!question) {
    return null
  }

  const progress = (currentQuestion / questions.length) * 100
  const nextProgress = Math.min(((currentQuestion + 1) / questions.length) * 100, 100)
  const selectedAnswer = answers.find(a => a.questionId === question.id)
  const isAnswered = Boolean(selectedAnswer)
  const answeredCount = answers.length
  const currentProgress = Math.max(Math.round((answeredCount / questions.length) * 100), Math.round(progress))

  const triggerAdvance = () => {
    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutRefs.current = []

    const isLastQuestion = currentQuestion >= questions.length - 1

    setMotionState(prev => ({
      ...prev,
      isReeling: true,
      reelToken: prev.reelToken + 1
    }))

    if (isLastQuestion) {
      const landingStartDelay = prefersReducedMotion ? 120 : 420
      const finishDelay = prefersReducedMotion ? 280 : 1280

      timeoutRefs.current.push(window.setTimeout(() => {
        setMotionState(prev => ({
          ...prev,
          isLanding: true
        }))
      }, landingStartDelay))

      timeoutRefs.current.push(window.setTimeout(() => {
        onFinish()
      }, finishDelay))

      return
    }

    timeoutRefs.current.push(window.setTimeout(() => {
      onNext()
    }, prefersReducedMotion ? 180 : 620))
  }

  useEffect(() => {
    setMotionState({
      isReeling: false,
      isReleasing: false,
      isLanding: false,
      reelToken: 0,
      releaseToken: 0
    })
  }, [question.id])

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

  const handleOptionClick = (optionId: number) => {
    if (motionState.isReeling || motionState.isReleasing || motionState.isLanding) {
      return
    }

    onAnswer(question.id, optionId)

    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutRefs.current = []
    timeoutRefs.current.push(window.setTimeout(() => {
      triggerAdvance()
    }, prefersReducedMotion ? 90 : 300))
  }

  const handleNext = () => {
    if (!isAnswered || motionState.isReeling || motionState.isReleasing || motionState.isLanding) {
      return
    }
    triggerAdvance()
  }

  const handlePrevious = () => {
    if (currentQuestion <= 0 || motionState.isReeling || motionState.isReleasing || motionState.isLanding) {
      return
    }

    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutRefs.current = []

    setMotionState(prev => ({
      ...prev,
      isReleasing: true,
      releaseToken: prev.releaseToken + 1
    }))

    timeoutRefs.current.push(window.setTimeout(() => {
      onPrevious()
    }, prefersReducedMotion ? 120 : 420))
  }

  const handleOpenExitPrompt = () => {
    if (motionState.isReeling || motionState.isLanding) {
      return
    }

    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutRefs.current = []
    setIsExitPromptOpen(true)
  }

  const handleCloseExitPrompt = () => {
    setIsExitPromptOpen(false)
  }

  const handleConfirmExit = () => {
    setIsExitPromptOpen(false)
    onExit()
  }

  return (
    <div className="page page-quiz">
      <ScenicBackdrop variant="quiz" />
      <div className="page-shell quiz-shell">
        <section className={`quiz-frame surface surface-strong ${motionState.isReeling ? 'is-reeling' : ''}`}>
          <AnimatePresence>
            {isExitPromptOpen && (
              <ExitPrompt
                answeredCount={answeredCount}
                totalQuestions={questions.length}
                currentQuestion={currentQuestion + 1}
                progress={currentProgress}
                prefersReducedMotion={prefersReducedMotion}
                onCancel={handleCloseExitPrompt}
                onConfirm={handleConfirmExit}
              />
            )}
            {motionState.isLanding && (
              <LandingCatchOverlay prefersReducedMotion={prefersReducedMotion} />
            )}
          </AnimatePresence>

          <div className="quiz-header">
            <div className="quiz-heading-group">
              <span className="section-label">Question Flow</span>
              <h1 className="quiz-heading">跟着自己内心和自觉选择</h1>
              <p className="quiz-subtitle">
                每题只选一个最贴且的答案，就像去钓鱼一样自然~
              </p>
            </div>
            <div className="question-counter">
              <span className="current">{currentQuestion + 1}</span>
              <span className="separator">/</span>
              <span className="total">{questions.length}</span>
            </div>
          </div>

          <ProgressFish
            progress={progress}
            nextProgress={nextProgress}
            prefersReducedMotion={prefersReducedMotion}
            isReeling={motionState.isReeling}
            isLanding={motionState.isLanding}
            reelToken={motionState.reelToken}
          />

          <div className="quiz-layout">
            <div className="quiz-card surface">

              <span className="question-label">
                第 {currentQuestion + 1} 题
              </span>
              <h2 className="question-text">{question.text}</h2>


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
                      whileHover={motionState.isReeling || motionState.isLanding ? undefined : { y: -2 }}
                      whileTap={{ scale: 0.985 }}
                      disabled={motionState.isReeling || motionState.isLanding}
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
          </div>

          <div className="quiz-footer">
            <div className="quiz-action-group">
              <button
                className={`quiz-nav-button quiz-nav-button-secondary ${motionState.isReleasing ? 'is-active' : ''}`}
                onClick={handlePrevious}
                disabled={currentQuestion <= 0 || motionState.isReeling || motionState.isReleasing || motionState.isLanding}
              >
                <m.span
                  className="quiz-nav-button__label"
                  aria-hidden="true"
                  animate={
                    motionState.isReleasing
                      ? { scale: prefersReducedMotion ? 1 : [1, 1.03, 1], opacity: [0.88, 1, 0.92] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.01 }
                      : { duration: 0.42, ease: 'easeInOut', repeat: 0 }
                  }
                >
                  <m.span
                    key={motionState.releaseToken}
                    className="quiz-nav-button__reel-icon"
                    animate={motionState.isReleasing ? { rotate: prefersReducedMotion ? 0 : -360 } : { rotate: 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.01 }
                        : {
                            duration: 0.7,
                            ease: 'linear'
                          }
                    }
                  >
                    <ReelIcon />
                  </m.span>
                  放线(上一题)
                </m.span>
              </button>

              <button
                className={`quiz-nav-button quiz-nav-button-primary ${motionState.isReeling || motionState.isLanding ? 'is-active' : ''}`}
                onClick={handleNext}
                disabled={!isAnswered || motionState.isReeling || motionState.isReleasing || motionState.isLanding}
              >
                <m.span
                  className="quiz-nav-button__label"
                  aria-hidden="true"
                  animate={
                    motionState.isReeling || motionState.isLanding
                      ? { scale: prefersReducedMotion ? 1 : [1, 1.03, 1], opacity: [0.88, 1, 0.92] }
                      : { scale: 1, opacity: 1 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.01 }
                      : { duration: 0.42, ease: 'easeInOut', repeat: motionState.isLanding ? 0 : 1 }
                  }
                >
                  <m.span
                    className="quiz-nav-button__reel-icon"
                    animate={
                      motionState.isReeling
                        ? { rotate: prefersReducedMotion ? 0 : 360 }
                        : motionState.isLanding
                          ? { rotate: prefersReducedMotion ? 0 : 180 }
                          : { rotate: 0 }
                    }
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.01 }
                        : {
                            duration: motionState.isLanding ? 0.5 : 0.7,
                            ease: 'linear'
                          }
                    }
                  >
                    <ReelIcon />
                  </m.span>
                  收线(下一题)
                </m.span>
              </button>

              <button
                  className="quiz-nav-button quiz-nav-button-home"
                  onClick={handleOpenExitPrompt}
                  disabled={motionState.isReeling || motionState.isReleasing || motionState.isLanding}
              >
                回到首页
              </button>

            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function ReelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="2" x2="10" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="14" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ExitPrompt({
  answeredCount,
  totalQuestions,
  currentQuestion,
  progress,
  prefersReducedMotion,
  onCancel,
  onConfirm
}: {
  answeredCount: number
  totalQuestions: number
  currentQuestion: number
  progress: number
  prefersReducedMotion: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <m.div
      className="quiz-dialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.12 : 0.2 }}
    >
      <m.div
        className="quiz-dialog surface"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, scale: prefersReducedMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8, scale: prefersReducedMotion ? 1 : 0.98 }}
        transition={{ duration: prefersReducedMotion ? 0.12 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-exit-title"
      >
        <span className="question-label">退出确认</span>
        <h2 id="quiz-exit-title" className="quiz-dialog__title">是否放弃当前 FBTI 测试？</h2>
        <p className="quiz-dialog__copy">放弃后，当前答题记录和随机题序都会被清空。</p>
        <p className="quiz-dialog__copy">不过也没关系，再测一次就像钓鱼一样再甩一杆简单。</p>
        <div className="quiz-dialog__stats">
          <div className="quiz-dialog__stat">
            <span>当前进度</span>
            <strong>{progress}%</strong>
          </div>
          <div className="quiz-dialog__stat">
            <span>已答题数</span>
            <strong>{answeredCount} / {totalQuestions}</strong>
          </div>
          <div className="quiz-dialog__stat">
            <span>当前题目</span>
            <strong>第 {currentQuestion} 题</strong>
          </div>
        </div>

        <div className="quiz-dialog__actions">
          <button className="quiz-nav-button quiz-nav-button-secondary" onClick={onCancel}>
            继续测试
          </button>
          <button className="quiz-nav-button quiz-nav-button-home" onClick={onConfirm}>
            确认放弃
          </button>
        </div>
      </m.div>
    </m.div>
  )
}

function ProgressFish({
  progress,
  nextProgress,
  prefersReducedMotion,
  isReeling,
  isLanding,
  reelToken
}: {
  progress: number
  nextProgress: number
  prefersReducedMotion: boolean
  isReeling: boolean
  isLanding: boolean
  reelToken: number
}) {
  const renderedProgress = isLanding || isReeling ? nextProgress : progress

  return (
    <div className="reel-progress" aria-hidden="true">
      <div className="reel-progress__lane">
        <div className="reel-progress__line" />
        <m.div
          className="reel-progress__tension"
          initial={false}
          animate={{ width: `calc(${100 - renderedProgress}% + 16px)` }}
          transition={
            prefersReducedMotion
              ? { duration: 0.12, ease: 'linear' }
              : { type: 'spring', stiffness: 170, damping: 26 }
          }
        />
        <m.div
          className={`reel-progress__fish ${isLanding ? 'is-hidden' : ''}`}
          initial={false}
          animate={{ left: `calc(${renderedProgress}% - 40px)` }}
          transition={
            prefersReducedMotion
              ? { duration: 0.12, ease: 'linear' }
              : { type: 'spring', stiffness: 180, damping: 24 }
          }
        >
          <m.div
            className="reel-progress__fish-body"
            animate={
              prefersReducedMotion
                ? { y: 0, rotate: 0 }
                : isReeling
                  ? { y: [0, -2, 0, 2, 0], rotate: [0, -4, 0, 4, 0], scale: [1, 1.03, 1] }
                  : { y: [0, -3, 0, 2, 0], rotate: [0, -2, 1, 2, 0] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.01 }
                : { duration: isReeling ? 0.82 : 2.8, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <span className="reel-progress__wake" />
            <span className="reel-progress__bubble reel-progress__bubble--one" />
            <span className="reel-progress__bubble reel-progress__bubble--two" />
            <span className="reel-progress__bubble reel-progress__bubble--three" />
            <img src={processFish} alt="" className="reel-progress__fish-icon" draggable={false} />
          </m.div>
        </m.div>
      </div>

      <div className={`reel-progress__reel ${isReeling || isLanding ? 'is-active' : ''}`}>
        <m.div
          key={reelToken}
          className="reel-progress__spool"
          animate={
            isReeling || isLanding
              ? { rotate: prefersReducedMotion ? 0 : [0, 120, 240, 360, 480] }
              : { rotate: 0 }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0.01 }
              : { duration: isLanding ? 1.1 : 0.62, ease: 'linear', repeat: isLanding ? 0 : 1 }
          }
        >
          <span className="reel-progress__spoke reel-progress__spoke--one" />
          <span className="reel-progress__spoke reel-progress__spoke--two" />
        </m.div>
        <span className="reel-progress__handle" />
      </div>
    </div>
  )
}

function LandingCatchOverlay({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <m.div
      className="landing-catch"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.12 : 0.24 }}
    >
      <svg className="landing-catch__line" viewBox="0 0 720 420" preserveAspectRatio="none">
        <m.path
          d="M610 22C602 74 580 142 525 190C474 236 395 274 296 330"
          fill="none"
          stroke="rgba(197, 238, 211, 0.85)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.14 : 0.48, ease: 'easeOut' }}
        />
      </svg>

      <m.div
        className="landing-catch__fish"
        initial={{ x: 120, y: 90, rotate: 6, scale: 0.92, opacity: 0 }}
        animate={
          prefersReducedMotion
            ? { x: 0, y: -120, rotate: -18, scale: 1.08, opacity: 1 }
            : { x: [120, 48, -26], y: [90, -22, -182], rotate: [6, -12, -28], scale: [0.92, 1.04, 1.14], opacity: [0, 1, 1] }
        }
        transition={{ duration: prefersReducedMotion ? 0.24 : 0.84, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={landingFish} alt="" className="landing-catch__fish-icon" draggable={false} />
      </m.div>

      <m.div
        className="landing-catch__splash"
        initial={{ scale: 0.4, opacity: 0.55 }}
        animate={{ scale: prefersReducedMotion ? 1 : 1.7, opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.18 : 0.58, ease: 'easeOut' }}
      />

      <m.div
        className="landing-catch__copy"
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0.04 : 0.22, duration: prefersReducedMotion ? 0.14 : 0.32 }}
      >
        起鱼成功
      </m.div>
    </m.div>
  )
}

export default Quiz
