import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ShieldCheck, Fingerprint, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => Promise<void>;
  previewElement: React.ReactNode;
  isDownloading: boolean;
  includeEvidence: boolean;
  onEvidenceToggle: (value: boolean) => void;
}

export default function DownloadModal({ 
  isOpen, 
  onClose, 
  onDownload, 
  previewElement,
  isDownloading,
  includeEvidence,
  onEvidenceToggle
}: DownloadModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Preview Section */}
          <div className="flex-1 bg-zinc-50 p-6 md:p-12 overflow-y-auto flex flex-col items-center justify-start border-b md:border-b-0 md:border-r border-zinc-100" aria-hidden="true">
            <div className="w-full max-w-md py-8">
              <div className="text-center mb-12">
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">Live Preview</span>
              </div>
              {previewElement}
            </div>
          </div>

          {/* Controls Section */}
          <div className="w-full md:w-[400px] p-8 md:p-12 flex flex-col justify-between bg-white">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 id="modal-title" className="text-3xl font-black text-zinc-900 uppercase tracking-tighter leading-none">Siap <br /><span className="text-red-600">Amankan?</span></h3>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-zinc-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  Sertifikat ini adalah bukti sah kesabaran lo yang luar biasa. Pilih format yang paling pas buat pamer.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => onEvidenceToggle(!includeEvidence)}
                    aria-pressed={includeEvidence}
                    className={cn(
                      "w-full p-6 rounded-3xl border-4 transition-all flex items-center gap-4 text-left group",
                      includeEvidence 
                        ? "bg-red-50 border-red-600 text-red-900 shadow-xl shadow-red-100" 
                        : "bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-xl transition-all",
                      includeEvidence ? "bg-red-600 text-white" : "bg-zinc-100 text-zinc-400 group-hover:bg-zinc-200"
                    )}>
                      {includeEvidence ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black uppercase tracking-tight">Lampirkan Bukti</div>
                      <div className="text-[10px] opacity-60 font-medium">Tampilkan teks asli lo di sertifikat</div>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      includeEvidence ? "bg-red-600 border-red-600" : "border-zinc-200"
                    )}>
                      {includeEvidence && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <button
                onClick={() => onDownload()}
                disabled={isDownloading}
                className={cn(
                  "w-full py-6 rounded-[2rem] font-black text-white shadow-2xl flex items-center justify-center gap-4 transition-all text-xl uppercase tracking-tighter",
                  isDownloading ? "bg-zinc-200 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 shadow-red-200"
                )}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Mengamankan...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-6 h-6" />
                    <span>Download PNG</span>
                  </>
                )}
              </button>
              <p className="text-[9px] text-center font-mono text-zinc-400 uppercase tracking-widest">
                Format: 1:1 High Resolution PNG
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
