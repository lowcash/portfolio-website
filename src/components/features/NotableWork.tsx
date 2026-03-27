import { Eye, Glasses, TrendingUp, ExternalLink, Globe, type LucideIcon } from 'lucide-react';
import { SectionWrapper } from '../shared/SectionWrapper';
import { SectionHeader } from '../shared/SectionHeader';
import { Card } from '../shared/Card';
import { TechTag } from '../shared/TechTag';
import { useStaggerFadeIn } from '../../hooks/useStaggerFadeIn';
import { SECTION_STYLES } from '../../lib/section-config';
import { siteContent, type NotableWorkIconKey } from '../../lib/content';

const iconMap: Record<NotableWorkIconKey, LucideIcon> = {
  eye: Eye,
  glasses: Glasses,
  trendingUp: TrendingUp,
  globe: Globe,
};

export function NotableWork() {
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(4);
  const { title, subtitle, projects } = siteContent.notableWork;

  return (
    <SectionWrapper id="notable-work">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        {...SECTION_STYLES.notableWork}
      />

      <div ref={cardsRef} className="grid md:grid-cols-2 gap-3">
        {projects.map((project, index) => {
          const Icon = iconMap[project.icon];
          return (
            <Card
              key={index}
              icon={Icon}
              iconColor={project.iconColor}
              title={project.title}
              subtitle={project.period}
              description={project.description}
              style={getItemStyle(index) as React.CSSProperties}
              className="h-full"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, techIndex) => (
                  <TechTag key={techIndex}>{tech}</TechTag>
                ))}
              </div>
              {'link' in project && project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm section-link"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{'linkText' in project && project.linkText ? project.linkText : 'Watch Demo Video'}</span>
                </a>
              )}
              {'multipleLinks' in project && project.multipleLinks && (
                <div className="flex flex-col gap-2">
                  {project.multipleLinks.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm section-link"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{link.text}</span>
                    </a>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
}