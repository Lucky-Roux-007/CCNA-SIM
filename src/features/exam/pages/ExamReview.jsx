import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import validateAnswer from '../../../utils/validateAnswer.js'
import ThemeToggle from '../../../components/UI/ThemeToggle.jsx'

export default function ExamReview() {
  const navigate = useNavigate()
  const { state, calculateScore } = useApp()
  const { correct, total, percent, scaledScore, passed, passingScore } = useMemo(() => calculateScore(), [state.userAnswers, state.examQuestions])

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Review</h1>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-lg font-semibold">{scaledScore}/1000</span>
              <span className={`text-sm px-2 py-0.5 rounded ${passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {passed ? 'Passed' : 'Failed'} (≥{passingScore})
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Raw: {correct}/{total} correct ({percent}%)</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => navigate('/home')}>Home</button>
            <button className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => navigate('/exam')}>Retake</button>
          </div>
        </div>

        <div className="space-y-4">
          {state.examQuestions.map((q, i) => {
            const given = state.userAnswers[q.id] || []
            const isCorrect = validateAnswer(given, q.correctAnswer)
            return (
              <div key={q.id} className={`rounded border p-4 ${isCorrect ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'}`}>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Q{i + 1}</div>
                <div className="font-medium mb-2 text-gray-900 dark:text-white">{q.question}</div>
                <div className="text-sm text-gray-800 dark:text-gray-200">
                  {q.type === 'drag-drop' ? (
                    <>
                      <div className="mb-1"><span className="font-semibold">Your answer:</span> {given.length ? formatPairs(given, q.pairs || []) : '—'}</div>
                      <div className="mb-2"><span className="font-semibold">Correct:</span> {formatPairs(q.correctAnswer || [], q.pairs || [])}</div>
                    </>
                  ) : (
                    <>
                      <div className="mb-1"><span className="font-semibold">Your answer:</span> {given.join(', ') || '—'}</div>
                      <div className="mb-2"><span className="font-semibold">Correct:</span> {q.correctAnswer.join(', ')}</div>
                    </>
                  )}
                  {q.explanation && (
                    <div className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Explanation:</span> {q.explanation}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
