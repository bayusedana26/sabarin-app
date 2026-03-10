import { Heart, Info } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import ResultCard from './components/ResultCard';
import TranslatorForm from './components/TranslatorForm';
import { translateToCorporate } from './services/gemini';
import { Language, Tone, TranslationResult } from './types';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
          <div className="text-center space-y-4 max-w-md">
            <div className="bg-red-50 p-6 rounded-3xl border-4 border-red-100">
              <Info className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-black text-red-900 uppercase tracking-tighter mb-2">
                Sistem Error
              </h2>
              <p className="text-red-700 font-medium">
                Ada masalah teknis nih. Coba refresh halaman atau coba lagi nanti ya.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-3 bg-red-600 text-white rounded-full font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
              >
                Refresh Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage not available:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};

// Safe JSON parsing for history
const parseHistory = (saved: string | null): TranslationResult[] => {
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed.filter(item =>
        item &&
        typeof item === 'object' &&
        item.id &&
        item.timestamp &&
        item.original &&
        item.translated &&
        item.score
      );
    }
    return [];
  } catch (error) {
    console.error('History corrupted, clearing:', error);
    safeLocalStorage.removeItem('sabar_history');
    return [];
  }
};

export default function App() {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [history, setHistory] = useState<TranslationResult[]>(() => {
    const saved = safeLocalStorage.getItem('sabar_history');
    return parseHistory(saved);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleTranslate = useCallback(async (text: string, tone: Tone, language: Language) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const { translated, score, error: apiError } = await translateToCorporate(text, tone, language);

      if (apiError) {
        setError(apiError);
        setResult(null);
        setRetryCount(prev => prev + 1);
        return;
      }

      const newResult: TranslationResult = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        original: text,
        translated,
        tone,
        language,
        score
      };

      setResult(newResult);
      setRetryCount(0);

      // Safely update history with size limit
      const newHistory = [newResult, ...history].slice(0, 10);
      setHistory(newHistory);
      safeLocalStorage.setItem('sabar_history', JSON.stringify(newHistory));

    } catch (err) {
      console.error('Translation error:', err);

      // Provide specific error messages based on error type
      let errorMessage = 'Waduh, ada masalah teknis nih. Coba lagi ya!';

      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'Respons lama banget nih, mungkin koneksi lagi slow. Coba lagi?';
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'Koneksi internet bermasalah nih. Cek WiFi atau data kamu ya.';
        } else if (err.message.includes('rate limit') || err.message.includes('429')) {
          errorMessage = `Strategis Korporat lagi sibuk nih. Tunggu ${Math.min(30 * (retryCount + 1), 300)} detik ya!`;
        }
      }

      setError(errorMessage);
      setResult(null);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, history, retryCount]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    safeLocalStorage.removeItem('sabar_history');
  }, []);

  const retryTranslation = useCallback(() => {
    if (result?.original) {
      handleTranslate(result.original, result.tone, result.language);
    }
  }, [result, handleTranslate]);

  // Memoize expensive calculations
  const hasHistory = useMemo(() => history.length > 0, [history.length]);
  const canRetry = useMemo(() => result?.original && !isLoading, [result, isLoading]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-red-100 selection:text-red-900">
        <Header />
        
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-50 rounded-full blur-[120px]" />
        </div>

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 space-y-16 relative z-10">
          <section className="space-y-6 text-center relative">
            <div className="space-y-2">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-8xl font-black tracking-tighter text-zinc-900 leading-[0.85] uppercase"
              >
                Sabar.in <span className="text-red-600">Aja Dulu.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-medium tracking-tight leading-tight"
              >
                Emosi di hati aja, <span className="text-zinc-900 font-black italic">professional kudu tetep jalan.</span>
              </motion.p>
            </div>
          </section>

          <section className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 overflow-hidden"
              >
                <TranslatorForm onTranslate={handleTranslate} isLoading={isLoading} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="h-full"
              >
                <ResultCard result={result} isLoading={isLoading} />
              </motion.div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 bg-red-50 border-4 border-red-100 rounded-[3rem] flex items-center gap-8 text-red-700 font-black shadow-2xl shadow-red-100"
              >
                <div className="bg-red-600 p-5 rounded-3xl shadow-xl shadow-red-200 shrink-0">
                  <Info className="w-10 h-10 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">System Alert</p>
                    <p className="text-xl md:text-2xl uppercase tracking-tighter leading-none">{error}</p>
                  </div>
                  {canRetry && (
                    <button
                      onClick={retryTranslation}
                      className="px-6 py-2 bg-red-600 text-white rounded-full text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                    >
                      Coba Lagi
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {hasHistory && (
              <section className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.4em]">Arsip Kesabaran</h3>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {history.map((item) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onClick={() => {
                        setResult(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      aria-label={`Lihat terjemahan dari ${new Date(item.timestamp || 0).toLocaleDateString()}`}
                      className="group bg-zinc-50 hover:bg-white p-8 rounded-[2.5rem] border-2 border-transparent hover:border-zinc-900 transition-all text-left space-y-4 shadow-sm hover:shadow-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">
                          {new Date(item.timestamp || 0).toLocaleDateString()}
                        </span>
                        <div className="px-3 py-1 bg-white rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-100 group-hover:border-zinc-900 group-hover:text-zinc-900 transition-colors">
                          {item.tone}
                        </div>
                      </div>
                      <p className="text-zinc-900 font-serif italic text-lg line-clamp-2 leading-tight">
                        "{item.translated}"
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Savage</span>
                          <span className="text-xs font-black text-zinc-900">{item.score.savage}%</span>
                        </div>
                        <div className="w-px h-4 bg-zinc-200" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Pro</span>
                          <span className="text-xs font-black text-red-600">{item.score.professional}%</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <button 
                    onClick={clearHistory}
                    className="text-[9px] font-black text-zinc-300 hover:text-red-600 uppercase tracking-widest transition-colors"
                  >
                    [ Hapus Semua Arsip ]
                  </button>
                </div>
              </section>
            )}
          </section>
        </main>

        <footer className="py-20 border-t border-zinc-100 bg-zinc-50 relative z-10">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-zinc-900 p-2 rounded-lg">
                  <Heart className="w-4 h-4 text-white fill-white" aria-hidden="true" />
                </div>
                <span className="text-lg font-black text-zinc-900 tracking-tighter uppercase">Sabar.in</span>
              </div>
              <p className="text-zinc-600 text-sm max-w-xs text-center md:text-left font-medium">
                Solusi cerdas buat lo yang pengen tetep profesional meskipun hati lagi pengen ngamuk.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6">
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.3em] font-bold">
                &copy; 2026 SABAR.IN - PROTOKOL ANTI-TANTRUM
              </p>
              <nav className="flex items-center gap-8" aria-label="Footer navigation">
                <a href="#" className="text-[10px] font-black text-zinc-600 hover:text-red-600 transition-all uppercase tracking-widest">Privacy Policy</a>
                <a href="#" className="text-[10px] font-black text-zinc-600 hover:text-red-600 transition-all uppercase tracking-widest">Terms of Service</a>
                <a href="#" className="text-[10px] font-black text-zinc-600 hover:text-red-600 transition-all uppercase tracking-widest">Support</a>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
