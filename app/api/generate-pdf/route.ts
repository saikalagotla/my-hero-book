import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';
import { GeneratedBook } from '@/lib/types';

const PAGE_SIZE = 612;
const IMAGE_HEIGHT = 380;
const TEXT_AREA_TOP = PAGE_SIZE - IMAGE_HEIGHT;
const MARGIN = 46;
const TEXT_WIDTH = PAGE_SIZE - MARGIN * 2;

function wrapText(text: string, maxWidth: number, fontSize: number, avgCharWidth: number): string[] {
  const charsPerLine = Math.floor(maxWidth / (fontSize * avgCharWidth));
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > charsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCenteredText(
  page: PDFPage,
  text: string,
  y: number,
  fontSize: number,
  font: PDFFont,
  color = rgb(0.1, 0.1, 0.1)
) {
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const x = (PAGE_SIZE - textWidth) / 2;
  page.drawText(text, { x: Math.max(MARGIN, x), y, size: fontSize, font, color });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const book: GeneratedBook = body.book;

    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const coverPage = pdfDoc.addPage([PAGE_SIZE, PAGE_SIZE]);
    coverPage.drawRectangle({
      x: 0, y: 0, width: PAGE_SIZE, height: PAGE_SIZE,
      color: rgb(1, 0.973, 0.941),
    });

    const titleLines = wrapText(book.title, TEXT_WIDTH, 28, 0.55);
    let titleY = PAGE_SIZE / 2 + 60;
    for (const line of titleLines) {
      drawCenteredText(coverPage, line, titleY, 28, helveticaBold, rgb(0.2, 0.2, 0.2));
      titleY -= 38;
    }

    const dedLines = wrapText(book.dedication, TEXT_WIDTH, 14, 0.55);
    let dedY = titleY - 24;
    for (const line of dedLines) {
      drawCenteredText(coverPage, line, dedY, 14, helveticaOblique, rgb(0.5, 0.5, 0.5));
      dedY -= 20;
    }

    for (const bookPage of book.pages) {
      const page = pdfDoc.addPage([PAGE_SIZE, PAGE_SIZE]);

      page.drawRectangle({
        x: 0, y: 0, width: PAGE_SIZE, height: PAGE_SIZE,
        color: rgb(1, 1, 1),
      });

      if (bookPage.imageUrl && bookPage.imageUrl.startsWith('data:image/png;base64,')) {
        try {
          const base64 = bookPage.imageUrl.replace('data:image/png;base64,', '');
          const imageBytes = Buffer.from(base64, 'base64');
          const embeddedImage = await pdfDoc.embedPng(imageBytes);
          page.drawImage(embeddedImage, {
            x: 0,
            y: TEXT_AREA_TOP,
            width: PAGE_SIZE,
            height: IMAGE_HEIGHT,
          });
        } catch {
          page.drawRectangle({
            x: 0, y: TEXT_AREA_TOP, width: PAGE_SIZE, height: IMAGE_HEIGHT,
            color: rgb(0.93, 0.93, 0.93),
          });
        }
      } else {
        page.drawRectangle({
          x: 0, y: TEXT_AREA_TOP, width: PAGE_SIZE, height: IMAGE_HEIGHT,
          color: rgb(0.93, 0.93, 0.93),
        });
      }

      page.drawRectangle({
        x: 0, y: 0, width: PAGE_SIZE, height: TEXT_AREA_TOP,
        color: rgb(1, 1, 1),
      });

      const textLines = wrapText(bookPage.text, TEXT_WIDTH, 14, 0.55);
      const lineHeight = 20;
      const totalTextHeight = textLines.length * lineHeight;
      let textY = TEXT_AREA_TOP / 2 + totalTextHeight / 2 - lineHeight / 2;

      for (const line of textLines) {
        page.drawText(line, {
          x: MARGIN,
          y: textY,
          size: 14,
          font: helvetica,
          color: rgb(0.15, 0.15, 0.15),
        });
        textY -= lineHeight;
      }

      page.drawText(`${bookPage.pageNumber}`, {
        x: PAGE_SIZE - MARGIN,
        y: 14,
        size: 10,
        font: helvetica,
        color: rgb(0.6, 0.6, 0.6),
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="story.pdf"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error generating PDF.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
