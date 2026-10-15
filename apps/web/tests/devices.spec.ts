import { test, expect } from "@playwright/test";

for (const width of [375, 390, 768]) {
  test(`E01 dispositivos visible y sin desborde en ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/demo/arbitro/fisico/dispositivos");
    await expect(page.getByRole("heading", { name: "Mis dispositivos" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Buscar por Bluetooth" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Activar cámara" })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });
}

test("E01 navegación desde perfil físico", async ({ page }) => {
  await page.goto("/demo/arbitro/fisico/perfil");
  await page.getByRole("link", { name: /Conectar dispositivos/ }).click();
  await expect(page).toHaveURL(/\/fisico\/dispositivos$/);
});

test("E01 informa incompatibilidad Bluetooth sin inventar conexión", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "bluetooth", { value: undefined, configurable: true });
  });
  await page.goto("/demo/arbitro/fisico/dispositivos");
  await page.getByRole("button", { name: "Buscar por Bluetooth" }).click();
  await expect(page.getByRole("status")).toContainText("Bluetooth web no está disponible");
  await expect(page.getByText(/Seleccionado:/)).toHaveCount(0);
});
