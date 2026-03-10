import React, { useState, useRef, useCallback } from 'react';
import { Copy, Check, Download, Award, Star, Heart, Loader2, ShieldCheck, Fingerprint, Share2, Trophy, Medal, Crown, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TranslationResult } from '../types';
import { cn } from '../lib/utils';
import { toPng } from 'html-to-image';
import { filterProfanity } from '../lib/profanity';
import DownloadModal from './DownloadModal';

// Loading skeleton component
const ResultSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-[2.5rem] border border-zinc-100 flex flex-col h-full overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] relative"
  >
    {/* Header skeleton */}
    <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-zinc-100 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse" />
          <div className="h-2 w-16 bg-zinc-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-8 h-8 rounded-xl bg-zinc-100 animate-pulse" />
      </div>
    </div>

    {/* Main content skeleton */}
    <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-8">
      <div className="space-y-4 w-full max-w-md">
        <div className="h-8 w-3/4 bg-zinc-100 rounded animate-pulse mx-auto" />
        <div className="h-6 w-1/2 bg-zinc-100 rounded animate-pulse mx-auto" />
        <div className="h-4 w-2/3 bg-zinc-100 rounded animate-pulse mx-auto" />
      </div>

      <div className="h-12 w-32 bg-zinc-100 rounded-full animate-pulse" />
    </div>

    {/* Footer skeleton */}
    <div className="px-8 py-8 bg-zinc-50/50 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-1.5 w-full">
        <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse" />
        <div className="h-2 w-full bg-zinc-100 rounded-full animate-pulse" />
      </div>
      <div className="space-y-1.5 w-full">
        <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
        <div className="h-2 w-full bg-zinc-100 rounded-full animate-pulse" />
      </div>
    </div>

    <div className="p-6 bg-white border-t border-zinc-100 flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 animate-pulse" />
      <div className="flex-1 h-12 bg-zinc-100 rounded-2xl animate-pulse" />
    </div>
  </motion.div>
);

interface ResultCardProps {
  result: TranslationResult | null;
}

