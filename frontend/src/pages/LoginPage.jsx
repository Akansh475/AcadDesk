import { useState, useRef, useCallback } from "react";
import { Eye, EyeOff, Loader2, GraduationCap, BookOpen, CalendarCheck, Bell, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const FEATURES = [
  { icon: CalendarCheck, text: "Track your academic calendar" },
  { icon: BookOpen,      text: "Manage assignments & exams" },
  { icon: Bell,          text: "Never miss a deadline" },
];

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1.5,
  top: Math.random() * 100,
  left: Math.random() * 100,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 8,
  driftX: Math.random() * 40 - 20,
  driftY: Math.random() * 50 + 20,
  opacity: Math.random() * 0.4 + 0.2,
}));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors]   = useState({});
  const [shake, setShake]               = useState(false);

  const panelRef = useRef(null);
  const [blobOffset, setBlobOffset] = useState({ x: 0, y: 0 });

  // ── Mouse-reactive blob parallax ──
  const handleMouseMove = useCallback((e) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setBlobOffset({ x: relX, y: relY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setBlobOffset({ x: 0, y: 0 });
  }, []);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!EMAIL_RE.test(email.trim())) {
      errs.email = "Enter a valid email address";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 350);
      return;
    }

    login(email, password);
  };

  return (
    <div className="flex min-h-screen overflow-hidden font-sans">

      {/* ── LEFT PANEL ── */}
      <div
        ref={panelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary-600 p-14 lg:flex"
      >

        {/* Animated blobs — mouse-reactive parallax */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary-400 opacity-50 blur-3xl transition-transform duration-700 ease-out"
            style={{
              animation: "blob 7s ease-in-out infinite",
              transform: `translate(${blobOffset.x * 30}px, ${blobOffset.y * 30}px)`,
            }}
          />
          <div
            className="absolute top-1/2 -right-10 h-72 w-72 rounded-full bg-primary-800 opacity-40 blur-3xl transition-transform duration-700 ease-out"
            style={{
              animation: "blob 7s ease-in-out infinite",
              animationDelay: "2s",
              transform: `translate(${blobOffset.x * -45}px, ${blobOffset.y * -45}px)`,
            }}
          />
          <div
            className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-primary-300 opacity-40 blur-3xl transition-transform duration-700 ease-out"
            style={{
              animation: "blob 7s ease-in-out infinite",
              animationDelay: "4s",
              transform: `translate(${blobOffset.x * 20}px, ${blobOffset.y * -20}px)`,
            }}
          />
        </div>

        {/* Floating particles */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              className="particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                top: `${p.top}%`,
                left: `${p.left}%`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                "--p-x": `${p.driftX}px`,
                "--p-y": `-${p.driftY}px`,
                "--p-opacity": p.opacity,
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="text-base font-semibold text-white">AcadDesk</span>
        </div>

        {/* Middle content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight text-white">
              Your Academic<br />Life, Organized.
            </h2>
            <p className="mt-3 text-base text-primary-100">
              One place for your timetable, attendance,<br />
              goals, and deadlines.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon size={15} className="text-white" />
                </div>
                <span className="text-sm text-primary-50">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Empty bottom spacer */}
        <div />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex w-full flex-col items-center justify-center bg-surface-50 px-8 py-12 lg:w-1/2 lg:px-20">
        <div
          className={`w-full max-w-sm ${shake ? "animate-shake" : ""}`}
          style={{ animation: shake ? undefined : "slide-up 0.5s ease-out both" }}
        >

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-800">AcadDesk</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-surface-800">Welcome back</h1>
            <p className="mt-1 text-sm text-surface-500">Sign in to continue to your dashboard.</p>
          </div>

          {/* Server error */}
          {error && (
            <div
              className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              style={{ animation: "fade-in 0.3s ease-out both" }}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-600">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
                }}
                placeholder="you@college.edu"
                autoComplete="email"
                autoFocus
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-surface-800 outline-none transition-all placeholder:text-surface-400 focus:ring-2 ${
                  fieldErrors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : "border-surface-200 focus:border-primary-400 focus:ring-primary-100"
                }`}
              />
              {fieldErrors.email && (
                <p
                  className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
                  style={{ animation: "fade-in 0.2s ease-out both" }}
                >
                  <AlertCircle size={12} />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-surface-600">Password</label>
                <button type="button" className="text-xs text-primary-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 pr-11 text-sm text-surface-800 outline-none transition-all placeholder:text-surface-400 focus:ring-2 ${
                    fieldErrors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-surface-200 focus:border-primary-400 focus:ring-primary-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 transition-colors hover:text-surface-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p
                  className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
                  style={{ animation: "fade-in 0.2s ease-out both" }}
                >
                  <AlertCircle size={12} />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-surface-400">
            No account? Contact your college administrator.
          </p>
        </div>
      </div>
    </div>
  );
}