'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  CornerDownLeft,
  Lightbulb,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  X,
} from 'lucide-react'

const DEFAULT_MESSAGES = [
  {
    sender: 'bot',
    text: `Hello! I am your **EcoTrack AI Decarbonization Copilot**. I am connected to your live Scope 1, 2, and 3 emission ledger and water consumption telemetry.

How can I assist your sustainability roadmap today?`,
    chips: [
      { label: 'Gross: 2,847 tCO₂e', tone: 'emerald' },
      { label: 'SBTi 1.5°C Active', tone: 'sky' },
    ],
    suggestedQuestions: [
      'What is our biggest emissions hotspot?',
      'Scan for active anomalies',
      'Recommend highest-ROI decarbonization projects',
      'Check SBTi 2030 target readiness',
    ],
  },
]

export default function CopilotDrawer({
  isOpen,
  setIsOpen,
  initialQuery = '',
  sectors = [],
}) {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Handle external query trigger
  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery)
    }
  }, [initialQuery, isOpen])

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input
    if (!query || !query.trim() || loading) return

    const userMsg = { sender: 'user', text: query.trim() }
    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          context: { sectors, totalEmissions: '2,847' },
        }),
      })

      const json = await res.json()
      if (json.success && json.data) {
        const botMsg = {
          sender: 'bot',
          text: json.data.reply,
          chips: json.data.chips || [],
          suggestedQuestions: json.data.suggestedQuestions || [],
        }
        setMessages((prev) => [...prev, botMsg])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: 'I encountered an issue analyzing the telemetry. Please try asking again.',
          },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Network error connecting to Copilot engine: ' + err.message,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button at bottom right */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-slate-900 px-4 py-3 text-white shadow-xl shadow-slate-900/30 border border-slate-700 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200 group"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white animate-pulse">
            <Sparkles size={14} />
          </div>
          <span className="text-xs font-semibold tracking-wide">AI Copilot</span>
          <span className="flex size-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
        </button>
      )}

      {/* Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="relative w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      Decarbonization Copilot
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                        AI
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Grounded in verified Scope 1-3 telemetry
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white font-medium rounded-br-xs shadow-sm'
                          : 'bg-slate-50 text-slate-800 border border-slate-200/70 rounded-bl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Chips */}
                      {msg.chips && msg.chips.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60">
                          {msg.chips.map((chip, cIdx) => (
                            <span
                              key={cIdx}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                chip.tone === 'emerald'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : chip.tone === 'amber'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {chip.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Follow-up Prompts */}
                    {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1 max-w-[90%]">
                        {msg.suggestedQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            type="button"
                            onClick={() => handleSendMessage(q)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition text-left"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200/60 p-3 text-xs text-slate-500 w-fit">
                    <Loader2 size={14} className="animate-spin text-emerald-600" />
                    <span>Analyzing emission factors & telemetry...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="border-t border-slate-100 p-4 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-1.5 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-500 transition"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about emissions, anomalies, SBTi..."
                    className="flex-1 bg-transparent px-2.5 text-xs text-slate-800 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={13} />
                  </button>
                </form>
                <p className="mt-2 text-[10px] text-center text-slate-400">
                  EcoTrack Copilot generates recommendations grounded in GHG Protocol standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
