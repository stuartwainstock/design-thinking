import PptxGenJS from 'pptxgenjs'
import type {StructuredSlides} from '@/lib/exportSlides'

const BRAND = '2B4ACB'
const CTA = 'FF6B35'
const FOREGROUND = '1A1A2E'
const MUTED = '6B6B80'
const SUNSHINE_WASH = 'FFFCEB'

export async function renderPptx(data: StructuredSlides): Promise<Buffer> {
  const pptx = new PptxGenJS()
  pptx.author = 'Design Knowledge Agent'
  pptx.title = data.deckTitle

  pptx.defineLayout({name: 'WIDE', width: 13.33, height: 7.5})
  pptx.layout = 'WIDE'

  const titleSlide = pptx.addSlide()
  titleSlide.background = {color: SUNSHINE_WASH}
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.15,
    h: 7.5,
    fill: {color: CTA},
  })
  titleSlide.addText(data.deckTitle, {
    x: 1.0,
    y: 2.0,
    w: 10.5,
    h: 2.0,
    fontSize: 36,
    fontFace: 'Arial',
    bold: true,
    color: FOREGROUND,
  })
  titleSlide.addText('Design Knowledge Agent', {
    x: 1.0,
    y: 4.2,
    w: 10.5,
    h: 0.6,
    fontSize: 14,
    fontFace: 'Arial',
    color: MUTED,
  })

  for (const slide of data.slides) {
    const s = pptx.addSlide()
    s.background = {color: 'FFFFFF'}
    s.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.15,
      h: 7.5,
      fill: {color: BRAND},
    })
    s.addText(slide.title, {
      x: 1.0,
      y: 0.5,
      w: 11.0,
      h: 1.0,
      fontSize: 28,
      fontFace: 'Arial',
      bold: true,
      color: FOREGROUND,
    })
    s.addShape(pptx.ShapeType.line, {
      x: 1.0,
      y: 1.5,
      w: 11.0,
      h: 0,
      line: {color: 'E0E0E0', width: 1},
    })

    const bulletRows = slide.points.map((pt) => ({
      text: pt,
      options: {
        fontSize: 16,
        fontFace: 'Arial' as const,
        color: FOREGROUND,
        bullet: {code: '2022'},
        paraSpaceAfter: 8,
      },
    }))

    s.addText(bulletRows, {
      x: 1.0,
      y: 1.8,
      w: 11.0,
      h: 3.8,
      valign: 'top',
    })

    s.addShape(pptx.ShapeType.roundRect, {
      x: 1.0,
      y: 5.9,
      w: 11.0,
      h: 1.0,
      fill: {color: SUNSHINE_WASH},
      rectRadius: 0.15,
    })
    s.addText(`Takeaway: ${slide.takeaway}`, {
      x: 1.2,
      y: 5.95,
      w: 10.6,
      h: 0.9,
      fontSize: 14,
      fontFace: 'Arial',
      bold: true,
      color: CTA,
      valign: 'middle',
    })
  }

  const output = await pptx.write({outputType: 'nodebuffer'})
  return output as unknown as Buffer
}
