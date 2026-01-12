import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import DragMatch from '../../../components/UI/DragMatch.jsx'
import filterByCategory from '../../../utils/filterByCategory.js'
import ThemeToggle from '../../../components/UI/ThemeToggle.jsx'
import { ChevronLeft, ChevronRight, Eye, EyeOff, BookOpen, CheckCircle, XCircle, ZoomIn, X } from 'lucide-react'

export default function LearnMode() {
    const { category: catParam } = useParams()
    const navigate = useNavigate()
    const { state, questionsData, setPractice, nextQuestion, prevQuestion, toggleShowAnswer, answerQuestion } = useApp()
    const category = decodeURIComponent(catParam || '')

    const questions = useMemo(() => {
        if (!Array.isArray(questionsData) || questionsData.length === 0) return []
        return filterByCategory(questionsData, category)
    }, [questionsData, category])

    useEffect(() => {
        if (!category) {
            navigate('/practice')
            return
        }
        if (!questions.length) return
        if (state.category !== category || state.practiceQuestions.length !== questions.length) {
            setPractice(category, questions)
        }
    }, [category, questions, setPractice, state.category, state.practiceQuestions.length, navigate])

    const q = state.practiceQuestions[state.currentQuestionIndex]
    const reveal = state.showAnswer

    const defaultPng = useMemo(() => {
        if (!q?.hasImage) return ''
        return q.imagePath || `/question-${q.id}.png`
    }, [q?.hasImage, q?.imagePath, q?.id])

    const [imgSrc, setImgSrc] = useState(defaultPng)
    const [imageZoomed, setImageZoomed] = useState(false)
    const [selected, setSelected] = useState([])

    useEffect(() => {
        setImgSrc(defaultPng)
        setImageZoomed(false)
        setSelected(state.userAnswers?.[q?.id] || [])
    }, [defaultPng, q?.id, state.userAnswers])

    if (!q) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">No questions found for this category.</p>
                    <button
                        onClick={() => navigate('/practice')}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Back to Practice
                    </button>
                </div>
            </div>
        )
    }

    const isDrag = q.type === 'drag-drop'
    const isMulti = !isDrag && Array.isArray(q.correctAnswer) && q.correctAnswer.length > 1

    const onImgError = () => {
        if (!imgSrc) return
        if (imgSrc.endsWith('.png')) setImgSrc(imgSrc.replace('.png', '.jpg'))
        else if (imgSrc.endsWith('.jpg')) setImgSrc(imgSrc.replace('.jpg', '.jpeg'))
        else if (imgSrc.endsWith('.jpeg')) setImgSrc(imgSrc.replace('.jpeg', '.webp'))
    }

    const handleSelect = (key) => {
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

    const isCorrect = (key) => Array.isArray(q.correctAnswer) && q.correctAnswer.includes(key)

    const showPrev = state.currentQuestionIndex > 0
    const showNext = state.currentQuestionIndex < state.practiceQuestions.length - 1

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/25 to-indigo-50/25 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
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
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                        onClick={() => navigate('/practice')}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-md">
                            {state.currentQuestionIndex + 1} / {state.practiceQuestions.length}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium">
                        <BookOpen className="w-4 h-4" />
                        {category}
                    </span>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/25 dark:to-blue-900/25 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{q.question}</h2>
                    </div>

                    <div className="p-6">
                        {q.hasImage && imgSrc && (
                            <div className="flex justify-center mb-6 group">
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
                                    let classes = 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                                    let icon = null

                                    if (reveal) {
                                        if (isCorrect(key)) {
                                            classes = 'border-emerald-400 dark:border-emerald-600 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 shadow-md'
                                            icon = <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                        } else if (selectedThis) {
                                            classes = 'border-red-400 dark:border-red-600 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 shadow-md'
                                            icon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        }
                                    } else if (selectedThis) {
                                        classes = 'border-blue-400 dark:border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-md'
                                    }

                                    return (
                                        <button
                                            key={key}
                                            className={`${base} ${classes}`}
                                            onClick={() => handleSelect(key)}
                                        >
                                            <span className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-sm">
                                                {key}
                                            </span>
                                            <div className="flex-1 text-left">
                                                <div className="text-gray-900 dark:text-gray-100 font-semibold leading-snug">{text}</div>
                                                {isMulti && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Multi-select</div>}
                                            </div>
                                            {icon}
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
                                    reveal={reveal}
                                    correctTokens={q.correctAnswer || []}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                        onClick={prevQuestion}
                        disabled={!showPrev}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Prev
                    </button>
                    <button
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                        onClick={nextQuestion}
                        disabled={!showNext}
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                        className="ml-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition shadow-lg"
                        onClick={toggleShowAnswer}
                    >
                        {reveal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        {reveal ? 'Hide Answer' : 'Show Answer'}
                    </button>
                </div>

                {reveal && (
                    <div className="mt-6 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/25 dark:to-green-900/25 shadow-xl overflow-hidden animate-slideIn">
                        <div className="px-6 py-4 border-b-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-lg font-bold text-emerald-900 dark:text-emerald-200">Answer & Explanation</span>
                            </div>
                        </div>
                        <div className="p-6 space-y-3 text-gray-800 dark:text-gray-100">
                            {isDrag ? (
                                <div>
                                    <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Correct pairs</div>
                                    <div className="flex flex-col gap-2">
                                        {(q.correctAnswer || []).map((token) => (
                                            <div key={token} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-emerald-200 dark:border-emerald-700 w-fit">
                                                <span className="font-mono text-emerald-700 dark:text-emerald-300">{token}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                                    Correct answer{(q.correctAnswer || []).length > 1 ? 's' : ''}: {(q.correctAnswer || []).join(', ')}
                                </div>
                            )}
                            {q.explanation && (
                                <div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explanation</div>
                                    <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">{q.explanation}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
