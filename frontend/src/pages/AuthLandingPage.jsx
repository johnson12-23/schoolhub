import { Link } from "react-router-dom";

function AuthLandingPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/gallery/hero-bg.jpg)" }}
    >
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center text-white">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-brand-green">SchoolHub</p>
          <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Learn everywhere in Ghana
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-200 sm:text-lg">
            Access study resources, upload teaching materials, and manage your SchoolHub account from one place.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-full bg-brand-green px-8 py-4 text-sm font-bold text-white shadow-xl shadow-brand-green/20 transition hover:bg-emerald-500 sm:w-auto"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/20 sm:w-auto"
          >
            Sign up
          </Link>
        </div>

        <p className="mt-10 text-sm text-slate-300">
          Already have an account? <Link to="/login" className="font-bold text-white underline">Login now</Link>
        </p>
      </div>
    </div>
  );
}

export default AuthLandingPage;
