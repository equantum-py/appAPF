# Matriz E-00
Fecha: 2026-10-12 UTC. Node 24 (entorno local 24.19.0); Python 3.12 (local 3.12.14); uv 0.12.23. CI usa las mismas líneas Node/Python y uv exacto.
Versiones directas npm fijadas y transitivas en package-lock.json; Python fijadas y transitivas/hashes en uv.lock. PostgreSQL, Playwright, Vitest, Testcontainers y shadcn/ui se incorporarán al contrato que efectivamente los utilice, con verificación previa. PWA aún no implementada.

Fuentes oficiales consultadas: https://nextjs.org/docs/app/getting-started/installation (Node >=20.9); https://nodejs.org/en/about/previous-releases (línea LTS); https://devguide.python.org/versions/ (soporte Python); https://fastapi.tiangolo.com/deployment/versions/ (fijar versiones y probar compatibilidad).
La instalación resuelve metadatos de npm y PyPI; build e importación prueban la base, no integración DB/Auth.

## Frontend
{
  "name": "@arbitral/web",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@tailwindcss/postcss": "4.3.3",
    "next": "16.4.0",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "tailwindcss": "4.3.3"
  },
  "devDependencies": {
    "@types/node": "26.6.5",
    "@types/react": "19.3.0",
    "@types/react-dom": "19.3.0",
    "eslint": "10.12.0",
    "eslint-config-next": "16.4.0",
    "typescript": "6.0.3"
  }
}
## Python
- alembic 1.20.0
- fastapi 0.143.0
- httpx 0.28.1
- pydantic 2.14.1
- pytest 9.1.1
- ruff 0.17.0
- sqlalchemy 2.1.4
- uvicorn 0.54.0