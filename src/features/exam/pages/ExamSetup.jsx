import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import selectRandom from '../../../utils/selectRandom.js'
import { ArrowLeft, Play } from 'lucide-react'
import ThemeToggle from '../../../components/UI/ThemeToggle'

export default function ExamSetup() {
  const navigate = useNavigate()
  const { questionsData, startExam } = useApp()
  // Category selection
  const categories = useMemo(() => {
    const set = new Set(questionsData.map(q => q.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [questionsData])
  const [category, setCategory] = useState('All')

  // Derived list based on category
  const filtered = useMemo(() => {
    return category === 'All' ? questionsData : questionsData.filter(q => q.category === category)
  }, [questionsData, category])

  // Number of questions: predefined options via buttons
  const questionOptions = [30, 50, 60, 'All']
  const [questionCount, setQuestionCount] = useState(
    filtered.length >= 50 ? 50 : Math.min(30, filtered.length)
  )

  // Timer options via buttons (minutes)
  const timerOptions = [30, 60, 100, 120]
  const [timer, setTimer] = useState(90)

  const handleStart = () => {
    const pool = filtered
    const desired = questionCount === 'All' ? pool.length : Number(questionCount)
    const count = Math.max(1, Math.min(desired, pool.length))
    const list = selectRandom(pool, count)
    startExam(list, { totalQuestions: count, timer })
    navigate('/exam/start')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl">
        <button
          onClick={() => navigate('/home')}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <h1 className="text-4xl font-black mb-3 text-center bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
          Exam Setup
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Configure your exam settings</p>

        <div className="space-y-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* Category selection */}
          <div>
            <label className="block text-lg font-bold mb-4 text-gray-900 dark:text-white">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map(cat => {
                const active = category === cat
                return (
                  <button
                    key={cat}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-all shadow-sm ${active ? 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    onClick={() => {
                      setCategory(cat)
                      // Reset question count to a valid option for new pool
                      const poolSize = (cat === 'All' ? questionsData.length : questionsData.filter(q => q.category === cat).length)
                      if (questionCount !== 'All' && Number(questionCount) > poolSize) {
                        // pick the largest option that fits, else 'All'
                        const fit = questionOptions.findLast(opt => opt !== 'All' && opt <= poolSize)
                        setQuestionCount(fit || 'All')
                      }
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Number of questions */}
          <div>
            <label className="block text-lg font-bold mb-4 text-gray-900 dark:text-white">Number of questions</label>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {questionOptions.map(opt => {
                const active = questionCount === opt
                const poolSize = filtered.length
                const disabled = opt !== 'All' && opt > poolSize
                return (
                  <button
                    key={String(opt)}
                    disabled={disabled}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-all shadow-sm ${active ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    onClick={() => setQuestionCount(opt)}
                  >
                    {opt === 'All' ? `All (${poolSize})` : opt}
                  </button>
                )
              })}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">Available in selected category: {filtered.length}</p>
          </div>

          {/* Timer selection */}
          <div>
            <label className="block text-lg font-bold mb-4 text-gray-900 dark:text-white">Timer (minutes)</label>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {timerOptions.map(opt => {
                const active = timer === opt
                return (
                  <button
                    key={opt}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-all shadow-sm ${active ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    onClick={() => setTimer(opt)}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button 
              className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-base font-semibold shadow-sm transition-all" 
              onClick={() => navigate('/home')}
            >
              Cancel
            </button>
            <button 
              className="group px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-500 dark:to-blue-500 hover:from-emerald-700 hover:to-blue-700 dark:hover:from-emerald-600 dark:hover:to-blue-600 text-white text-base font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2" 
              onClick={handleStart}
            >
              <Play className="w-5 h-5" />
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
