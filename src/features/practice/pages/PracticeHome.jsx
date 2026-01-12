import { useMemo } from 'react'
import { Link } from 'react-router'
import { useApp } from '../../../context/AppContext.jsx'
import { ArrowLeft, BookOpen } from 'lucide-react'
import ThemeToggle from '../../../components/UI/ThemeToggle'

export default function PracticeHome() {
    const { questionsData } = useApp()

    const categories = useMemo(() => {
        // Add safety check
        if (!Array.isArray(questionsData) || questionsData.length === 0) {
            return []
        }
        const set = new Set(questionsData.map(q => q?.category).filter(Boolean))
        return Array.from(set)
    }, [questionsData])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="mb-6">
                    <Link
                        to="/home"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </div>
                
                <div className="mb-8">
                    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        Practice by Category
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Select a category to start practicing</p>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No questions available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                to={`/practice/${encodeURIComponent(cat)}`}
                                className="group relative rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-transparent dark:from-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative">
                                    <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{cat}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        {questionsData.filter(q => q?.category === cat).length} questions
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}