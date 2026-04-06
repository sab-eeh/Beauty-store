export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close modal overlay"
      />

      {/* Centered container with safe padding */}
      <div className="relative mx-auto flex min-h-screen w-full items-start justify-center p-4 sm:items-center">
        {/* Modal box: scrolls internally on small screens */}
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-soft">
          <div className="flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5 sm:py-4">
            <div className="text-sm font-semibold allow-select">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          {/* IMPORTANT: internal scroll area */}
          <div className="max-h-[75vh] overflow-y-auto px-4 py-4 sm:max-h-[80vh] sm:px-5 sm:py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
