import { Link } from 'react-router'
import { GraduationCap, ClipboardList, ArrowLeft } from 'lucide-react'
import ThemeToggle from '../components/UI/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <div className="max-w-xl mx-auto px-6 pt-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Welcome
        </Link>
      </div>

      <div className="min-h-screen flex items-center justify-center px-6 -mt-16">
        <div className="max-w-xl w-full py-10 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 bg-clip-text text-transparent">
              CCNA 200-301 Study
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Choose a mode to begin your journey</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link 
              to="/practice" 
              className="group relative rounded-2xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-gray-800 p-8 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent dark:from-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="text-white w-10 h-10" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Practice Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Learn by category with detailed explanations and instant feedback
                </p>
              </div>
            </Link>
            
            <Link 
              to="/exam" 
              className="group relative rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-gray-800 p-8 hover:shadow-2xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent dark:from-emerald-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ClipboardList className="text-white w-10 h-10" />
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">Exam Simulation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Timed exam-like experience with comprehensive scoring
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
