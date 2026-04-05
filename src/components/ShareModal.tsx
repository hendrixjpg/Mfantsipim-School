import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Twitter, Facebook, Linkedin, Link, Check, Share2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:text-[#1DA1F2]',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:text-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:text-[#0A66C2]',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden"
          >
            {/* HUD Corners */}
            <div className="hud-corner hud-corner-tl -top-1 -left-1" />
            <div className="hud-corner hud-corner-tr -top-1 -right-1" />
            <div className="hud-corner hud-corner-bl -bottom-1 -left-1" />
            <div className="hud-corner hud-corner-br -bottom-1 -right-1" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center neon-red">
                  <Share2 className="text-red-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">Share_Feed</h2>
                  <p className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-widest">DISTRIBUTION_PROTOCOL_v1.0</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {shareLinks.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-3xl glass glass-hover border border-white/5 transition-all group",
                      platform.color
                    )}
                  >
                    <platform.icon size={28} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest">{platform.name}</span>
                  </a>
                ))}
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-4 p-4 glass border border-white/10 rounded-2xl">
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Direct_Link</p>
                    <p className="text-xs text-white truncate font-medium">{url}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={cn(
                      "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      copied 
                        ? "bg-green-600/20 text-green-500 border border-green-600/30" 
                        : "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20"
                    )}
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> COPIED
                      </>
                    ) : (
                      <>
                        <Link size={14} /> COPY
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">ENCRYPTED_TRANSMISSION_READY</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
