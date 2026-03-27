import { Music2, Plane, BookOpen, TrendingUp, ExternalLink } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { Card } from '../shared/Card';
import { TechTag } from '../shared/TechTag';
import { SECTION_STYLES } from '../../lib/section-config';
import { siteContent } from '../../lib/content';

export function BeyondCode() {

  const content = siteContent.beyondCode;
  const iconMap = {
    music2: Music2,
    plane: Plane,
    bookOpen: BookOpen,
    trendingUp: TrendingUp,
  } as const;

  return (
    <SectionWrapper id="beyond-code">
      <SectionHeader
        title={content.title}
        subtitle={content.subtitle}
        {...SECTION_STYLES.beyondCode}
      />

      <div className="grid md:grid-cols-2 gap-3">
        {content.items.map((interest, index) => (
          <Card
            key={index}
            icon={iconMap[interest.icon]}
            iconColor={interest.iconColor}
            title={interest.title}
            description={interest.description}
           
            className="h-full"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {interest.tags.map((tag, tagIndex) => (
                <TechTag key={tagIndex}>{tag}</TechTag>
              ))}
            </div>
            {'link' in interest && 'linkText' in interest && interest.link && interest.linkText && (
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