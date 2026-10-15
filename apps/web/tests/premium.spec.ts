import { test, expect } from "@playwright/test";

for (const width of [375, 390, 393, 430]) {
  test(`premium home composition and existing routes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => m.type() === "error" && errors.push(m.text()));
    await page.goto("/demo/arbitro");
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect(page.getByRole("heading", { name: "ENTRENÁ TU CRITERIO" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "¿Qué quieres entrenar hoy?" })).toBeVisible();
    for (const photo of await page.locator(".rf-premium-home img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
    }
    const cards = page.locator(".rf-premium-card");
    const left = await cards.nth(0).boundingBox();
    const right = await cards.nth(1).boundingBox();
    expect(Math.abs(left!.y - right!.y)).toBeLessThan(1);
    expect(Math.abs(left!.height - right!.height)).toBeLessThan(1);
    expect(right!.x).toBeGreaterThan(left!.x + left!.width);
    const physical = page.getByRole("link", { name: "Explorar preparación física, preview" });
    await expect(physical).toContainText("Preparación física");
    await expect(physical).toContainText("Explorar preparación física");
    // The contract permits natural vertical scrolling; verify the last module
    // remains accessible above the fixed navigation when the user reaches it.
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    const control = await cards.last().boundingBox();
    const nav = page.getByRole("navigation", { name: "Navegación principal" });
    const navBox = await nav.boundingBox();
    expect(control!.y + control!.height).toBeLessThanOrEqual(navBox!.y);
    await expect(nav.getByRole("link")).toHaveCount(5);
    await expect(nav.getByRole("link", { name: "Inicio", exact: true })).toHaveAttribute("aria-current", "page");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await physical.click();
    await expect(page).toHaveURL("/demo/arbitro/fisico");
    await expect(page.getByRole("heading", { name: "Preparación física" })).toBeVisible();
    await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "Inicio", exact: true }).click();
    await page.locator('a.rf-premium-start[href="/demo/arbitro/jugada/entrada-mediocampo"]').click();
    await expect(page).toHaveURL("/demo/arbitro/jugada/entrada-mediocampo");
    await expect(page.getByRole("button", { name: "Decidir", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Salir de la práctica" }).click();
    await page.getByRole("link", { name: "Jugadas", exact: true }).click();
    await expect(page).toHaveURL("/demo/arbitro/entrenar");
    await page.getByRole("navigation", { name: "Navegación principal" }).getByRole("link", { name: "Inicio", exact: true }).click();
    await page.getByRole("link", { name: "Reglas del juego", exact: true }).click();
    await expect(page).toHaveURL("/demo/arbitro/entrenar#reglas");
    expect(errors).toEqual([]);
  });
}
