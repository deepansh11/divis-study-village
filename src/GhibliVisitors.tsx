import type { ReactNode } from "react";
import { ArrowRight, Check, Shuffle, Sparkles } from "lucide-react";
import { GHIBLI_VISITORS, type GhibliId, type GhibliVisitor } from "./ghibli";
import { SUPPLIED_GHIBLI_DESIGNS } from "./characterAssets";

function Eyes({
  y = 62,
  left = 65,
  right = 95,
  size = 4,
  pale = false,
}: {
  y?: number;
  left?: number;
  right?: number;
  size?: number;
  pale?: boolean;
}) {
  return (
    <g className="ghibli-eyes" fill={pale ? "#f6f1db" : "#343c32"}>
      <circle cx={left} cy={y} r={size} />
      <circle cx={right} cy={y} r={size} />
    </g>
  );
}
function Totoro({ kind = "gray" }: { kind?: "gray" | "blue" | "white" }) {
  const white = kind === "white",
    blue = kind === "blue";
  return (
    <>
      <path
        d="m49 54-3-31 13-7 10 34m22-1 10-34 12 9-4 31"
        fill={white ? "#f8f6e8" : blue ? "#829ba0" : "#8b9082"}
        stroke="#727b68"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="M47 58q-20 23-19 53 5 31 52 33 47 0 52-32 1-29-24-55-27-23-61 1Z"
        fill={white ? "#faf8ed" : blue ? "#8ea8aa" : "#93998b"}
        stroke="#727b68"
        strokeWidth="2.3"
      />
      {!white && (
        <>
          <ellipse cx="80" cy="105" rx="37" ry="34" fill="#ece7cc" />
          {[
            [-20, 92],
            [0, 87],
            [20, 92],
            [-14, 108],
            [13, 108],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`m${80 + x - 5} ${y + 3} 5-6 5 6`}
              fill="none"
              stroke={blue ? "#6d888d" : "#7b8372"}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
        </>
      )}
      <g fill="#f9f8ed">
        <ellipse cx="59" cy="63" rx="8" ry="7" />
        <ellipse cx="101" cy="63" rx="8" ry="7" />
      </g>
      <Eyes left={60} right={100} y={64} size={3} />
      {!white && (
        <>
          <path d="m73 65 7-3 7 3-7 6Z" fill="#3e483a" />
          <path
            d="M60 76q20 13 40 0"
            fill="none"
            stroke="#5d6854"
            strokeWidth="2"
          />
          <path
            d="m35 70-18-3m18 10-18 2m108-9 18-3m-18 10 18 2"
            stroke="#69745f"
            strokeWidth="1.5"
          />
        </>
      )}
      {kind === "gray" && (
        <g className="ghibli-leaf">
          <path d="m75 34 8-20" stroke="#69814d" strokeWidth="2" />
          <path
            d="M77 26Q57 3 92 9q13 21-15 17Z"
            fill="#91a06a"
            stroke="#69814d"
            strokeWidth="1.5"
          />
        </g>
      )}
      {blue && (
        <path
          d="m119 95 17-11 13 31-20 14-9-17Z"
          fill="#cfcba9"
          stroke="#8d967a"
          strokeWidth="2"
        />
      )}
    </>
  );
}
function Jiji() {
  return (
    <>
      <path
        className="ghibli-tail"
        d="M106 127q48 9 35-27-6-12-13-5-7 8 4 12"
        fill="none"
        stroke="#3c433d"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M59 85q-13 9-14 40-7 19 34 20 34-1 33-16L99 87Z"
        fill="#3c433d"
        stroke="#303932"
        strokeWidth="2"
      />
      <path
        d="m45 48-5-31 28 20q11-6 23 0l26-20-4 33q12 32-32 43-45-3-36-45Z"
        fill="#3c433d"
        stroke="#303932"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m47 27 3 20 10-6m35 0 12 5 3-19" fill="#9c7d7f" />
      <g fill="#ded8a5">
        <ellipse cx="62" cy="60" rx="11" ry="14" />
        <ellipse cx="96" cy="60" rx="11" ry="14" />
      </g>
      <Eyes left={64} right={94} y={62} size={5} />
      <path d="m75 73 5-2 5 2-5 5Z" fill="#bc8d82" />
      <path
        d="m50 74-23-4m23 10-23 4m84-10 23-4m-23 10 23 4"
        stroke="#535a4d"
        strokeWidth="1.5"
      />
      <path d="m68 92 13 6 13-6-4 13-19-1Z" fill="#bd756c" />
      <path
        d="m61 125 0 14m16-13 0 15m16-16 0 13"
        stroke="#73796a"
        strokeWidth="1.5"
      />
    </>
  );
}
function Calcifer() {
  return (
    <>
      <g className="ghibli-flame">
        <path
          d="M30 116Q8 86 43 48q-3 25 14 15 0-33 22-53 0 28 18 38 14-7 9-20 43 38 28 80-8 29-53 31-41 0-51-23Z"
          fill="#d88450"
          stroke="#b96943"
          strokeWidth="2"
        />
        <path
          d="M43 115q-10-25 13-48 1 27 19 12 13-13 11-27 28 18 22 43 20-2 17-14 16 53-44 53-26 0-38-19Z"
          fill="#eeb56a"
        />
        <path
          d="M57 121q-8-18 8-31 7 15 16 11 8-3 11-15 24 31 2 45-28 9-37-10Z"
          fill="#f7dca0"
        />
        <g fill="#fff7e2">
          <ellipse cx="59" cy="87" rx="11" ry="13" />
          <ellipse cx="102" cy="87" rx="11" ry="13" />
        </g>
        <Eyes left={60} right={101} y={89} size={4} />
        <path
          d="M70 111q11 6 21-1"
          fill="none"
          stroke="#8b503b"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <path
        d="m30 138 92-8 7 10-94 9Zm9-9 91 8-7 10-88-8Z"
        fill="#89745a"
        stroke="#695e4a"
        strokeWidth="2"
      />
    </>
  );
}
function NoFace() {
  return (
    <>
      <path
        d="M34 140q4-32 8-69 2-49 38-50 37 2 39 52l9 67q-47 15-94 0Z"
        fill="#48434d"
        stroke="#3f3c45"
        strokeWidth="2"
      />
      <path
        d="M56 35q24-18 47 1l4 38q-8 28-28 27-23-6-26-26Z"
        fill="#eee9d9"
        stroke="#c8c3b4"
        strokeWidth="1.5"
      />
      <Eyes left={66} right={94} y={55} size={3.5} />
      <path d="m61 63 9 0-4 11Zm29 0 9 0-5 11Z" fill="#a89baf" />
      <path d="m64 41 4 7m22 0 4-7" stroke="#a89baf" strokeWidth="3" />
      <path d="M71 83q9-4 18 0v5H71Z" fill="#5b5359" />
      <path
        d="M45 115q-23-3-26 8 10 12 27 6m68-14q22-3 27 8-10 12-27 6"
        fill="#554f5b"
      />
      <path d="m31 122 10-5 9 7-10 7Z" fill="#d5b66e" />
    </>
  );
}
function Catbus() {
  return (
    <>
      <path
        className="ghibli-tail"
        d="M128 102q28-2 18-25"
        fill="none"
        stroke="#b99458"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M23 110q-12-28 2-51l15-18 22 8h55q23 3 24 26l-3 41q-55 18-115-6Z"
        fill="#bd995f"
        stroke="#8a704c"
        strokeWidth="2.4"
      />
      <path
        d="m24 60 0-23 21 15m61-2 17-15 6 26"
        fill="#bd995f"
        stroke="#8a704c"
        strokeWidth="2"
      />
      <path
        d="M26 84q17 11 34 0l-2 24q-15 11-32-3Z"
        fill="#f0dc9d"
        stroke="#8a704c"
        strokeWidth="1.5"
      />
      <path
        d="m30 91 26 0m-17-1 0 18m10-18 0 18"
        stroke="#9d8053"
        strokeWidth="1.2"
      />
      <g fill="#ece4bd" stroke="#8a704c" strokeWidth="2">
        <path d="M67 64h16v26H67Zm23 0h16v26H90Zm23 0h16v26h-16Z" />
      </g>
      <g fill="#d5b371" stroke="#8a704c" strokeWidth="2">
        {[27, 46, 67, 87, 108, 126].map((x) => (
          <path key={x} d={`M${x} 111v16q-10 8-1 13 13 1 13-8v-19Z`} />
        ))}
      </g>
      <g fill="#efe4a4">
        <ellipse cx="29" cy="74" rx="7" ry="8" />
        <ellipse cx="51" cy="74" rx="7" ry="8" />
      </g>
      <Eyes left={30} right={50} y={75} size={3} />
      <path d="m36 81 4-3 4 3-4 3Z" fill="#7b6150" />
      <path
        d="m67 53 7 4m12-4 7 4m12-4 7 4m-43 44 12 4m11-4 12 4m8-3 12 4"
        stroke="#8a704c"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M71 43h37v13H71Z"
        fill="#e2d7a8"
        stroke="#8a704c"
        strokeWidth="1.5"
      />
      <path
        d="m81 48 5 4 7-4 6 4"
        fill="none"
        stroke="#92875e"
        strokeWidth="1.3"
      />
    </>
  );
}
function Haku() {
  return (
    <>
      <path
        d="M39 130q-29-33 7-54 42-24 64 1 21 25-7 40-22 12-21-9 2-15 20-13"
        fill="none"
        stroke="#a0bcb2"
        strokeWidth="24"
        strokeLinecap="round"
      />
      <path
        d="M40 130q-22-29 12-49 36-19 52 0"
        fill="none"
        stroke="#eef0dc"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="m38 129-19 8 11-17m74-48 15-8-7 19m-4 32 14 7-18 5"
        fill="#bfd0bc"
      />
      <path
        d="M65 47 53 23l24 17m18-1 14-20-1 28"
        fill="#d8e2c9"
        stroke="#8aa398"
        strokeWidth="2"
      />
      <path
        d="M51 43q26-22 55 0l14 18-22 8-8 15-21-11-25 1 9-18Z"
        fill="#f1f0dc"
        stroke="#91ac9f"
        strokeWidth="2"
      />
      <path d="m48 48 7-18 17 10 10-13 10 14 20-7-3 17" fill="#99b6ab" />
      <Eyes left={68} right={96} y={53} size={3} />
      <path
        d="m65 66 8 2m20-1 7-2m-46 6q-31 7-27-13m82 10q30 8 24-13"
        fill="none"
        stroke="#8ca99a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="m73 76-5 21 18-13" fill="#b9ccc0" />
    </>
  );
}
function SootSprites() {
  return (
    <>
      <g stroke="#414438" strokeWidth="2" fill="#42453c">
        {[
          [46, 99, 22],
          [100, 95, 27],
          [78, 42, 17],
        ].map(([x, y, r], i) => (
          <g key={i}>
            {Array.from({ length: 14 }, (_, n) => {
              const a = (n * Math.PI) / 7;
              return (
                <path
                  key={n}
                  d={`M${x + Math.cos(a) * (r - 3)} ${y + Math.sin(a) * (r - 3)}l${Math.cos(a) * 9} ${Math.sin(a) * 9}`}
                />
              );
            })}
            <circle cx={x} cy={y} r={r} />
            <g className="ghibli-eyes" stroke="none">
              <ellipse
                cx={x - r / 3}
                cy={y - 2}
                rx={r / 3}
                ry={r / 2.5}
                fill="#f5f2df"
              />
              <ellipse
                cx={x + r / 3}
                cy={y - 2}
                rx={r / 3}
                ry={r / 2.5}
                fill="#f5f2df"
              />
              <circle cx={x - r / 3 + 1} cy={y - 1} r="2.5" />
              <circle cx={x + r / 3 - 1} cy={y - 1} r="2.5" />
            </g>
          </g>
        ))}
      </g>
      <g strokeWidth="1.5">
        {[
          [27, 45, "#d6a5a0"],
          [133, 52, "#d6c380"],
          [69, 132, "#a7bba0"],
        ].map(([x, y, color], i) => (
          <path
            key={i}
            d="m0-7 3 3 4-1 0 5 3 3-5 2-2 4-4-3-5 0 1-5-2-4 5-1Z"
            transform={`translate(${x} ${y})`}
            fill={String(color)}
            stroke={String(color)}
          />
        ))}
      </g>
    </>
  );
}
function Kodama() {
  return (
    <>
      <path
        d="M62 88q-12 11-11 37-10 11-2 16 10 5 20-6l9-19 7 18q16 13 25 5 2-6-11-17l-3-35Z"
        fill="#e9eedb"
        stroke="#a4b397"
        strokeWidth="2"
      />
      <g className="ghibli-head-tilt">
        <path
          d="M42 54q-3-31 28-34 34-1 45 26 11 26-10 42-22 17-48 1-19-11-15-35Z"
          fill="#f0f3e5"
          stroke="#a4b397"
          strokeWidth="2"
        />
        <g fill="#5c6e57">
          <ellipse cx="61" cy="55" rx="8" ry="10" />
          <ellipse cx="95" cy="61" rx="7" ry="9" />
          <ellipse cx="74" cy="78" rx="7" ry="6" />
        </g>
      </g>
    </>
  );
}
function Ponyo() {
  return (
    <>
      <path
        d="M31 131q8-30 47-30 35 0 53 27-19 24-50 18-34 7-50-15Z"
        fill="#ca7970"
        stroke="#ab655e"
        strokeWidth="2"
      />
      <path
        d="m50 112-24-10-8 8 26 15m64-13 24-10 9 8-25 15"
        fill="#e8ba91"
        stroke="#b8896f"
        strokeWidth="2"
      />
      <path
        d="M41 54q-12-30 15-36 11-14 30-7 26-5 30 18 18 6 7 34l-40 18Z"
        fill="#b36b4e"
      />
      <ellipse
        cx="81"
        cy="66"
        rx="37"
        ry="35"
        fill="#edc8a4"
        stroke="#bb8e70"
        strokeWidth="2"
      />
      <path
        d="M43 54q14-5 18-19 5 15 19 4 9 10 22-2l17 19-4-27-48-9-25 15Z"
        fill="#b36b4e"
      />
      <Eyes left={66} right={96} y={65} size={3.5} />
      <path
        d="M72 82q9 9 18-1"
        fill="none"
        stroke="#a76f5a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g fill="#d99a88" opacity=".55">
        <ellipse cx="55" cy="77" rx="6" ry="3" />
        <ellipse cx="108" cy="77" rx="6" ry="3" />
      </g>
      <path
        d="M21 142q12-9 25 0t25 0 25 0 25 0 25 0"
        fill="none"
        stroke="#91b2b0"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </>
  );
}
function TurnipHead() {
  return (
    <>
      <path
        d="M79 83v63m-41-48 84-10m-43 38-18 18m19-18 20 17"
        fill="none"
        stroke="#82765b"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="m62 78-14 38 32 8 34-14-17-35Z"
        fill="#625d69"
        stroke="#4f4b56"
        strokeWidth="2"
      />
      <path d="m59 78 21 18 21-20-22 7Z" fill="#ece3c8" />
      <path d="m75 88 8 0 3 17-10 0Z" fill="#8c728d" />
      <path
        d="M55 43q23-19 48 0l-2 26q-20 17-42-1Z"
        fill="#e9e5d3"
        stroke="#a8a28b"
        strokeWidth="2"
      />
      <Eyes left={69} right={90} y={54} size={3} />
      <path
        d="M66 65q13 10 28-1"
        stroke="#8c826c"
        strokeWidth="2"
        fill="none"
      />
      <path d="M45 42q33-11 70 0l-3 9-66-1Z" fill="#56535d" />
      <path
        d="m61 41 1-25 34-1 7 27Z"
        fill="#625d69"
        stroke="#4f4b56"
        strokeWidth="2"
      />
      <path d="m62 32 37 0" stroke="#a47c8a" strokeWidth="6" />
    </>
  );
}
function Robot() {
  return (
    <>
      <g fill="#99977b" stroke="#74785f" strokeWidth="2">
        <path d="m55 65-19 13-18 57 11 5 29-42m47-33 18 15 21 54-12 6-29-44" />
        <path d="M55 55h51l9 52-14 16-43-2-15-20Z" />
        <path d="m60 117-6 25 18 3 8-25 8 24 18-2-6-25" />
        <path d="M56 20q22-12 43 2l8 24-12 18-33-1-15-18Z" />
      </g>
      <path d="m64 79 15-8 16 8-4 19H68Z" fill="#7e8568" />
      <circle
        cx="65"
        cy="38"
        r="7"
        fill="#d7ce9e"
        stroke="#656f59"
        strokeWidth="2"
      />
      <circle cx="89" cy="38" r="5" fill="#515e4d" />
      <path
        d="M68 54h20m-14-28 0 29m-36 46-9 26m96-23 10 23"
        stroke="#68745a"
        strokeWidth="2"
      />
      <path d="m105 41 8-17m-5 9 12-1" stroke="#7f9568" strokeWidth="2" />
      <g fill="#d3ba8e">
        <circle cx="113" cy="23" r="5" />
        <circle cx="118" cy="22" r="4" />
        <circle cx="117" cy="28" r="4" />
      </g>
      <path d="m45 110 7-8 4 13m41 12 8-5 3 10" fill="#7f9568" />
    </>
  );
}

type HumanKind =
  "kiki" | "howl" | "sophie" | "chihiro" | "san" | "arrietty" | "nausicaa";
function Human({ kind }: { kind: HumanKind }) {
  const colors = {
    kiki: ["#40424d", "#44403c"],
    howl: ["#ead69a", "#b48f91"],
    sophie: ["#b2b5a8", "#819b99"],
    chihiro: ["#635247", "#c98887"],
    san: ["#6b5143", "#5d6e72"],
    arrietty: ["#9e7052", "#b97666"],
    nausicaa: ["#ab805b", "#779da5"],
  };
  const [hair, dress] = colors[kind];
  return (
    <>
      {kind === "kiki" && (
        <>
          <path
            d="m23 125 113-74"
            stroke="#997c55"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="m28 117-16 12 10 16 16-13Z"
            fill="#c6b17e"
            stroke="#a28c63"
            strokeWidth="2"
          />
          <path
            d="m18 131 10 10m-6-13 10 10"
            stroke="#a28c63"
            strokeWidth="1.5"
          />
        </>
      )}
      {kind === "nausicaa" && (
        <path
          d="M12 116 66 97 80 110 96 97 149 115 102 121 81 115 60 122Z"
          fill="#e9e6ce"
          stroke="#9aab9c"
          strokeWidth="2"
        />
      )}
      <path
        d="m65 124-3 18h14l4-16 6 16h14l-5-18"
        fill="#ddbc98"
        stroke="#a58b6d"
        strokeWidth="1.5"
      />
      <path
        d="M56 81q-12 7-17 33l12 5 8-16-5 28q25 12 53 0l-5-28 8 15 12-6q-4-25-20-31Z"
        fill={dress}
        stroke="#6e7569"
        strokeWidth="2"
      />
      {kind === "howl" && (
        <>
          <path
            d="M55 80 36 118l16 11 19-44m31-5 25 38-16 12-20-46"
            fill="#dfcab7"
            stroke="#8e8390"
            strokeWidth="2"
          />
          <path
            d="m49 94 9 10-8 11-8-10m67-10 10 10-7 11-10-11"
            fill="#a18596"
          />
          <path d="m65 88 15 10 16-11-6 38H70Z" fill="#eee7d3" />
          <path d="m80 98 0 23" stroke="#c5ac72" strokeWidth="2" />
        </>
      )}
      {kind === "sophie" && (
        <path
          d="m70 88 10 9 10-9m-10 10 0 29"
          fill="none"
          stroke="#c4d2bf"
          strokeWidth="2"
        />
      )}
      {kind === "chihiro" && (
        <>
          <path d="m55 104 51 0 3 11-57-1Z" fill="#a6b99b" />
          <path d="M60 126h41v10H60Z" fill="#c98887" />
        </>
      )}
      {kind === "san" && (
        <>
          <path
            d="m54 83-7 19 14-3 5 13 9-13 13 9 10-12 15 5-8-20Z"
            fill="#ede8d5"
            stroke="#b8b4a0"
            strokeWidth="1.5"
          />
          <path
            d="m55 105-12 35 9 4 9-37"
            fill="#d9d4bb"
            stroke="#8c8b73"
            strokeWidth="1.5"
          />
        </>
      )}
      <path
        d="M47 51q-5-29 21-36 31-10 45 16 9 18 0 39l-15 16H57Z"
        fill={hair}
        stroke="#6e6252"
        strokeWidth="1.5"
      />
      <ellipse
        cx="80"
        cy="56"
        rx="29"
        ry="31"
        fill="#e6c19a"
        stroke="#b89172"
        strokeWidth="1.5"
      />
      <path
        d="M50 49q12-7 18-24 4 18 14 11 9 12 18-2l11 18-2-21-24-14-29 8Z"
        fill={hair}
      />
      <Eyes left={69} right={91} y={58} size={2.7} />
      <path
        d="M73 73q7 5 14 0"
        fill="none"
        stroke="#a77761"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {kind === "kiki" && (
        <>
          <path
            d="m73 25-24-15-4 21 28 2 30-15-5-13Z"
            fill="#b96e66"
            stroke="#955950"
            strokeWidth="2"
          />
          <ellipse cx="76" cy="27" rx="7" ry="8" fill="#c38375" />
        </>
      )}
      {kind === "howl" && (
        <>
          <path
            d="M50 42q-10 15-4 38l14 11-7-31m57-18q12 20 3 42l-12 7 8-33"
            fill={hair}
          />
          <circle cx="50" cy="72" r="3" fill="#88a69a" />
          <circle cx="110" cy="72" r="3" fill="#88a69a" />
          <path
            d="M74 101q7 9 13-1"
            stroke="#c6ac6b"
            strokeWidth="2"
            fill="none"
          />
        </>
      )}
      {kind === "sophie" && (
        <>
          <path
            d="m53 62-7 11 6 9-6 10 10 10 4-16-5-8 6-9m47-6 7 11-6 9 6 10-10 9-3-15 5-8-6-9"
            fill={hair}
            stroke="#7f8e80"
            strokeWidth="1.5"
          />
          <path
            d="M40 29q40-15 80 0l6 9q-45 11-92 0Z"
            fill="#c8b684"
            stroke="#a5946b"
            strokeWidth="2"
          />
          <path
            d="M54 29q-2-27 27-24 26 0 28 26Z"
            fill="#d9c99c"
            stroke="#a5946b"
            strokeWidth="2"
          />
          <path d="m55 23 54 0" stroke="#9d8c6b" strokeWidth="5" />
          <circle cx="105" cy="24" r="6" fill="#bf8c87" />
        </>
      )}
      {kind === "chihiro" && (
        <>
          <path d="M105 34q32-3 21 21l-19-8Z" fill={hair} />
          <path d="m108 35 7 10" stroke="#b290aa" strokeWidth="4" />
        </>
      )}
      {kind === "san" && (
        <>
          <path
            d="m53 58 11 8-5 8m48-16-11 8 5 8m-21-31 0 9"
            fill="none"
            stroke="#b96f60"
            strokeWidth="4"
          />
          <path
            d="m52 27-8-19 24 11m26 0 21-11-5 22"
            fill="#eee8d4"
            stroke="#9c9b84"
            strokeWidth="2"
          />
          <path
            d="M61 18q19-16 38 0l-7 16-11-8-11 8Z"
            fill="#b96f60"
            stroke="#8b6255"
            strokeWidth="1.5"
          />
          <path d="m72 20 6-5m9 0 5 5" stroke="#ebe0c4" strokeWidth="3" />
          <circle cx="49" cy="73" r="5" fill="#e8dcb9" />
          <circle cx="111" cy="73" r="5" fill="#e8dcb9" />
        </>
      )}
      {kind === "arrietty" && (
        <>
          <path d="M96 24q22-28 37-8 2 16-18 20Z" fill={hair} />
          <path
            d="m105 20 14 8 9-15-13-7Z"
            fill="#94a476"
            stroke="#728658"
            strokeWidth="1.5"
          />
          <path
            d="M104 85q25-4 27 17l-9 18-12-5Z"
            fill="#b1ad85"
            stroke="#878e68"
            strokeWidth="2"
          />
          <path d="m41 114-7 24m-2-18 7 4" stroke="#b3aa7a" strokeWidth="2" />
        </>
      )}
      {kind === "nausicaa" && (
        <>
          <path
            d="m48 44 11-24 19-7 24 12 11 23-9 7-9-23-24 0-15 22Z"
            fill="#85a8ae"
            stroke="#63858c"
            strokeWidth="2"
          />
          <path
            d="m63 93 17 7 17-7m-17 8 0 17m-13-10 26 0"
            stroke="#e9e4c9"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M111 87q21-7 24 8l-11 13-10-9Z"
            fill="#c4a16a"
            stroke="#9d8257"
            strokeWidth="1.5"
          />
          <path
            d="m114 88 1-12 8 9m2 0 7-11-1 16"
            fill="#c4a16a"
            stroke="#9d8257"
            strokeWidth="1.5"
          />
          <circle cx="123" cy="93" r="2" fill="#454d3e" />
        </>
      )}
    </>
  );
}
function Porco() {
  return (
    <>
      <path
        d="M47 94q33-18 66 0l13 42H34Z"
        fill="#b09572"
        stroke="#826d55"
        strokeWidth="2"
      />
      <path d="m61 88 19 20 20-21-7 47H67Z" fill="#e6d5b2" />
      <path d="m77 108 7 0 5 28-15 0Z" fill="#966e5b" />
      <path
        d="m48 44-9-15 22 5m37 0 23-7-8 22"
        fill="#d7a18d"
        stroke="#ad7f6d"
        strokeWidth="2"
      />
      <ellipse
        cx="80"
        cy="60"
        rx="39"
        ry="34"
        fill="#d9a992"
        stroke="#ad7f6d"
        strokeWidth="2"
      />
      <path
        d="M38 40q42-23 84 1l-9-15-30-10-32 12Z"
        fill="#e5d4ac"
        stroke="#a38b67"
        strokeWidth="2"
      />
      <path d="m47 30 63-1" stroke="#ad9269" strokeWidth="5" />
      <g fill="#48514c" stroke="#737b69" strokeWidth="2">
        <rect x="46" y="46" width="29" height="17" rx="7" />
        <rect x="86" y="46" width="29" height="17" rx="7" />
        <path d="m75 51 11 0" />
      </g>
      <ellipse
        cx="80"
        cy="71"
        rx="16"
        ry="10"
        fill="#c99180"
        stroke="#a67464"
        strokeWidth="1.5"
      />
      <g fill="#8e6255">
        <ellipse cx="75" cy="71" rx="2.5" ry="3" />
        <ellipse cx="85" cy="71" rx="2.5" ry="3" />
      </g>
      <path d="M63 84q9-7 17-2 9-5 18 2l-11 5-7-4-7 4Z" fill="#635647" />
    </>
  );
}
function Baron() {
  return (
    <>
      <path
        d="m60 85-16 49 24 8 12-20 14 20 24-9-18-48Z"
        fill="#eee6cd"
        stroke="#aa9a77"
        strokeWidth="2"
      />
      <path d="m65 88 14 22 15-22-4 41H72Z" fill="#b39e72" />
      <path d="m67 94 12 5 13-6-3 13-11-5-9 6Z" fill="#8b9b81" />
      <path
        d="M51 44 49 18l24 20m14 0 24-20-2 28"
        fill="#c9a477"
        stroke="#8f795c"
        strokeWidth="2"
      />
      <path
        d="M49 44q30-20 62 0l-5 31-27 19-27-19Z"
        fill="#d6b98c"
        stroke="#9d8564"
        strokeWidth="2"
      />
      <path d="M66 66q14-8 27 0l7 16-21 12-21-13Z" fill="#efe2bd" />
      <g fill="#849b83">
        <ellipse cx="63" cy="55" rx="7" ry="5" />
        <ellipse cx="96" cy="55" rx="7" ry="5" />
      </g>
      <Eyes left={64} right={95} y={55} size={2.5} />
      <path d="m75 72 5-3 5 3-5 5Z" fill="#926f5b" />
      <path
        d="m80 77 0 5m-8 0q8 6 16 0m-31-9-18-3m18 8-18 3m65-8 18-3m-18 8 18 3"
        fill="none"
        stroke="#9b845f"
        strokeWidth="1.2"
      />
      <path
        d="M40 35q39-15 80 0l-4 9-73-1Z"
        fill="#e4d6b0"
        stroke="#a8946f"
        strokeWidth="2"
      />
      <path
        d="m57 34 0-28 39 0 7 29Z"
        fill="#efe3c1"
        stroke="#a8946f"
        strokeWidth="2"
      />
      <path d="m58 26 43 0" stroke="#9f9273" strokeWidth="5" />
      <path
        d="m116 100 0 46m-4-45q5-7 10 0"
        fill="none"
        stroke="#8e7c5e"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  );
}

export function GhibliCharacter({
  id,
  className = "",
}: {
  id: GhibliId;
  className?: string;
}) {
  const visitor = GHIBLI_VISITORS.find((v) => v.id === id)!;
  if (SUPPLIED_GHIBLI_DESIGNS.some((supplied) => supplied === id)) {
    return (
      <svg
        viewBox="0 0 160 160"
        className={`character character-ghibli supplied-ghibli ${className}`}
        data-visitor={id}
        data-artwork="provided"
        role="img"
        aria-label={`${visitor.name}, an illustrated visitor from ${visitor.film}, from the supplied character designs`}
      >
        <g className="ghibli-float">
          <g
            className={
              id === "calcifer"
                ? "ghibli-flame"
                : id === "kodama"
                  ? "ghibli-head-tilt"
                  : ""
            }
          >
            <image
              href={`/characters/ghibli-${id}.webp`}
              x="3"
              y="2"
              width="154"
              height="150"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </svg>
    );
  }
  let art: ReactNode;
  switch (id) {
    case "totoro":
      art = <Totoro />;
      break;
    case "blue-totoro":
      art = <Totoro kind="blue" />;
      break;
    case "white-totoro":
      art = <Totoro kind="white" />;
      break;
    case "jiji":
      art = <Jiji />;
      break;
    case "calcifer":
      art = <Calcifer />;
      break;
    case "no-face":
      art = <NoFace />;
      break;
    case "catbus":
      art = <Catbus />;
      break;
    case "haku":
      art = <Haku />;
      break;
    case "soot-sprites":
      art = <SootSprites />;
      break;
    case "kodama":
      art = <Kodama />;
      break;
    case "ponyo":
      art = <Ponyo />;
      break;
    case "turnip-head":
      art = <TurnipHead />;
      break;
    case "robot":
      art = <Robot />;
      break;
    case "porco":
      art = <Porco />;
      break;
    case "baron":
      art = <Baron />;
      break;
    default:
      art = <Human kind={id} />;
  }
  return (
    <svg
      viewBox="0 0 160 160"
      className={`character character-ghibli ${className}`}
      data-visitor={id}
      role="img"
      aria-label={`${visitor.name}, an illustrated visitor from ${visitor.film}`}
    >
      <ellipse cx="80" cy="147" rx="48" ry="6" fill="#66735a" opacity=".12" />
      <g className="ghibli-float">{art}</g>
    </svg>
  );
}

export function VisitorPostcard({
  visitor,
  onOpen,
}: {
  visitor: GhibliVisitor;
  onOpen: () => void;
}) {
  return (
    <button
      className="card visitor-postcard"
      onClick={onOpen}
      aria-label={`Meet all ${GHIBLI_VISITORS.length} Ghibli visitors. ${visitor.name} is visiting today.`}
    >
      <span
        className="visitor-postcard-art"
        style={{ background: visitor.color }}
      >
        <GhibliCharacter id={visitor.id} />
      </span>
      <span className="visitor-postcard-copy">
        <small>A LITTLE GHIBLI MAGIC</small>
        <strong>{visitor.name} stopped by.</strong>
        <span>
          Meet the whole little world <ArrowRight size={13} />
        </span>
      </span>
    </button>
  );
}

export function GhibliCorner({
  selected,
  pinned,
  onSelect,
  onPin,
  onRotate,
  onClose,
}: {
  selected: GhibliVisitor;
  pinned?: string;
  onSelect: (id: GhibliId) => void;
  onPin: () => void;
  onRotate: () => void;
  onClose: () => void;
}) {
  return (
    <div className="ghibli-corner">
      <p className="small muted">
        A whole little world of familiar friends. Mylo is still in charge of the
        study desk, of course.
      </p>
      <div className="visitor-spotlight">
        <div style={{ background: selected.color }}>
          <GhibliCharacter id={selected.id} />
        </div>
        <section>
          <span className="eyebrow">A FAMILIAR LITTLE FRIEND</span>
          <h3>{selected.name}</h3>
          <span className="visitor-film">{selected.film}</span>
          <p>{selected.note}</p>
          <button
            className="button primary"
            onClick={onPin}
            disabled={pinned === selected.id}
          >
            {pinned === selected.id ? (
              <Check size={15} />
            ) : (
              <Sparkles size={15} />
            )}
            {pinned === selected.id
              ? "Keeping you company"
              : `Keep ${selected.name} nearby`}
          </button>
        </section>
      </div>
      <div className="visitors-grid" aria-label="Ghibli character collection">
        {GHIBLI_VISITORS.map((v) => (
          <button
            key={v.id}
            className={`visitor-tile ${selected.id === v.id ? "selected" : ""}`}
            aria-pressed={selected.id === v.id}
            aria-label={`Visit ${v.name}`}
            onClick={() => onSelect(v.id)}
          >
            <span className="visitor-tile-art" style={{ background: v.color }}>
              <GhibliCharacter id={v.id} />
            </span>
            <strong>{v.name}</strong>
            <small>{v.film}</small>
            {pinned === v.id && (
              <span className="visitor-pinned">
                <Check size={10} />
                Staying nearby
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="visitors-footer">
        <button className="text-button" onClick={onRotate}>
          <Shuffle size={14} />
          Let visitors take turns
        </button>
        <button className="button secondary" onClick={onClose}>
          Back to my little day <ArrowRight size={14} />
        </button>
      </div>
      <p className="fan-art-note">
        Personal fan-art tributes, illustrated for this little village.
        Characters belong to their respective creators; this is not an official
        Studio Ghibli app. Encouragement messages are original, not film
        quotations.
      </p>
    </div>
  );
}
