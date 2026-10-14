import { notFound } from "next/navigation";
import { situations } from "../../../_data";
import { Jugada } from "../../_ui/jugada";

export function generateStaticParams() {
  return situations.map((s) => ({ id: s.id }));
}

export default async function JugadaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = situations.findIndex((s) => s.id === id);
  if (index === -1) notFound();
  return <Jugada key={id} situation={situations[index]} position={index + 1} total={situations.length} />;
}
