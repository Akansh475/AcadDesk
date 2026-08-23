import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Sliders,
  Copy,
  Download,
  Printer,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  Award,
  Layers,
  BookOpen,
  History,
  Trash2,
  ChevronRight,
  Eye,
  FileCode,
  X,
} from "lucide-react";
import QuestionCard from "./QuestionCard";
import { useQuestions } from "../../hooks/useQuestions";
import { extractFileText } from "../../api/questionsApi";

const SAMPLE_NOTES = [
  {
    subject: "Computer Networks",
    title: "TCP & UDP Protocols",
    content: `Transmission Control Protocol (TCP):
- Connection-oriented protocol using a 3-way handshake (SYN, SYN-ACK, ACK) to establish reliable connections.
- Features: Byte-stream delivery, reliable ordered packet delivery, flow control (Sliding Window Protocol), and error detection/correction.
- Congestion Control algorithms: Slow Start (exponential window growth), Congestion Avoidance (additive increase/multiplicative decrease), Fast Retransmit (triggered by 3 duplicate ACKs), and Fast Recovery.
- TCP Header size: 20 bytes standard (up to 60 bytes with options).

User Datagram Protocol (UDP):
- Connectionless, lightweight transport protocol without handshake or acknowledgment.
- Characteristics: Unreliable (best-effort delivery), unordered packets, low latency, no flow control or congestion mechanisms.
- Header size: 8 bytes fixed (Source port, Destination port, Length, Checksum).
- Ideal applications: Real-time audio/video streaming, VoIP, DNS queries, Online multiplayer gaming where low latency is critical over packet loss.`,
  },
  {
    subject: "Operating Systems",
    title: "Deadlocks & Concurrency",
    content: `Deadlock in Operating Systems:
A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.

Four Necessary Coffman Conditions:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be currently holding at least one resource and requesting additional resources being held by other processes.
3. No Preemption: Resources cannot be preempted; a resource can only be released voluntarily by the process holding it after task completion.
4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource that is needed by the next process in the chain.

Deadlock Handling Strategies:
- Deadlock Prevention: Invalidate at least one of the 4 Coffman conditions (e.g., resource ordering to eliminate circular wait).
- Deadlock Avoidance: System dynamically checks resource allocation state. Banker's Algorithm uses Safe State vs Unsafe State analysis.
- Deadlock Detection and Recovery: Maintain Wait-For-Graph (WFG), detect cycles, and recover via process termination or resource preemption.
- Ostrich Algorithm: Ignore deadlocks assuming they occur rarely (used in many general-purpose OS).`,
  },
  {
    subject: "Database Management Systems",
    title: "ACID Properties & Normalization",
    content: `Database Transactions and ACID Properties:
A transaction is a logical unit of database processing. ACID properties ensure data integrity:
1. Atomicity: "All or nothing" execution principle managed by recovery manager/undo logs.
2. Consistency: Execution of transaction preserves database integrity constraints and business rules.
3. Isolation: Concurrent execution produces states equivalent to serial execution (Serializability). Controlled by Concurrency Control protocols (2PL, Timestamp ordering).
4. Durability: Once a transaction commits, its modifications persist permanently even across system crashes (redo logs, Write-Ahead Logging).

Database Normalization:
- 1NF: Eliminate repeating groups, all attributes must contain atomic (indivisible) values.
- 2NF: Must be in 1NF and eliminate partial functional dependencies (every non-prime attribute fully dependent on primary key).
- 3NF: Must be in 2NF and eliminate transitive dependencies (X -> Y where Y is non-prime and X is not a superkey).
- BCNF (Boyce-Codd Normal Form): For every non-trivial functional dependency X -> Y, X must be a super key.`,
  },
];

