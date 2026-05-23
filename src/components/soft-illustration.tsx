// Inline SVG editorial illustrations — calm, soft, hand-drawn feel.

export function HearthIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="A calm, sheltering home with soft warmth"
    >
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.97 0.01 230)" />
          <stop offset="100%" stopColor="oklch(0.975 0.008 170)" />
        </linearGradient>
        <linearGradient id="warm" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.9 0.05 70)" />
          <stop offset="100%" stopColor="oklch(0.82 0.06 60)" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#sky)" />
      {/* sun */}
      <circle cx="320" cy="80" r="34" fill="url(#warm)" opacity="0.7" />
      {/* hills */}
      <path d="M0 220 Q 100 170 200 210 T 400 200 V 300 H 0 Z" fill="oklch(0.91 0.018 170)" />
      <path d="M0 250 Q 130 210 260 245 T 400 240 V 300 H 0 Z" fill="oklch(0.85 0.024 170)" />
      {/* house */}
      <g transform="translate(140 150)">
        <path d="M0 50 L60 0 L120 50 V120 H0 Z" fill="oklch(0.97 0.01 60)" stroke="oklch(0.45 0.03 60)" strokeWidth="1.5" />
        <rect x="48" y="70" width="24" height="50" fill="oklch(0.555 0.045 235)" />
        <rect x="14" y="65" width="20" height="18" fill="oklch(0.9 0.05 70)" opacity="0.9" />
        <rect x="86" y="65" width="20" height="18" fill="oklch(0.9 0.05 70)" opacity="0.9" />
        {/* chimney smoke */}
        <path d="M88 -2 Q 92 -20 84 -32 Q 78 -44 86 -58" stroke="oklch(0.7 0.01 220)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      </g>
      {/* leaves */}
      <g opacity="0.7">
        <ellipse cx="60" cy="240" rx="40" ry="10" fill="oklch(0.555 0.032 175)" opacity="0.3" />
        <ellipse cx="340" cy="250" rx="50" ry="12" fill="oklch(0.555 0.032 175)" opacity="0.3" />
      </g>
    </svg>
  );
}

export function HandsIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="Two hands gently holding a small growing plant"
    >
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.97 0.01 230)" />
          <stop offset="100%" stopColor="oklch(0.985 0.003 100)" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#halo)" />
      {/* hands */}
      <g fill="oklch(0.88 0.03 60)" stroke="oklch(0.5 0.04 60)" strokeWidth="1.5">
        <path d="M70 200 Q 120 160 200 175 Q 280 160 330 200 Q 330 240 280 240 H 120 Q 70 240 70 200 Z" />
        <path d="M70 200 Q 60 175 80 165" fill="none" />
        <path d="M330 200 Q 340 175 320 165" fill="none" />
      </g>
      {/* stem */}
      <path d="M200 175 V 110" stroke="oklch(0.555 0.032 175)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* leaves */}
      <path d="M200 145 Q 170 130 165 110 Q 195 115 200 140 Z" fill="oklch(0.555 0.032 175)" />
      <path d="M200 130 Q 230 115 240 95 Q 210 100 200 125 Z" fill="oklch(0.475 0.032 175)" />
      {/* sparkles */}
      <g fill="oklch(0.9 0.05 70)">
        <circle cx="120" cy="100" r="3" />
        <circle cx="290" cy="90" r="2.5" />
        <circle cx="320" cy="140" r="2" />
        <circle cx="90" cy="150" r="2" />
      </g>
    </svg>
  );
}

export function PathIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="A winding gentle path leading forward"
    >
      <rect width="400" height="300" fill="oklch(0.97 0.01 230)" />
      <path
        d="M50 270 Q 150 220 180 180 Q 210 130 280 110 Q 340 100 360 60"
        fill="none"
        stroke="oklch(0.555 0.032 175)"
        strokeWidth="2.5"
        strokeDasharray="6 8"
        strokeLinecap="round"
      />
      <circle cx="50" cy="270" r="6" fill="oklch(0.555 0.045 235)" />
      <circle cx="360" cy="60" r="8" fill="oklch(0.9 0.05 70)" />
      <g opacity="0.7">
        <circle cx="120" cy="220" r="3" fill="oklch(0.555 0.032 175)" />
        <circle cx="200" cy="160" r="3" fill="oklch(0.555 0.032 175)" />
        <circle cx="290" cy="100" r="3" fill="oklch(0.555 0.032 175)" />
      </g>
    </svg>
  );
}
