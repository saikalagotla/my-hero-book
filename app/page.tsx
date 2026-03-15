'use client';

import { useState } from 'react';
import { BookFormData, GeneratedBook } from '@/lib/types';
import HomeScreen from '@/components/HomeScreen';
import FormScreen from '@/components/FormScreen';
import PreviewScreen from '@/components/PreviewScreen';
import DownloadScreen from '@/components/DownloadScreen';

type Screen = 'home' | 'form' | 'preview' | 'download';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home');
  const [formData, setFormData] = useState<BookFormData | null>(null);
  const [book, setBook] = useState<GeneratedBook | null>(null);

  function handleFormSubmit(data: BookFormData) {
    setFormData(data);
    setScreen('preview');
  }

  function handleBookReady(generatedBook: GeneratedBook) {
    setBook(generatedBook);
    setScreen('download');
  }

  function handleStartOver() {
    setBook(null);
    setFormData(null);
    setScreen('home');
  }

  if (screen === 'home') {
    return <HomeScreen onStart={() => setScreen('form')} />;
  }

  if (screen === 'form') {
    return <FormScreen onSubmit={handleFormSubmit} onBack={() => setScreen('home')} />;
  }

  if (screen === 'preview' && formData) {
    return <PreviewScreen formData={formData} onBookReady={handleBookReady} />;
  }

  if (screen === 'download' && book && formData) {
    return <DownloadScreen book={book} formData={formData} onStartOver={handleStartOver} />;
  }

  return null;
}
