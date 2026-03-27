import { Brain, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { Card } from '../shared/Card';
import { SECTION_STYLES } from '../../lib/section-config';
import { siteContent, type WhoIAmIconKey } from '../../lib/content';

const iconMap: Record<WhoIAmIconKey, LucideIcon> = {
  zap: Zap,
  sparkles: Sparkles,
  brain: Brain,
};

export function WhoIAm() {
  const { title, subtitle, items } = siteContent.whoIAm;

  return (
    <SectionWrapper id="who-i-am">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        {...SECTION_STYLES.whoIAm}
      />

      <div className="space-y-3 max-w-3xl mx-auto">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon];
          return (
            <Card
              key={index}
              icon={Icon}
              iconColor={item.iconColor}
              title={item.title}
              description={item.description}
             
            />
          );
        })}
      </div>
    </SectionWrapper>
  );
}