import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import DragMatch from '../../../components/UI/DragMatch.jsx'
import ThemeToggle from '../../../components/UI/ThemeToggle.jsx'
import { ArrowLeft, Clock3, ChevronRight, ShieldCheck, Sparkles, ZoomIn, X } from 'lucide-react'

export default function ExamMode() {
  const navigate = useNavigate()
  const { state, answerQuestion, nextQuestion } = useApp()
  const questions = state.examQuestions
  const idx = state.currentQuestionIndex
  const q = questions[idx]

  const totalSeconds = useMemo(() => Math.max(1, (state.examSettings?.timer || 90) * 60), [state.examSettings?.timer])
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const intervalRef = useRef(null)

  const defaultPng = q?.hasImage ? (q.imagePath || `/question-${q.id}.png`) : ''
  const [imgSrc, setImgSrc] = useState(defaultPng)
  const [imageZoomed, setImageZoomed] = useState(false)
  const [selected, setSelected] = useState(state.userAnswers[q?.id] || [])

  useEffect(() => {
    if (!questions.length) {
      navigate('/exam')
      return
    }
    intervalRef.current = setInterval(() => setSecondsLeft(prev => prev - 1), 1000)
    return () => clearInterval(intervalRef.current)
  }, [questions.length, navigate])

  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(intervalRef.current)
      navigate('/exam/result')
    }
  }, [secondsLeft, navigate])

  useEffect(() => {
    setImgSrc(defaultPng)
    setImageZoomed(false)
    setSelected(state.userAnswers[q?.id] || [])
  }, [defaultPng, q?.id, state.userAnswers])

  if (!q) return null

  const isDrag = q.type === 'drag-drop'
  const isMulti = !isDrag && Array.isArray(q.correctAnswer) && q.correctAnswer.length > 1

  const onImgError = () => {
    if (!imgSrc) return
    if (imgSrc.endsWith('.png')) setImgSrc(imgSrc.replace('.png', '.jpg'))
    else if (imgSrc.endsWith('.jpg')) setImgSrc(imgSrc.replace('.jpg', '.jpeg'))
    else if (imgSrc.endsWith('.jpeg')) setImgSrc(imgSrc.replace('.jpeg', '.webp'))
  }

  const onSelect = (key) => {
    if (isDrag) return
    if (isMulti) {
      const exists = selected.includes(key)
      const next = exists ? selected.filter(k => k !== key) : [...selected, key]
      setSelected(next)
      answerQuestion(q.id, next)
    } else {
      const next = [key]
      setSelected(next)
      answerQuestion(q.id, next)
    }
  }

  const handleExit = () => {
    const confirmExit = window.confirm('Exit the exam? Your progress will be lost.')
    if (!confirmExit) return
    clearInterval(intervalRef.current)
    navigate('/exam')
  }

  const goNext = () => {
    if (idx >= questions.length - 1) {
      clearInterval(intervalRef.current)
      navigate('/exam/result')
    } else {
      nextQuestion()
    }
  }

  const mm = Math.floor(secondsLeft / 60)
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const timePercent = Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100))
  const progressPercent = Math.max(0, Math.min(100, ((idx + 1) / questions.length) * 100))

  const canGoNext = isDrag ? (Array.isArray(selected) && q.pairs && selected.length === q.pairs.length) : selected.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {imageZoomed && q.hasImage && imgSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setImageZoomed(false)}
        >
          <button
            className="absolute top-6 right-6 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition"
            onClick={() => setImageZoomed(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imgSrc}
            onError={onImgError}
            alt={`Question ${q.id} - Zoomed`}
            className="max-w-full max-h-full object-contain animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
            onClick={handleExit}
          >
            <ArrowLeft className="w-4 h-4" />
            Exit
          </button>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-gray-900 text-white dark:bg-gray-700 font-mono text-sm shadow-md">
              <Clock3 className="w-4 h-4 inline mr-2" />
              {mm}:{ss}
            </div>
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md">
              {idx + 1} / {questions.length}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Time left</span>
              <span className="font-mono text-gray-900 dark:text-gray-100">{mm}:{ss}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${timePercent}%` }} />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{idx + 1} / {questions.length}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Exam Mode</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{q.question}</h2>
          </div>

          <div className="p-6 space-y-6">
            {q.hasImage && imgSrc && (
              <div className="flex justify-center group">
                <div className="relative">
                  <img
                    src={imgSrc}
                    onError={onImgError}
                    alt={`Question ${q.id}`}
                    className="max-h-80 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer transition hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-lg"
                    onClick={() => setImageZoomed(true)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-sm rounded-full p-3">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isDrag ? (
              <div className="space-y-3">
                {Object.entries(q.options || {}).map(([key, text]) => {
                  const selectedThis = selected.includes(key)
                  const base = 'w-full text-left rounded-xl border-2 p-4 transition-all duration-200 flex items-start gap-3'
                  const classes = selectedThis
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'

                  return (
                    <button
                      key={key}
                      className={`${base} ${classes}`}
                      onClick={() => onSelect(key)}
                    >
                      <span className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-sm">
                        {key}
                      </span>
                      <div className="flex-1 text-left">
                        <div className="text-gray-900 dark:text-gray-100 font-semibold leading-snug">{text}</div>
                        {isMulti && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Multi-select</div>}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="mt-2">
                <DragMatch
                  pairs={q.pairs || []}
                  value={selected}
                  onChange={(tokens) => {
                    setSelected(tokens)
                    answerQuestion(q.id, tokens)
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm">Answer to continue</span>
          </div>
          <button
            className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!canGoNext}
            onClick={goNext}
          >
            {idx >= questions.length - 1 ? 'Finish Exam' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
