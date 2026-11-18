import { useId, useState } from "react";
import {
  MINI_POSE_LABELS,
  MINI_SPRITES,
  type MiniPose,
} from "./characterAssets";
import { SpriteStrip } from "./SpriteStrip";

export function Dog({
  sleeping = false,
  activity = "idle",
  className = "",
  name = "Mylo",
}: {
  sleeping?: boolean;
  activity?: "idle" | "playful" | "scratch";
  className?: string;
  name?: string;
}) {
  const [failed, setFailed] = useState(false);
  const mode = sleeping ? "rest" : activity;
  const dimensions =
    mode === "idle"
      ? { width: 210, height: 240, frames: 6 }
      : { width: 240, height: 250, frames: mode === "scratch" ? 5 : 4 };
  if (failed)
    return (
      <DogVectorFallback
        sleeping={sleeping}
        className={className}
        name={name}
      />
    );
  return (
    <svg
      viewBox="0 0 220 210"
      className={`character character-mylo supplied-mylo mood-${mode} ${className}`}
      data-artwork="provided"
      data-activity={mode}
      role="img"
      aria-label={`${name}, Divi’s fluffy cream dog, ${sleeping ? "curled up for a peaceful rest" : activity === "playful" ? "celebrating with a playful pounce" : activity === "scratch" ? "enjoying a little ear scratch" : "wagging his tail and keeping her company"}`}
    >
      <SpriteStrip
        asset={`mylo-${mode}-atlas`}
        {...dimensions}
        className="mylo-sprite-strip"
        onError={() => setFailed(true)}
      />
    </svg>
  );
}

