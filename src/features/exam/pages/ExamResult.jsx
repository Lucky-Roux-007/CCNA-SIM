import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import validateAnswer from '../../../utils/validateAnswer.js'
import ThemeToggle from '../../../components/UI/ThemeToggle.jsx'
import { TrendingUp, TrendingDown, Target, Award, Brain, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

export default function ExamResult() {
  const navigate = useNavigate()
  const { state, calculateScore } = useApp()

  const { correct, total, percent, scaledScore, passed, passingScore } = useMemo(() => calculateScore(), [state.userAnswers, state.examQuestions])

  const wrongQuestions = useMemo(() => {
    return (state.examQuestions || []).filter(q => !validateAnswer(state.userAnswers[q.id] || [], q.correctAnswer))
  }, [state.examQuestions, state.userAnswers])

  const formatPairs = (tokens = [], pairs = []) => {
    const parse = (t = '') => {
      const m = /^L(\d+):R(\d+)$/.exec(t)
      if (!m) return null
      return { l: Number(m[1]), r: Number(m[2]) }
    }
    const parts = []
    for (const t of tokens) {
      const pr = parse(t)
      if (pr && pairs[pr.l] && pairs[pr.r]) {
        parts.push(`${pairs[pr.l].left} → ${pairs[pr.r].right}`)
      } else {
        parts.push(t)
      }
    }
    return parts.join(', ')
  }

  const unansweredCount = useMemo(() => {
    return (state.examQuestions || []).reduce((acc, q) => acc + ((state.userAnswers[q.id] || []).length ? 0 : 1), 0)
  }, [state.examQuestions, state.userAnswers])

  // Category breakdown statistics
  const categoryStats = useMemo(() => {
    const categories = {}
    ;(state.examQuestions || []).forEach(q => {
      if (!categories[q.category]) {
        categories[q.category] = { total: 0, correct: 0 }
      }
      categories[q.category].total++
      if (validateAnswer(state.userAnswers[q.id] || [], q.correctAnswer)) {
        categories[q.category].correct++
      }
    })
    return Object.entries(categories).map(([name, stats]) => ({
      name,
      correct: stats.correct,
      total: stats.total,
      percent: Math.round((stats.correct / stats.total) * 100)
    }))
  }, [state.examQuestions, state.userAnswers])

  // Performance level
  const performanceLevel = useMemo(() => {
    if (percent >= 90) return { label: 'Excellent', color: 'emerald', icon: Award }
    if (percent >= 80) return { label: 'Very Good', color: 'blue', icon: TrendingUp }
    if (percent >= 70) return { label: 'Good', color: 'indigo', icon: Brain }
    if (percent >= 60) return { label: 'Fair', color: 'yellow', icon: Target }
    return { label: 'Needs Improvement', color: 'red', icon: TrendingDown }
  }, [percent])

  const PerformanceIcon = performanceLevel.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-8 px-4">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Header with Score Circle */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="relative flex-shrink-0">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-200 dark:text-gray-700" />
                <circle 
                  cx="96" 
                  cy="96" 
                  r="88" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - percent / 100)}`}
                  className={`${passed ? 'text-emerald-500' : 'text-red-500'} transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-5xl font-extrabold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {percent}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{scaledScore}/1000</div>
              </div>
            </div>

            {/* Info and Stats */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Exam Results
                </h1>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${passed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                  {passed ? '✓ PASSED' : '✗ FAILED'}
                </span>
              </div>

              {/* Performance Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-${performanceLevel.color}-50 dark:bg-${performanceLevel.color}-900/20 border border-${performanceLevel.color}-200 dark:border-${performanceLevel.color}-800 mb-6`}>
                <PerformanceIcon className={`w-5 h-5 text-${performanceLevel.color}-600 dark:text-${performanceLevel.color}-400`} />
                <span className={`font-semibold text-${performanceLevel.color}-700 dark:text-${performanceLevel.color}-400`}>
                  {performanceLevel.label}
                </span>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Correct</div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{correct}</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    <div className="text-xs font-medium text-red-700 dark:text-red-400">Wrong</div>
                  </div>
                  <div className="text-2xl font-bold text-red-700 dark:text-red-400">{total - correct}</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <div className="text-xs font-medium text-amber-700 dark:text-amber-400">Skipped</div>
                  </div>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{unansweredCount}</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-400">Total</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{total}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button 
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 hover:from-gray-700 hover:to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" 
                  onClick={() => navigate('/home')}
                >
                  Home
                </button>
                <button 
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" 
                  onClick={() => navigate('/exam/review')}
                >
                  Review All Questions
                </button>
                <button 
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5" 
                  onClick={() => navigate('/exam')}
                >
                  Retake Exam
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Performance by Category
          </h2>
          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{cat.name}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {cat.correct}/{cat.total} ({cat.percent}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      cat.percent >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                      cat.percent >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                      'bg-gradient-to-r from-amber-500 to-red-500'
                    }`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips and Notes */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Exam Notes
          </h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span>Your final score is scaled to 1000. A score of {passingScore}+ is considered a pass.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span>Questions are weighted: Single-choice (1.0 pt), Multi-choice (1.5 pts), Drag-drop (2.5 pts).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
              <span>Only incorrect questions are shown below. Use "Review All" to see every question with explanations.</span>
            </li>
          </ul>
        </div>

        {/* Wrong Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            Incorrect Answers ({wrongQuestions.length})
          </h2>
          {wrongQuestions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent mb-2">
                Perfect Score! 🎉
              </div>
              <p className="text-gray-600 dark:text-gray-400">You answered all questions correctly!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wrongQuestions.map((q) => {
                const given = state.userAnswers[q.id] || []
                return (
                  <div key={q.id} className="group rounded-xl p-5 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all hover:shadow-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-600 dark:bg-red-500 text-white flex items-center justify-center font-bold text-sm">
                        {q.id}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1 uppercase tracking-wide">
                          {q.category}
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white text-lg mb-3">{q.question}</div>
                        
                        <div className="space-y-3 text-sm">
                          {q.type === 'drag-drop' ? (
                            <>
                              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-red-200 dark:border-red-800">
                                <div className="font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  Your answer:
                                </div>
                                <div className="text-gray-800 dark:text-gray-200">{given.length ? formatPairs(given, q.pairs || []) : '(No answer)'}</div>
                              </div>
                              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                                <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Correct answer:
                                </div>
                                <div className="text-gray-800 dark:text-gray-200">{formatPairs(q.correctAnswer || [], q.pairs || [])}</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-red-200 dark:border-red-800">
                                <div className="font-semibold text-red-700 dark:text-red-400 mb-1 flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  Your answer:
                                </div>
                                <div className="text-gray-800 dark:text-gray-200">{given.join(', ') || '(No answer)'}</div>
                              </div>
                              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                                <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Correct answer:
                                </div>
                                <div className="text-gray-800 dark:text-gray-200">{(q.correctAnswer || []).join(', ')}</div>
                              </div>
                            </>
                          )}
                          {q.explanation && (
                            <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                              <div className="font-semibold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-2">
                                <Brain className="w-4 h-4" />
                                Explanation:
                              </div>
                              <div className="text-gray-700 dark:text-gray-300">{q.explanation}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
