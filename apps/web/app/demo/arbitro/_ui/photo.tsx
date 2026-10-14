import Image from "next/image";
import type { Foto } from "./fotos";

/**
 * Fotografía recortada para llenar su contenedor (que debe ser relativo).
 * Sin `alt` es decorativa: el texto vecino ya nombra el contenido.
 */
export function Photo({
  foto,
  sizes,
  alt = "",
  priority = false,
  className = "",
}: {
  foto: Foto;
  sizes: string;
  alt?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={foto.src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className={`rf-photo ${className}`}
      style={{ objectPosition: foto.focus }}
    />
  );
}
