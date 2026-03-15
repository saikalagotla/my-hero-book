'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { BookFormData } from '@/lib/types';
import ProgressBar from './ProgressBar';

async function compressImage(file: File): Promise<{ data: string; mediaType: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 800;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve({ data: dataUrl.split(',')[1], mediaType: 'image/jpeg', previewUrl: dataUrl });
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

interface FormScreenProps {
  onSubmit: (data: BookFormData) => void;
  onBack: () => void;
}

const PRESET_PRONOUNS = ['he/him', 'she/her', 'they/them'];
const TRAITS: { value: string; label: string }[] = [
  { value: 'brave', label: 'Brave 🦁' },
  { value: 'curious', label: 'Curious 🔭' },
  { value: 'kind', label: 'Kind 🌸' },
  { value: 'funny', label: 'Funny 😄' },
  { value: 'creative', label: 'Creative 🎨' },
];
const THEMES: { value: string; label: string }[] = [
  { value: 'space', label: 'Space 🚀' },
  { value: 'ocean', label: 'Ocean 🌊' },
  { value: 'forest', label: 'Forest 🌲' },
  { value: 'magic', label: 'Magic 🪄' },
  { value: 'dinosaurs', label: 'Dinosaurs 🦕' },
];

const MAX_MULTI = 3;

const pillBase = 'px-4 py-2 rounded-full border-2 font-body text-sm cursor-pointer transition-colors';
const pillSelected = 'bg-book-coral text-white border-book-coral';
const pillUnselected = 'bg-white border-book-yellow text-gray-700 hover:border-book-coral';
const pillDisabled = 'bg-white border-gray-200 text-gray-300 cursor-not-allowed';
const pillCustom = 'bg-white border-dashed border-2 border-book-yellow text-gray-500 hover:border-book-coral';

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function FormScreen({ onSubmit, onBack }: FormScreenProps) {
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [pronouns, setPronouns] = useState<string[]>([]);
  const [traits, setTraits] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [friendName, setFriendName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [childPhoto, setChildPhoto] = useState<{ data: string; mediaType: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [showCustomAge, setShowCustomAge] = useState(false);
  const [customAgeInput, setCustomAgeInput] = useState('');
  const ageInputRef = useRef<HTMLInputElement>(null);

  // Custom input state for each field
  const [showCustomPronoun, setShowCustomPronoun] = useState(false);
  const [customPronounInput, setCustomPronounInput] = useState('');
  const [showCustomTrait, setShowCustomTrait] = useState(false);
  const [customTraitInput, setCustomTraitInput] = useState('');
  const [showCustomTheme, setShowCustomTheme] = useState(false);
  const [customThemeInput, setCustomThemeInput] = useState('');

  const pronounInputRef = useRef<HTMLInputElement>(null);
  const traitInputRef = useRef<HTMLInputElement>(null);
  const themeInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    'w-full border-2 border-book-yellow rounded-2xl px-5 py-4 font-body text-base focus:outline-none focus:ring-2 focus:ring-book-coral bg-white';

  function addCustomMulti(
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void,
    setShow: (v: boolean) => void,
  ) {
    const trimmed = value.trim();
    if (!trimmed || list.includes(trimmed) || list.length >= MAX_MULTI) {
      setInput('');
      setShow(false);
      return;
    }
    setList([...list, trimmed]);
    setInput('');
    setShow(false);
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please upload an image file.');
      return;
    }
    setPhotoError(null);
    try {
      const compressed = await compressImage(file);
      setChildPhoto({ data: compressed.data, mediaType: compressed.mediaType });
      setPhotoPreview(compressed.previewUrl);
    } catch {
      setPhotoError('Could not process the image. Please try another file.');
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!childName.trim()) newErrors.childName = "Please enter your child's name.";
    if (!age) newErrors.age = 'Please select an age.';
    if (pronouns.length === 0) newErrors.pronouns = 'Please select pronouns.';
    if (traits.length === 0) newErrors.traits = 'Please select at least one personality trait.';
    if (themes.length === 0) newErrors.themes = 'Please select at least one story theme.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      childName: childName.trim(),
      age: age!,
      pronouns,
      traits,
      themes,
      friendName: friendName.trim(),
      childPhoto: childPhoto ?? undefined,
    });
  }

  const traitsAtMax = traits.length >= MAX_MULTI;

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
          {/* Child's name */}
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

          {/* Age */}
          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">Their age</label>
            <div className="flex flex-wrap gap-2">
              {[3, 4, 5, 6, 7, 8].map((a) => (
                <button
                  key={a}
                  onClick={() => { setAge(a); setShowCustomAge(false); setCustomAgeInput(''); }}
                  className={`${pillBase} ${age === a ? pillSelected : pillUnselected}`}
                >
                  {a}
                </button>
              ))}
              {/* Custom age pill (shown when selected value is non-preset) */}
              {age !== null && ![3, 4, 5, 6, 7, 8].includes(age) && (
                <span className={`${pillBase} ${pillSelected} flex items-center gap-1`}>
                  {age}
                  <button
                    onClick={() => setAge(null)}
                    className="ml-1 leading-none"
                    aria-label="Remove age"
                  >
                    ×
                  </button>
                </span>
              )}
              {!showCustomAge ? (
                <button
                  onClick={() => {
                    setShowCustomAge(true);
                    setTimeout(() => ageInputRef.current?.focus(), 0);
                  }}
                  className={`${pillBase} ${pillCustom}`}
                >
                  + Custom
                </button>
              ) : (
                <span className="flex items-center gap-1">
                  <input
                    ref={ageInputRef}
                    type="number"
                    min={1}
                    max={18}
                    value={customAgeInput}
                    onChange={(e) => setCustomAgeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseInt(customAgeInput, 10);
                        if (!isNaN(val) && val >= 1) { setAge(val); setShowCustomAge(false); setCustomAgeInput(''); }
                      }
                      if (e.key === 'Escape') { setShowCustomAge(false); setCustomAgeInput(''); }
                    }}
                    placeholder="e.g. 9"
                    className="border-2 border-book-yellow rounded-full px-3 py-1 font-body text-sm focus:outline-none focus:ring-2 focus:ring-book-coral w-20"
                  />
                  <button
                    onClick={() => {
                      const val = parseInt(customAgeInput, 10);
                      if (!isNaN(val) && val >= 1) { setAge(val); setShowCustomAge(false); setCustomAgeInput(''); }
                    }}
                    className="px-3 py-1 rounded-full bg-book-coral text-white font-body text-sm"
                  >
                    Add
                  </button>
                </span>
              )}
            </div>
            {errors.age && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.age}</p>
            )}
          </div>

          {/* Pronouns — single select */}
          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">
              Their pronouns
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_PRONOUNS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPronouns([p])}
                  className={`${pillBase} ${pronouns[0] === p ? pillSelected : pillUnselected}`}
                >
                  {p}
                </button>
              ))}
              {/* Custom pronoun pill (shown when selected value is non-preset) */}
              {pronouns[0] && !PRESET_PRONOUNS.includes(pronouns[0]) && (
                <span className={`${pillBase} ${pillSelected} flex items-center gap-1`}>
                  {pronouns[0]}
                  <button
                    onClick={() => setPronouns([])}
                    className="ml-1 leading-none"
                    aria-label="Remove pronoun"
                  >
                    ×
                  </button>
                </span>
              )}
              {!showCustomPronoun ? (
                <button
                  onClick={() => {
                    setShowCustomPronoun(true);
                    setTimeout(() => pronounInputRef.current?.focus(), 0);
                  }}
                  className={`${pillBase} ${pillCustom}`}
                >
                  + Custom
                </button>
              ) : (
                <span className="flex items-center gap-1">
                  <input
                    ref={pronounInputRef}
                    type="text"
                    value={customPronounInput}
                    onChange={(e) => setCustomPronounInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const trimmed = customPronounInput.trim();
                        if (trimmed) setPronouns([trimmed]);
                        setCustomPronounInput('');
                        setShowCustomPronoun(false);
                      }
                      if (e.key === 'Escape') { setShowCustomPronoun(false); setCustomPronounInput(''); }
                    }}
                    placeholder="e.g. xe/xem"
                    className="border-2 border-book-yellow rounded-full px-3 py-1 font-body text-sm focus:outline-none focus:ring-2 focus:ring-book-coral w-28"
                  />
                  <button
                    onClick={() => {
                      const trimmed = customPronounInput.trim();
                      if (trimmed) setPronouns([trimmed]);
                      setCustomPronounInput('');
                      setShowCustomPronoun(false);
                    }}
                    className="px-3 py-1 rounded-full bg-book-coral text-white font-body text-sm"
                  >
                    Add
                  </button>
                </span>
              )}
            </div>
            {errors.pronouns && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.pronouns}</p>
            )}
          </div>

          {/* Traits — multi-select, max 3 */}
          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">
              Their personality traits{' '}
              <span className="text-gray-400 font-body text-base">(pick up to {MAX_MULTI})</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TRAITS.map((t) => {
                const selected = traits.includes(t.value);
                const disabled = !selected && traitsAtMax;
                return (
                  <button
                    key={t.value}
                    onClick={() => !disabled && setTraits(toggle(traits, t.value))}
                    className={`${pillBase} ${selected ? pillSelected : disabled ? pillDisabled : pillUnselected}`}
                  >
                    {t.label}
                  </button>
                );
              })}
              {/* Custom trait pills */}
              {traits.filter((t) => !TRAITS.map((x) => x.value).includes(t)).map((t) => (
                <span key={t} className={`${pillBase} ${pillSelected} flex items-center gap-1`}>
                  {t}
                  <button
                    onClick={() => setTraits(traits.filter((v) => v !== t))}
                    className="ml-1 leading-none"
                    aria-label={`Remove ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {!traitsAtMax && !showCustomTrait && (
                <button
                  onClick={() => {
                    setShowCustomTrait(true);
                    setTimeout(() => traitInputRef.current?.focus(), 0);
                  }}
                  className={`${pillBase} ${pillCustom}`}
                >
                  + Custom
                </button>
              )}
              {showCustomTrait && (
                <span className="flex items-center gap-1">
                  <input
                    ref={traitInputRef}
                    type="text"
                    value={customTraitInput}
                    onChange={(e) => setCustomTraitInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter')
                        addCustomMulti(customTraitInput, traits, setTraits, setCustomTraitInput, setShowCustomTrait);
                      if (e.key === 'Escape') { setShowCustomTrait(false); setCustomTraitInput(''); }
                    }}
                    placeholder="e.g. adventurous"
                    className="border-2 border-book-yellow rounded-full px-3 py-1 font-body text-sm focus:outline-none focus:ring-2 focus:ring-book-coral w-32"
                  />
                  <button
                    onClick={() => addCustomMulti(customTraitInput, traits, setTraits, setCustomTraitInput, setShowCustomTrait)}
                    className="px-3 py-1 rounded-full bg-book-coral text-white font-body text-sm"
                  >
                    Add
                  </button>
                </span>
              )}
            </div>
            {errors.traits && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.traits}</p>
            )}
          </div>

          {/* Themes — single select */}
          <div>
            <label className="block font-heading text-gray-800 text-lg mb-2">
              Story theme
            </label>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setThemes([t.value])}
                  className={`${pillBase} ${themes[0] === t.value ? pillSelected : pillUnselected}`}
                >
                  {t.label}
                </button>
              ))}
              {/* Custom theme pill (shown when selected value is non-preset) */}
              {themes[0] && !THEMES.map((x) => x.value).includes(themes[0]) && (
                <span className={`${pillBase} ${pillSelected} flex items-center gap-1`}>
                  {themes[0]}
                  <button
                    onClick={() => setThemes([])}
                    className="ml-1 leading-none"
                    aria-label="Remove theme"
                  >
                    ×
                  </button>
                </span>
              )}
              {!showCustomTheme ? (
                <button
                  onClick={() => {
                    setShowCustomTheme(true);
                    setTimeout(() => themeInputRef.current?.focus(), 0);
                  }}
                  className={`${pillBase} ${pillCustom}`}
                >
                  + Custom
                </button>
              ) : (
                <span className="flex items-center gap-1">
                  <input
                    ref={themeInputRef}
                    type="text"
                    value={customThemeInput}
                    onChange={(e) => setCustomThemeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const trimmed = customThemeInput.trim();
                        if (trimmed) setThemes([trimmed]);
                        setCustomThemeInput('');
                        setShowCustomTheme(false);
                      }
                      if (e.key === 'Escape') { setShowCustomTheme(false); setCustomThemeInput(''); }
                    }}
                    placeholder="e.g. underwater city"
                    className="border-2 border-book-yellow rounded-full px-3 py-1 font-body text-sm focus:outline-none focus:ring-2 focus:ring-book-coral w-36"
                  />
                  <button
                    onClick={() => {
                      const trimmed = customThemeInput.trim();
                      if (trimmed) setThemes([trimmed]);
                      setCustomThemeInput('');
                      setShowCustomTheme(false);
                    }}
                    className="px-3 py-1 rounded-full bg-book-coral text-white font-body text-sm"
                  >
                    Add
                  </button>
                </span>
              )}
            </div>
            {errors.themes && (
              <p className="text-book-coral text-sm mt-1 font-body">{errors.themes}</p>
            )}
          </div>

          {/* Friend name */}
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

          {/* Photo upload */}
          <div>
            <label className="block font-heading text-gray-800 text-lg mb-1">
              Photo of your child <span className="text-gray-400 font-body text-base">(optional)</span>
            </label>
            <p className="text-gray-400 font-body text-sm mb-3">
              Upload a photo and the illustrations will be based on their real appearance.
            </p>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {!photoPreview ? (
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="w-full border-2 border-dashed border-book-yellow rounded-2xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-book-coral hover:text-book-coral transition-colors cursor-pointer bg-white"
              >
                <span className="text-3xl">📷</span>
                <span className="font-body text-sm">Click to upload a photo</span>
              </button>
            ) : (
              <div className="relative w-32 h-32">
                <Image
                  src={photoPreview}
                  alt="Child photo preview"
                  fill
                  className="object-cover rounded-2xl border-2 border-book-yellow"
                />
                <button
                  type="button"
                  onClick={() => { setChildPhoto(null); setPhotoPreview(null); if (photoInputRef.current) photoInputRef.current.value = ''; }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-book-coral text-white text-xs flex items-center justify-center leading-none cursor-pointer"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            )}
            {photoError && (
              <p className="text-book-coral text-sm mt-1 font-body">{photoError}</p>
            )}
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
