import {ImageResponse} from 'next/og'
import {getSiteContent} from '@/lib/sanity'

export const alt = 'fieldnotes — your design team’s knowledge, on demand'
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

const COLORS = {
  background: '#FFF8E1',
  foreground: '#1A1A2E',
  brand: '#2B4ACB',
  sunshine: '#FFD43B',
  cta: '#FF6B35',
  pink: '#FF4D6A',
}

export default async function OpengraphImage() {
  const {seo} = await getSiteContent()

  // If an editor uploaded a custom social image in Studio, use it verbatim.
  if (seo.ogImage?.url) {
    return new ImageResponse(
      (
        <img
          src={seo.ogImage.url}
          alt=""
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ),
      size,
    )
  }

  const siteName = seo.siteName || 'fieldnotes'
  const tagline = seo.tagline || "your design team's knowledge, on demand"
  const dotColors = [COLORS.pink, COLORS.sunshine, COLORS.brand, COLORS.cta]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: COLORS.background,
          padding: '96px',
        }}
      >
        <div style={{display: 'flex', gap: '16px', marginBottom: '40px'}}>
          {dotColors.map((c) => (
            <div
              key={c}
              style={{width: '28px', height: '28px', borderRadius: '9999px', backgroundColor: c}}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: '88px',
            fontWeight: 800,
            color: COLORS.foreground,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '40px',
            fontWeight: 600,
            color: COLORS.brand,
            marginTop: '28px',
            maxWidth: '900px',
            lineHeight: 1.2,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    size,
  )
}
