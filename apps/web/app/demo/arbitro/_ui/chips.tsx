"use client";

import { topics, type Topic } from "./data";

export function TopicChips({ value, onChange }: { value: Topic; onChange: (t: Topic) => void }) {
  return (
    <div className="rf-chips" role="group" aria-label="Tema de práctica">
      {topics.map((t) => (
        <button key={t} type="button" className="rf-chip" aria-pressed={t === value} onClick={() => onChange(t)}>
          {t === value && <span aria-hidden>✓</span>}
          {t}
        </button>
      ))}
    </div>
  );
}
