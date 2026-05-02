export default function LogoMark() {
  return (
    <div
      className="logo-mark relative flex-shrink-0 flex items-center justify-center overflow-hidden"
      style={{ width: 44, height: 44, background: "#1F2433", borderRadius: 11 }}
    >
      <div
        className="absolute rounded-full z-[1]"
        style={{ width: 32, height: 32, background: "#3FAE89" }}
      />
      <svg
        className="animate-idle relative z-[2]"
        width="36"
        height="28"
        viewBox="0 0 60 44"
        fill="none"
      >
        <path d="M28 4 L31 14 L25 14 Z" fill="white" />
        <path d="M27 8 L29 8" stroke="#3FAE89" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M26.3 11 L29.7 11" stroke="#3FAE89" strokeWidth="0.6" strokeLinecap="round" />
        <path d="M14 22 L18 16 Q22 14 28 14 L36 14 Q40 14 43 17 L48 22 Z" fill="white" />
        <path d="M8 22 L52 22 Q54 22 54 24 L54 30 Q54 32 52 32 L8 32 Q6 32 6 30 L6 24 Q6 22 8 22 Z" fill="white" />
        <path d="M19 17 Q22 15.5 27 15.5 L27 21 L19 21 Z" fill="#3FAE89" />
        <path d="M28 15.5 L36 15.5 Q39 15.5 41 17 L43 21 L28 21 Z" fill="#3FAE89" />
        <line x1="28" y1="22" x2="28" y2="32" stroke="#3FAE89" strokeWidth="0.5" opacity="0.4" />
        <circle cx="50" cy="26" r="1.5" fill="#E8C77A" />
        <circle className="wheel" cx="16" cy="33" r="5" fill="#1F2433" />
        <circle cx="16" cy="33" r="2" fill="white" />
        <circle className="wheel" cx="44" cy="33" r="5" fill="#1F2433" />
        <circle cx="44" cy="33" r="2" fill="white" />
        <g className="logo-mark-sparkle">
          <path d="M28 2 L28.5 4 L30 4.5 L28.5 5 L28 7 L27.5 5 L26 4.5 L27.5 4 Z" fill="#E8C77A" />
        </g>
      </svg>
    </div>
  );
}
