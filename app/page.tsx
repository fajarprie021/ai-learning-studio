"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  FileText,
  ImageIcon,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import LessonInfographic, {
  type LessonInfographicData,
} from "./components/LessonInfographic";

const SECTION_OPTIONS = [
  { id: "conceptMap", label: "Peta konsep" },
  { id: "objectives", label: "Tujuan pembelajaran" },
  { id: "keyTakeaways", label: "Konsep yang harus diingat" },
  { id: "keywords", label: "Kata kunci dan definisi" },
  { id: "examples", label: "Contoh kontekstual" },
  { id: "funFact", label: "Fakta menarik" },
];

const INITIAL_SECTIONS = SECTION_OPTIONS.map((item) => item.id);

type ImageAttempt = {
  model: string;
  status: number | null;
  ok: boolean;
  reason: string | null;
};

type SourceInfo = {
  pdfUploaded?: boolean;
  extractedCharacters?: number;
  truncated?: boolean;
  imageGenerated?: boolean;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("IPAS");
  const [grade, setGrade] = useState("Kelas VI SD");
  const [content, setContent] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfInputKey, setPdfInputKey] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [selectedSections, setSelectedSections] =
    useState<string[]>(INITIAL_SECTIONS);

  const [infographic, setInfographic] =
    useState<LessonInfographicData | null>(null);
  const [resultSections, setResultSections] =
    useState<string[]>(INITIAL_SECTIONS);

  const [imageModelUsed, setImageModelUsed] = useState<string | null>(null);
  const [imageModelCandidates, setImageModelCandidates] = useState<string[]>([]);
  const [imageAttempts, setImageAttempts] = useState<ImageAttempt[]>([]);
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleSection(id: string) {
    setSelectedSections((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function resetForm() {
    setTitle("");
    setSubject("IPAS");
    setGrade("Kelas VI SD");
    setContent("");
    setPdfFile(null);
    setPdfInputKey((current) => current + 1);
    setInstructions("");
    setSelectedSections(INITIAL_SECTIONS);
    setInfographic(null);
    setResultSections(INITIAL_SECTIONS);
    setImageModelUsed(null);
    setImageModelCandidates([]);
    setImageAttempts([]);
    setSourceInfo(null);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Judul resume wajib diisi.");
      return;
    }

    if (!content.trim() && !pdfFile) {
      setError("Masukkan materi sumber atau unggah file PDF.");
      return;
    }

    if (content.length > 20000) {
      setError("Materi teks maksimal 20.000 karakter.");
      return;
    }

    if (selectedSections.length === 0) {
      setError("Pilih minimal satu bagian resume.");
      return;
    }

    setLoading(true);
    setError("");
    setInfographic(null);
    setImageModelUsed(null);
    setImageModelCandidates([]);
    setImageAttempts([]);
    setSourceInfo(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("grade", grade);
      formData.append("content", content);
      formData.append("instructions", instructions);
      formData.append("selectedSections", JSON.stringify(selectedSections));

      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      const response = await fetch("/api/learn", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("[FRONTEND IMAGE DEBUG]", {
        hasInfographic: Boolean(data?.infographic),
        hasHeroImage: Boolean(data?.infographic?.heroImageUrl),
        imagePrefix:
          typeof data?.infographic?.heroImageUrl === "string"
            ? data.infographic.heroImageUrl.slice(0, 30)
            : null,
        imageGenerated: data?.sourceInfo?.imageGenerated ?? null,
        imageModel: data?.imageModel ?? null,
        imageAttempts: data?.imageAttempts ?? [],
      });

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat resume.");
      }

      setInfographic(data.infographic);
      setResultSections(data.selectedSections ?? selectedSections);
      setImageModelUsed(data.imageModel ?? null);
      setImageModelCandidates(data.imageModelCandidates ?? []);
      setImageAttempts(data.imageAttempts ?? []);
      setSourceInfo(data.sourceInfo ?? null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuat resume."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090b12] text-slate-100">
      <header className="border-b border-white/10 bg-[#0c0f18] px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="rounded-xl bg-violet-600 p-3">
            <BookOpen size={23} />
          </div>
          <div>
            <h1 className="text-lg font-bold">AI Learning Studio</h1>
            <p className="text-xs text-slate-400">
              Pembuat resume infografis pembelajaran
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
        <section>
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-violet-300">
              <Sparkles size={18} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Resume Generator
              </span>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">Buat resume materi</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Atur isi materi dan bagian infografis sesuai kebutuhan Anda.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-white/10 bg-[#10131d] p-5 sm:p-6"
          >
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Judul resume <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                placeholder="Contoh: Makanan Bergizi untuk Kesehatan Pencernaan"
                className="w-full rounded-xl border border-white/10 bg-[#090b12] px-4 py-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Mata pelajaran
                </label>
                <input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={100}
                  placeholder="Contoh: IPAS"
                  className="w-full rounded-xl border border-white/10 bg-[#090b12] px-3 py-3 text-sm outline-none focus:border-violet-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="grade" className="text-sm font-medium">
                  Tingkat kelas
                </label>
                <select
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#090b12] px-3 py-3 text-sm outline-none focus:border-violet-400"
                >
                  <option>Kelas IV SD</option>
                  <option>Kelas V SD</option>
                  <option>Kelas VI SD</option>
                  <option>SMP</option>
                  <option>SMA/SMK</option>
                  <option>Perguruan tinggi</option>
                  <option>Umum</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Materi sumber <span className="text-red-400">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={20000}
                rows={9}
                placeholder="Tempel isi buku, catatan guru, materi pelajaran, atau teks yang ingin diringkas..."
                className="w-full resize-y rounded-xl border border-white/10 bg-[#090b12] px-4 py-3 text-sm leading-6 outline-none focus:border-violet-400"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Gunakan materi yang ingin dijadikan sumber resume.</span>
                <span>{content.length}/20000</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="pdf" className="text-sm font-medium">
                Unggah materi PDF (opsional)
              </label>

              <div className="rounded-xl border border-dashed border-white/20 bg-[#090b12] p-4">
                <input
                  key={pdfInputKey}
                  id="pdf"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;

                    if (file && file.size > 10 * 1024 * 1024) {
                      setError("Ukuran PDF maksimal 10 MB.");
                      e.target.value = "";
                      setPdfFile(null);
                      return;
                    }

                    if (
                      file &&
                      file.type !== "application/pdf" &&
                      !file.name.toLowerCase().endsWith(".pdf")
                    ) {
                      setError("Pilih file dengan format PDF.");
                      e.target.value = "";
                      setPdfFile(null);
                      return;
                    }

                    setError("");
                    setPdfFile(file);
                  }}
                  className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-violet-500"
                />

                {pdfFile && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
                    <Check size={16} />
                    <span className="break-all">{pdfFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setPdfFile(null)}
                      className="ml-auto text-xs text-slate-400 underline"
                    >
                      Hapus
                    </button>
                  </div>
                )}

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  PDF maksimal 10 MB. Anda dapat mengunggah PDF saja,
                  mengisi materi secara manual, atau menggunakan keduanya.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="instructions" className="text-sm font-medium">
                Instruksi tambahan
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                maxLength={3000}
                rows={3}
                placeholder="Contoh: Gunakan bahasa sederhana, fokus pada konsep utama, dan berikan contoh kehidupan sehari-hari."
                className="w-full resize-y rounded-xl border border-white/10 bg-[#090b12] px-4 py-3 text-sm leading-6 outline-none focus:border-violet-400"
              />
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold">Bagian resume</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Pilih bagian yang ingin dimasukkan ke poster.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {SECTION_OPTIONS.map((item) => {
                  const checked = selectedSections.includes(item.id);

                  return (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                        checked
                          ? "border-violet-400/50 bg-violet-500/10 text-violet-100"
                          : "border-white/10 bg-[#090b12] text-slate-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSection(item.id)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          checked
                            ? "border-violet-400 bg-violet-500"
                            : "border-slate-600"
                        }`}
                      >
                        {checked && <Check size={13} />}
                      </span>
                      {item.label}
                    </label>
                  );
                })}
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Membuat resume...
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    Buat Resume
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 disabled:opacity-50"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="min-w-0">
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2 text-blue-300">
              <FileText size={18} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Live Result
              </span>
            </div>
            <h2 className="text-2xl font-bold">Hasil resume</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Hasil AI akan ditampilkan di sini setelah proses selesai.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#10131d] p-8 text-center">
              <LoaderCircle
                size={35}
                className="animate-spin text-violet-400"
              />
              <p className="mt-4 font-medium">AI sedang menyusun materi</p>
              <p className="mt-2 text-sm text-slate-500">
                Konten sedang diringkas dan disusun menjadi infografis.
              </p>
            </div>
          ) : infographic ? (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#10131d] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-emerald-300">
                    Resume berhasil dibuat
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
                  >
                    Cetak / Simpan PDF
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-[#090b12] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Status gambar
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <ImageIcon size={16} className={sourceInfo?.imageGenerated ? "text-emerald-400" : "text-amber-400"} />
                      <span className="text-sm font-semibold">
                        {sourceInfo?.imageGenerated ? "Berhasil dibuat" : "Belum tersedia"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#090b12] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Model terpakai
                    </p>
                    <p className="mt-2 text-sm font-semibold break-all">
                      {imageModelUsed || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#090b12] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      PDF
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {sourceInfo?.pdfUploaded ? "Diunggah" : "Tidak"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#090b12] p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Karakter PDF
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {typeof sourceInfo?.extractedCharacters === "number"
                        ? sourceInfo.extractedCharacters
                        : "-"}
                    </p>
                  </div>
                </div>

                {imageAttempts.length > 0 && (
                  <div className="rounded-xl border border-white/10 bg-[#090b12] p-3">
                    <p className="mb-3 text-[11px] uppercase tracking-wide text-slate-500">
                      Riwayat percobaan model gambar
                    </p>
                    <div className="space-y-2">
                      {imageAttempts.map((attempt, index) => (
                        <div
                          key={`${attempt.model}-${index}`}
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold break-all">{attempt.model}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                attempt.ok
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {attempt.ok ? "SUCCESS" : "FAILED"}
                            </span>
                          </div>
                          <div className="mt-1 text-slate-400">
                            status: {attempt.status ?? "n/a"}
                          </div>
                          {attempt.reason && (
                            <div className="mt-1 text-slate-500">
                              {attempt.reason}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!sourceInfo?.imageGenerated && (
                  <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                      <div>
                        Gambar belum berhasil dibuat. Cek riwayat percobaan model di atas.
                        Resume teks tetap berhasil ditampilkan.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <LessonInfographic data={infographic} sections={resultSections} />
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#10131d] p-8 text-center">
              <div className="rounded-2xl bg-violet-500/10 p-4 text-violet-300">
                <FileText size={30} />
              </div>
              <h3 className="mt-4 font-semibold">Belum ada resume</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Isi judul dan materi sumber, pilih bagian resume, lalu tekan
                Buat Resume.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
