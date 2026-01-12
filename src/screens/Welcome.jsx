import { useNavigate } from 'react-router'
import { ArrowRight, BookOpen, Trophy, Clock, Target, Sparkles, Zap, Award } from 'lucide-react'
import ThemeToggle from '../components/UI/ThemeToggle'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 rounded-full blur-2xl opacity-40 dark:opacity-30 animate-pulse group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-xl opacity-20 animate-spin-slow"></div>
              <img 
                src="/avatar.jpg" 
                alt="AQASBI Yassine" 
                className="relative w-40 h-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl ring-4 ring-blue-100 dark:ring-blue-900/50 transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%236366f1;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2310b981;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="100" height="100"/%3E%3Ctext x="50" y="50" dominant-baseline="middle" text-anchor="middle" font-size="36" font-weight="bold" fill="white"%3EAY%3C/text%3E%3C/svg%3E'
                }}
              />
              <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 bg-clip-text text-transparent mb-3 animate-gradient">
              AQASBI Yassine
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xl font-medium flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              CCNA Exam Simulator Project
              <Zap className="w-5 h-5 text-amber-500" />
            </p>
          </div>

          {/* Project Title */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
              Master Your <span className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">CCNA 200-301</span> Certification
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A comprehensive, interactive study platform designed to help you ace the Cisco CCNA exam with confidence
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-blue-100 dark:border-blue-900/50 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent dark:from-blue-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  Practice Mode
                  <Award className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Learn at your own pace with categorized questions covering all CCNA topics. 
                  Get instant feedback and detailed explanations to reinforce your understanding.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                    Network Fundamentals
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                    IP Connectivity & Services
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                    Security & Automation
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-emerald-100 dark:border-emerald-900/50 hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-transparent dark:from-emerald-500/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  Exam Simulation
                  <Target className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Experience the real exam environment with timed tests, realistic questions, 
                  and comprehensive scoring to assess your readiness.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Timed assessments
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Weighted scoring system
                  </li>
                  <li className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Detailed performance review
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack & Features */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-700 dark:via-purple-700 dark:to-emerald-700 rounded-3xl p-10 text-white mb-12 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative grid md:grid-cols-3 gap-8 text-center">
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-black mb-2 bg-white/20 backdrop-blur-sm rounded-2xl py-4 group-hover:bg-white/30 transition-colors">3</div>
              <div className="text-blue-100 font-semibold text-lg mb-1">Question Types</div>
              <div className="text-sm text-blue-200">Multiple Choice, Multi-Select & Drag-Drop</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-black mb-2 bg-white/20 backdrop-blur-sm rounded-2xl py-4 group-hover:bg-white/30 transition-colors">6</div>
              <div className="text-purple-100 font-semibold text-lg mb-1">CCNA Categories</div>
              <div className="text-sm text-purple-200">Complete exam blueprint coverage</div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="text-5xl font-black mb-2 bg-white/20 backdrop-blur-sm rounded-2xl py-4 group-hover:bg-white/30 transition-colors">100%</div>
              <div className="text-emerald-100 font-semibold text-lg mb-1">Interactive</div>
              <div className="text-sm text-emerald-200">Real-time feedback & explanations</div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/home')}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-500 dark:via-purple-500 dark:to-emerald-500 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Get Started
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
            Built with ❤️ using React, Vite & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  )
}
