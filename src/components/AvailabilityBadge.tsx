import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function AvailabilityBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.5 }}
      className="fixed top-4 right-4 md:top-8 md:right-8 z-50"
    >
      <div className="relative">
        {/* Badge - clean minimal style */}
        <div 
          className="relative rounded-2xl px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 transition-all duration-300"
        >
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span className="text-xs md:text-sm text-gray-200">Available (ML priority)</span>
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
        </div>
      </div>
    </motion.div>
  );
}