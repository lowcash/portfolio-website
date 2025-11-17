import { SectionWrapper } from './shared/SectionWrapper';
import { SectionHeader } from './shared/SectionHeader';
import { TechTag } from './shared/TechTag';
import { ExternalLink } from 'lucide-react';
import { SECTION_STYLES } from '../lib/section-config';

export function BeyondCode() {
  return (
    <SectionWrapper id="beyond-code">
      <SectionHeader
        title="Beyond Code"
        subtitle="Life is more than just programming - here's what else drives me"
        {...SECTION_STYLES.beyondCode}
      />

      <div className="grid md:grid-cols-2 gap-3">
        {/* Music Production */}
        <div className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 text-green-400 flex-shrink-0 text-2xl">🎵</div>
            <div className="flex-grow">
              <h3 className="text-xl mb-1 text-white">Music Production</h3>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            As DJ Lowcash, I explore electronic music production and live DJ sets. From house to techno, music is where creativity meets technical precision - just like coding.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <TechTag>Electronic Music</TechTag>
            <TechTag>DJing</TechTag>
            <TechTag>Live Performance</TechTag>
          </div>
          <a
            href="https://youtube.com/@ltdlowcash?si=WTPwh27LfNIW1Q_K"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm group"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Check out my mixes</span>
          </a>
        </div>

        {/* Digital Nomad Life */}
        <div className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 text-green-400 flex-shrink-0 text-2xl">🎧</div>
            <div className="flex-grow">
              <h3 className="text-xl mb-1 text-white">Digital Nomad Life</h3>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Embracing location independence and exploring the world while building software. Remote work enables experiencing different cultures and perspectives.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <TechTag>Remote Work</TechTag>
            <TechTag>Travel</TechTag>
            <TechTag>Cultural Exploration</TechTag>
          </div>
        </div>

        {/* Audiobooks & Hiking */}
        <div className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 text-green-400 flex-shrink-0 text-2xl">📚</div>
            <div className="flex-grow">
              <h3 className="text-xl mb-1 text-white">Audiobooks & Hiking</h3>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Combining long hikes with audiobooks - learning while moving. Nature provides clarity, books provide knowledge, together they create space for thinking.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <TechTag>Continuous Learning</TechTag>
            <TechTag>Nature</TechTag>
            <TechTag>Deep Thinking</TechTag>
          </div>
        </div>

        {/* Biohacking & Optimization */}
        <div className="rounded-2xl p-8 transition-all duration-500 h-full flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 text-green-400 flex-shrink-0 text-2xl">📈</div>
            <div className="flex-grow">
              <h3 className="text-xl mb-1 text-white">Biohacking & Optimization</h3>
            </div>
          </div>
          <p className="text-gray-400 mb-6">
            Exploring how to optimize physical and mental performance through data-driven experimentation. From sleep tracking to nutrition, I approach health like debugging code.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <TechTag>Sleep Optimization</TechTag>
            <TechTag>Nutrition</TechTag>
            <TechTag>Performance Tracking</TechTag>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}