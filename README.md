# Welcome to Resume Analyzer: https://resumeanalyzer-lake.vercel.app/

Built a client-side resume-analysis SPA using React Router, TypeScript, and Tailwind, implementing
drag-and-drop PDF uploads, high-resolution on-device PDF→PNG conversion via dynamically
imported pdfjs-dist workers, and end-to-end AI feedback via Puter Auth/FS/KV/AI services.

Engineered a typed Zustand service layer abstracting authentication, filesystem operations, KV
storage, and AI calls into a unified hook, eliminating duplicated logic across 6+ components,
improving solution maintainability, and enabling faster feature delivery aligned with Agile workflows.
