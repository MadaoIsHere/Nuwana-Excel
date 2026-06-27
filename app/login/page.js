"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (tab === "register" && !agree) {
      setError("Kamu harus menyetujui Terms of Service & Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Catatan: untuk menyimpan "name" ke profil user, gunakan updateProfile()
        // dari firebase/auth, atau simpan ke Firestore collection "users".
      }
      router.push("/templates");
    } catch (err) {
      console.error(err);
      setError(mapAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/templates");
    } catch (err) {
      console.error(err);
      setError("Gagal login dengan Google. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const mapAuthError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Format email tidak valid.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Email atau password salah.";
      case "auth/email-already-in-use":
        return "Email sudah terdaftar. Coba login.";
      case "auth/weak-password":
        return "Password minimal 6 karakter.";
      default:
        return "Terjadi kesalahan. Coba lagi.";
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <main className="grid min-h-screen" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <section className="bg-surface-container-low hidden lg:flex flex-col justify-center items-center p-margin-desktop relative overflow-hidden wayang-pattern">
          <div className="max-w-md w-full text-center z-10 fade-in">
            <h1 className="text-headline-xl font-headline-xl text-primary mb-4">Structured Wisdom</h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-sm mx-auto mb-8">
              Master the art of Excel with the guidance of the legendary Kucing Wayang.
            </p>
            <div className="gunungan-divider w-64 mx-auto mb-8"></div>
            <div className="flex gap-4 justify-center text-primary">
              {[["auto_awesome", "Mastery"], ["precision_manufacturing", "Precision"], ["local_library", "Wisdom"]].map(
                ([icon, label], i) => (
                  <div key={label} className="flex items-center gap-4">
                    {i > 0 && <div className="w-px h-10 bg-outline-variant opacity-50"></div>}
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined mb-1">{icon}</span>
                      <span className="text-label-sm font-label-sm uppercase tracking-widest">{label}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="flex flex-col bg-surface p-margin-desktop md:px-24">
          <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full fade-in">
            <div className="mb-10">
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2">
                {tab === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                {tab === "login" ? "Access your Excel learning path and resources." : "Start your journey to Excel mastery today."}
              </p>
            </div>

            <div className="flex border-b border-outline-variant mb-8">
              {["login", "register"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setError(""); }}
                  className={`flex-1 py-4 text-label-md font-label-md transition-all capitalize ${
                    tab === t ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-outline-variant rounded-xl text-label-md font-label-md text-on-surface hover:bg-surface-container-low transition-colors mb-8 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink mx-4 text-label-sm font-label-sm text-outline uppercase tracking-widest">or email</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-error-container text-error rounded-lg text-body-sm font-body-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {tab === "register" && (
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md font-body-md"
                      placeholder="Gatot Kaca"
                      type="text"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-label-md font-label-md text-on-surface mb-2">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md font-body-md"
                    placeholder="professional@nuwana.com"
                    type="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-label-md font-label-md text-on-surface">Password</label>
                  {tab === "login" && <a className="text-label-sm font-label-sm text-primary hover:underline" href="#">Forgot Password?</a>}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-body-md font-body-md"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              {tab === "register" && (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 rounded border-outline-variant"
                  />
                  <span className="text-body-sm font-body-sm text-on-surface-variant">
                    I agree to the <a className="text-primary hover:underline font-semibold" href="#">Terms of Service</a> and{" "}
                    <a className="text-primary hover:underline font-semibold" href="#">Privacy Policy</a>.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary py-4 rounded-xl text-headline-sm font-headline-sm hover:bg-primary-container transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {loading ? "Loading..." : tab === "login" ? "Login" : "Register Now"}
              </button>
            </form>
          </div>

          <footer className="mt-12 py-6 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-body-sm font-body-sm text-on-surface-variant">© 2024 Nuwana Excel. Structured Wisdom.</p>
            <div className="flex gap-6">
              {["Help", "Privacy", "Terms"].map((l) => (
                <a key={l} className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">{l}</a>
              ))}
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}