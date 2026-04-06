import { motion } from "framer-motion";

export default function Page({ title, subtitle, right, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {(title || subtitle || right) && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            {title ? <h1 className="text-xl font-semibold">{title}</h1> : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
            ) : null}
          </div>
          {right ? <div>{right}</div> : null}
        </div>
      )}

      {children}
    </motion.section>
  );
}