function DogVectorFallback({
  sleeping = false,
  className = "",
  name = "Mylo",
}: {
  sleeping?: boolean;
  className?: string;
  name?: string;
}) {
  return (
    <svg
      className={`character character-mylo ${sleeping ? "is-sleeping" : ""} ${className}`}
      viewBox="0 0 220 210"
      role="img"
      aria-label={
        sleeping
          ? `${name}, Divi’s fluffy dog, taking a peaceful nap`
          : `${name}, Divi’s fluffy cream dog with dark ears and a happy face`
      }
    >
      <ellipse cx="111" cy="192" rx="76" ry="10" fill="#6b7953" opacity=".1" />
      <g className="mylo-breath">
        <path
          className="mylo-tail"
          d="M160 163c51 3 55-59 30-58 12 12 9 23-10 22-18-1-25 16-20 36"
          fill="#ddc7a2"
          stroke="#9b876c"
          strokeWidth="2"
        />
        <path
          d="m61 126-8 16 6 2-9 13 10-1-5 18 13-5-3 15 13-6q31 20 65 0l11 6-1-15 12 4-5-15 11 2-8-16 7-2-12-17Z"
          fill="#e6d3af"
          stroke="#b6a17f"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M80 139q29 17 58-1l-5 43-26 7-26-10Z" fill="#fff7e6" />
        <path
          d="M71 153q-5 9-5 31c-9 12 18 17 27 7l4-34m30 0 4 33c11 10 34 6 26-7l-6-29"
          fill="#f2e7d0"
          stroke="#b6a17f"
          strokeWidth="2"
        />
        <path
          d="M55 75Q37 45 47 15q25 8 43 40m44-1q19-29 40-38 12 28-4 60"
          fill="#786b59"
          stroke="#685f50"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="m53 28 9 42 17-11m64 0 18 11 6-39" fill="#b3a087" />
        <path
          d="m68 54 13-7-2-7 20 8 10-9 12 10 17-7 1 9 18 5 7 15 10 8-4 14 9 13-8 8 2 17-15 2-6 15-16-3-12 9-16-5-13 6-13-10-17 1-4-15-16-5 3-16-7-11 9-14-2-13 12-10Z"
          fill="#e7d3af"
          stroke="#b5a080"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M107 48 94 78l6 26 19 1 8-26-13-31" fill="#fff5de" />
        <path
          d="M62 78q18-17 35 1l4 25-16 13-24-18Zm94 0q-17-17-34 1l-4 25 16 13 25-18Z"
          fill="#7a7060"
        />
        <path d="M81 103q29-13 55 0l8 20-16 18-21 2-27-15Z" fill="#faf3e2" />
        {sleeping ? (
          <g fill="none" stroke="#333d32" strokeWidth="3" strokeLinecap="round">
            <path d="m73 90 8 4 8-4m43 0 8 4 8-4" />
          </g>
        ) : (
          <g className="mylo-eyes">
            <ellipse cx="82" cy="91" rx="5" ry="6" fill="#30372f" />
            <ellipse cx="140" cy="91" rx="5" ry="6" fill="#30372f" />
            <circle cx="84" cy="89" r="1.7" fill="white" />
            <circle cx="142" cy="89" r="1.7" fill="white" />
          </g>
        )}
        <path d="M98 111q12-8 24 0l-4 9-8 3-8-3Z" fill="#384039" />
        <path
          d="M110 123v7m-13-2q13 14 26 0"
          fill="none"
          stroke="#565c4a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {!sleeping && (
          <path d="M108 135q5 3 10-1l-2 9q-7 7-9-1Z" fill="#cd8c7c" />
        )}
        <path d="m76 145 33 12 37-13-7 12-26 13-34-12Z" fill="#8b9b74" />
        <path d="m109 157 12 2-7 25-14-8Z" fill="#70865d" />
        <path
          d="m71 185 0 6m8-6 0 8m64-8 0 8m7-8 0 6"
          stroke="#c2b295"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function MiniYou({
  className = "",
  pose = "heart",
}: {
  className?: string;
  pose?: MiniPose;
}) {
  const [failedPose, setFailedPose] = useState<MiniPose | null>(null);
  if (failedPose === pose)
    return <MiniYouVectorFallback className={className} />;
  const sprite = MINI_SPRITES[pose];
  const height =
    sprite?.height ||
    (pose === "peek"
      ? 120
      : ["reading", "laptop", "shrug"].includes(pose)
        ? 205
        : 255);
  const width = sprite?.width || 190;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`character character-mini supplied-mini pose-${pose} ${className}`}
      data-pose={pose}
      data-artwork="provided"
      role="img"
      aria-label={`A little storybook version of Deepansh, ${MINI_POSE_LABELS[pose]}, from the supplied character designs`}
    >
      <g className="mini-figure">
        {sprite ? (
          <SpriteStrip
            asset={`mini-${pose}-atlas`}
            {...sprite}
            className="mini-sprite-strip"
            onError={() => setFailedPose(pose)}
          />
        ) : (
          <g className="supplied-mini-gesture">
            <image
              href={`/characters/mini-${pose}.webp`}
              width="190"
              height={height}
              preserveAspectRatio="xMidYMax meet"
              onError={() => setFailedPose(pose)}
            />
          </g>
        )}
      </g>
    </svg>
  );
}

