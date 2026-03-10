import { Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="w-full py-5 px-6 border-b border-zinc-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="bg-red-600 p-2 rounded-xl shadow-xl shadow-red-100 rotate-3">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-zinc-900 uppercase">Sabar.in</h1>
            <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.2em] font-bold">Protokol Anti-Tantrum</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Sertifikasi Sabar</span>
        </motion.div>
      </div>
    </header>
  );
}
