export const GHIBLI_VISITORS = [
  {
    id: "totoro",
    name: "Totoro",
    film: "My Neighbor Totoro",
    note: "Big dreams can grow from very little seeds.",
    color: "#e5eadc",
  },
  {
    id: "jiji",
    name: "Jiji",
    film: "Kiki’s Delivery Service",
    note: "A little company for your next chapter.",
    color: "#eee4e6",
  },
  {
    id: "calcifer",
    name: "Calcifer",
    film: "Howl’s Moving Castle",
    note: "Keep that little spark of yours alive.",
    color: "#f5e6d3",
  },
  {
    id: "no-face",
    name: "No-Face",
    film: "Spirited Away",
    note: "A quiet moment is a good place to begin.",
    color: "#e9e4ed",
  },
  {
    id: "catbus",
    name: "Catbus",
    film: "My Neighbor Totoro",
    note: "One little stop closer to your dreams.",
    color: "#eee5cb",
  },
  {
    id: "haku",
    name: "Haku",
    film: "Spirited Away",
    note: "Find your way back to what matters to you.",
    color: "#dfece7",
  },
  {
    id: "ponyo",
    name: "Ponyo",
    film: "Ponyo",
    note: "Bring a little curiosity to the next page.",
    color: "#f2e3dc",
  },
  {
    id: "soot-sprites",
    name: "Soot Sprites",
    film: "Spirited Away / My Neighbor Totoro",
    note: "Little efforts, carried together.",
    color: "#eae6d9",
  },
  {
    id: "kodama",
    name: "Kodama",
    film: "Princess Mononoke",
    note: "Even the quietest growth is still growth.",
    color: "#e1eadb",
  },
  {
    id: "kiki",
    name: "Kiki",
    film: "Kiki’s Delivery Service",
    note: "You can start before you feel ready.",
    color: "#e9e3ed",
  },
  {
    id: "howl",
    name: "Howl",
    film: "Howl’s Moving Castle",
    note: "There is a little magic in showing up.",
    color: "#eee2dc",
  },
  {
    id: "sophie",
    name: "Sophie",
    film: "Howl’s Moving Castle",
    note: "Gentle can be a very brave way to be.",
    color: "#e4e9e6",
  },
  {
    id: "chihiro",
    name: "Chihiro",
    film: "Spirited Away",
    note: "Bravery is often just taking the next step.",
    color: "#f1e2e2",
  },
  {
    id: "san",
    name: "San",
    film: "Princess Mononoke",
    note: "Protect your peace. Then keep going.",
    color: "#e6e9df",
  },
  {
    id: "turnip-head",
    name: "Turnip Head",
    film: "Howl’s Moving Castle",
    note: "A little kindness can turn a day around.",
    color: "#e9e4d8",
  },
  {
    id: "blue-totoro",
    name: "Blue Totoro",
    film: "My Neighbor Totoro",
    note: "Gather one little win at a time.",
    color: "#dfe8eb",
  },
  {
    id: "white-totoro",
    name: "Little White Totoro",
    film: "My Neighbor Totoro",
    note: "Small doesn’t mean insignificant.",
    color: "#e9eddf",
  },
  {
    id: "robot",
    name: "Laputa’s Robot",
    film: "Castle in the Sky",
    note: "Leave a little room for flowers, too.",
    color: "#e9e6da",
  },
  {
    id: "porco",
    name: "Porco Rosso",
    film: "Porco Rosso",
    note: "A steady course. A little courage.",
    color: "#f0e2d6",
  },
  {
    id: "arrietty",
    name: "Arrietty",
    film: "The Secret World of Arrietty",
    note: "Tiny steps can be wonderful adventures.",
    color: "#e8ead9",
  },
  {
    id: "nausicaa",
    name: "Nausicaä",
    film: "Nausicaä of the Valley of the Wind",
    note: "Be curious. Be kind. Keep learning.",
    color: "#dfeaec",
  },
  {
    id: "baron",
    name: "The Baron",
    film: "The Cat Returns / Whisper of the Heart",
    note: "Trust the little story you’re writing.",
    color: "#eee7d8",
  },
] as const;

export type GhibliId = (typeof GHIBLI_VISITORS)[number]["id"];
export type GhibliVisitor = (typeof GHIBLI_VISITORS)[number];
export function isGhibliId(id: unknown): id is GhibliId {
  return GHIBLI_VISITORS.some((v) => v.id === id);
}
export function visitorForDay(
  dayIndex: number,
  pinned?: string,
): GhibliVisitor {
  return (
    GHIBLI_VISITORS.find((v) => v.id === pinned) ||
    GHIBLI_VISITORS[Math.max(0, Math.floor(dayIndex)) % GHIBLI_VISITORS.length]
  );
}
