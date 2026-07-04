interface BubblePatternProps {
  className?: string;
  opacity?: number;
  color?: string;
  /** Hide on screens narrower than md — removes GPU overhead on mobile */
  hideOnMobile?: boolean;
}

type Bubble = {
  cx: string;
  cy: string;
  r: number;
  kind: 'fill' | 'ring' | 'shine';
};

const BUBBLES: Bubble[] = [
  { cx: '6%',  cy: '18%', r: 220, kind: 'ring'  },
  { cx: '94%', cy: '80%', r: 240, kind: 'fill'  },
  { cx: '8%',  cy: '22%', r: 120, kind: 'fill'  },
  { cx: '92%', cy: '15%', r: 80,  kind: 'shine' },
  { cx: '75%', cy: '70%', r: 160, kind: 'ring'  },
  { cx: '20%', cy: '80%', r: 60,  kind: 'shine' },
  { cx: '50%', cy: '45%', r: 40,  kind: 'ring'  },
  { cx: '88%', cy: '55%', r: 55,  kind: 'fill'  },
  { cx: '35%', cy: '10%', r: 30,  kind: 'shine' },
  { cx: '62%', cy: '30%', r: 24,  kind: 'ring'  },
  { cx: '15%', cy: '55%', r: 34,  kind: 'fill'  },
];

export default function BubblePattern({
  className = '',
  opacity = 0.11,
  color = 'white',
  hideOnMobile = true,
}: BubblePatternProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${hideOnMobile ? 'hidden md:block' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        {BUBBLES.map((b, i) => {
          if (b.kind === 'fill') {
            return (
              <circle key={i} cx={b.cx} cy={b.cy} r={b.r}
                fill={color} fillOpacity={opacity} />
            );
          }
          const shineOffset = -(b.r * 0.3);
          return (
            <g key={i}>
              <circle cx={b.cx} cy={b.cy} r={b.r}
                fill="none" stroke={color}
                strokeOpacity={opacity + 0.04}
                strokeWidth={b.r > 120 ? 2.5 : 1.5} />
              {b.kind === 'shine' && (
                <circle cx={b.cx} cy={b.cy} r={Math.max(b.r * 0.14, 3)}
                  fill={color} fillOpacity={opacity + 0.06}
                  transform={`translate(${shineOffset} ${shineOffset})`} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
