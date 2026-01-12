import { useEffect, useMemo, useState } from 'react'
import shuffle from '../../utils/shuffle.js'

// Token helpers: encode/decode stable mapping tokens like "L0:R2"
const makeToken = (lIndex, rIndex) => `L${lIndex}:R${rIndex}`
const parseToken = (t = '') => {
  const m = /^L(\d+):R(\d+)$/.exec(t)
  if (!m) return null
  return { l: Number(m[1]), r: Number(m[2]) }
}

export default function DragMatch({ pairs = [], value = [], onChange, reveal = false, correctTokens = [] }) {
  // Build assigned map from value tokens
  const initialAssigned = useMemo(() => {
    const arr = Array(pairs.length).fill(null)
    for (const t of value) {
      const pr = parseToken(t)
      if (!pr) continue
      if (pr.l >= 0 && pr.l < pairs.length) arr[pr.l] = pr.r
    }
    return arr
  }, [pairs.length, value])

  const [assigned, setAssigned] = useState(initialAssigned)
  const [shuffledRight, setShuffledRight] = useState(() => shuffle(pairs.map((p, i) => ({ idx: i, text: p.right }))))

  useEffect(() => {
    setAssigned(initialAssigned)
    // Keep shuffledRight stable once created per question to avoid moving targets
  }, [initialAssigned])

  const unassignedRight = useMemo(() => {
    const used = new Set(assigned.filter(v => v !== null))
    return shuffledRight.filter(item => !used.has(item.idx))
  }, [assigned, shuffledRight])

  const commit = (nextAssigned) => {
    setAssigned(nextAssigned)
    if (onChange) {
      const tokens = nextAssigned
        .map((rIdx, lIdx) => (rIdx === null ? null : makeToken(lIdx, rIdx)))
        .filter(Boolean)
      onChange(tokens)
    }
  }

  // Drag handlers
  const onDragStart = (e, rIdx) => {
    e.dataTransfer.setData('text/plain', String(rIdx))
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDropOnLeft = (e, lIdx) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('text/plain')
    const rIdx = Number(data)
    if (Number.isNaN(rIdx)) return
    const next = [...assigned]
    // unassign previous slot that had this rIdx
    const prevL = next.findIndex(x => x === rIdx)
    if (prevL !== -1) next[prevL] = null
    next[lIdx] = rIdx
    commit(next)
  }

  const onRemove = (lIdx) => {
    const next = [...assigned]
    next[lIdx] = null
    commit(next)
  }

  const allowDrop = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const isCorrectSlot = (lIdx) => {
    if (!reveal) return null
    const expected = correctTokens.find(t => parseToken(t)?.l === lIdx)
    const exp = expected ? parseToken(expected).r : null
    const got = assigned[lIdx]
    return exp !== null && got === exp
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Left panel */}
      <div className="rounded-lg border bg-blue-50/60 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 p-3">
        <div className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Match these</div>
        <div className="space-y-2 max-h-96 overflow-auto pr-1">
          {pairs.map((p, lIdx) => {
            const rIdx = assigned[lIdx]
            const correct = isCorrectSlot(lIdx)
            let slotClasses = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            if (reveal) {
              if (correct === true) slotClasses = 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-200 dark:ring-emerald-800'
              else if (rIdx !== null) slotClasses = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30 ring-2 ring-red-200 dark:ring-red-800'
              else slotClasses = 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-75'
            }
            return (
              <div key={lIdx}
                   onDrop={(e) => onDropOnLeft(e, lIdx)}
                   onDragOver={allowDrop}
                   className={`flex items-center justify-between rounded border p-3 min-h-12 ${slotClasses}`}>
                <div className="mr-2 text-gray-800 dark:text-gray-200">{p.left}</div>
                <div className="flex items-center gap-2">
                  {rIdx !== null ? (
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-2 rounded px-2 py-1 text-sm border ${reveal
                        ? (correct === true
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                          : 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-900 dark:text-red-200')
                        : 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'}`}>
                        {pairs[rIdx]?.right}
                        {reveal && (
                          <span className={`font-bold ${correct === true ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} aria-hidden>
                            {correct === true ? '✓' : '✕'}
                          </span>
                        )}
                      </span>
                      {!reveal && (
                        <button className="text-xs text-gray-600 dark:text-gray-400 underline" onClick={() => onRemove(lIdx)}>remove</button>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500">drop here</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel */}
      <div className="rounded-lg border bg-indigo-50/60 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 p-3">
        <div className="text-sm font-medium mb-2 text-indigo-800 dark:text-indigo-300">Options</div>
        <div className="flex flex-wrap gap-2 max-h-96 overflow-auto">
          {unassignedRight.map(item => (
            <div key={item.idx}
                 draggable={!reveal}
                 onDragStart={(e) => onDragStart(e, item.idx)}
                 className={`cursor-move select-none inline-block rounded px-3 py-2 border text-sm ${reveal ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {item.text}
            </div>
          ))}
          {!unassignedRight.length && (
            <div className="text-xs text-gray-500 dark:text-gray-400">All options are placed</div>
          )}
        </div>
      </div>
    </div>
  )
}
