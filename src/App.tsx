import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateScript, ScriptStep } from './services/gemini';
import { LatexRenderer } from './components/LatexRenderer';
import { Sparkles, Video, Code, Loader2, Copy, Check } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [topic, setTopic] = useState('');
  const [script, setScript] = useState<ScriptStep[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setScript(null);

    try {
      const result = await generateScript(topic);
      setScript(result);
    } catch (err) {
      setError('Failed to generate script. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (script) {
      navigator.clipboard.writeText(JSON.stringify(script, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen tech-grid text-gray-200 p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          layout
          className="flex items-center justify-center gap-3 mb-12 pt-8"
        >
          <div className="p-3 rounded-xl bg-gray-900 border border-[var(--color-tech-accent)] shadow-[0_0_15px_rgba(0,255,157,0.3)]">
            <Video className="w-8 h-8 text-[var(--color-tech-accent)]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter">
            <span className="text-white">Tech</span>
            <span className="text-[var(--color-tech-accent)] neon-text">Vision</span>
          </h1>
        </motion.header>

        {/* Input Section */}
        <motion.div layout className={cn("transition-all duration-500", script ? "mb-8" : "mb-20")}>
          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-tech-accent)] to-[var(--color-tech-secondary)] rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-black rounded-2xl border border-gray-800">
                <Sparkles className="absolute left-4 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a technical topic (e.g., Transformer Architecture, Fourier Transform)..."
                  className="w-full bg-transparent border-none py-4 pl-12 pr-32 text-lg focus:ring-0 text-white placeholder-gray-600"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="absolute right-2 px-6 py-2 bg-[var(--color-tech-accent)] text-black font-bold rounded-xl hover:bg-[#00cc7d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-center mb-8 bg-red-900/20 p-4 rounded-lg border border-red-900/50"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {script && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-mono text-gray-400">
                  Script for: <span className="text-[var(--color-tech-secondary)]">{topic}</span>
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-gray-400 hover:text-white border border-gray-800 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied JSON' : 'Copy JSON'}
                </button>
              </div>

              <div className="relative border-l-2 border-gray-800 ml-4 md:ml-6 space-y-12 pb-12">
                {script.map((step, index) => (
                  <motion.div
                    key={step.step_number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 md:pl-12"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-[var(--color-tech-accent)] shadow-[0_0_10px_var(--color-tech-accent)]" />

                    <div className="glass-panel rounded-2xl p-6 md:p-8 hover:border-[var(--color-tech-accent)]/30 transition-colors group">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        
                        {/* Header Section */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-[var(--color-tech-accent)] text-sm font-bold tracking-wider uppercase">
                              Step {String(step.step_number).padStart(2, '0')}
                            </span>
                            <div className="h-px flex-1 bg-gray-800" />
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{step.title_zh}</h3>
                            <p className="text-[var(--color-tech-secondary)] font-mono text-sm tracking-wide">{step.title_en}</p>
                          </div>

                          <p className="text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-4">
                            {step.short_desc}
                          </p>
                        </div>

                        {/* Visual & Formula Section */}
                        <div className="flex-1 space-y-6">
                          {/* Formula Card */}
                          <div className="bg-black/50 rounded-xl p-4 border border-gray-800 group-hover:border-gray-700 transition-colors">
                            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider">
                              <Code className="w-3 h-3" /> Core Formula
                            </div>
                            <div className="overflow-x-auto pb-2">
                              <LatexRenderer formula={step.formula} className="text-lg md:text-xl text-white" />
                            </div>
                          </div>

                          {/* Visual Element Description */}
                          <div className="bg-[var(--color-tech-secondary)]/5 rounded-xl p-4 border border-[var(--color-tech-secondary)]/20">
                            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-tech-secondary)] mb-2 uppercase tracking-wider">
                              <Video className="w-3 h-3" /> Visual Element
                            </div>
                            <p className="text-sm text-gray-300">
                              {step.visual_element}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Empty State / Placeholder */}
        {!script && !loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-20 opacity-30"
          >
            <div className="font-mono text-sm text-[var(--color-tech-accent)] mb-2">SYSTEM READY</div>
            <div className="text-6xl font-bold tracking-tighter text-gray-800 select-none">WAITING FOR INPUT</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
