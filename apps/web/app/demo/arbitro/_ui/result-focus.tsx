"use client";
import { useEffect, useRef } from "react";
export function ResultHeading({
  children,
  correct,
}: {
  children: string;
  correct: boolean;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  return (
    <h1 ref={heading} tabIndex={-1} className="rf-headline" data-ok={correct}>
      {children}
    </h1>
  );
}
