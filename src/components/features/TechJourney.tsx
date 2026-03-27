import { Code, Database, Cpu, Globe, Box, type LucideIcon } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { Card } from '../shared/Card';
import { TechTag } from '../shared/TechTag';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';
import { siteContent, type TechJourneyIconKey } from '../../lib/content';

const iconMap: Record<TechJourneyIconKey, LucideIcon> = {
  code: Code,
  database: Database,
  box: Box,
  cpu: Cpu,
  globe: Globe,
};

export function TechJourney() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(5);
  const { title, subtitle, items } = siteContent.techJourney;

  return (
    <SectionWrapper id="tech-journey">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        {...SECTION_STYLES.techJourney}
      />

      <div ref={cardsRef} className="grid md:grid-cols-2 gap-3">
        {items.map((skillGroup, index) => {
          const Icon = iconMap[skillGroup.icon];
          return (
            <Card
              key={index}
              icon={Icon}
              iconColor={skillGroup.iconColor}
              title={skillGroup.category}
              description={skillGroup.description}
              style={getItemStyle(index) as React.CSSProperties}
              className="h-full"
            >
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((item, itemIndex) => (
                  <TechTag key={itemIndex}>{item}</TechTag>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
}