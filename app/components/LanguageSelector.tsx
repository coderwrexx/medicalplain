'use client';

interface Props {
  currentLang: string;
  onChange: (lang: string) => void;
}

export default function LanguageSelector({ currentLang, onChange }: Props) {
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🏴' },
    { code: 'te', label: 'తెలుగు', flag: '🏴' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            currentLang === lang.code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
}
