import { Brain, Sparkles, Zap } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { Card } from '../shared/Card';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';

export function WhoIAm() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(3);

  const highlights = [
    {
      icon: Zap,
      title: 'Fullstack Development',
      description: 'TypeScript, React, Next.js, tRPC - building complete web applications from frontend to backend',
      iconColor: 'text-cyan-400'
    },
    {
      icon: Sparkles,
      title: 'Agentic Workflow',
      description: 'Leveraging AI agents and prompt engineering to architect and build systems faster - the future of software development',
      iconColor: 'text-blue-400'
    },
    {
      icon: Brain,
      title: 'ML & Computer Vision',
      description: "Master's in Computer Vision, currently experimenting with ML models and planning to dive deeper into OpenCV and AI systems",
      iconColor: 'text-indigo-400'
    }
  ];

  return (
    <SectionWrapper id="who-i-am">
      <SectionHeader
        title="Who I Am"
        subtitle="From computer graphics to modern web development - a journey of continuous learning"
        {...SECTION_STYLES.whoIAm}
      />

      <div ref={cardsRef} className="space-y-3 max-w-3xl mx-auto">
        {highlights.map((item, index) => (
          <Card
            key={index}
            icon={item.icon}
            iconColor={item.iconColor}
            title={item.title}
            description={item.description}
            style={getItemStyle(index) as React.CSSProperties}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}