export default function QuestionGeneratorTab({ subjects = [] }) {
  const {
    currentSet,
    setCurrentSet,
    generateQuestions,
    isGenerating,
    generationError,
    history,
    deleteSet,
    viewMode,
    setViewMode,
    copied,
    copyPaper,
    downloadMarkdown,
  } = useQuestions();

  const [selectedSubject, setSelectedSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [notesText, setNotesText] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("mixed"); // "mixed" | "easy" | "medium" | "hard"
  const [questionType, setQuestionType] = useState("mixed"); // "mixed" | "short" | "long"
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStats, setExtractionStats] = useState(null);
  const [extractError, setExtractError] = useState("");

  const fileInputRef = useRef(null);

  // Available subjects list
  const defaultSubjectNames = [
    "Computer Networks",
    "Operating Systems",
    "DBMS",
    "Data Structures",
    "Algorithms",
    "Software Engineering",
    "Compiler Design",
  ];

  const subjectOptions =
    subjects.length > 0
      ? subjects.map((s) => s.subject_name || s.name || s)
      : defaultSubjectNames;

  const activeSubjectName = isCustomSubject ? customSubject.trim() : selectedSubject;

  // Handle File Upload (PDF, Word DOCX/DOC, TXT, MD, etc.)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setExtractError("");
    setExtractionStats(null);
    setIsExtracting(true);

    try {
      // Call server extraction endpoint for PDF, DOCX, etc.
      const res = await extractFileText(file);
      if (res && res.text) {
        setNotesText(res.text);
        setExtractionStats({
          fileName: res.fileName || file.name,
          wordCount: res.wordCount,
          charCount: res.charCount,
        });
      } else {
        throw new Error("No text content found in file.");
      }
    } catch (err) {
      console.warn("Server extraction error, attempting client-side text fallback:", err);
      // Fallback for simple text files if API fails
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === "string" && !content.startsWith("%PDF")) {
          setNotesText(content);
          setExtractionStats({
            fileName: file.name,
            wordCount: content.split(/\s+/).filter(Boolean).length,
            charCount: content.length,
          });
        } else {
          setExtractError(
            err.response?.data?.error ||
              "Could not extract text from document. Please ensure the PDF/DOC contains readable text, or paste notes directly."
          );
        }
      };
      reader.onerror = () => {
        setExtractError("Failed to read file. Please paste notes directly.");
      };
      reader.readAsText(file);
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplySample = (sample) => {
    setIsCustomSubject(false);
    setSelectedSubject(sample.subject);
    setNotesText(sample.content);
    setUploadedFileName("");
    setExtractionStats(null);
    setExtractError("");
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!activeSubjectName) {
      alert("Please select or enter a subject name.");
      return;
    }
    if (!notesText.trim() || notesText.trim().length < 15) {
      alert("Please provide lecture notes content (at least 15 characters).");
      return;
    }

    try {
      await generateQuestions({
        subject: activeSubjectName,
        notes: notesText.trim(),
        numQuestions: Math.min(10, Math.max(1, numQuestions)),
        difficulty,
        questionType,
      });
    } catch (err) {
      console.error("Generation failed:", err);
    }
  };

  const wordCount = notesText.trim() ? notesText.trim().split(/\s+/).length : 0;
  const charCount = notesText.length;

  return (
    <div className="space-y-6">
      {/* ── TOP BANNER ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-surface-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles size={18} className="text-primary-600 dark:text-primary-400" />
            AI Exam Question Generator
          </h2>
          <p className="text-xs text-surface-500 dark:text-slate-400">
            Upload lecture notes or syllabus content. AI will analyze it and generate exam-grade theoretical questions (Max 10 questions).
          </p>
        </div>

        {/* History Toggle Button */}
        <button
          type="button"
          onClick={() => setShowHistoryDrawer((prev) => !prev)}
          className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-surface-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-surface-700 shadow-2xs hover:bg-surface-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <History size={14} />
          <span>Past Papers</span>
          {history.length > 0 && (
            <span className="rounded-full bg-primary-100 px-1.5 py-0.2 text-[10px] font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* ── MAIN TWO-COLUMN / STACKED LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT: INPUT FORM CARD (5 cols) ── */}
        <div className="lg:col-span-5 rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4.5">
          <div className="border-b border-surface-100 pb-3 dark:border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-slate-300 flex items-center gap-2">
              <FileCode size={14} className="text-primary-600 dark:text-primary-400" />
              Notes & Exam Settings
            </h3>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* 1. Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-surface-700 dark:text-slate-300">
                Subject Name <span className="text-red-500">*</span>
              </label>

              {!isCustomSubject ? (
                <div className="space-y-2">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs font-medium text-surface-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="">-- Select Subject --</option>
                    {subjectOptions.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSubject(true);
                      setSelectedSubject("");
                    }}
                    className="text-[11px] text-primary-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    + Enter custom subject name
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="e.g. Distributed Systems, VLSI Design"
                    className="w-full rounded-xl border border-surface-200 bg-white px-3 py-2 text-xs text-surface-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSubject(false);
                      setCustomSubject("");
                    }}
                    className="text-[11px] text-primary-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    ← Pick from subjects list
                  </button>
                </div>
              )}
            </div>

            {/* 2. Upload / Input Notes Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-surface-700 dark:text-slate-300">
                  Lecture Notes / Syllabus Content <span className="text-red-500">*</span>
                </label>
                {(notesText || uploadedFileName) && (
                  <button
                    type="button"
                    onClick={() => {
                      setNotesText("");
                      setUploadedFileName("");
                      setExtractionStats(null);
                      setExtractError("");
                    }}
                    className="text-[11px] text-surface-400 hover:text-red-600 flex items-center gap-0.5 font-medium"
                  >
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Upload Drop Area */}
              <div
                onClick={() => !isExtracting && fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center transition-all ${
                  isExtracting
                    ? "border-primary-400 bg-primary-50/40 dark:bg-primary-500/10 cursor-wait"
                    : extractionStats
                    ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-500/30 dark:bg-emerald-500/5"
                    : "border-surface-300 bg-surface-50/50 hover:border-primary-400 hover:bg-primary-50/30 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-primary-500"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt,.md,.json,.csv,.rtf,.html"
                  disabled={isExtracting}
                  className="hidden"
                />

                {isExtracting ? (
                  <div className="flex flex-col items-center gap-2 py-1">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                    <p className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                      Reading & extracting text from {uploadedFileName || "document"}...
                    </p>
                    <p className="text-[10px] text-surface-400">
                      Extracting full chapters, formulas, and topics...
                    </p>
                  </div>
                ) : extractionStats ? (
                  <div className="flex flex-col items-center gap-1 py-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <Check size={14} className="shrink-0" />
                      <span>{extractionStats.fileName}</span>
                    </div>
                    <p className="text-[11px] text-emerald-600/90 dark:text-emerald-400/80 font-medium">
                      ✓ Successfully extracted {extractionStats.wordCount.toLocaleString()} words ({extractionStats.charCount.toLocaleString()} chars)
                    </p>
                    <p className="text-[10px] text-surface-400 mt-1">
                      Click to upload a different PDF or Word document
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="text-primary-600 dark:text-primary-400 mb-1.5" />
                    <p className="text-xs font-semibold text-surface-800 dark:text-slate-200">
                      Click to upload PDF, Word (.docx) or Text Notes
                    </p>
                    <p className="text-[10px] text-surface-400 dark:text-slate-500 mt-0.5">
                      Supports .pdf, .docx, .doc, .txt, .md — text will automatically be extracted below
                    </p>
                  </>
                )}
              </div>

              {/* Extraction Error Alert */}
              {extractError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{extractError}</span>
                </div>
              )}

              {/* Textarea for Notes */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-surface-500 dark:text-slate-400">
                  <span>Extracted / Pasted Lecture Notes:</span>
                  <span>{wordCount.toLocaleString()} words • {charCount.toLocaleString()} chars</span>
                </div>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Extracted document text or pasted lecture notes will appear here. You can edit, review, or add notes before generating..."
                  rows={8}
                  className="w-full resize-y rounded-xl border border-surface-200 bg-white p-3 text-xs leading-relaxed text-surface-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-surface-500 dark:text-slate-400">
                Try Sample Lecture Notes:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_NOTES.map((sample) => (
                  <button
                    key={sample.title}
                    type="button"
                    onClick={() => handleApplySample(sample)}
                    className="rounded-lg border border-surface-200 bg-surface-50 px-2.5 py-1 text-[11px] font-medium text-surface-700 hover:border-primary-300 hover:bg-primary-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Number of Questions Selector (Max 10 limit) */}
            <div className="space-y-2 pt-1 border-t border-surface-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-surface-700 dark:text-slate-300">
                  Number of Questions: <span className="text-primary-600 font-bold">{numQuestions}</span>
                </label>
                <span className="text-[11px] font-medium text-surface-400 bg-surface-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  Max Limit: 10
                </span>
              </div>

              {/* Number Buttons Selector (1 to 10) */}
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNumQuestions(num)}
                    className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      numQuestions === num
                        ? "bg-primary-600 text-white shadow-2xs"
                        : "border border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:bg-surface-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Advanced Exam Customization (Collapsible) */}
            <div className="border-t border-surface-100 pt-2 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex w-full items-center justify-between text-xs font-semibold text-surface-600 hover:text-surface-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders size={13} />
                  Question Difficulty & Exam Types
                </span>
                <span className="text-[11px] text-primary-600">{showAdvanced ? "Hide" : "Show"}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 rounded-xl bg-surface-50 p-3 dark:bg-slate-950/60 border border-surface-200/60 dark:border-slate-800">
                  {/* Difficulty */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-surface-600 dark:text-slate-400">
                      Cognitive Difficulty Level:
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-xs text-surface-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <option value="mixed">Mixed (Balanced 2M, 5M & 10M)</option>
                      <option value="easy">Foundational (Definitions & Core Concepts)</option>
                      <option value="medium">Intermediate (Comparisons & Workflows)</option>
                      <option value="hard">Advanced (Derivations & Critical Analysis)</option>
                    </select>
                  </div>

                  {/* Question Weightage Type */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-surface-600 dark:text-slate-400">
                      Question Structure & Marks:
                    </label>
                    <select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                      className="w-full rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-xs text-surface-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <option value="mixed">Standard Exam Mix (Short & Long Theory)</option>
                      <option value="short">Short Answer Questions (2-3 Marks)</option>
                      <option value="long">Long Analytical Essays (5-10 Marks)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {generationError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{generationError}</span>
              </div>
            )}

            {/* Generate Action Button */}
            <button
              type="submit"
              disabled={isGenerating || !activeSubjectName || !notesText.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Analyzing Notes & Generating Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate {numQuestions} Exam Questions</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── RIGHT: GENERATED QUESTIONS VIEW (7 cols) ── */}
        <div className="lg:col-span-7 space-y-4">
          {/* Initial State / No Questions Generated Yet */}
          {!currentSet && !isGenerating && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400 mb-4">
                <BookOpen size={28} />
              </div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-slate-100">
                No Questions Generated Yet
              </h3>
              <p className="mt-1.5 max-w-md text-xs text-surface-500 dark:text-slate-400 leading-relaxed">
                Select a subject, upload or paste your lecture notes on the left, and click{" "}
                <span className="font-semibold text-primary-600 dark:text-primary-400">Generate</span>. The AI will formulate theoretical questions with marking schemes and model answers.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplySample(SAMPLE_NOTES[0])}
                  className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-1.5 text-xs font-semibold text-surface-700 hover:bg-surface-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  ⚡ Load Computer Networks Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleApplySample(SAMPLE_NOTES[1])}
                  className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-1.5 text-xs font-semibold text-surface-700 hover:bg-surface-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                >
                  ⚡ Load OS Deadlocks Demo
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isGenerating && (
            <div className="space-y-4">
              <div className="h-28 animate-pulse rounded-2xl bg-surface-100 dark:bg-slate-800" />
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-36 animate-pulse rounded-2xl bg-surface-100 dark:bg-slate-800"
                />
              ))}
            </div>
          )}

          {/* Active Question Set Display */}
          {currentSet && !isGenerating && (
            <div className="space-y-4">
              {/* Paper Summary Header */}
              <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-primary-100 px-2 py-0.5 text-[11px] font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">
                        {currentSet.subject}
                      </span>
                      <span className="text-xs text-surface-400">
                        • {currentSet.total_questions} Questions
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-surface-900 dark:text-slate-100">
                      Theoretical Examination Question Paper
                    </h3>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-1.5 text-center dark:border-slate-800 dark:bg-slate-800">
                      <p className="text-[10px] uppercase font-semibold text-surface-400">Total Marks</p>
                      <p className="text-xs font-bold text-surface-800 dark:text-slate-100">
                        {currentSet.total_marks} M
                      </p>
                    </div>
                    <div className="rounded-xl border border-surface-200 bg-surface-50 px-3 py-1.5 text-center dark:border-slate-800 dark:bg-slate-800">
                      <p className="text-[10px] uppercase font-semibold text-surface-400">Questions</p>
                      <p className="text-xs font-bold text-surface-800 dark:text-slate-100">
                        {currentSet.total_questions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overview statement */}
                {currentSet.overview && (
                  <p className="text-xs text-surface-600 dark:text-slate-400 leading-relaxed border-t border-surface-100 pt-2.5 dark:border-slate-800">
                    <span className="font-semibold text-surface-800 dark:text-slate-200">Assessment Scope: </span>
                    {currentSet.overview}
                  </p>
                )}

                {/* Control Bar: View Mode & Export Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-surface-100 pt-3 dark:border-slate-800">
                  {/* View Mode Switcher */}
                  <div className="flex items-center gap-1 rounded-lg bg-surface-100 p-0.5 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setViewMode("interactive")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        viewMode === "interactive"
                          ? "bg-white text-surface-900 shadow-2xs dark:bg-slate-900 dark:text-white"
                          : "text-surface-600 hover:text-surface-900 dark:text-slate-400"
                      }`}
                    >
                      <Eye size={12} />
                      <span>Study & Answers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode("exam_sheet")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        viewMode === "exam_sheet"
                          ? "bg-white text-surface-900 shadow-2xs dark:bg-slate-900 dark:text-white"
                          : "text-surface-600 hover:text-surface-900 dark:text-slate-400"
                      }`}
                    >
                      <FileText size={12} />
                      <span>Worksheet / Exam View</span>
                    </button>
                  </div>

                  {/* Actions: Copy & Export */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => copyPaper(false)}
                      className="flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-xs font-medium text-surface-700 hover:bg-surface-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Copy Questions Only"
                    >
                      {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copied ? "Copied!" : "Copy Questions"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyPaper(true)}
                      className="flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-xs font-medium text-surface-700 hover:bg-surface-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Copy Full Solutions and Marking Scheme"
                    >
                      <Sparkles size={12} className="text-primary-600 dark:text-primary-400" />
                      <span>Copy Solutions</span>
                    </button>

                    <button
                      type="button"
                      onClick={downloadMarkdown}
                      className="flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-xs font-medium text-surface-700 hover:bg-surface-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Download Markdown Document"
                    >
                      <Download size={12} />
                      <span>Export</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex items-center gap-1 rounded-lg border border-surface-200 bg-white px-2.5 py-1.5 text-xs font-medium text-surface-700 hover:bg-surface-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      title="Print / Save as PDF"
                    >
                      <Printer size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {currentSet.questions.map((q, idx) => (
                  <QuestionCard
                    key={q.id || idx}
                    question={q}
                    index={idx}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── HISTORY DRAWER / MODAL ── */}
      {showHistoryDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-surface-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-surface-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History size={16} className="text-primary-600 dark:text-primary-400" />
                <h3 className="text-sm font-bold text-surface-900 dark:text-slate-100">
                  Previously Generated Exam Question Sets
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryDrawer(false)}
                className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {history.length === 0 ? (
                <div className="py-8 text-center text-xs text-surface-400 dark:text-slate-500">
                  No previous question sets found. Generate questions to build your library.
                </div>
              ) : (
                history.map((set) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between rounded-xl border border-surface-200 bg-surface-50/70 p-3 transition-all hover:border-primary-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
                  >
                    <div
                      onClick={() => {
                        setCurrentSet(set);
                        setShowHistoryDrawer(false);
                      }}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-surface-800 dark:text-slate-200">
                          {set.subject}
                        </span>
                        <span className="text-[10px] text-surface-400">
                          • {set.total_questions} Questions ({set.total_marks} Marks)
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-surface-500 dark:text-slate-400 line-clamp-1">
                        {set.overview}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 pl-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentSet(set);
                          setShowHistoryDrawer(false);
                        }}
                        className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10"
                        title="Load Set"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSet(set.id)}
                        className="rounded-lg p-1.5 text-surface-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
