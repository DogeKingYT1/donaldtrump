type LogoProps = {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`w-8 h-8 ${className}`} aria-hidden>
      <svg viewBox="0 0 64 64" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" role="img">
        {/* subtle rounded background to read well on dark and light */}
        <rect x="2" y="2" width="60" height="60" rx="10" fill="currentColor" fillOpacity="0.06" />

        {/* open book: left and right pages */}
        <path d="M12 20c8-6 16-6 24 0 8-6 16-6 24 0v24c-8-6-16-6-24 0-8-6-16-6-24 0V20z" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.75" />
        <path d="M32 20v24" stroke="currentColor" strokeWidth="1.6" strokeOpacity="0.5" />

        {/* eye in center to symbolize seeing / scrutiny */}
        <ellipse cx="32" cy="32" rx="9" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.95" />
        <circle cx="32" cy="32" r="2.4" fill="currentColor" />

        {/* transparency hint: a faint layered rectangle with lower opacity */}
        <rect x="18" y="38" width="28" height="6" rx="2" fill="currentColor" fillOpacity="0.04" />
      </svg>
    </div>
  )
}
