import React, { useState, useCallback, useMemo } from 'react';
import { Send, Loader2, Languages, MessageSquare, Briefcase, Zap, AlertCircle, Heart, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tone, Language } from '../types';
import { cn } from '../lib/utils';

// Move constants outside component to prevent re-creation
const TONES: { value: Tone; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'Professional',
    label: 'Professional (Slay)',
    description: 'Vibes tenang, solusi nendang',
    icon: <Briefcase className="w-4 h-4" />
  },
  {
    value: 'Savage-but-Polite',
    label: 'Savage (No Cap)',
    description: 'Sopan di luar, savage di dalam',
    icon: <Zap className="w-4 h-4" />
  },
  {
    value: 'Direct',
    label: 'Direct (Gaspol)',
    description: 'Gak pake lama, langsung intinya',
    icon: <AlertCircle className="w-4 h-4" />
  },
];

const LANGUAGES: { value: Language; label: string; shortLabel: string }[] = [
  { value: 'ID-ID', label: 'Indo → Indo (Local Pride)', shortLabel: 'ID-ID' },
  { value: 'EN-EN', label: 'English → English (Global)', shortLabel: 'EN-EN' },
  { value: 'ID-EN', label: 'Indo → English (Jaksel)', shortLabel: 'ID-EN' },
  { value: 'EN-ID', label: 'English → Indo (Translate)', shortLabel: 'EN-ID' },
];

interface TranslatorFormProps {
  onTranslate: (text: string, tone: Tone, language: Language) => Promise<void>;
  isLoading: boolean;
}

type ValidationState = 'idle' | 'valid' | 'invalid' | 'warning';

export default function TranslatorForm({ onTranslate, isLoading }: TranslatorFormProps) {
  const [text, setText] = useState('');
  const [tone, setTone] = useState<Tone>('Professional');
  const [language, setLanguage] = useState<Language>('ID-ID');
  const [hasInteracted, setHasInteracted] = useState(false);

  // Memoized validation
  const validationState = useMemo((): ValidationState => {
    if (!hasInteracted || !text.trim()) return 'idle';

    const trimmed = text.trim();
    if (trimmed.length < 3) return 'invalid';
    if (trimmed.length > 1000) return 'invalid';
    if (/^[0-9]+$/.test(trimmed) || /^([a-zA-Z])\1+$/i.test(trimmed)) return 'warning';

    return 'valid';
  }, [text, hasInteracted]);

  const validationMessage = useMemo(() => {
    switch (validationState) {
      case 'invalid':
        return text.trim().length < 3
          ? 'Minimal 3 karakter ya!'
          : 'Teks terlalu panjang, maksimal 1000 karakter';
      case 'warning':
        return 'Coba tulis kalimat yang lebih bermakna ya!';
      default:
        return '';
    }
  }, [validationState, text]);

  const canSubmit = useMemo(() => {
    return text.trim().length >= 3 &&
           text.trim().length <= 1000 &&
           !isLoading &&
           validationState !== 'invalid';
  }, [text, isLoading, validationState]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setHasInteracted(true);
    await onTranslate(text, tone, language);
  }, [canSubmit, text, tone, language, onTranslate]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setHasInteracted(true);
  }, []);

  const clearText = useCallback(() => {
    setText('');
    setHasInteracted(false);
  }, []);

  const getValidationIcon = () => {
    switch (validationState) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-[400px]">
      {/* Language Selector Header */}
      <div className="flex items-center gap-1 p-2 border-b border-zinc-100 bg-zinc-50/50" role="tablist" aria-label="Pilih bahasa terjemahan">
        {LANGUAGES.map((l) => (
          <button
            key={l.value}
            type="button"
            role="tab"
            aria-selected={language === l.value}
            onClick={() => setLanguage(l.value)}
            className={cn(
              "px-3 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-tight",
              language === l.value
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                : "text-zinc-500 hover:text-zinc-700 hover:bg-white/50"
            )}
            disabled={isLoading}
            aria-label={`Pilih ${l.label}`}
          >
            {l.shortLabel}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex-1 relative group">
        <label htmlFor="input-text" className="sr-only">
          Tulis uneg-uneg atau emosi yang ingin diubah jadi profesional
        </label>
        <textarea
          id="input-text"
          value={text}
          onChange={handleTextChange}
          placeholder="Tulis uneg-uneg lo di sini... contoh: 'Kerjaan gue numpuk banget, kapan selesainya sih?!'"
          className={cn(
            "w-full h-full p-6 md:p-8 bg-transparent focus:outline-none resize-none text-zinc-800 placeholder:text-zinc-300 text-xl md:text-2xl font-medium leading-relaxed transition-colors",
            validationState === 'invalid' && "text-red-600 placeholder:text-red-300",
            validationState === 'warning' && "text-amber-600 placeholder:text-amber-300"
          )}
          disabled={isLoading}
          maxLength={1000}
          aria-describedby={validationMessage ? "validation-message" : undefined}
          aria-invalid={validationState === 'invalid'}
        />

        {/* Character counter and validation */}
        <div className="absolute bottom-4 left-6 flex items-center gap-3">
          <AnimatePresence>
            {validationState !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                {getValidationIcon()}
                <span
                  id="validation-message"
                  className={cn(
                    "text-xs font-medium",
                    validationState === 'valid' && "text-emerald-600",
                    validationState === 'warning' && "text-amber-600",
                    validationState === 'invalid' && "text-red-600"
                  )}
                >
                  {validationMessage}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear button */}
        {text && (
          <button
            type="button"
            onClick={clearText}
            aria-label="Hapus teks"
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Character count */}
        <div className="absolute bottom-4 right-6 text-xs text-zinc-400 font-mono">
          {text.length}/1000
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar" role="radiogroup" aria-label="Pilih tone terjemahan">
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={tone === t.value}
              onClick={() => setTone(t.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full border transition-all whitespace-nowrap flex-shrink-0",
                tone === t.value
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-lg"
                  : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
              )}
              disabled={isLoading}
              aria-label={`Pilih tone ${t.label}: ${t.description}`}
            >
              {t.icon}
              <span className="text-[9px] font-black uppercase tracking-tighter">{t.value}</span>
            </button>
          ))}
        </div>

        <motion.button
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "w-full sm:w-auto px-8 py-3 rounded-full font-black text-white shadow-xl flex items-center justify-center gap-2 transition-all text-sm uppercase tracking-tighter",
            canSubmit
              ? "bg-red-600 hover:bg-red-700 shadow-red-100"
              : "bg-zinc-200 cursor-not-allowed"
          )}
          aria-label={isLoading ? "Sedang memproses terjemahan" : "Mulai terjemahan"}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>Translate</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}

