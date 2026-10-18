"use client";

import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  ImageIcon,
  Lightbulb,
  Target,
  Utensils,
} from "lucide-react";

export type LessonInfographicData = {
  title: string;
  subject: string;
  grade: string;
  subtitle: string;
  funFact: string;
  conceptMap: {
    heading: string;
    points: string[];
  }[];
  objectives: string[];
  keyTakeaways: string[];
  keywords: {
    term: string;
    definition: string;
  }[];
  examples: {
    title: string;
    description: string;
  }[];
  closingMessage: string;
  heroImageUrl?: string | null;
};

type Props = {
  data: LessonInfographicData;
  sections: string[];
};

export default function LessonInfographic({ data, sections }: Props) {
  const show = (name: string) => sections.includes(name);

  const conceptColors = [
    {
      border: "border-blue-500",
      badge: "bg-blue-600",
      surface: "bg-blue-50",
      text: "text-blue-950",
    },
    {
      border: "border-emerald-500",
      badge: "bg-emerald-600",
      surface: "bg-emerald-50",
      text: "text-emerald-950",
    },
    {
      border: "border-violet-500",
      badge: "bg-violet-600",
      surface: "bg-violet-50",
      text: "text-violet-950",
    },
  ];

  return (
    <article
      id="lesson-infographic"
      className="lesson-poster mx-auto w-full max-w-[794px] overflow-hidden border border-[#eadfca] bg-[#fffdf5] text-slate-900 shadow-2xl"
    >
      <header className="relative overflow-hidden bg-[#073b91] px-6 pb-7 pt-6 text-white sm:px-9 sm:pb-9 sm:pt-8">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[24px] border-white/5" />
        <div className="absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-cyan-400/10" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-white/30 bg-emerald-600 text-center leading-none shadow-lg">
            <span className="text-[9px] font-black uppercase tracking-wide">
              Materi
            </span>
            <span className="mt-1 text-2xl font-black">01</span>
          </div>

          <div className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 sm:text-xs">
              {data.subject} · {data.grade}
            </p>
            <p className="mt-1 text-xs font-extrabold uppercase leading-snug sm:text-sm">
              {data.subtitle || "Ringkasan materi pembelajaran"}
            </p>
          </div>
        </div>

        <div className="relative mt-7 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Panduan belajar visual
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase leading-[0.98] tracking-tight sm:text-5xl">
            {data.title}
          </h1>
          <div className="mt-4 h-2 w-28 rounded-full bg-emerald-400" />
        </div>
      </header>

      <div className="space-y-5 p-4 sm:space-y-6 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          {show("objectives") && data.objectives?.length > 0 && (
            <section className="rounded-2xl border-2 border-blue-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-lg bg-blue-700 p-2 text-white">
                  <Target size={18} />
                </span>
                <h2 className="text-sm font-black uppercase tracking-wide text-blue-900 sm:text-base">
                  Tujuan Pembelajaran
                </h2>
              </div>
              <ol className="space-y-2.5">
                {data.objectives.slice(0, 3).map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex gap-2.5 text-xs leading-relaxed sm:text-sm"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {show("funFact") && data.funFact && (
            <section className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-lg bg-amber-400 p-2 text-amber-950">
                  <Lightbulb size={18} />
                </span>
                <h2 className="text-sm font-black uppercase tracking-wide text-amber-950 sm:text-base">
                  Tahukah Kamu?
                </h2>
              </div>
              <p className="text-xs leading-relaxed sm:text-sm">{data.funFact}</p>
            </section>
          )}
        </div>

        {/* Hero image block */}
        <section className="overflow-hidden rounded-2xl border-2 border-blue-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-blue-700 p-2 text-white">
                <ImageIcon size={18} />
              </span>
              <h2 className="text-sm font-black uppercase tracking-wide text-blue-900 sm:text-base">
                Ilustrasi Materi
              </h2>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-800">
              Visual AI
            </span>
          </div>

          {data.heroImageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-blue-100 bg-slate-50">
              <img
                src={data.heroImageUrl}
                alt={`Ilustrasi ${data.title}`}
                className="block h-auto max-h-[560px] w-full object-contain"
                loading="lazy"
                onError={(event) => {
                  console.error(
                    "[IMG RENDER ERROR]",
                    event.currentTarget.src.slice(0, 80)
                  );
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
              <div className="rounded-full bg-amber-100 p-3 text-amber-700">
                <AlertTriangle size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Ilustrasi belum tersedia
              </p>
              <p className="mt-2 max-w-md text-xs leading-6 text-slate-500 sm:text-sm">
                Gambar belum berhasil dibuat oleh model AI atau tidak dikirim ke frontend.
                Resume teks tetap bisa ditampilkan.
              </p>
            </div>
          )}
        </section>

        {show("conceptMap") && data.conceptMap?.length > 0 && (
          <section className="rounded-2xl border-2 border-blue-200 bg-white p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-blue-800 px-7 py-2.5 text-center text-sm font-black uppercase tracking-wide text-white shadow-md sm:text-base">
                Peta Konsep
              </div>
            </div>

            <div className="mx-auto mb-4 max-w-md rounded-xl border-2 border-blue-700 bg-blue-50 px-4 py-3 text-center">
              <p className="text-sm font-black uppercase text-blue-950 sm:text-base">
                {data.title}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {data.conceptMap.slice(0, 3).map((concept, index) => {
                const color = conceptColors[index % conceptColors.length];

                return (
                  <section
                    key={`${concept.heading}-${index}`}
                    className={`overflow-hidden rounded-xl border-2 ${color.border} ${color.surface} ${color.text}`}
                  >
                    <h3
                      className={`${color.badge} px-3 py-3 text-center text-xs font-black uppercase leading-snug text-white sm:text-sm`}
                    >
                      {concept.heading}
                    </h3>
                    <ul className="space-y-2 p-3 text-xs leading-relaxed sm:text-sm">
                      {concept.points.slice(0, 4).map((point, pointIndex) => (
                        <li key={`${point}-${pointIndex}`} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </section>
        )}

        {show("keyTakeaways") && data.keyTakeaways?.length > 0 && (
          <section className="overflow-hidden rounded-2xl border-2 border-orange-300 bg-orange-50">
            <div className="flex items-center gap-2 bg-orange-500 px-4 py-3 text-white">
              <Brain size={19} />
              <h2 className="text-sm font-black uppercase tracking-wide sm:text-base">
                Konsep Penting yang Harus Diingat
              </h2>
            </div>
            <div className="grid gap-x-5 gap-y-3 p-4 sm:grid-cols-2">
              {data.keyTakeaways.slice(0, 7).map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex gap-2.5 text-xs leading-relaxed sm:text-sm"
                >
                  <span className="mt-0.5 shrink-0 text-orange-600">★</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("keywords") && data.keywords?.length > 0 && (
          <section className="overflow-hidden rounded-2xl border-2 border-emerald-300 bg-white">
            <div className="flex items-center gap-2 bg-emerald-700 px-4 py-3 text-white">
              <BookOpen size={19} />
              <h2 className="text-sm font-black uppercase tracking-wide sm:text-base">
                Kata Kunci
              </h2>
            </div>
            <div>
              {data.keywords.slice(0, 8).map((item, index) => (
                <div
                  key={`${item.term}-${index}`}
                  className={`grid gap-1 border-b border-emerald-100 px-4 py-2.5 text-xs sm:grid-cols-[145px_1fr] sm:gap-4 sm:text-sm ${
                    index % 2 === 0 ? "bg-emerald-50/80" : "bg-white"
                  }`}
                >
                  <strong className="text-emerald-950">{item.term}</strong>
                  <span className="leading-relaxed">{item.definition}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {show("examples") && data.examples?.length > 0 && (
          <section className="rounded-2xl border-2 border-violet-300 bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-lg bg-violet-700 p-2 text-white">
                <Utensils size={18} />
              </span>
              <h2 className="text-sm font-black uppercase tracking-wide text-violet-950 sm:text-base">
                Contoh Kontekstual
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.examples.slice(0, 4).map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-xl border border-violet-200 bg-violet-50 p-3"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-700 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-xs font-black leading-snug text-violet-950 sm:text-sm">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed sm:text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.closingMessage && (
          <footer className="rounded-xl bg-[#073b91] px-5 py-4 text-center text-sm font-black leading-relaxed text-white sm:text-base">
            {data.closingMessage}
          </footer>
        )}

        <div className="flex items-center justify-between gap-3 border-t-2 border-blue-100 pt-3 text-[10px] font-bold uppercase tracking-wide text-blue-900 sm:text-xs">
          <span>{data.subject} · {data.grade}</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} />
            Ringkasan Pembelajaran
          </span>
        </div>
      </div>
    </article>
  );
}
