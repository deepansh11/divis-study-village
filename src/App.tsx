import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CircleHelp,
  Coffee,
  Download,
  Flame,
  Flower2,
  Heart,
  Home,
  Leaf,
  Mail,
  Moon,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Settings,
  Share2,
  ShieldCheck,
  Sprout,
  Sparkles,
  Sun,
  Timer as TimerIcon,
  Trash2,
  TrendingUp,
  Upload,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Dog, MiniYou, Village } from "./Illustrations";
import { nicknameForDay } from "./personalization";
import {
  GhibliCharacter,
  GhibliCorner,
  VisitorPostcard,
} from "./GhibliVisitors";
import { GHIBLI_VISITORS, visitorForDay, type GhibliId } from "./ghibli";
import { miniPoseForNote } from "./characterAssets";
import {
  KEY,
  LEVELS,
  addDays,
  badges,
  challengeDates,
  dateKey,
  dayDifference,
  displayDate,
  emptyDay,
  finishTimer,
  formatMinutes,
  freshTimer,
  initialState,
  levelFor,
  minutesFor,
  migrateCompanionName,
  percent,
  remainingSeconds,
  stats,
  uid,
  validateState,
  type Day,
  type State,
  type StudyTest,
} from "./model";

type Tab = "today" | "journey" | "focus" | "tests";
type Confirm = {
  title: string;
  detail: string;
  action: () => void;
  label: string;
};
const SUBJECTS = [
  "Accounting",
  "Advanced Accounting",
  "Corporate & Other Laws",
  "Taxation",
  "Cost & Management Accounting",
  "Auditing & Ethics",
  "Financial Management",
  "Strategic Management",
  "Financial Reporting",
  "Advanced Financial Management",
  "Direct Tax Laws",
  "Indirect Tax Laws",
  "Integrated Business Solutions",
];
const MOODS = [
  { icon: "😴", label: "Tired" },
  { icon: "🌧️", label: "Low" },
  { icon: "🌤️", label: "Okay" },
  { icon: "🌷", label: "Good" },
  { icon: "✨", label: "Wonderful" },
];
const NOTES = [
  "Divi, you don’t have to do the whole mountain today. Just the next little step. I’m cheering for you. Always.",
  "Babe, a little reminder: your marks are something you work on. They are not who you are. You’re already so much more.",
  "Pyaari Pyaari, one page, one question, one tiny win. And then we can argue about what to eat. You’ve got this.",
  "Babe, even the strongest ninja needs a ramen break. Stretch, drink some water, and come back when you’re ready. 🍜",
  "Pyaari Pyaari, some days are for blooming. Some are for growing roots. I’m proud of your effort on both kinds of days.",
];
function safeLoad() {
  try {
    const raw = localStorage.getItem(KEY);
    return {
      data: raw
        ? migrateCompanionName(validateState(JSON.parse(raw)))
        : initialState(),
      error: "",
    };
  } catch {
    return {
      data: initialState(),
      error:
        "Your saved data could not be read. It has not been overwritten. Restore a backup in Settings, or explicitly choose to start fresh.",
    };
  }
}
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={21} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(Math.min(100, Math.max(0, value)))}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
function SectionTitle({
  icon,
  title,
  action,
}: {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-title">
      <h2>
        {icon}
        {title}
      </h2>
      {action}
    </div>
  );
}
function Empty({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty-state">
      {icon}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
function beep() {
  try {
    const audio = new AudioContext();
    const osc = audio.createOscillator(),
      gain = audio.createGain();
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.type = "sine";
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.08, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 1);
    osc.start();
    osc.stop(audio.currentTime + 1);
    osc.onended = () => {
      void audio.close();
    };
  } catch {
    /* Optional sound; visual completion remains available. */
  }
}

export default function App() {
  const [loaded] = useState(safeLoad);
  const [state, setState] = useState<State>(loaded.data);
  const [storageError, setStorageError] = useState(loaded.error);
  const [saveBlocked, setSaveBlocked] = useState(!!loaded.error);
  const [tab, setTab] = useState<Tab>("today");
  const [now, setNow] = useState(Date.now());
  const [editing, setEditing] = useState<string | null>(null);
  const [settings, setSettings] = useState(false);
  const [note, setNote] = useState<number | null>(null);
  const [noteCycle, setNoteCycle] = useState(0);
  const [reward, setReward] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [toast, setToast] = useState("");
  const [sharing, setSharing] = useState<{ url: string; blob: Blob } | null>(
    null,
  );
  const [shareBusy, setShareBusy] = useState(false);
  const [help, setHelp] = useState(false);
  const [visitorsOpen, setVisitorsOpen] = useState(false);
  const [visitorPreview, setVisitorPreview] = useState<GhibliId | null>(null);
  const today = dateKey(new Date(now), state.profile.timezone);
  const st = stats(state, today);
  const dayNo = dayDifference(today, state.profile.start) + 1;
  const nickname = nicknameForDay(dayNo - 1, state.profile.name);
  const activeVisitor = visitorForDay(dayNo - 1, state.profile.visitor);
  const selectedVisitor =
    GHIBLI_VISITORS.find((v) => v.id === visitorPreview) || activeVisitor;
  const inChallenge = dayNo >= 1 && dayNo <= 50;
  const todayMinutes = minutesFor(state, today);
  const todayDay = state.days[today] || emptyDay();
  const achieved = badges(state, today);
  const level = levelFor(st.points),
    nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const seconds = remainingSeconds(state.timer, now);
  const lastFinished = useRef("");
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storageReady = useRef(false);

  function notify(message: string) {
    setToast(message);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), 4500);
  }
  function openVisitors() {
    setVisitorPreview(activeVisitor.id);
    setVisitorsOpen(true);
  }
  useEffect(
    () => () => {
      if (toastRef.current) clearTimeout(toastRef.current);
    },
    [],
  );
  useEffect(() => {
    document.documentElement.dataset.theme = state.profile.theme;
  }, [state.profile.theme]);
  useEffect(() => {
    if (saveBlocked) return;
    if (storageReady.current) {
      storageReady.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      setStorageError("");
    } catch {
      setStorageError(
        "Saving is unavailable or storage is full. Keep this page open and export a backup now.",
      );
    }
  }, [state, saveBlocked]);
  useEffect(() => {
    // Keep an idle second tab from silently overwriting edits in the active one.
    const onStorage = (event: StorageEvent) => {
      if (event.key === KEY && event.newValue) {
        try {
          const data = migrateCompanionName(
            validateState(JSON.parse(event.newValue)),
          );
          storageReady.current = true;
          setState(data);
        } catch {
          setStorageError(
            "Another tab saved unreadable data. Export a backup before continuing.",
          );
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    const update = () => setNow(Date.now());
    const interval = setInterval(
      update,
      state.timer.status === "running" ? 500 : 30000,
    );
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [state.timer.status]);
  useEffect(() => {
    if (state.timer.status !== "running" || seconds > 0) return;
    const timer = state.timer;
    const oldMinutes = minutesFor(state, timer.date);
    setState((current) =>
      current.timer.id === timer.id && current.timer.status === "running"
        ? finishTimer(current, today)
        : current,
    );
    if (lastFinished.current === timer.id) return;
    lastFinished.current = timer.id;
    if (state.profile.sound) beep();
    if (timer.mode === "focus") {
      notify("A little win! 25 minutes saved. Your 5-minute break is ready.");
      if (
        oldMinutes < state.profile.target &&
        oldMinutes + 25 >= state.profile.target
      )
        setReward(
          "Pyaari Pyaari, your daily target is complete. Look at you, showing up for your dreams. I’m so proud of you.",
        );
    } else
      notify("Break complete. Your next focus session is ready when you are.");
  }, [seconds, state.timer.status, state.timer.id, today]);
  useEffect(() => {
    document.title =
      state.timer.status === "running"
        ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} · Divi’s Village`
        : "Divi’s Study Village";
  }, [seconds, state.timer.status]);
  useEffect(
    () => () => {
      if (sharing) URL.revokeObjectURL(sharing.url);
    },
    [sharing],
  );

  function updateDay(date: string, patch: Partial<Day>) {
    setState((s) => ({
      ...s,
      days: {
        ...s.days,
        [date]: { ...(s.days[date] || emptyDay()), ...patch },
      },
    }));
  }
  function saveDay(date: string, day: Day) {
    const before = minutesFor(state, date),
      after =
        day.manualMinutes +
        state.sessions.filter((x) => x.date === date).length * 25;
    updateDay(date, day);
    setEditing(null);
    notify("Your day is saved. Every little effort counts.");
    if (before < state.profile.target && after >= state.profile.target)
      setReward(
        "Target reached, Babe! You did the work, one little step at a time. This calls for something delicious. 💛",
      );
  }
  function toggleTimer() {
    const timestamp = Date.now();
    setNow(timestamp);
    if (state.profile.sound && state.timer.status !== "running") beep();
    setState((s) => {
      const t = s.timer;
      if (t.status === "running")
        return {
          ...s,
          timer: {
            ...t,
            status: "paused",
            remaining: remainingSeconds(t, timestamp),
            endsAt: null,
          },
        };
      return {
        ...s,
        timer: {
          ...t,
          date: t.status === "idle" ? today : t.date,
          status: "running",
          endsAt: timestamp + t.remaining * 1000,
        },
      };
    });
  }
  function resetTimer() {
    setConfirm({
      title: "Reset this timer?",
      detail:
        "The current unfinished session will be discarded. Already completed sessions stay saved.",
      label: "Reset timer",
      action: () => setState((s) => ({ ...s, timer: freshTimer(today) })),
    });
  }
  function exportBackup() {
    download(
      new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
      `divi-study-village-${today}.json`,
    );
    notify("Backup downloaded. Keep it somewhere safe, like iCloud Drive.");
  }
  async function importBackup(file: File) {
    try {
      if (file.size > 10 * 1024 * 1024)
        throw new Error("Please choose a backup smaller than 10 MB.");
      const imported = migrateCompanionName(
        validateState(JSON.parse(await file.text())),
      );
      setConfirm({
        title: "Restore this backup?",
        detail: `${Object.keys(imported.days).length} daily records, ${imported.tests.length} tests, and ${imported.sessions.length} focus sessions. This replaces the data currently on this iPad. Export a backup first if you need to keep it.`,
        label: "Restore backup",
        action: () => {
          setSaveBlocked(false);
          setState(imported);
          setSettings(false);
          notify("Your study village has been restored.");
        },
      });
    } catch (e) {
      notify(e instanceof Error ? e.message : "This backup could not be read.");
    }
  }
  async function makeShareCard() {
    setShareBusy(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext("2d");
      if (!ctx)
        throw new Error("Image export is not available in this browser.");
      ctx.fillStyle = "#f6f3e7";
      ctx.fillRect(0, 0, 1080, 1350);
      ctx.fillStyle = "#e3ead7";
      ctx.beginPath();
      ctx.arc(950, 60, 350, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4f6649";
      ctx.textAlign = "center";
      ctx.font = "24px Georgia";
      ctx.fillText("A LITTLE PLACE FOR BIG DREAMS", 540, 100);
      ctx.font = "58px Georgia";
      ctx.fillText(`${state.profile.name || "Divi"}’s study village`, 540, 190);
      ctx.fillStyle = "#737963";
      ctx.font = "28px sans-serif";
      ctx.fillText(
        `My 50-day journey · ${displayDate(state.profile.start)} — ${displayDate(addDays(state.profile.start, 49))}`,
        540,
        245,
      );
      challengeDates(state).forEach((date, index) => {
        const x = 70 + (index % 10) * 95,
          y = 325 + Math.floor(index / 10) * 100;
        const mins = minutesFor(state, date),
          future = date > today;
        ctx.fillStyle =
          future || !mins
            ? "#e9e9dc"
            : mins >= state.profile.target
              ? "#5d7750"
              : mins >= state.profile.minimum
                ? "#a6b887"
                : "#d5dfbf";
        ctx.beginPath();
        ctx.roundRect(x, y, 83, 83, 17);
        ctx.fill();
        ctx.fillStyle =
          !future && mins >= state.profile.target ? "#fffdf3" : "#4b5c42";
        ctx.font = "25px sans-serif";
        ctx.fillText(String(index + 1), x + 41, y + 51);
      });
      [
        [String(st.completed), "days nurtured"],
        [String(st.streak), "day streak"],
        [formatMinutes(st.minutes), "time invested"],
      ].forEach(([value, label], index) => {
        const x = 205 + index * 335;
        ctx.fillStyle = "#425c3b";
        ctx.font = "52px Georgia";
        ctx.fillText(value, x, 965);
        ctx.font = "24px sans-serif";
        ctx.fillStyle = "#737963";
        ctx.fillText(label, x, 1010);
      });
      ctx.fillStyle = "#536b48";
      ctx.font = "32px Georgia";
      ctx.fillText("Little steps. Beautiful things.", 540, 1150);
      ctx.font = "22px sans-serif";
      ctx.fillStyle = "#7d806e";
      ctx.fillText("Growing at my own pace.", 540, 1200);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b ? resolve(b) : reject(new Error("Could not create image.")),
          "image/png",
        ),
      );
      setSharing({ url: URL.createObjectURL(blob), blob });
    } catch (e) {
      notify(
        e instanceof Error ? e.message : "Could not create progress image.",
      );
    } finally {
      setShareBusy(false);
    }
  }
  async function nativeShare() {
    if (!sharing) return;
    const file = new File([sharing.blob], "my-study-village.png", {
      type: "image/png",
    });
    try {
      if (navigator.canShare?.({ files: [file] }))
        await navigator.share({ files: [file], title: "My study journey" });
      else {
        download(sharing.blob, "my-study-village.png");
        notify("Image downloaded. You can share it from Files or Photos.");
      }
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError"))
        notify("Sharing wasn’t available. Use Save image instead.");
    }
  }

  const nav = [
    { id: "today" as Tab, label: "My little day", icon: Home },
    { id: "journey" as Tab, label: "50-day journey", icon: Sprout },
    { id: "focus" as Tab, label: "Focus room", icon: TimerIcon },
    { id: "tests" as Tab, label: "Tests & growth", icon: BookOpen },
  ];
  function TimerCard({ full = false }: { full?: boolean }) {
    const duration = state.timer.mode === "focus" ? 1500 : 300;
    return (
      <section
        className={`card timer-card ${full ? "full-timer" : ""}`}
        aria-label="Focus timer"
      >
        <SectionTitle
          icon={
            state.timer.mode === "focus" ? (
              <TimerIcon size={18} />
            ) : (
              <Coffee size={18} />
            )
          }
          title={
            state.timer.mode === "focus"
              ? "A little focus time"
              : "A well-earned pause"
          }
          action={
            <button
              className="icon-button subtle"
              aria-label={
                state.profile.sound
                  ? "Turn timer sound off"
                  : "Turn timer sound on"
              }
              onClick={() =>
                setState((s) => ({
                  ...s,
                  profile: { ...s.profile, sound: !s.profile.sound },
                }))
              }
            >
              {state.profile.sound ? (
                <Volume2 size={17} />
              ) : (
                <VolumeX size={17} />
              )}
            </button>
          }
        />
        <div className="timer-tabs" aria-label="Timer mode">
          <button
            className={state.timer.mode === "focus" ? "active" : ""}
            disabled={state.timer.status !== "idle"}
            onClick={() =>
              setState((s) => ({ ...s, timer: freshTimer(today, "focus") }))
            }
          >
            Study · 25 min
          </button>
          <button
            className={state.timer.mode === "break" ? "active" : ""}
            disabled={state.timer.status !== "idle"}
            onClick={() =>
              setState((s) => ({ ...s, timer: freshTimer(today, "break") }))
            }
          >
            Rest · 5 min
          </button>
        </div>
        <div className="timer-face">
          <svg viewBox="0 0 220 220" aria-hidden="true">
            <circle className="timer-ring-bg" cx="110" cy="110" r="99" />
            <circle
              className="timer-ring"
              cx="110"
              cy="110"
              r="99"
              strokeDasharray={622}
              strokeDashoffset={622 * (1 - seconds / duration)}
            />
          </svg>
          <div>
            <span
              className="timer-digits"
              role="timer"
              aria-label={`${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds`}
            >
              {Math.floor(seconds / 60)
                .toString()
                .padStart(2, "0")}
              <span>:</span>
              {String(seconds % 60).padStart(2, "0")}
            </span>
            <span className="timer-caption">
              {state.timer.status === "running"
                ? "one thing at a time"
                : state.timer.status === "paused"
                  ? "take your time"
                  : "a fresh little beginning"}
            </span>
            <Leaf size={17} />
          </div>
        </div>
        <div className="timer-controls">
          <button className="button primary" onClick={toggleTimer}>
            {state.timer.status === "running" ? (
              <Pause size={17} />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            {state.timer.status === "running"
              ? "Pause"
              : state.timer.status === "paused"
                ? "Continue"
                : state.timer.mode === "focus"
                  ? "Let’s focus"
                  : "Take a break"}
          </button>
          <button
            className="icon-button reset-timer"
            onClick={resetTimer}
            aria-label="Reset timer"
          >
            <RotateCcw size={19} />
          </button>
        </div>
        <p className="timer-foot">
          <span className="tiny-dot" />
          {state.sessions.filter((s) => s.date === today).length} focus sessions
          today · 25 real minutes each
        </p>
        {full && (
          <p className="fine-print">
            Completed sessions save automatically to the date the session
            started. Keep this page open for the best alarm experience; iPadOS
            may silence or suspend it in the background. Your timer catches up
            when you return.
          </p>
        )}
      </section>
    );
  }
  function JourneyGrid({ compact = false }: { compact?: boolean }) {
    return (
      <div className={`journey-grid ${compact ? "compact" : ""}`}>
        {challengeDates(state).map((date, index) => {
          const minutes = minutesFor(state, date),
            future = date > today;
          const status = future
            ? "future"
            : minutes >= state.profile.target
              ? "bloom"
              : minutes >= state.profile.minimum
                ? "grown"
                : minutes > 0
                  ? "seed"
                  : "unlogged";
          return (
            <button
              key={date}
              disabled={future}
              className={`day-cell ${status} ${date === today ? "is-today" : ""}`}
              onClick={() => setEditing(date)}
              aria-label={`Day ${index + 1}, ${displayDate(date)}, ${future ? "not yet available" : `${formatMinutes(minutes)} studied`}${date === today ? ", today" : ""}`}
            >
              <span className="day-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              {status === "bloom" ? (
                <Flower2 size={20} />
              ) : status === "grown" ? (
                <Sprout size={20} />
              ) : status === "seed" ? (
                <Leaf size={18} />
              ) : (
                <span className="seed-dot" />
              )}
              {!compact && (
                <span className="day-caption">
                  {future
                    ? "soon"
                    : minutes
                      ? formatMinutes(minutes)
                      : displayDate(date, { day: "numeric", month: "short" })}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
  function WeekChart() {
    const weeks = Array.from({ length: 8 }, (_, week) =>
      challengeDates(state)
        .slice(week * 7, week * 7 + 7)
        .filter((d) => d <= today)
        .reduce((sum, d) => sum + minutesFor(state, d), 0),
    );
    const max = Math.max(state.profile.target * 7, ...weeks);
    return (
      <section className="card">
        <SectionTitle
          icon={<TrendingUp size={18} />}
          title="Growing, week by week"
        />
        <p className="muted small">All those little hours add up.</p>
        <div className="week-chart">
          {weeks.map((minutes, i) => (
            <div key={i}>
              <span>{minutes ? formatMinutes(minutes) : "—"}</span>
              <div className="week-bar-space">
                <i
                  style={{ height: `${Math.max(3, (minutes / max) * 100)}%` }}
                />
              </div>
              <small>W{i + 1}</small>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div
      className="app-shell"
      data-motion={state.profile.animations === false ? "paused" : "gentle"}
      data-studying={
        state.timer.status === "running" && state.timer.mode === "focus"
      }
    >
      <a className="skip-link" href="#main-content">
        Skip to my study day
      </a>
      <aside className="sidebar">
        <a
          href="#today"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            setTab("today");
          }}
          aria-label="Divi’s Study Village home"
        >
          <span className="brand-mark">
            <Home size={26} strokeWidth={1.4} />
            <Sprout size={16} />
          </span>
          <span>
            Divi’s<span>study village</span>
          </span>
        </a>
        <div className="sidebar-divider" />
        <span className="eyebrow nav-label">YOUR LITTLE CORNER</span>
        <nav aria-label="Main navigation">
          {nav.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${tab === n.id ? "active" : ""}`}
              onClick={() => setTab(n.id)}
              aria-current={tab === n.id ? "page" : undefined}
            >
              <n.icon size={20} strokeWidth={1.7} />
              <span>{n.label}</span>
              {tab === n.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <button
          className="sidebar-note"
          onClick={() => setNote(Math.floor(Math.random() * NOTES.length))}
        >
          <span className="letter-peek" aria-hidden="true">
            <MiniYou pose="peek" />
          </span>
          <span className="envelope">
            <Mail size={27} strokeWidth={1.3} />
            <Heart size={10} fill="currentColor" />
          </span>
          <span>
            A little something
            <br />
            <b>just for you</b>
          </span>
          <ArrowRight size={16} />
        </button>
        <button className="nav-item ghibli-nav" onClick={openVisitors}>
          <Sparkles size={18} strokeWidth={1.5} />
          <span>Ghibli visitors’ corner</span>
        </button>
        <div className="sidebar-bottom">
          <div className="little-flower">
            <Flower2 size={43} strokeWidth={1} />
            <p>
              Good things take time.
              <br />
              So do beautiful gardens.
            </p>
          </div>
          <button className="nav-item" onClick={() => setSettings(true)}>
            <Settings size={19} strokeWidth={1.6} />
            <span>Make it yours</span>
          </button>
          <button className="nav-item" onClick={() => setHelp(true)}>
            <CircleHelp size={19} strokeWidth={1.6} />
            <span>A little guide</span>
          </button>
          <div className="made-with">
            <Heart size={12} /> Made for Divi, with love.
          </div>
        </div>
      </aside>
      <main className="main-content" id="main-content">
        <header className="page-header">
          <div>
            <div className="eyebrow header-eyebrow">
              <Sun size={15} />
              YOUR DREAMS HAVE A HOME HERE
            </div>
            <h1>
              {tab === "today"
                ? `A little better, every day.`
                : tab === "journey"
                  ? "Watch your garden grow."
                  : tab === "focus"
                    ? "Just you. This little moment."
                    : "Learning is a kind of growing."}
            </h1>
            <p>
              {displayDate(today, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              <span className="middle-dot">·</span>
              {dayNo < 1
                ? "Your journey begins soon"
                : dayNo > 50
                  ? "Your fifty-day chapter is complete"
                  : `Day ${dayNo} of your 50-day story`}
            </p>
          </div>
          <div className="header-actions">
            <button
              className="icon-button theme-toggle motion-toggle"
              aria-label={
                state.profile.animations === false
                  ? "Enable character animations"
                  : "Pause character animations"
              }
              aria-pressed={state.profile.animations !== false}
              title={
                state.profile.animations === false
                  ? "Enable gentle character motion"
                  : "Pause gentle character motion"
              }
              onClick={() =>
                setState((s) => ({
                  ...s,
                  profile: {
                    ...s.profile,
                    animations: s.profile.animations === false,
                  },
                }))
              }
            >
              <Sparkles size={18} />
            </button>
            <button
              className="icon-button theme-toggle"
              onClick={() =>
                setState((s) => ({
                  ...s,
                  profile: {
                    ...s.profile,
                    theme: s.profile.theme === "light" ? "dark" : "light",
                  },
                }))
              }
              aria-label={
                state.profile.theme === "light"
                  ? "Use night theme"
                  : "Use day theme"
              }
            >
              {state.profile.theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>
            <button
              className="button secondary share-button"
              disabled={shareBusy}
              onClick={makeShareCard}
            >
              <Share2 size={16} />
              <span>{shareBusy ? "Creating…" : "Share my progress"}</span>
            </button>
          </div>
        </header>
        {storageError && (
          <div className="storage-warning" role="alert">
            {storageError}
            <button onClick={exportBackup}>Export backup</button>
            <button onClick={() => setSettings(true)}>Open Settings</button>
            {saveBlocked && (
              <button
                onClick={() =>
                  setConfirm({
                    title: "Start fresh?",
                    detail:
                      "This will replace the unreadable local save. If it matters to you, do not continue until you have recovered it.",
                    label: "Start fresh",
                    action: () => {
                      setSaveBlocked(false);
                      setState(initialState());
                    },
                  })
                }
              >
                Start fresh
              </button>
            )}
          </div>
        )}
        {tab === "today" && (
          <>
            <section className="hero-banner">
              <Village />
              <div className="hero-copy">
                <span className="eyebrow">
                  おかえり · WELCOME HOME, {nickname.toUpperCase()}
                </span>
                <h2>
                  Little steps.
                  <br />
                  Beautiful things.
                </h2>
                <p>
                  A page, a question, a little courage.
                  <br />
                  That’s how your dreams grow.
                </p>
              </div>
              <span className="hero-tag">
                <Sprout size={13} /> Growing at your own pace
              </span>
            </section>
            <div className="stats-row">
              <Stat
                icon={<Sprout />}
                value={`${st.completed}`}
                suffix="/ 50"
                label="Days nurtured"
                tint="green"
              />
              <Stat
                icon={<Flame />}
                value={`${st.streak}`}
                suffix={st.streak === 1 ? " day" : " days"}
                label="Your little streak"
                tint="peach"
              />
              <Stat
                icon={<TimerIcon />}
                value={formatMinutes(st.minutes)}
                label="Time well spent"
                tint="sand"
              />
              <Stat
                icon={<Flower2 />}
                value={`${achieved.filter((b) => b.earned).length}`}
                suffix={` / ${achieved.length}`}
                label="Little achievements"
                tint="pink"
              />
            </div>
            <div className="dashboard-grid">
              <div className="main-stack">
                <section className="card today-card">
                  <SectionTitle
                    icon={<Sun size={19} />}
                    title="Today, one step at a time"
                    action={
                      <span className="soft-tag">
                        {todayMinutes >= state.profile.target
                          ? "A beautiful effort"
                          : "You’ve got this"}
                      </span>
                    }
                  />
                  <div className="daily-progress-heading">
                    <div>
                      <span className="large-number">
                        {formatMinutes(todayMinutes)}
                      </span>
                      <span className="muted">
                        {" "}
                        / {formatMinutes(state.profile.target)} goal
                      </span>
                    </div>
                    <span className="progress-percent">
                      {Math.min(
                        100,
                        Math.round((todayMinutes / state.profile.target) * 100),
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(todayMinutes / state.profile.target) * 100}
                    label="Today’s study target"
                  />
                  <p className="small muted daily-hint">
                    {todayMinutes >= state.profile.target
                      ? "Your little garden is blooming today. Time to be proud of yourself."
                      : todayMinutes >= state.profile.minimum
                        ? "Your streak is safe. Every extra minute is a little gift to future you."
                        : `${formatMinutes(Math.max(0, state.profile.minimum - todayMinutes))} more to nurture today’s streak. No rush, just a start.`}
                  </p>
                  <div className="task-list">
                    {[0, 1, 2].map((i) => (
                      <label
                        key={i}
                        className={todayDay.tasks[i] ? "checked-task" : ""}
                      >
                        <input
                          type="checkbox"
                          checked={todayDay.tasks[i]}
                          disabled={!inChallenge}
                          onChange={(e) => {
                            const tasks = [...todayDay.tasks] as Day["tasks"];
                            tasks[i] = e.target.checked;
                            updateDay(today, { tasks });
                          }}
                        />
                        <span className="custom-check">
                          <Check size={12} />
                        </span>
                        <span>
                          {todayDay.taskNames[i] ||
                            [
                              "One concept, a little clearer",
                              "A few questions, thoughtfully solved",
                              "A little revision for future me",
                            ][i]}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="today-card-footer">
                    <span>
                      <ShieldCheck size={14} />
                      {storageError
                        ? "Backup recommended"
                        : "Saved on this device"}
                    </span>
                    <button
                      className="text-button"
                      onClick={() =>
                        inChallenge ? setEditing(today) : setTab("journey")
                      }
                    >
                      {inChallenge ? "Log my day" : "View my journey"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </section>
                <section className="card journey-preview">
                  <SectionTitle
                    icon={<Sprout size={19} />}
                    title="Your 50-day garden"
                    action={
                      <button
                        className="text-button"
                        onClick={() => setTab("journey")}
                      >
                        See journey
                        <ArrowRight size={15} />
                      </button>
                    }
                  />
                  <p className="muted small">
                    Every day you show up, something grows.
                  </p>
                  {JourneyGrid({ compact: true })}
                  <div className="grid-legend">
                    <span>
                      <i className="legend-seed" />A little start
                    </span>
                    <span>
                      <i className="legend-grown" />
                      Streak nurtured
                    </span>
                    <span>
                      <i className="legend-bloom" />
                      Target bloomed
                    </span>
                  </div>
                </section>
              </div>
              <div className="side-stack">
                <section className="card companion-card">
                  <div className="companion-label">
                    <span className="tiny-dot" />
                    {state.profile.dog.toUpperCase()} · YOUR STUDY COMPANION
                    <Heart size={13} />
                  </div>
                  <Dog name={state.profile.dog} />
                  <h2>{state.profile.dog} is here for you.</h2>
                  <p>
                    {todayMinutes > 0
                      ? `${state.profile.dog} is so proud of your little steps today.`
                      : `${state.profile.dog} will be right here while you turn a few more pages.`}
                  </p>
                  <span className="dog-name">{state.profile.dog}</span>
                  <div className="companion-level">
                    <span>
                      {level.icon} {level.name}
                    </span>
                    <small>{st.points} little points</small>
                  </div>
                  <Progress
                    value={
                      nextLevel
                        ? ((st.points - level.at) / (nextLevel.at - level.at)) *
                          100
                        : 100
                    }
                    label="Companion level"
                  />
                </section>
                {TimerCard({})}
                <VisitorPostcard
                  visitor={activeVisitor}
                  onOpen={openVisitors}
                />
              </div>
            </div>
            <footer className="page-footer">
              <span>
                <Leaf size={13} />
                Progress, not perfection. Always.
              </span>
              <button onClick={() => setNote(4)}>
                A small reminder for you <Heart size={12} />
              </button>
            </footer>
          </>
        )}
        {tab === "journey" && (
          <>
            <div className="journey-intro">
              <div>
                <span className="eyebrow">FIFTY DAYS. YOUR OWN PACE.</span>
                <h2>A garden made of little efforts.</h2>
                <p>
                  {displayDate(state.profile.start)} —{" "}
                  {displayDate(addDays(state.profile.start, 49))} ·{" "}
                  {formatMinutes(state.profile.minimum)} nurtures a streak ·{" "}
                  {formatMinutes(state.profile.target)} blooms a target
                </p>
              </div>
              <div className="journey-total">
                {st.completed}
                <span>days nurtured</span>
              </div>
            </div>
            <section className="card">
              <SectionTitle
                icon={<Sprout size={19} />}
                title="Your 50-day journey"
                action={<span className="soft-tag">Tap a day to reflect</span>}
              />
              {JourneyGrid({})}
              <div className="grid-legend">
                <span>
                  <i className="legend-seed" />A little start
                </span>
                <span>
                  <i className="legend-grown" />
                  Streak nurtured
                </span>
                <span>
                  <i className="legend-bloom" />
                  Target bloomed
                </span>
                <span>Outlined = today</span>
              </div>
            </section>
            <div className="insights-grid">
              {WeekChart()}
              <section className="card">
                <SectionTitle
                  icon={<BookOpen size={18} />}
                  title="A little balance"
                />
                <p className="small muted">
                  Days with practical or theory work. A day can have both.
                </p>
                {["Practical", "Theory"].map((type) => {
                  const n = challengeDates(state).filter(
                    (d) =>
                      d <= today &&
                      minutesFor(state, d) > 0 &&
                      state.days[d]?.types.includes(type),
                  ).length;
                  return (
                    <div className="subject-balance" key={type}>
                      <div>
                        <span>{type}</span>
                        <b>{n} days</b>
                      </div>
                      <Progress
                        value={(n / Math.max(1, st.logged)) * 100}
                        label={`${type} study days`}
                      />
                    </div>
                  );
                })}
                <div className="mini-stats">
                  <div>
                    <b>{st.best}</b>
                    <small>best streak</small>
                  </div>
                  <div>
                    <b>{formatMinutes(st.average)}</b>
                    <small>average / studied day</small>
                  </div>
                  <div>
                    <b>
                      {state.profile.exam
                        ? Math.max(0, dayDifference(state.profile.exam, today))
                        : Math.max(0, 51 - Math.max(1, dayNo))}
                    </b>
                    <small>
                      {state.profile.exam
                        ? "days to exam"
                        : "challenge days left"}
                    </small>
                  </div>
                </div>
              </section>
            </div>
            <section className="card">
              <SectionTitle
                icon={<Award size={19} />}
                title="Small wins, worth keeping"
                action={
                  <span className="soft-tag">
                    {achieved.filter((b) => b.earned).length} little treasures
                  </span>
                }
              />
              <div className="badge-grid">
                {achieved.map((b) => (
                  <div
                    key={b.name}
                    className={`badge ${b.earned ? "earned" : ""}`}
                  >
                    <span aria-hidden="true">{b.icon}</span>
                    <h3>{b.name}</h3>
                    <p>{b.detail}</p>
                    <small>
                      {b.earned ? "Yours to keep ✓" : "Still growing"}
                    </small>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        {tab === "focus" && (
          <div className="focus-layout">
            <div>
              {TimerCard({ full: true })}
              <section className="card session-history">
                <SectionTitle
                  icon={<Leaf size={18} />}
                  title="Today’s little pockets of focus"
                />
                {state.sessions.filter((s) => s.date === today).length ? (
                  <div className="session-leaves">
                    {state.sessions
                      .filter((s) => s.date === today)
                      .map((s, i) => (
                        <span key={s.id}>
                          <Leaf size={17} />
                          Session {i + 1}
                          <b>25 min</b>
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="muted">
                    Your first leaf is waiting. Start when you’re ready.
                  </p>
                )}
              </section>
            </div>
            <div className="focus-company">
              <div className="focus-friends">
                <Dog
                  name={state.profile.dog}
                  sleeping={state.timer.mode === "break"}
                />
                <MiniYou
                  pose={state.timer.mode === "break" ? "tea" : "reading"}
                />
              </div>
              <h2>{state.profile.dog} is keeping watch.</h2>
              <p>
                No perfect desk. No perfect mood.
                <br />
                Just a little time for your dreams.
              </p>
              <button
                className="button secondary"
                onClick={() =>
                  setNote(Math.floor(Math.random() * NOTES.length))
                }
              >
                <Heart size={16} />I need a little encouragement
              </button>
              <p className="fine-print">
                A break is part of the work, not a reward you have to earn.
              </p>
              <VisitorPostcard visitor={activeVisitor} onOpen={openVisitors} />
            </div>
          </div>
        )}
        {tab === "tests" && (
          <Tests
            state={state}
            setState={setState}
            today={today}
            notify={notify}
            ask={setConfirm}
          />
        )}
      </main>
      <nav className="mobile-nav" aria-label="Compact navigation">
        {nav.map((n) => (
          <button
            key={n.id}
            className={tab === n.id ? "active" : ""}
            aria-current={tab === n.id ? "page" : undefined}
            onClick={() => setTab(n.id)}
          >
            <n.icon size={20} />
            <span>
              {n.id === "today"
                ? "My day"
                : n.id === "journey"
                  ? "Journey"
                  : n.id === "focus"
                    ? "Focus"
                    : "Tests"}
            </span>
          </button>
        ))}
        <button onClick={() => setSettings(true)} aria-label="Open settings">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>
      {editing && (
        <DayEditor
          key={editing}
          date={editing}
          state={state}
          onClose={() => setEditing(null)}
          onSave={saveDay}
          clear={() =>
            setConfirm({
              title: "Clear this day?",
              detail:
                "Manual hours, tasks, mood and reflection will be cleared. Completed timer sessions stay recorded, so time is never silently lost.",
              label: "Clear day",
              action: () => {
                setState((s) => {
                  const days = { ...s.days };
                  delete days[editing];
                  return { ...s, days };
                });
                setEditing(null);
                notify(
                  "Daily log cleared. Completed focus sessions were kept.",
                );
              },
            })
          }
        />
      )}
      {settings && (
        <Modal
          title="Make this little village yours"
          onClose={() => setSettings(false)}
          wide
        >
          <SettingsPanel
            state={state}
            update={(profile) =>
              setState((s) => ({ ...s, profile: { ...s.profile, ...profile } }))
            }
            exportBackup={exportBackup}
            importBackup={importBackup}
            ask={setConfirm}
            restart={() => {
              setState((s) => ({
                ...s,
                profile: { ...s.profile, start: today },
                days: {},
                sessions: [],
                timer: freshTimer(today),
              }));
              setSettings(false);
              notify(
                "A fresh fifty-day chapter. Your subjects and tests are still here.",
              );
            }}
            erase={() => {
              setState(initialState());
              setSaveBlocked(false);
              setSettings(false);
              notify("All data erased. A fresh little beginning.");
            }}
          />
        </Modal>
      )}
      {note !== null && (
        <Modal
          title="A little note, just for you"
          onClose={() => setNote(null)}
        >
          <div className="love-note">
            <span className="eyebrow">FROM YOUR BIGGEST FAN</span>
            <MiniYou pose={miniPoseForNote(note, dayNo - 1 + noteCycle)} />
            <blockquote>{NOTES[note]}</blockquote>
            <span className="note-signature">
              In your corner, always. <Heart size={15} />
            </span>
            <button
              className="button secondary"
              onClick={() => {
                setNote((note + 1) % NOTES.length);
                if (note === NOTES.length - 1) setNoteCycle((c) => c + 1);
              }}
            >
              Another little reminder
              <ArrowRight size={15} />
            </button>
          </div>
        </Modal>
      )}
      {reward && (
        <Modal title="Look at you, Divi!" onClose={() => setReward(null)}>
          <div className="love-note reward-note">
            <span className="eyebrow">A LITTLE CELEBRATION, JUST FOR YOU</span>
            <div className="reward-art">
              <MiniYou pose="celebrate" />
              <Dog name={state.profile.dog} activity="playful" />
            </div>
            <div className="celebration-visitor">
              <GhibliCharacter id={activeVisitor.id} />
              <span>{activeVisitor.name} stopped by to celebrate, too.</span>
            </div>
            <h3>Your garden bloomed today.</h3>
            <p>{reward}</p>
            <p className="cheering-promise">
              Me and {state.profile.dog} will always be cheering for you,{" "}
              {nickname}. <Heart size={15} aria-hidden="true" />
            </p>
            <span className="celebration-signature">
              On the little-win days and the hard days. Always.
            </span>
            <button className="button primary" onClick={() => setReward(null)}>
              Keeping this little win
              <Heart size={16} />
            </button>
          </div>
        </Modal>
      )}
      {visitorsOpen && (
        <Modal
          title="Your little Ghibli-verse"
          onClose={() => setVisitorsOpen(false)}
          wide
        >
          <GhibliCorner
            selected={selectedVisitor}
            pinned={state.profile.visitor}
            onSelect={setVisitorPreview}
            onPin={() => {
              setState((s) => ({
                ...s,
                profile: { ...s.profile, visitor: selectedVisitor.id },
              }));
              notify(
                `${selectedVisitor.name} is staying nearby. Mylo is still your number-one study buddy.`,
              );
            }}
            onRotate={() => {
              setState((s) => ({
                ...s,
                profile: { ...s.profile, visitor: undefined },
              }));
              setVisitorPreview(visitorForDay(dayNo - 1).id);
              notify("A different little visitor will stop by each day.");
            }}
            onClose={() => setVisitorsOpen(false)}
          />
        </Modal>
      )}
      {confirm && (
        <Modal title={confirm.title} onClose={() => setConfirm(null)}>
          <p className="confirm-detail">{confirm.detail}</p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setConfirm(null)}
            >
              Keep things as they are
            </button>
            <button
              className="button danger"
              onClick={() => {
                confirm.action();
                setConfirm(null);
              }}
            >
              {confirm.label}
            </button>
          </div>
        </Modal>
      )}
      {sharing && (
        <Modal
          title="A little progress, worth sharing"
          onClose={() => setSharing(null)}
        >
          <p className="muted small">
            Only your name and study statistics are included. Your reflections,
            marks and private notes stay here.
          </p>
          <img
            className="share-preview"
            src={sharing.url}
            alt="Your study journey progress card"
          />
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => download(sharing.blob, "my-study-village.png")}
            >
              <Download size={16} />
              Save image
            </button>
            <button className="button primary" onClick={nativeShare}>
              <Share2 size={16} />
              Share my little wins
            </button>
          </div>
          <a
            className="whatsapp-link"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/?text=${encodeURIComponent(`My study garden: ${st.completed}/50 days nurtured, ${st.streak}-day streak, ${formatMinutes(st.minutes)} studied. Growing at my own pace. 🌱`)}`}
          >
            Share a text update on WhatsApp <ArrowRight size={14} />
          </a>
        </Modal>
      )}
      {help && (
        <Modal
          title="A little guide to your village"
          onClose={() => setHelp(false)}
        >
          <div className="guide">
            <Dog name={state.profile.dog} activity="scratch" />
            <h3>This is a companion, not a competition.</h3>
            <p>
              <b>Your garden:</b> the fifty days start on your chosen date. Any
              study earns a leaf; {formatMinutes(state.profile.minimum)} keeps
              the streak; {formatMinutes(state.profile.target)} blooms your
              daily target. Tomorrow stays closed until it arrives.
            </p>
            <p>
              <b>Little points:</b> 10 per study hour, plus 10 per completed
              task, phone-away day, and protected-sleep day when you’ve studied.
              A missed day never erases your garden.
            </p>
            <p>
              <b>Focus:</b> a completed timer adds exactly 25 minutes. Manual
              hours are additional time, so don’t enter those same minutes
              twice. Unfinished timers and breaks don’t add study time.
            </p>
            <p>
              <b>Your iPad, your data:</b> no login and no data server. Browser
              storage can be cleared; export a backup regularly in Settings.
              Install with Safari → Share → Add to Home Screen. After the first
              online visit to the production app, it’s available offline.
            </p>
            <p>
              <b>Your clock:</b> dates use {state.profile.timezone}. Sessions
              belong to the day they started. A timer catches up on return, but
              alarms aren’t guaranteed with the screen locked.
            </p>
            <p className="small muted">
              The little notes are editable-in-code draft messages, written for
              this app—not quotations from anyone.
            </p>
          </div>
        </Modal>
      )}
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <span>🌿</span>
            {toast}
          </>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  suffix = "",
  label,
  tint,
}: {
  icon: ReactNode;
  value: string;
  suffix?: string;
  label: string;
  tint: string;
}) {
  return (
    <div className="stat-card">
      <span className={`stat-icon ${tint}`}>{icon}</span>
      <div>
        <span className="stat-value">
          {value}
          <small>{suffix}</small>
        </span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function DayEditor({
  date,
  state,
  onClose,
  onSave,
  clear,
}: {
  date: string;
  state: State;
  onClose: () => void;
  onSave: (date: string, day: Day) => void;
  clear: () => void;
}) {
  const [draft, setDraft] = useState<Day>(state.days[date] || emptyDay());
  const sessionMinutes = state.sessions
    .filter((s) => s.date === date)
    .reduce((a, s) => a + s.minutes, 0);
  const [hours, setHours] = useState(String(draft.manualMinutes / 60));
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const h = Number(hours);
    if (
      hours === "" ||
      !Number.isFinite(h) ||
      h < 0 ||
      h > 24 ||
      h * 60 + sessionMinutes > 1440
    ) {
      setError(
        "Please enter valid manual hours. Total study time cannot exceed 24 hours.",
      );
      return;
    }
    onSave(date, { ...draft, manualMinutes: Math.round(h * 60) });
  }
  return (
    <Modal
      title={`Day ${dayDifference(date, state.profile.start) + 1} · ${displayDate(date, { weekday: "short", day: "numeric", month: "short" })}`}
      onClose={onClose}
      wide
    >
      <form className="day-form" onSubmit={submit}>
        <div className="log-hours-row">
          <div>
            <label className="field-label" htmlFor="manual-hours">
              Manual study time (hours)
            </label>
            <p className="small muted">
              Only time studied outside the focus timer.
            </p>
          </div>
          <input
            id="manual-hours"
            className="hours-input"
            type="number"
            min="0"
            max="24"
            step="any"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
        </div>
        <div className="hour-presets">
          {[0, 2, 4, 6, 8, 10].map((h) => (
            <button
              type="button"
              className={Number(hours) === h ? "selected" : ""}
              key={h}
              onClick={() => setHours(String(h))}
            >
              {h}h
            </button>
          ))}
        </div>
        <div className="session-credit">
          <TimerIcon size={16} />
          {formatMinutes(sessionMinutes)} automatically saved from focus
          sessions.{" "}
          <b>
            {formatMinutes((Number(hours) || 0) * 60 + sessionMinutes)} total
          </b>
        </div>
        <div className="form-two">
          <div>
            <span className="field-label">What kind of study?</span>
            <div className="chips">
              {["Practical", "Theory"].map((t) => (
                <button
                  type="button"
                  key={t}
                  aria-pressed={draft.types.includes(t)}
                  className={draft.types.includes(t) ? "selected" : ""}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      types: d.types.includes(t)
                        ? d.types.filter((x) => x !== t)
                        : [...d.types, t],
                    }))
                  }
                >
                  {t === "Practical" ? "🧮" : "📖"} {t}
                </button>
              ))}
            </div>
          </div>
          <label>
            Subject <span className="muted small">(optional)</span>
            <input
              value={draft.subject}
              onChange={(e) =>
                setDraft((d) => ({ ...d, subject: e.target.value }))
              }
              placeholder="A little accounting, perhaps?"
              maxLength={60}
              list="ca-subjects"
            />
          </label>
        </div>
        <span className="field-label">How did this little day feel?</span>
        <div className="mood-options">
          {MOODS.map((m) => (
            <button
              type="button"
              key={m.label}
              aria-pressed={draft.mood === m.label}
              className={draft.mood === m.label ? "selected" : ""}
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  mood: d.mood === m.label ? "" : m.label,
                }))
              }
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
        <span className="field-label">Three little intentions</span>
        <div className="editable-tasks">
          {draft.tasks.map((done, i) => (
            <div key={i}>
              <input
                aria-label={`Task ${i + 1} completed`}
                type="checkbox"
                checked={done}
                onChange={(e) => {
                  const tasks = [...draft.tasks] as Day["tasks"];
                  tasks[i] = e.target.checked;
                  setDraft((d) => ({ ...d, tasks }));
                }}
              />
              <input
                aria-label={`Task ${i + 1} name`}
                value={draft.taskNames[i]}
                maxLength={100}
                placeholder={`My little intention ${i + 1}`}
                onChange={(e) => {
                  const taskNames = [...draft.taskNames] as Day["taskNames"];
                  taskNames[i] = e.target.value;
                  setDraft((d) => ({ ...d, taskNames }));
                }}
              />
            </div>
          ))}
        </div>
        <div className="habit-options">
          <label>
            <input
              type="checkbox"
              checked={draft.phone}
              onChange={(e) =>
                setDraft((d) => ({ ...d, phone: e.target.checked }))
              }
            />
            Phone tucked away
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.sleep}
              onChange={(e) =>
                setDraft((d) => ({ ...d, sleep: e.target.checked }))
              }
            />
            Protected my sleep
          </label>
        </div>
        <label>
          A little reflection
          <textarea
            maxLength={200}
            value={draft.note}
            onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
            placeholder="Something that clicked, something to try tomorrow…"
            rows={3}
          />
          <small className="muted char-count">
            {draft.note.length}/200 · just for you
          </small>
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="modal-actions split">
          <button type="button" className="text-button muted" onClick={clear}>
            <Trash2 size={15} />
            Clear daily log
          </button>
          <button type="submit" className="button primary">
            <Check size={17} />
            Save my little day
          </button>
        </div>
      </form>
      <datalist id="ca-subjects">
        {SUBJECTS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </Modal>
  );
}

function Tests({
  state,
  setState,
  today,
  notify,
  ask,
}: {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  today: string;
  notify: (message: string) => void;
  ask: (confirm: Confirm) => void;
}) {
  const [form, setForm] = useState<StudyTest | null>(null),
    [goalOpen, setGoalOpen] = useState(false),
    [error, setError] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const tests = [...state.tests]
    .filter(
      (t) => subjectFilter === "All subjects" || t.subject === subjectFilter,
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const average = tests.length
    ? tests.reduce((sum, t) => sum + percent(t), 0) / tests.length
    : 0;
  const subjects = [
    ...new Set([
      ...SUBJECTS,
      ...state.goals.map((g) => g.subject),
      ...state.tests.map((t) => t.subject),
    ]),
  ];
  function submitTest(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (
      !form.subject.trim() ||
      !Number.isFinite(form.marks) ||
      !Number.isFinite(form.total) ||
      form.total <= 0 ||
      form.marks < 0 ||
      form.marks > form.total ||
      form.date > today
    ) {
      setError(
        "Check your subject, date and marks. Scored marks cannot exceed total marks, and future tests cannot be logged.",
      );
      return;
    }
    setState((s) => ({
      ...s,
      tests: [
        ...s.tests.filter((t) => t.id !== form.id),
        { ...form, subject: form.subject.trim() },
      ],
    }));
    setForm(null);
    notify("Test saved. A score is a signpost, not a verdict.");
  }
  return (
    <>
      <div className="tests-heading">
        <p className="muted">
          Not a verdict. Just a little map of what to learn next.
        </p>
        <button
          className="button primary"
          onClick={() => {
            setError("");
            setForm({
              id: uid(),
              date: today,
              subject: "",
              kind: "Daily",
              marks: 0,
              total: 100,
            });
          }}
        >
          <Plus size={17} />
          Log a test
        </button>
      </div>
      <div className="test-stats">
        <Stat
          icon={<BookOpen />}
          value={String(tests.length)}
          label="Tests reflected on"
          tint="green"
        />
        <Stat
          icon={<TrendingUp />}
          value={tests.length ? `${average.toFixed(1)}%` : "—"}
          label="Average score"
          tint="sand"
        />
        <Stat
          icon={<Award />}
          value={
            tests.length
              ? `${Math.max(...tests.map(percent)).toFixed(1)}%`
              : "—"
          }
          label="Personal best"
          tint="peach"
        />
      </div>
      <div className="insights-grid">
        <section className="card">
          <SectionTitle
            icon={<TrendingUp size={18} />}
            title="Your learning curve"
          />
          <label className="filter-label">
            Show scores for
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option>All subjects</option>
              {[...new Set(state.tests.map((t) => t.subject))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {tests.length > 1 ? (
            <>
              <div className="score-chart">
                <div className="chart-labels">
                  <span>100%</span>
                  <span>50%</span>
                  <span>0%</span>
                </div>
                <svg
                  viewBox="0 0 400 160"
                  role="img"
                  aria-label={`Test percentage trend in date order: ${tests.map((t) => `${t.subject} ${percent(t).toFixed(1)} percent`).join(", ")}`}
                >
                  <line x1="10" y1="15" x2="390" y2="15" />
                  <line x1="10" y1="80" x2="390" y2="80" />
                  <line x1="10" y1="145" x2="390" y2="145" />
                  <polyline
                    points={tests
                      .map(
                        (t, i) =>
                          `${15 + (i / (tests.length - 1)) * 370},${145 - percent(t) * 1.3}`,
                      )
                      .join(" ")}
                  />
                  {tests.map((t, i) => (
                    <circle
                      key={t.id}
                      cx={15 + (i / (tests.length - 1)) * 370}
                      cy={145 - percent(t) * 1.3}
                      r="4"
                    >
                      <title>
                        {t.subject}: {percent(t).toFixed(1)}% · {t.date}
                      </title>
                    </circle>
                  ))}
                </svg>
              </div>
              <p className="fine-print">
                {displayDate(tests[0].date)} → {displayDate(tests.at(-1)!.date)}{" "}
                ·{" "}
                {subjectFilter === "All subjects"
                  ? "Mixed subjects and test types; scores may not be directly comparable."
                  : "Scores shown as percentages in date order."}
              </p>
            </>
          ) : (
            <Empty
              icon={<Sprout size={31} />}
              title="Every curve starts somewhere"
            >
              Log two tests to see your progress take shape.
            </Empty>
          )}
        </section>
        <section className="card">
          <SectionTitle
            icon={<Flower2 size={18} />}
            title="Aiming a little higher"
            action={
              <button className="text-button" onClick={() => setGoalOpen(true)}>
                <Plus size={16} />
                Subject
              </button>
            }
          />
          {state.goals.length ? (
            state.goals.map((g) => {
              const latest = [...state.tests]
                .filter(
                  (t) => t.subject.toLowerCase() === g.subject.toLowerCase(),
                )
                .sort((a, b) => b.date.localeCompare(a.date))[0];
              return (
                <div className="goal-row" key={g.id}>
                  <div>
                    <b>{g.subject}</b>
                    <button
                      className="icon-button subtle"
                      aria-label={`Delete ${g.subject} goal`}
                      onClick={() =>
                        ask({
                          title: "Remove this subject goal?",
                          detail: "Its test history will stay saved.",
                          label: "Remove goal",
                          action: () =>
                            setState((s) => ({
                              ...s,
                              goals: s.goals.filter((x) => x.id !== g.id),
                            })),
                        })
                      }
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p>
                    Previous {g.previous} → Goal {g.target} / 100
                  </p>
                  <Progress
                    value={latest ? percent(latest) : g.previous}
                    label={`${g.subject} latest score`}
                  />
                  <small>
                    {latest
                      ? `Latest test: ${percent(latest).toFixed(1)}%${percent(latest) >= g.target ? " · Goal reached 🌼" : ""}`
                      : "Your next chapter is still being written."}
                  </small>
                </div>
              );
            })
          ) : (
            <Empty
              icon={<Flower2 size={31} />}
              title="Make room for a little growth"
            >
              Add your subjects, previous marks, and the scores you’re working
              towards.
            </Empty>
          )}
        </section>
      </div>
      <section className="card">
        <SectionTitle
          icon={<BookOpen size={18} />}
          title="Little lessons from every test"
          action={<span className="soft-tag">{tests.length} reflections</span>}
        />
        {tests.length ? (
          <div className="test-list">
            {[...tests].reverse().map((t) => {
              const earlier = tests
                .filter(
                  (x) =>
                    x.subject.toLowerCase() === t.subject.toLowerCase() &&
                    (x.date < t.date ||
                      (x.date === t.date &&
                        tests.indexOf(x) < tests.indexOf(t))),
                )
                .at(-1);
              const diff = earlier ? percent(t) - percent(earlier) : null;
              return (
                <article className="test-row" key={t.id}>
                  <span className="test-type-icon">
                    {t.kind === "Mock"
                      ? "🏮"
                      : t.kind === "Chapter"
                        ? "📖"
                        : "🌱"}
                  </span>
                  <div>
                    <h3>{t.subject}</h3>
                    <p>
                      {displayDate(t.date)} · {t.kind} test · {t.marks}/
                      {t.total}
                      {diff !== null && (
                        <span className="test-diff">
                          {" "}
                          · {diff >= 0 ? "+" : ""}
                          {diff.toFixed(1)} percentage points
                        </span>
                      )}
                    </p>
                  </div>
                  <strong>
                    {percent(t).toFixed(1)}
                    <small>%</small>
                  </strong>
                  <button
                    className="icon-button"
                    aria-label={`Edit ${t.subject} test`}
                    onClick={() => {
                      setError("");
                      setForm({ ...t });
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Delete ${t.subject} test`}
                    onClick={() =>
                      ask({
                        title: "Delete this test?",
                        detail:
                          "This removes the score from your history and insights.",
                        label: "Delete test",
                        action: () =>
                          setState((s) => ({
                            ...s,
                            tests: s.tests.filter((x) => x.id !== t.id),
                          })),
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <Empty
            icon={<BookOpen size={34} />}
            title="Your next chapter starts here"
          >
            A test is a chance to find out what needs a little more love.
          </Empty>
        )}
      </section>
      {form && (
        <Modal
          title={
            state.tests.some((t) => t.id === form.id)
              ? "Reflect on this test"
              : "A little test, a little growth"
          }
          onClose={() => setForm(null)}
        >
          <form className="standard-form" onSubmit={submitTest}>
            <label>
              Subject
              <input
                value={form.subject}
                required
                maxLength={60}
                list="test-subjects"
                placeholder="e.g. Auditing & Ethics"
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </label>
            <div className="form-two">
              <label>
                Test date
                <input
                  type="date"
                  required
                  max={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </label>
              <label>
                Type
                <select
                  value={form.kind}
                  onChange={(e) => setForm({ ...form, kind: e.target.value })}
                >
                  {["Daily", "Chapter", "Mock"].map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-two">
              <label>
                Marks scored
                <input
                  type="number"
                  min="0"
                  max={form.total}
                  step="any"
                  required
                  value={Number.isNaN(form.marks) ? "" : form.marks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      marks:
                        e.target.value === "" ? NaN : Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Out of
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="any"
                  required
                  value={Number.isNaN(form.total) ? "" : form.total}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      total:
                        e.target.value === "" ? NaN : Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <p className="muted small">
              Your marks are private and never included in a share card.
            </p>
            <button type="submit" className="button primary">
              <Check size={17} />
              Save test
            </button>
          </form>
        </Modal>
      )}
      {goalOpen && (
        <Modal
          title="A little goal for this subject"
          onClose={() => setGoalOpen(false)}
        >
          <form
            className="standard-form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget),
                subject = String(f.get("subject")).trim(),
                previous = Number(f.get("previous")),
                target = Number(f.get("target"));
              if (
                !subject ||
                !Number.isFinite(previous) ||
                !Number.isFinite(target) ||
                previous < 0 ||
                previous > 100 ||
                target < 0 ||
                target > 100
              )
                return;
              setState((s) => ({
                ...s,
                goals: [
                  ...s.goals.filter(
                    (g) => g.subject.toLowerCase() !== subject.toLowerCase(),
                  ),
                  { id: uid(), subject, previous, target },
                ],
              }));
              setGoalOpen(false);
              notify(
                "Subject goal saved. A little direction for your efforts.",
              );
            }}
          >
            <label>
              Subject
              <input
                name="subject"
                required
                list="test-subjects"
                maxLength={60}
                placeholder="Choose or type a CA subject"
              />
            </label>
            <div className="form-two">
              <label>
                Previous marks / 100
                <input
                  name="previous"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  required
                />
              </label>
              <label>
                Goal marks / 100
                <input
                  name="target"
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  required
                />
              </label>
            </div>
            <p className="small muted">
              Adding an existing subject updates its goal. Your test history
              stays untouched.
            </p>
            <button className="button primary" type="submit">
              <Sprout size={17} />
              Plant this little goal
            </button>
          </form>
        </Modal>
      )}
      <datalist id="test-subjects">
        {subjects.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </>
  );
}

function SettingsPanel({
  state,
  update,
  exportBackup,
  importBackup,
  ask,
  restart,
  erase,
}: {
  state: State;
  update: (profile: Partial<State["profile"]>) => void;
  exportBackup: () => void;
  importBackup: (file: File) => void;
  ask: (confirm: Confirm) => void;
  restart: () => void;
  erase: () => void;
}) {
  const [profile, setProfile] = useState({ ...state.profile });
  const [saved, setSaved] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    update({
      ...profile,
      name: profile.name.trim() || "Divi",
      dog: profile.dog.trim() || "Mylo",
    });
    setSaved(true);
  }
  return (
    <div className="settings-panel">
      <form className="standard-form" onSubmit={submit}>
        <div className="form-two">
          <label>
            Your name
            <input
              value={profile.name}
              maxLength={40}
              onChange={(e) => {
                setSaved(false);
                setProfile({ ...profile, name: e.target.value });
              }}
            />
          </label>
          <label>
            Your dog’s name
            <input
              value={profile.dog}
              maxLength={60}
              onChange={(e) => {
                setSaved(false);
                setProfile({ ...profile, dog: e.target.value });
              }}
            />
          </label>
        </div>
        <div className="form-two">
          <label>
            Your first day
            <input
              type="date"
              required
              value={profile.start}
              onChange={(e) => {
                setSaved(false);
                setProfile({ ...profile, start: e.target.value });
              }}
            />
          </label>
          <label>
            Exam date (optional)
            <input
              type="date"
              value={profile.exam}
              onChange={(e) => {
                setSaved(false);
                setProfile({ ...profile, exam: e.target.value });
              }}
            />
          </label>
        </div>
        <p className="fine-print">
          Changing the start date changes which dates appear in your garden.
          Existing logs stay on their original dates; they are not moved.
        </p>
        <div className="form-two">
          <label>
            Daily target (hours)
            <input
              type="number"
              min="0.25"
              max="24"
              step="0.25"
              required
              value={profile.target / 60}
              onChange={(e) => {
                setSaved(false);
                setProfile({ ...profile, target: Number(e.target.value) * 60 });
              }}
            />
          </label>
          <label>
            Streak minimum (hours)
            <input
              type="number"
              min="0.25"
              max="24"
              step="0.25"
              required
              value={profile.minimum / 60}
              onChange={(e) => {
                setSaved(false);
                setProfile({
                  ...profile,
                  minimum: Number(e.target.value) * 60,
                });
              }}
            />
          </label>
        </div>
        <p className="fine-print">
          A little study always counts. The minimum keeps your streak; the
          target is your bigger daily intention. These rules also update past
          progress and badges.
        </p>
        <div className="setting-toggles">
          <label>
            <input
              type="checkbox"
              checked={profile.theme === "dark"}
              onChange={(e) => {
                setSaved(false);
                setProfile({
                  ...profile,
                  theme: e.target.checked ? "dark" : "light",
                });
              }}
            />
            Cozy night theme
          </label>
          <label>
            <input
              type="checkbox"
              checked={profile.sound}
              onChange={(e) => {
                setSaved(false);
                setProfile({ ...profile, sound: e.target.checked });
              }}
            />
            Gentle timer sound
          </label>
          <label>
            <input
              type="checkbox"
              checked={profile.animations !== false}
              onChange={(e) => {
                setSaved(false);
                setProfile({ ...profile, animations: e.target.checked });
              }}
            />
            Gentle character motion
          </label>
        </div>
        <p className="fine-print">
          Character motion rests during focus sessions and follows your iPad’s
          Reduce Motion preference. You can also pause it with the sparkle
          button.
        </p>
        <p className="fine-print">
          Your village clock: {profile.timezone}. Dates stay in this timezone
          even if you travel.
        </p>
        <button className="button primary" type="submit">
          <Check size={17} />
          {saved ? "Preferences saved" : "Save my preferences"}
        </button>
      </form>
      <section className="settings-backup">
        <h3>A safe little copy</h3>
        <p className="small muted">
          Your data lives only in this browser on this iPad. Clearing Safari
          data can erase it. Save a backup to iCloud Drive regularly. No photos
          or private notes leave this app unless you export them yourself.
        </p>
        <div className="backup-buttons">
          <button className="button secondary" onClick={exportBackup}>
            <ArrowDownToLine size={16} />
            Export backup
          </button>
          <label className="button secondary import-button">
            <Upload size={16} />
            Restore backup
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importBackup(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </section>
      <section className="settings-reset">
        <h3>Another beginning</h3>
        <p className="small muted">
          Restart clears all daily logs and focus sessions, and starts today.
          Your subjects, test history, and preferences stay. Export a backup
          first to keep this chapter.
        </p>
        <div className="backup-buttons">
          <button
            className="button secondary"
            onClick={() =>
              ask({
                title: "Begin a new fifty-day chapter?",
                detail:
                  "All daily records and completed focus sessions will be removed. Subjects, test history, name, and preferences stay saved. Export a backup first if you want to keep this chapter.",
                label: "Restart challenge",
                action: restart,
              })
            }
          >
            <RotateCcw size={16} />
            Restart challenge
          </button>
          <button
            className="text-button danger-text"
            onClick={() =>
              ask({
                title: "Erase everything on this device?",
                detail:
                  "All study logs, tests, subjects, focus sessions, and preferences will be erased. This cannot be undone without a backup.",
                label: "Erase all data",
                action: erase,
              })
            }
          >
            <Trash2 size={16} />
            Erase all data
          </button>
        </div>
      </section>
    </div>
  );
}