function MiniYouVectorFallback({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 190 255"
      className={`character character-mini ${className}`}
      role="img"
      aria-label="A little storybook version of Deepansh, shirtless with photo-inspired tattoos, teal glasses, wavy hair, a beard and white shorts, holding a heart"
    >
      <ellipse cx="97" cy="244" rx="55" ry="7" fill="#6b7953" opacity=".12" />
      <g className="mini-figure">
        <path
          d="m72 202 1 31q-10 3-10 9h27l4-34 7 0 4 34h27q0-7-10-10l1-30"
          fill="#cb9873"
          stroke="#956d52"
          strokeWidth="2"
        />
        <path
          d="m70 238 8-2 7 2m25 0 7-2 8 2"
          fill="none"
          stroke="#ac7b5b"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M72 105q-22-3-31 17l-12 38q-3 15 11 13l15-29 5 37q35 13 74-1l4-36 11 27q15 6 15-10l-12-36q-8-22-33-21Z"
          fill="#cb9873"
          stroke="#956d52"
          strokeWidth="2"
        />
        <path
          d="M61 117q8 6 7 17l-3 39m65-56q-8 6-7 17l5 39"
          stroke="#b38160"
          strokeWidth="2"
          opacity=".65"
          fill="none"
        />
        <path
          d="M72 120q10-2 19 5m10 0q9-7 20-5m-48 18q11 6 21 1m8 0q9 5 19-1"
          fill="none"
          stroke="#ad7a5a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M59 177q36 11 76 0l-2 32-31 2-6-14-5 14-30-2Z"
          fill="#f7f3e7"
          stroke="#b5ab93"
          strokeWidth="2"
        />
        <path
          d="M61 183q35 10 72 0m-37 1v15m0-14q-10-6-10 1 2 6 10-1 9-7 11 0-1 6-11 0m-2 2-5 11m9-11 7 10"
          fill="none"
          stroke="#686757"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path d="m65 191 1 13m61-13-1 13" stroke="#dbd6c6" strokeWidth="2" />
        {/* Stylized gray-ink motifs, following the photo's placement. Fine
          lettering and exact tattoo subjects are intentionally not invented. */}
        <g
          className="avatar-tattoos"
          fill="none"
          stroke="#5d6256"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity=".78"
        >
          <g transform="translate(136 120) rotate(-17)">
            <path
              d="M0 13Q-7 6-3 1q5-6 9 0 7-2 8 4 0 7-10 10Zm3-10q-8 3-1 7 7 3 7-3-1-6-8-1m1 8-2 14m3-9 7-5m-8 10-6-6m7 4 8-3"
              strokeWidth="1.2"
            />
            <path
              d="m-1 23-5 8 7-3 4 7 3-10m-9 9 8 4m-10-3-2 5m5-4 3 6"
              strokeWidth="1"
            />
          </g>
          <path
            d="m40 153 1 5 5-6 1 7 4-6m-13 10 10 2m-11 2 10 2"
            strokeWidth="1.2"
          />
          <path
            d="m148 150 8 13-13 1Zm-5 1 12 10m-6-5-5 12m6-4 7 7m-12-4 8 6"
            strokeWidth="1.1"
          />
        </g>
        <path
          d="M78 103q19 24 38 0l-4-14H81Z"
          fill="#bf8b64"
          stroke="#90654b"
          strokeWidth="2"
        />
        <path
          d="M55 50q-7 4-3 20l8 6m72-26q12-4 10 13l-9 13"
          fill="#c6956c"
          stroke="#92674f"
          strokeWidth="2"
        />
        <path
          d="M58 43q39-29 78 1l-3 35q-7 32-37 33-29-3-35-32Z"
          fill="#cf9d73"
          stroke="#92674f"
          strokeWidth="2"
        />
        <path
          d="m60 64 6 17 6-2 9 9 15-4 14 4 12-10 9-12-1 25q-13 26-35 22-23-4-31-23Z"
          fill="#45433a"
        />
        <path d="M83 85q12-9 25 0l-1 9H83Z" fill="#45433a" />
        <path
          d="m88 96 13 0"
          stroke="#e9c2a0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <g fill="none" stroke="#466e69" strokeWidth="4">
          <rect x="61" y="54" width="30" height="22" rx="7" />
          <rect x="102" y="54" width="30" height="22" rx="7" />
          <path d="M91 61q5-4 11 0m-48-7 7 5m71-5 6-4" />
        </g>
        <g className="mini-eyes" fill="#393d34">
          <circle cx="77" cy="64" r="3" />
          <circle cx="116" cy="64" r="3" />
        </g>
        <path
          d="m95 66-4 15 8 1"
          fill="none"
          stroke="#ac7957"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M55 58q-12-9-3-22-11-12 5-17 6-3 12 1-4-14 12-13 7 0 9 7 9-14 20-4l2 7q16-10 23 3 3 5-1 10 17 2 11 17l-10 13-9-13q-13 13-23 1-12 14-24 0-7 11-17 4l-3 12Z"
          fill="#45433a"
          stroke="#393c32"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M59 34q-3-10 9-9m4 10q-7-11 5-15m9 15q12 1 7-10m12-6q10-7 14 4m-9 15q10 3 13-5m4 7q12-4 11 7"
          fill="none"
          stroke="#696153"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M76 110q18 33 41 0"
          stroke="#e1cb85"
          strokeWidth="2"
          fill="none"
        />
        <g transform="translate(0 27)">
          <g className="mini-heart">
            <path
              d="m96 153-22-20q-15-21 5-26 10-2 17 9 6-11 17-9 21 5 6 26Z"
              fill="#c88372"
              stroke="#aa695d"
              strokeWidth="2"
            />
            <path
              d="M47 148q3-12 17-20 8-5 10 2l-8 9q14-5 16 2-6 13-22 18-10 5-13-11m99 0q-3-12-17-20-8-5-10 2l8 9q-14-5-16 2 6 13 22 18 10 5 13-11"
              fill="#cf9d73"
              stroke="#92674f"
              strokeWidth="2"
            />
          </g>
        </g>
        <path
          className="mini-sparkle"
          d="m157 90 5-8 5 8-5 7Z"
          fill="#c9ab62"
        />
        <path
          className="mini-sparkle second"
          d="m24 106 3-6 4 6-4 5Z"
          fill="#c9ab62"
        />
      </g>
    </svg>
  );
}

