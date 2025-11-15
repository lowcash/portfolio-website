import { Handshake, FlaskConical, Network } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useStaggerFadeIn } from '../hooks/useStaggerFadeIn';

export function WhatsNext() {
  const sectionReveal = useScrollReveal();
  const { ref: cardsRef, getItemStyle } = useStaggerFadeIn(3);

  const items = [
    {
      icon: Handshake,
      title: 'Freelance Projects',
      description: 'Open to building web applications with modern fullstack tools and AI-assisted workflows',
      iconColor: 'text-yellow-400'
    },
    {
      icon: FlaskConical,
      title: 'ML Experiments',
      description: 'Currently focused on Forex ML/RL system, eager to collaborate on innovative AI projects',
      iconColor: 'text-amber-400'
    },
    {
      icon: Network,
      title: 'Networking',
      description: 'Always happy to connect with fellow developers, entrepreneurs, and tech enthusiasts',
      iconColor: 'text-yellow-400'
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 md:px-8 relative">
      <div 
        ref={sectionReveal.ref}
        style={sectionReveal.style}
        className="max-w-6xl mx-auto"
      >
        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 pb-[3px] bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(250, 204, 21, 0.6)) drop-shadow(0 0 24px rgba(251, 191, 36, 0.4))'
            }}
          >
            What's Next?
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Looking forward to building meaningful projects and collaborating with interesting people
          </p>
        </div>

        {/* CARDS - 3 ROWS VERTICAL LAYOUT */}
        <div ref={cardsRef} className="space-y-3 max-w-3xl mx-auto">
          {items.map((item, index) => (
            <div key={index} className="relative">
              <div
                className="rounded-2xl p-8 transition-all duration-500"
                style={{
                  ...getItemStyle(index),
                } as React.CSSProperties}
              >
                <div className="flex items-start gap-4">
                  <item.icon className={`w-10 h-10 ${item.iconColor} flex-shrink-0`} />
                  <div className="flex-grow">
                    <h3 className="text-2xl mb-1 text-white">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}