import { Rocket, TrendingUp, Target } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';

export function WhatsNext() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(3);

  const items = [
    {
      icon: Rocket,
      title: 'Freelance Projects',
      description: 'Open to building web applications with modern fullstack tools and AI-assisted workflows',
      iconColor: 'text-yellow-400'
    },
    {
      icon: TrendingUp,
      title: 'ML Experiments',
      description: 'Currently focused on Forex ML/RL system, eager to collaborate on innovative AI projects',
      iconColor: 'text-amber-400'
    },
    {
      icon: Target,
      title: 'Networking',
      description: 'Always happy to connect with fellow developers, entrepreneurs, and tech enthusiasts',
      iconColor: 'text-yellow-400'
    }
  ];

  return (
    <SectionWrapper id="whats-next">
      <SectionHeader
        title="What's Next?"
        subtitle="Looking forward to building meaningful projects and collaborating with interesting people"
        {...SECTION_STYLES.whatsNext}
      />

      <div ref={cardsRef} className="space-y-3 max-w-3xl mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl p-8 transition-all duration-500"
            style={getItemStyle(index) as React.CSSProperties}
          >
            <div className="flex items-start gap-4">
              <item.icon className={`w-10 h-10 ${item.iconColor} flex-shrink-0`} />
              <div className="flex-grow">
                <h3 className="text-2xl mb-1 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}