interface CertificateContentProps {
  result: TranslationResult;
  serialNumber: string;
  patienceLevel: any;
  includeEvidence?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const CertificateContent = React.forwardRef<HTMLDivElement, CertificateContentProps>(({
  result,
  serialNumber,
  patienceLevel,
  includeEvidence
}, ref) => {
  // Dynamic font size based on text length
  const getFontSize = (text: string) => {
    if (text.length > 200) return 'text-xl';
    if (text.length > 150) return 'text-2xl';
    if (text.length > 100) return 'text-3xl';
    return 'text-4xl';
  };

  return (
    <div
      ref={ref}
      className="bg-white p-12 w-[600px] min-h-[600px] flex flex-col justify-between border-[20px] border-zinc-900 rounded-[4rem] relative overflow-hidden shadow-2xl"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <Star className="absolute top-10 left-10 w-32 h-32" />
        <Heart className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] text-red-600" />
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-red-100">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Sertifikat Sabar</h3>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.3em] font-bold">ID: {serialNumber}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center py-8 border-y-4 border-double border-zinc-100 relative gap-6">
          <div className="space-y-2">
            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.25em] font-black text-center">Diberikan kepada jiwa yang paling chill:</p>
            <p className={cn(
              "font-serif italic text-zinc-900 leading-tight text-center px-4 break-words whitespace-pre-wrap",
              getFontSize(result.translated)
            )}>
              "{result.translated}"
            </p>
          </div>

          {includeEvidence && (
            <div className="mt-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-2">Bukti Kejadian (Original):</p>
              <p className="text-[10px] text-zinc-500 font-medium italic line-clamp-3">"{result.original}"</p>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between pt-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", patienceLevel?.bg, patienceLevel?.color)}>
                {patienceLevel?.name}
              </div>
            </div>
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Savage Index</span>
                <span className="text-xl font-black text-zinc-900">{result.score.savage}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">Professionalism</span>
                <span className="text-xl font-black text-red-600">{result.score.professional}%</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-24 h-24 border-4 border-red-600 rounded-full flex flex-col items-center justify-center font-black text-red-600 bg-white shadow-xl border-dashed rotate-12">
              <Zap className="w-6 h-6 mb-1 fill-red-600" />
              <span className="text-sm">SAH!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CertificateContent.displayName = 'CertificateContent';

interface ResultCardProps {
  result: TranslationResult | null;
  isLoading?: boolean;
}

const ScoreBar = ({ label, value, color, delay = 0 }: { label: string, value: number, color: string, delay?: number }) => (
  <div className="space-y-1.5 w-full">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
      <span className={cn("text-xs font-black", color)}>{value}%</span>
    </div>
    <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className={cn("h-full rounded-full", color.replace('text-', 'bg-'))}
      />
    </div>
  </div>
);

export default function ResultCard({ result, isLoading = false }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showIntent, setShowIntent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const serialNumber = React.useMemo(() =>
    `SBR-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    []);

  const patienceLevel = React.useMemo(() => {
    if (!result) return null;
    const avg = (result.score.savage + result.score.professional) / 2;
    if (avg > 90) return {
      name: 'Zen Master',
      desc: 'Sabar tingkat dewa, no cap! 🧘‍♂️',
      icon: <Crown className="w-6 h-6" />,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    };
    if (avg > 70) return {
      name: 'Elite Sabar',
      desc: 'Udah pro banget nahan emosi. 🛡️',
      icon: <Trophy className="w-6 h-6" />,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    };
    if (avg > 40) return {
      name: 'Pro Sabar',
      desc: 'Lumayan lah, masih aman terkendali. 👌',
      icon: <Medal className="w-6 h-6" />,
      color: 'text-zinc-900',
      bg: 'bg-zinc-100',
      border: 'border-zinc-200'
    };
    return {
      name: 'Sabar Pemula',
      desc: 'Masih belajar sabar, semangat ya! 🌱',
      icon: <Award className="w-6 h-6" />,
      color: 'text-zinc-400',
      bg: 'bg-zinc-50',
      border: 'border-zinc-100'
    };
  }, [result]);

  const handleCopy = useCallback(async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.translated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = result.translated;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleDownload = useCallback(async (includeEvidence: boolean) => {
    if (!cardRef.current || !result) return;
    setIsDownloading(true);

    try {
      // Wait for UI to update
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = cardRef.current;

      // Use a higher scale for better quality
      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
        }
      });

      const link = document.createElement('a');
      link.download = `sabar-in-certificate-${serialNumber}.png`;
      link.href = dataUrl;
      link.click();

      setIsModalOpen(false);
    } catch (error) {
      console.error('Download failed:', error);
      // Could show a toast notification here
    } finally {
      setIsDownloading(false);
    }
  }, [result, serialNumber]);

  const handleShareWhatsApp = useCallback(() => {
    if (!result) return;
    const text = `Cek sertifikat kesabaran gue dari Sabar.in! 🛡️\n\n"${result.translated}"\n\nSavage Level: ${result.score.savage}%\nProfessionalism: ${result.score.professional}%\n\nCoba sendiri di: ${window.location.origin}`;

    try {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open WhatsApp:', error);
    }
  }, [result]);

  // Show skeleton when loading
  if (isLoading) {
    return <ResultSkeleton />;
  }

  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-[2.5rem] border border-zinc-100 flex flex-col h-full overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] relative"
        >
          {/* Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-zinc-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-2xl border border-white/10"
          >
            <Zap className="w-3 h-3 text-red-500 fill-red-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">Achievement Unlocked!</span>
          </motion.div>

          {/* Header Section */}
          <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm", patienceLevel?.bg, patienceLevel?.color)}>
                {patienceLevel?.icon}
              </div>
              <div>
                <h4 className={cn("text-xs font-black uppercase tracking-widest", patienceLevel?.color)}>
                  {patienceLevel?.name}
                </h4>
                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">Serial: {serialNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                title="Salin terjemahan"
                aria-label={copied ? "Berhasil disalin" : "Salin terjemahan"}
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 opacity-10">
                <Star className="w-12 h-12 text-red-600 fill-red-600" />
              </div>
              <p className="text-2xl md:text-4xl font-serif italic text-zinc-900 leading-tight px-4">
                "{result.translated}"
              </p>
              <div className="absolute -bottom-6 -right-6 opacity-10">
                <Heart className="w-12 h-12 text-red-600 fill-red-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={cn("px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]", patienceLevel?.bg, patienceLevel?.color, patienceLevel?.border)}
            >
              {patienceLevel?.desc}
            </motion.div>
          </div>

          {/* Gamification Stats Section */}
          <div className="px-8 py-8 bg-zinc-50/50 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScoreBar label="Savage Index" value={result.score.savage} color="text-zinc-900" delay={0.5} />
            <ScoreBar label="Professionalism" value={result.score.professional} color="text-red-600" delay={0.7} />
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white border-t border-zinc-100 flex items-center gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all active:scale-95"
              aria-label="Bagikan ke WhatsApp"
            >
              <Share2 size={20} />
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-zinc-200 hover:bg-black transition-all"
              aria-label="Download sertifikat sebagai PNG"
            >
              <Download size={18} />
              <span>Amankan Bukti (PNG)</span>
            </motion.button>
          </div>

          {/* Hidden Certificate for Capture */}
          <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none" aria-hidden="true">
            <CertificateContent
              ref={cardRef}
              result={result}
              serialNumber={serialNumber}
              patienceLevel={patienceLevel}
              includeEvidence={showIntent}
            />
          </div>

          <DownloadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDownload={() => handleDownload(showIntent)}
            isDownloading={isDownloading}
            includeEvidence={showIntent}
            onEvidenceToggle={setShowIntent}
            previewElement={
              <div className="w-full flex justify-center overflow-hidden">
                <div className="scale-[0.45] md:scale-[0.6] origin-top">
                  <CertificateContent
                    result={result}
                    serialNumber={serialNumber}
                    patienceLevel={patienceLevel}
                    includeEvidence={showIntent}
                  />
                </div>
              </div>
            }
          />
        </motion.div>
      ) : (
        <div className="w-full h-full min-h-[400px] border border-zinc-100 rounded-[2.5rem] p-12 text-center bg-zinc-50/50 flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-white p-6 rounded-3xl shadow-sm"
          >
            <Heart className="w-12 h-12 text-red-100 fill-red-50 mx-auto" />
          </motion.div>
          <div className="space-y-1">
            <h4 className="text-xl font-black text-zinc-300 uppercase tracking-tighter">Hasil Poles AI</h4>
            <p className="text-zinc-400 text-[10px] font-medium max-w-[180px] mx-auto uppercase tracking-widest">Ketik di sebelah kiri buat liat keajaiban korporat.</p>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
