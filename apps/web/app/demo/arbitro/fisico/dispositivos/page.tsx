"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Status = "idle" | "working" | "connected" | "error";
type BluetoothDeviceLike = { name?: string; id: string; addEventListener: (event: string, handler: () => void) => void; };
type BluetoothNavigator = Navigator & { bluetooth?: { requestDevice: (options: { acceptAllDevices: boolean; optionalServices: string[] }) => Promise<BluetoothDeviceLike> } };

export default function DevicesPage() {
  const [camera, setCamera] = useState<Status>("idle");
  const [bluetooth, setBluetooth] = useState<Status>("idle");
  const [deviceName, setDeviceName] = useState("");
  const [message, setMessage] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const stopCamera = () => {
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    setCamera("idle");
  };
  useEffect(() => () => { stream.current?.getTracks().forEach(track => track.stop()); }, []);
  const openCamera = async () => {
    setMessage("");
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCamera("error"); setMessage("La cámara requiere HTTPS y un navegador compatible."); return;
    }
    setCamera("working");
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      stream.current = media;
      if (video.current) { video.current.srcObject = media; await video.current.play(); }
      setCamera("connected");
    } catch {
      stopCamera(); setCamera("error"); setMessage("No se pudo abrir la cámara. Revisá el permiso del navegador.");
    }
  };
  const connectBluetooth = async () => {
    setMessage("");
    const bt = (navigator as BluetoothNavigator).bluetooth;
    if (!window.isSecureContext || !bt) {
      setBluetooth("error"); setMessage("Bluetooth web no está disponible en este navegador. Probá Chrome en Android con Bluetooth activado."); return;
    }
    setBluetooth("working");
    try {
      const device = await bt.requestDevice({ acceptAllDevices: true, optionalServices: ["heart_rate", "battery_service"] });
      setDeviceName(device.name || "Dispositivo seleccionado");
      device.addEventListener("gattserverdisconnected", () => setBluetooth("idle"));
      setBluetooth("connected");
    } catch {
      setBluetooth("idle"); setMessage("No se seleccionó ningún dispositivo o se canceló el permiso.");
    }
  };
  return <main className="mx-auto min-h-screen max-w-xl bg-[#f6f9fc] px-4 pb-28 pt-6 text-[#10283b]">
    <Link href="/demo/arbitro/fisico/perfil" className="text-sm font-semibold text-sky-700">← Mi perfil físico</Link>
    <header className="mt-6 mb-7"><p className="text-xs font-bold uppercase tracking-widest text-sky-600">Preparación física</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Mis dispositivos</h1><p className="mt-2 text-sm text-slate-600">Conectá sensores compatibles o activá la cámara con tu permiso.</p></header>
    <section className="space-y-4">
      <article className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-12 place-items-center rounded-2xl bg-sky-100 text-2xl">⌚</span><div><h2 className="font-bold">Smartwatch y sensores</h2><p className="text-xs text-slate-500">Bluetooth compatible · prueba de vinculación</p></div></div><p className="mt-4 text-sm text-slate-600">{bluetooth === "connected" ? `Seleccionado: ${deviceName}. Aún no se leen datos del sensor.` : "Seleccioná un dispositivo cercano. La compatibilidad depende del navegador y del fabricante."}</p><button type="button" disabled={bluetooth === "working"} onClick={connectBluetooth} className="mt-4 min-h-12 w-full rounded-2xl bg-[#087fe9] px-4 font-semibold text-white disabled:opacity-60">{bluetooth === "working" ? "Buscando…" : "Buscar por Bluetooth"}</button></article>
      <article className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-12 place-items-center rounded-2xl bg-sky-100 text-2xl">📷</span><div><h2 className="font-bold">Cámara</h2><p className="text-xs text-slate-500">Vista previa · sin grabación</p></div></div><video ref={video} muted playsInline autoPlay className={`mt-4 w-full rounded-2xl bg-slate-900 ${camera === "connected" ? "block" : "hidden"}`} aria-label="Vista previa de cámara"/><p className="mt-3 text-sm text-slate-600">La cámara se apaga al salir de esta pantalla. No se guardan imágenes ni videos.</p><button type="button" disabled={camera === "working"} onClick={camera === "connected" ? stopCamera : openCamera} className="mt-4 min-h-12 w-full rounded-2xl bg-[#0d2949] px-4 font-semibold text-white disabled:opacity-60">{camera === "connected" ? "Apagar cámara" : camera === "working" ? "Abriendo…" : "Activar cámara"}</button></article>
    </section>
    {message && <p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{message}</p>}
    <p className="mt-6 text-xs leading-relaxed text-slate-500">Demo E01: no se recopilan métricas ni se vinculan cuentas de fabricantes. Apple Watch y otros relojes pueden requerir integraciones nativas.</p>
  </main>;
}