export function Village({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 1100 300"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="An illustrated Japanese countryside village with a little cottage, a winding path, green hills and cherry blossoms"
    >
      <defs>
        <linearGradient id={`${id}sky`} x2="0" y2="1">
          <stop stopColor="#e5eddf" />
          <stop offset="1" stopColor="#f4edce" />
        </linearGradient>
        <linearGradient id={`${id}hill`} x2="0" y2="1">
          <stop stopColor="#a5b88a" />
          <stop offset="1" stopColor="#788f68" />
        </linearGradient>
        <pattern
          id={`${id}grain`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="2" r=".65" fill="#fbf9e9" opacity=".22" />
          <circle cx="5" cy="5" r=".6" fill="#516643" opacity=".09" />
        </pattern>
      </defs>
      <path fill={`url(#${id}sky)`} d="M0 0h1100v300H0Z" />
      <circle cx="723" cy="57" r="30" fill="#f7edc4" opacity=".8" />
      <g fill="#faf8e9" opacity=".6">
        <path d="M100 48q15-24 34-7 18-21 38 1 22-5 25 9h-97Z" />
        <path d="M465 39q15-20 30-7 25-22 40 4 22-6 25 8h-95Z" />
      </g>
      <path
        d="M0 158 110 86 195 136 302 68 401 138 513 94 637 167 780 103 933 156 1100 92v210H0Z"
        fill="#bccab3"
      />
      <path
        d="m302 68-34 46 32-13 17 14 16-8Zm478 35-33 30 29-8 15 10 12-6Z"
        fill="#e8ecdb"
        opacity=".65"
      />
      <path
        d="M0 183Q133 109 268 179T540 173Q718 105 869 169T1100 139v161H0Z"
        fill="#a6b991"
      />
      <path
        d="M0 222Q134 158 310 204T643 195Q835 141 1100 217v83H0Z"
        fill={`url(#${id}hill)`}
      />
      <path d="M0 271q201-64 408-21t365 2q164-27 327 13v35H0Z" fill="#70865e" />
      <path
        d="M550 300q-86-44-13-62t80-34l37 4q-5 24-62 40t57 52Z"
        fill="#d5ca9f"
      />
      <path
        d="M551 300q-63-43 0-59t80-34"
        stroke="#e6dcba"
        strokeWidth="5"
        fill="none"
      />
      <g stroke="#6c7054" strokeWidth="2" strokeLinejoin="round">
        <path d="M576 137h147v82H576Z" fill="#dcccaa" />
        <path d="m723 137 40-19v86l-40 15Z" fill="#b2a57f" />
        <path d="m554 140 86-69 111 53-27 22-78-47-72 49Z" fill="#8b755c" />
        <path d="m640 71 91-11 55 60-35 4Z" fill="#9c8260" />
        <path
          d="m643 78 85-8m-73 16 81-7m-68 15 76-5m-63 13 69-5m-57 14 65-5"
          stroke="#b4a07c"
        />
        <path d="M640 166q0-15 14-15t14 15v54h-28Z" fill="#6b7655" />
        <path d="M592 161h29v28h-29Zm94 0h23v28h-23Z" fill="#f4df9b" />
        <path d="M606 162v27m-13-13h28m76-15v28m-11-13h23" stroke="#9b8960" />
        <path d="M747 157v28l-13 5v-28Z" fill="#e3d19c" />
        <path d="M628 220h52l8 6h-69Z" fill="#9a9672" />
        <path d="m671 79 0-27 15 0 0 35" fill="#a69678" />
      </g>
      <path
        d="M679 47q-16-10-3-21t-1-21"
        fill="none"
        stroke="#f9f8e9"
        strokeWidth="9"
        strokeLinecap="round"
        opacity=".55"
      />
      <g fill="#e7d8ac">
        <path d="m843 238 17-13 7 5-17 14Zm-24 15 12-9 8 4-12 10Z" />
        <ellipse cx="574" cy="274" rx="13" ry="4" />
      </g>
      <g stroke="#737b54" strokeWidth="4" fill="none">
        <path d="m797 200 5 45m22-51 5 43m21-49 5 40m-59-13 61-16m-58 29 59-16" />
        <path d="m421 208-4 38m-19-43-4 39m-20-42-5 41m-18-37-4 41m1-28 76 8m-75 7 74 7" />
      </g>
      <g fill="#46664a">
        <path d="M81 227q-40-8-22-29-18-25 12-35-4-33 24-28 21-24 36 0 36-4 29 26 26 12 10 34 14 26-21 32Z" />
        <path d="m222 228 29-69 29 69Zm-34 8 23-53 23 53Zm698-19 27-66 28 66Zm45 7 22-55 23 55Z" />
      </g>
      <path
        d="m108 193 0 63m-1-35-24-25m25 14 22-26"
        stroke="#7a7557"
        strokeWidth="7"
        fill="none"
      />
      <g fill="#d4b989">
        <path d="m471 228 0-21 8-7 8 7v21Z" />
        <path d="m467 211 12-13 12 13Z" fill="#826f56" />
      </g>
      <g stroke="#556b45" strokeWidth="2">
        <path d="m32 297 0-23m48 13 0-21m114 32 0-25m131 12v-20m421 28v-22m285 25v-20m53 12v-22" />
      </g>
      <g fill="#eddca9">
        <circle cx="32" cy="272" r="4" />
        <circle cx="80" cy="265" r="4" />
        <circle cx="194" cy="272" r="4" />
        <circle cx="325" cy="263" r="4" />
        <circle cx="746" cy="269" r="4" />
        <circle cx="1031" cy="274" r="4" />
      </g>
      <path
        d="M1100 4q-33 34-100 39t-111 34m139-47-10-30m-20 43-8 40m-27-31-27-30m-18 40-27 32"
        stroke="#857d60"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {[
        [1080, 20],
        [1042, 32],
        [1012, 17],
        [1015, 65],
        [978, 51],
        [945, 33],
        [936, 74],
        [906, 82],
        [1065, 4],
        [988, 83],
      ].map(([x, y], i) => (
        <g
          key={i}
          transform={`translate(${x} ${y})`}
          fill={i % 2 ? "#e5c4ba" : "#f0d7c7"}
        >
          <circle cx="-5" cy="0" r="6" />
          <circle cx="4" cy="-4" r="6" />
          <circle cx="5" cy="5" r="6" />
          <circle cx="-3" cy="7" r="6" />
          <circle r="2" fill="#cfac82" />
        </g>
      ))}
      <g fill="#dbaea0" opacity=".75">
        <ellipse
          cx="945"
          cy="132"
          rx="4"
          ry="2"
          transform="rotate(40 945 132)"
        />
        <ellipse cx="1000" cy="180" rx="3" ry="2" />
        <ellipse cx="864" cy="99" rx="3" ry="2" />
      </g>
      <path
        d="m397 58 7-3 7 3m-36 11 5-3 5 3"
        fill="none"
        stroke="#7d8a70"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path fill={`url(#${id}grain)`} d="M0 0h1100v300H0Z" />
    </svg>
  );
}
