'use client';

import { useState } from 'react';
import { BookFormData } from '@/lib/types';
import ProgressBar from './ProgressBar';

interface FormScreenProps {
  onSubmit: (data: BookFormData) => void;
  onBack: () => void;
}

const PRONOUNS: BookFormData['pronouns'][] = ['he/him', 'she/her', 'they/them'];
const TRAITS: { value: BookFormData['trait']; label: string }[] = [
  { value: 'brave', label: 'Brave 🦁' },
  { value: 'curious', label: 'Curious 🔭' },
  { value: 'kind', label: 'Kind 🌸' },
  { value: 'funny', label: 'Funny 😄' },
  { value: 'creative', label: 'Creative 🎨' },
];
const THEMES: { value: BookFormData['theme']; label: string }[] = [
  { value: 'space', label: 'Space 🚀' },
  { value: 'ocean', label: 'Ocean 🌊' },
  { value: 'forest', label: 'Forest 🌲' },
  { value: 'magic', label: 'Magic 🪄' },
  { value: 'dinosaurs', label: 'Dinosaurs 🦕' },
];

const pillBase = 'px-4 py-2 rounded-full border-2 font-body text-sm cursor-pointer transition-colors';
const pillSelected = 'bg-book-coral text-white border-book-coral';
const pillUnselected = 'bg-white border-book-yellow text-gray-700 hover:border-book-coral';

export default function FormScreen({ onSubmit, onBack }: FormScreenProps) {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [pronouns, setPronouns] = useState<BookFormData['pronouns'] | null>(null);
  const [trait, setTrait] = useState<BookFormData['trait'] | null>(null);
  const [theme, setTheme] = useState<BookFormData['theme'] | null>(null);
  const [friendName, setFriendName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inputClass =
    'w-full border-2 border-book-yellow rounded-2xl px-5 py-4 font-body text-base focus:outline-none focus:ring-2 focus:ring-book-coral bg-white';

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!childName.trim()) newErrors.childName = 'Please enter your child\'s name.';
    if (!age) newErrors.age = 'Please select an age.';
    if (!pronouns) newErrors.pronouns = 'Please select pronouns.';
    if (!trait) newErrors.trait = 'Please select a personality trait.';
    if (!theme) newErrors.theme = 'Please select a story theme.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      childName: childName.trim(),
      age: age!,
      pronouns: pronouns!,
      trait: trait!,
      theme: theme!,
      friendName: friendName.trim(),
    });
  }

  return (
    <div className="min-h-screen bg-book-cream px-4 py-12">
      <div className="max-w-xl mx-auto">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 font-body mb-6 cursor-pointer"
        >
          ← Back
        </button>

        <ProgressBar value={33} label="Step 1 of 3 — Tell us about your child" />

        <div className="mt-8 space-y-6">
          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">
              Child&#39;s first name
            </label>
            <input
              type="text"
              placeholder="e.g. Mia"
              maxLength={20}
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className={inputClass}
            />
            {errors.childName && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.childName}</p>
            )}
          </div>

          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">Their age</label>
            <div className="flex flex-wrap gap-2">
              {[3, 4, 5, 6, 7, 8].map((a) => (
                <button
                  key={a}
                  onClick={() => setAge(a)}
                  className={`${pillBase} ${age === a ? pillSelected : pillUnselected}`}
                >
                  {a}
                </button>
              ))}
            </div>
            {errors.age && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.age}</p>
            )}
          </div>

          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">Their pronouns</label>
            <div className="flex flex-wrap gap-2">
              {PRONOUNS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPronouns(p)}
                  className={`${pillBase} ${pronouns === p ? pillSelected : pillUnselected}`}
                >
                  {p}
                </button>
              ))}
            </div>
            {errors.pronouns && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.pronouns}</p>
            )}
          </div>

          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">
              Their best personality trait
            </label>
            <div className="flex flex-wrap gap-2">
              {TRAITS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTrait(t.value)}
                  className={`${pillBase} ${trait === t.value ? pillSelected : pillUnselected}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {errors.trait && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.trait}</p>
            )}
          </div>

          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">Story theme</label>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`${pillBase} ${theme === t.value ? pillSelected : pillUnselected}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {errors.theme && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.theme}</p>
            )}
          </div>

          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">
              Best friend&#39;s name <span className="text-gray-400 font-body text-base">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Leo"
              maxLength={20}
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-book-coral text-white font-heading text-xl px-12 py-5 rounded-full shadow-button hover:scale-105 transition-transform cursor-pointer"
          >
            Create My Book! 🎉
          </button>
        </div>
      </div>
    </div>
  );
}
