import { ImageResponse } from 'next/og'

export const alt = 'Lukáš Machala - Fullstack Developer & AI Architect'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

const techPills = ['TypeScript', 'React 19', 'Next.js 16', 'AI Workflows']

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 18% 18%, rgba(82, 231, 255, 0.12), transparent 32%), radial-gradient(circle at 78% 24%, rgba(236, 72, 153, 0.18), transparent 38%), linear-gradient(135deg, #07101f 0%, #130f24 45%, #1b1630 100%)',
        color: '#f8fafc',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 58%, rgba(168, 85, 247, 0.22), transparent 40%), radial-gradient(circle at 85% 82%, rgba(96, 165, 250, 0.12), transparent 28%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: '100%',
          padding: '56px 64px',
          gap: '44px',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 288,
            minWidth: 288,
            borderRadius: 36,
            padding: 18,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              borderRadius: 28,
              background: 'linear-gradient(145deg, #0b1324 0%, #1b1631 100%)',
              border: '2px solid rgba(236,72,153,0.35)',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 50% 48%, rgba(168,85,247,0.4), transparent 42%), radial-gradient(circle at 70% 24%, rgba(236,72,153,0.18), transparent 26%)',
              }}
            />
            <div
              style={{
                position: 'relative',
                display: 'flex',
                fontSize: 156,
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: '-0.08em',
                color: '#fdf4ff',
                textShadow: '0 10px 30px rgba(236,72,153,0.24)',
              }}
            >
              LM
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            paddingTop: 6,
            paddingBottom: 8,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#cbd5e1',
              }}
            >
              lowcash.dev
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 28,
                fontSize: 82,
                fontWeight: 900,
                lineHeight: 1.02,
                letterSpacing: '-0.06em',
                color: '#f8fafc',
              }}
            >
              Lukáš Machala
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 18,
                fontSize: 50,
                lineHeight: 1.08,
                fontWeight: 700,
                color: '#f472b6',
              }}
            >
              Fullstack Developer & AI Architect
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 24,
                maxWidth: 720,
                fontSize: 26,
                lineHeight: 1.4,
                color: '#dbe4f0',
              }}
            >
              Building modern web products with TypeScript, React, Next.js, and AI-assisted workflows for faster, more
              deliberate delivery.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {techPills.map((pill) => (
                <div
                  key={pill}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 24px',
                    borderRadius: 999,
                    border: '1px solid rgba(196,181,253,0.34)',
                    background: 'rgba(139, 92, 246, 0.12)',
                    color: '#f5d0fe',
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {pill}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#94a3b8',
                fontSize: 24,
              }}
            >
              <div style={{ display: 'flex' }}>Portfolio • Systems • Product Thinking</div>
              <div style={{ display: 'flex', color: '#e2e8f0' }}>lowcash.dev</div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    size,
  )
}
