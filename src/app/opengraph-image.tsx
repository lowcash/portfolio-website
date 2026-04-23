import { ImageResponse } from 'next/og'

import { OPEN_GRAPH_IMAGE } from '@/lib/site-config'

export const alt = OPEN_GRAPH_IMAGE.alt
export const contentType = 'image/png'
export const size = OPEN_GRAPH_IMAGE.size

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 16% 18%, rgba(56, 189, 248, 0.16), transparent 34%), radial-gradient(circle at 84% 72%, rgba(244, 114, 182, 0.18), transparent 36%), linear-gradient(140deg, #07101f 0%, #140f28 58%, #1a1d35 100%)',
        color: '#f8fafc',
        fontFamily: 'Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -180,
          left: -120,
          width: 520,
          height: 520,
          borderRadius: '999px',
          background: 'radial-gradient(circle at center, rgba(96, 165, 250, 0.18), transparent 68%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          width: 1020,
          height: 500,
          padding: '54px 62px',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: 32,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(8, 14, 32, 0.72)',
          boxShadow: '0 24px 72px rgba(0,0,0,0.38)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#aab8d2',
            }}
          >
            {OPEN_GRAPH_IMAGE.siteLabel}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 26,
              fontSize: 88,
              lineHeight: 1.02,
              letterSpacing: '-0.06em',
              fontWeight: 900,
              color: '#f8fafc',
            }}
          >
            {OPEN_GRAPH_IMAGE.headline}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 16,
              fontSize: 46,
              lineHeight: 1.08,
              fontWeight: 700,
              color: '#f472b6',
            }}
          >
            {OPEN_GRAPH_IMAGE.subheadline}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 22,
              maxWidth: 860,
              fontSize: 27,
              lineHeight: 1.35,
              color: '#dbe4f0',
            }}
          >
            {OPEN_GRAPH_IMAGE.description}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', columnGap: 12, rowGap: 16, flexWrap: 'wrap' }}>
            {OPEN_GRAPH_IMAGE.techItems.map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 18px',
                  borderRadius: 999,
                  background: 'rgba(148, 163, 184, 0.16)',
                  color: '#e7edf8',
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 22,
              color: '#9eb0ca',
            }}
          >
            <div style={{ display: 'flex' }}>{OPEN_GRAPH_IMAGE.footerLabel}</div>
            <div style={{ display: 'flex', color: '#e2e8f0' }}>{OPEN_GRAPH_IMAGE.siteLabel}</div>
          </div>
        </div>
      </div>
    </div>,
    size,
  )
}
