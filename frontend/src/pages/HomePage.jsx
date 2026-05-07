import { BookOpenCheck, Search, Shapes, Smartphone, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ResourceCard from "../components/resources/ResourceCard";
import SectionHeading from "../components/ui/SectionHeading";
import { SUBJECTS } from "../data/constants";
import { apiRequest } from "../lib/api";

const featureCards = [
  {
    title: "Fast mobile learning",
    description: "Open resources quickly even on low bandwidth connections.",
    icon: Smartphone
  },
  {
    title: "Teacher-friendly uploads",
    description: "Teachers can upload PDF notes, slides, and revision packs in minutes.",
    icon: Users
  },
  {
    title: "Organised for basic school",
    description: "Find books and exam materials by subject, class, and resource type.",
    icon: Shapes
  }
];

function HomePage() {
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest("/resources?featured=true&page=1&pageSize=3")
      .then((data) => setFeatured(data.resources.slice(0, 3)))
      .catch(() => setFeatured([]));
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    navigate(`/resources?search=${encodeURIComponent(search)}`);
  }

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="container-shell relative grid gap-10 py-16 text-white lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              <Sparkles size={16} />
              Made for students across Ghana
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Welcome to SchoolHub
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              Find textbooks, class slides, and past questions in one easy, lightweight platform for
              primary and JHS learners.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 rounded-[28px] bg-white p-3 shadow-soft sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl px-3">
                <Search className="text-slate-400" size={20} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full border-none bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  placeholder="Search books, subjects, BECE questions..."
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                Search resources
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/resources" className="btn-secondary border-white/25 bg-white/10 text-white hover:bg-white/15">
                Browse all resources
              </Link>
              <Link to="/dashboard" className="btn-primary bg-brand-yellow text-brand-dark hover:bg-yellow-300">
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="card-surface bg-white/95 p-6 text-slate-900">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-green">Quick categories</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {SUBJECTS.map((subject) => (
                <Link
                  key={subject}
                  to={`/resources?subject=${encodeURIComponent(subject)}`}
                  className="rounded-3xl border border-slate-100 bg-brand-cream p-4 transition hover:-translate-y-1 hover:border-brand-yellow"
                >
                  <BookOpenCheck className="text-brand-green" size={22} />
                  <h3 className="mt-4 text-base font-extrabold">{subject}</h3>
                  <p className="mt-1 text-sm text-slate-500">Notes, revision and practice</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article key={feature.title} className="card-surface p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                <feature.icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured Resources"
            title="Start learning with recommended materials"
            description="Popular textbooks, slides, and revision packs selected for easy access."
          />
          <Link to="/resources" className="btn-secondary">
            View all resources
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
