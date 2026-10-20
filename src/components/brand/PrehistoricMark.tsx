type PrehistoricMarkProps = {
  className?: string;
  title?: string;
};

/** An original DAI VIET claw-island insignia, drawn as a reusable brand primitive. */
export function PrehistoricMark({ className, title }: PrehistoricMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M24 209C51 205 71 194 88 174C100 159 106 145 108 128C89 125 72 118 59 107C79 102 94 92 105 77C117 61 124 42 126 20C143 35 154 48 160 60C178 59 195 64 211 75C194 80 183 91 178 106C194 111 207 119 218 130C196 136 179 135 164 128C161 149 151 168 134 184C111 206 78 218 24 209Z"
        fill="currentColor"
      />
      <path
        d="M150 85C157 79 164 78 171 82C166 89 160 93 151 94"
        fill="#09100D"
      />
      <path
        d="M171 110C185 113 198 119 209 127"
        stroke="#09100D"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M54 228C79 230 104 226 128 216"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M72 244C102 246 128 241 152 229"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M105 256C130 255 153 248 174 235"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
