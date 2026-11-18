import type { CSSProperties } from "react";

export function SpriteStrip({
  asset,
  width,
  height,
  frames,
  still = 0,
  once = false,
  className = "",
  onError,
}: {
  asset: string;
  width: number;
  height: number;
  frames: number;
  still?: number;
  once?: boolean;
  className?: string;
  onError?: () => void;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      overflow="hidden"
      aria-hidden="true"
      className="sprite-window"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        className={`sprite-strip sprite-frames-${frames} ${once ? "sprite-cheer-once" : ""} ${className}`}
        style={
          {
            "--frame-width": `${width}px`,
            "--still-offset": `${-still * width}px`,
          } as CSSProperties
        }
      >
        <image
          href={`/characters/${asset}.webp`}
          width={width * frames}
          height={height}
          preserveAspectRatio="none"
          onError={onError}
        />
      </g>
    </svg>
  );
}
