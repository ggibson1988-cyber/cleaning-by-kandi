interface BubblePatternProps {
  className?: string;
  opacity?: number;
  color?: string;
}

const BUBBLES = [
  { cx: '8%', cy: '20%', r: 120 },
  { cx: '92%', cy: '15%', r: 80 },
  { cx: '75%', cy: '70%', r: 160 },
  { cx: '20%', cy: '80%', r: 60 },
  { cx: '50%', cy: '45%', r: 40 },
  { cx: '88%', cy: '55%', r: 55 },
  { cx: '35%', cy: '10%', r: 30 },
];

export default function BubblePattern({
  className = '',
  opacity = 0.06,
  color = 'white',
}: BubblePatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {BUBBLES.map((b, i) => (
          <circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={color}
            fillOpacity={opacity}
          />
        ))}
      </svg>
    </div>
  );
}
