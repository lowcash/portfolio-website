import { Music, Headphones, Heart, BookOpen, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';

export function BeyondCode() {
  const sectionReveal = useScrollReveal();
  const { ref: interestsRef, getItemStyle } = useStaggerFadeIn(4);

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 md:px-8 relative">
      <div 
        ref={sectionReveal.ref}
        style={sectionReveal.style}
        className="max-w-6xl mx-auto"
      >
        {/* HEADER */}
        <div className="text-center mb-20">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(163, 230, 53, 0.6)) drop-shadow(0 0 24px rgba(34, 197, 94, 0.4))'
            }}
          >
            Beyond Code
          </h2>
          <p className="text-base md:text-lg text-gray-400">
            Life is more than just programming - here's what else drives me
          </p>
        </div>

        {/* INTERESTS */}
        <div ref={interestsRef} className="grid md:grid-cols-2 gap-3">
          {/* Music */}
          <div className="relative h-full">
            <div 
              className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col"
              style={{
                ...getItemStyle(0),
              } as React.CSSProperties}
            >
              <div className="flex items-start gap-4 mb-4">
                <Music className="w-10 h-10 text-green-400 flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-xl mb-1 text-white">Music Production</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">
                As DJ Lowcash, I explore electronic music production and live DJ sets. 
                From house to techno, music is where creativity meets technical precision - just like coding.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Electronic Music', 'DJing', 'Sound Design'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Biohacking */}
          <div className="relative h-full">
            <div 
              className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col"
              style={{
                ...getItemStyle(1),
              } as React.CSSProperties}
            >
              <div className="flex items-start gap-4 mb-4">
                <Heart className="w-10 h-10 text-green-400 flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-xl mb-1 text-white">Biohacking & Optimization</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">
                Exploring how to optimize physical and mental performance through data-driven experimentation. 
                From sleep tracking to nutrition, I approach health like debugging code.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Sleep Optimization', 'Nutrition', 'Performance Tracking'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Travel */}
          <div className="relative h-full">
            <div 
              className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col"
              style={{
                ...getItemStyle(2),
              } as React.CSSProperties}
            >
              <div className="flex items-start gap-4 mb-4">
                <Headphones className="w-10 h-10 text-green-400 flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-xl mb-1 text-white">Digital Nomad Life</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">
                Embracing location independence and exploring the world while building software. 
                Remote work enables experiencing different cultures and perspectives.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Remote Work', 'Travel', 'Cultural Exploration'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Learning */}
          <div className="relative h-full">
            <div 
              className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col"
              style={{
                ...getItemStyle(3),
              } as React.CSSProperties}
            >
              <div className="flex items-start gap-4 mb-4">
                <Sparkles className="w-10 h-10 text-green-400 flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-xl mb-1 text-white">Audiobooks & Hiking</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6 flex-grow">
                Combining long hikes with audiobooks - learning while moving. 
                Nature provides clarity, books provide knowledge, together they create space for thinking.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Continuous Learning', 'Nature', 'Deep Thinking'].map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}