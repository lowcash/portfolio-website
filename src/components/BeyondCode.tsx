import { Music2, Plane, BookOpen, TrendingUp, ExternalLink } from 'lucide-react';
import { SectionWrapper } from './shared/SectionWrapper';
import { SectionHeader } from './shared/SectionHeader';
import { Card } from './shared/Card';
import { TechTag } from './shared/TechTag';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../lib/section-config';

export function BeyondCode() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(5);

  const interests = [
    {
      icon: Music2,
      title: 'Music Production',
      description: 'As DJ Lowcash, I explore electronic music production and live DJ sets. From house to techno, music is where creativity meets technical precision - just like coding.',
      tags: ['Electronic Music', 'DJing', 'Live Performance'],
      link: 'https://youtube.com/@ltdlowcash?si=WTPwh27LfNIW1Q_K',
      linkText: 'Check out my mixes',
      iconColor: 'text-lime-400'
    },
    {
      icon: Plane,
      title: 'Digital Nomad Life',
      description: 'Embracing location independence and exploring the world while building software. Remote work enables experiencing different cultures and perspectives.',
      tags: ['Remote Work', 'Travel', 'Cultural Exploration'],
      iconColor: 'text-green-400'
    },
    {
      icon: BookOpen,
      title: 'Audiobooks & Hiking',
      description: 'Combining long hikes with audiobooks - learning while moving. Nature provides clarity, books provide knowledge, together they create space for thinking.',
      tags: ['Continuous Learning', 'Nature', 'Deep Thinking'],
      iconColor: 'text-emerald-400'
    },
    {
      icon: TrendingUp,
      title: 'Biohacking & Optimization',
      description: 'Exploring how to optimize physical and mental performance through data-driven experimentation. From sleep tracking to nutrition, I approach health like debugging code.',
      tags: ['Sleep Optimization', 'Nutrition', 'Performance Tracking'],
      iconColor: 'text-teal-400'
    },
    {
      icon: TrendingUp,
      title: 'Family Projects',
      description: 'Building websites for family members. Created a massage therapy website for my mom - combining web development skills with helping those closest to me.',
      tags: ['Web Development', 'Family', 'Helping Others'],
      link: 'https://pohlazenipoteleadusi.cz',
      linkText: 'Visit the site',
      iconColor: 'text-lime-400'
    }
  ];

  return (
    <SectionWrapper id="beyond-code">
      <SectionHeader
        title="Beyond Code"
        subtitle="Life is more than just programming - here's what else drives me"
        {...SECTION_STYLES.beyondCode}
      />

      <div ref={cardsRef} className="grid md:grid-cols-2 gap-3">
        {interests.map((interest, index) => (
          <Card
            key={index}
            icon={interest.icon}
            iconColor={interest.iconColor}
            title={interest.title}
            description={interest.description}
            style={getItemStyle(index) as React.CSSProperties}
            className="h-full"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {interest.tags.map((tag, tagIndex) => (
                <TechTag key={tagIndex}>{tag}</TechTag>
              ))}
            </div>
            {interest.link && (
              <a
                href={interest.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm section-link"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{interest.linkText}</span>
              </a>
            )}
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}