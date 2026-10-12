import { notFound } from "next/navigation";
import { situations } from "../../../_data";
import { DecisionFlow } from "./decision-flow";

export function generateStaticParams() {
  return situations.map((s) => ({ id: s.id }));
}

export default async function JugadaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = situations.findIndex((s) => s.id === id);
  if (index === -1) notFound();
  const next = situations[(index + 1) % situations.length];
  return <DecisionFlow key={id} situation={situations[index]} nextId={next.id} position={index + 1} total={situations.length} />;
}
