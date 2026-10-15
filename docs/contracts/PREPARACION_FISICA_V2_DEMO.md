# APF — Preparación física V2 · Contrato de demo

Estado: DEMO navegable. No sustituye ni aprueba el contrato PREPARACION_FISICA_V1 de datos reales. Entrega directa en main autorizada por el usuario el 15/10/2026.

## Pantallas
1. /demo/arbitro/fisico: Inicio físico con CTA principal y seis categorías.
2. /demo/arbitro/fisico/entrenar: biblioteca y acceso a sesión.
3. /demo/arbitro/fisico/plan: calendario semanal ilustrativo; sin asignaciones reales.
4. /demo/arbitro/fisico/rendimiento: historial vacío y métricas no calculadas; nunca fingir registros.
5. /demo/arbitro/fisico/perfil: tipo de árbitro, objetivos y dispositivos sin conexiones reales.

## Ejecución de demostración
Seleccionar ejercicio → advertencia y preparación → iniciar cronómetro → pausar/reanudar → finalizar → resumen de tiempo transcurrido local. Sin persistencia. Confirmar abandono. No prescribir cargas, repeticiones, descansos ni pruebas oficiales. Sin GPS, sensores ni IA.

## Seguridad y dependencias
No modificar permisos, RLS, migraciones, secretos, autenticación ni API. Mantener avisos de independencia institucional y datos ficticios. La implementación real sigue dependiendo de N-02, N-03 y aprobaciones profesionales del contrato V1.

## Definición de terminado
Las cinco rutas renderizan, navegación móvil funcional, temporizador probado, ninguna persistencia, flujo de jugadas intacto, lint/typecheck/build y pruebas navegador verdes; comprobar despliegue Production Ready. Una compilación exitosa no sustituye pruebas de dispositivo.
