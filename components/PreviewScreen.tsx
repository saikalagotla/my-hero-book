'use client';

import { useEffect, useRef, useState } from 'react';
import { BookFormData, BookPage, GeneratedBook } from '@/lib/types';
import ProgressBar from './ProgressBar';

interface PreviewScreenProps {
  formData: BookFormData;
  onBookReady: (book: GeneratedBook) => void;
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number,
  onEach?: (result: T, index: number) => void
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const index = nextIndex++;
      const result = await tasks[index]();
      results[index] = result;
      if (onEach) onEach(result, index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export default function PreviewScreen({ formData, onBookReady }: PreviewScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Writing the story...');
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  function runPipeline() {
    setError(null);
    setProgress(0);
    setStatusText('Writing the story...');
    generate();
  }

  async function generate() {
    try {
      const storyRes = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      });
      if (!storyRes.ok) {
        const data = await storyRes.json();
        throw new Error(data.error || 'Failed to generate story.');
      }
      const storyData = await storyRes.json();
      setProgress(30);

      const pages: BookPage[] = storyData.pages.map(
        (p: { pageNumber: number; text: string; imagePrompt: string }) => ({
          pageNumber: p.pageNumber,
          text: p.text,
          imagePrompt: p.imagePrompt,
          imageUrl: '',
        })
      );

      let imagesCompleted = 0;
      setStatusText(`Illustrating page 1 of 12...`);

      const imageTasks = pages.map((page, i) => async () => {
        const imgRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imagePrompt: page.imagePrompt,
            childName: formData.childName,
            theme: formData.theme,
          }),
        });
        if (!imgRes.ok) {
          const data = await imgRes.json();
          throw new Error(data.error || `Failed to generate image for page ${i + 1}.`);
        }
        const imgData = await imgRes.json();
        imagesCompleted += 1;
        pages[i] = { ...page, imageUrl: imgData.imageUrl };
        const imageProgress = 30 + Math.round((imagesCompleted / 12) * 65);
        setProgress(imageProgress);
        if (imagesCompleted < 12) {
          setStatusText(`Illustrating page ${imagesCompleted + 1} of 12...`);
        } else {
          setStatusText('Finishing up...');
        }
        return imgData.imageUrl as string;
      });

      await runWithConcurrency(imageTasks, 3);

      setProgress(100);
      setStatusText('Finishing up...');

      const book: GeneratedBook = {
        title: storyData.title,
        dedication: storyData.dedication,
        pages,
      };

      await new Promise((r) => setTimeout(r, 500));
      onBookReady(book);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
    }
  }

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    generate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-book-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-4xl shadow-card p-12 max-w-md mx-auto w-full text-center">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="font-heading text-2xl text-gray-800 mb-4">Oops, something went wrong</h2>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-body text-sm mb-6">
            {error}
          </div>
          <button
            onClick={runPipeline}
            className="bg-book-coral text-white font-heading text-xl px-10 py-4 rounded-full shadow-button hover:scale-105 transition-transform cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-book-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-4xl shadow-card p-12 max-w-md mx-auto w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <div
            className="text-6xl"
            style={{
              animation: 'spin 2s linear infinite',
              display: 'inline-block',
            }}
          >
            📖
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <h2 className="font-heading text-3xl text-gray-800 mb-6">
          Creating {formData.childName}&#39;s book...
        </h2>
        <ProgressBar value={progress} />
        <p className="font-body text-gray-600 mt-4 text-base">{statusText}</p>
        <p className="text-gray-400 text-sm mt-2 font-body">This takes about 30–60 seconds</p>
      </div>
    </div>
  );
}
