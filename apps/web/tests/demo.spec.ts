import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`rule comparison, exit guard and relevant practice at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/demo/arbitro/jugada/entrada-mediocampo");
    await page.getByRole("button", { name: "Decidir", exact: true }).click();
    const confirm = page.getByRole("button", { name: "Confirmar decisión" });
    await expect(confirm).toBeDisabled();
    await page
      .getByRole("button", { name: "Tiro libre directo", exact: true })
      .click();
    await page.getByRole("button", { name: "Amarilla", exact: true }).click();
    await expect(confirm).toBeDisabled();
    await page.getByRole("button", { name: "Salir de la práctica" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Seguir respondiendo" }).click();
    await expect(
      page.getByRole("button", { name: "Amarilla", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page
      .getByRole("button", { name: "Regla 11 · Fuera de juego", exact: true })
      .click();
    await confirm.click();
    await expect(
      page.getByRole("heading", { name: "Regla a corregir", exact: true }),
    ).toBeFocused();
    const row = page
      .getByRole("row")
      .filter({
        has: page.getByRole("rowheader", { name: "Regla", exact: true }),
      });
    await expect(row).toContainText("Regla 11");
    await expect(row).toContainText("Regla 12");
    await expect(row.locator('td[data-ok="false"]')).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: "Practicar la relacionada", exact: true }),
    ).toHaveAttribute("href", "/demo/arbitro/jugada/disputa-area");
    await expect(page.locator(".rf-nav")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();

    await page
      .getByRole("link", { name: "Practicar la relacionada", exact: true })
      .click();
    await page.getByRole("button", { name: "Decidir", exact: true }).click();
    await page
      .getByRole("button", { name: "Sigue el juego", exact: true })
      .click();
    await page.getByRole("button", { name: "Ninguna", exact: true }).click();
    await page
      .getByRole("button", {
        name: "Regla 12 · Faltas y conducta incorrecta",
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: "Confirmar decisión" }).click();
    await expect(
      page.getByRole("heading", { name: "Decisión correcta", exact: true }),
    ).toBeVisible();

    for (const [id, decision, law, topic] of [
      ["brazo-defensor", "Penal", "12", "mano"],
      ["pase-profundidad", "Tiro libre indirecto", "11", "fuera de juego"],
    ]) {
      await page.goto(
        `/demo/arbitro/jugada/${id}/resultado?d=${decision === "Penal" ? "penal" : "tli"}&s=ninguna&l=${law}`,
      );
      await expect(
        page.getByText(`Todavía no hay otra jugada de ${topic}`, {
          exact: false,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", {
          name: "Practicar la relacionada",
          exact: true,
        }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("link", {
          name: "Volver a practicar esta jugada",
          exact: true,
        }),
      ).toHaveAttribute("href", `/demo/arbitro/jugada/${id}`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    }
    expect(errors).toEqual([]);
  });
}

test("clean exit, rule-only draft exit and invalid result input", async ({
  page,
  request,
}) => {
  await page.goto("/demo/arbitro/jugada/entrada-mediocampo");
  await page.getByRole("button", { name: "Salir de la práctica" }).click();
  await expect(page).toHaveURL("/demo/arbitro");
  await page.goto("/demo/arbitro/jugada/entrada-mediocampo");
  await page.getByRole("button", { name: "Decidir", exact: true }).click();
  await page
    .getByRole("button", { name: "Regla 13 · Tiros libres", exact: true })
    .click();
  await page.getByRole("button", { name: "Salir de la práctica" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Salir de la práctica" }).click();
  await page.getByRole("button", { name: "Salir y descartar" }).click();
  await expect(page).toHaveURL("/demo/arbitro");
  for (const query of [
    "d=tld&s=amarilla",
    "d=tld&s=amarilla&l=99",
    "d=invalid&s=amarilla&l=12",
  ]) {
    expect(
      (
        await request.get(
          `/demo/arbitro/jugada/entrada-mediocampo/resultado?${query}`,
        )
      ).status(),
    ).toBe(404);
  }
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  expect(home.url()).not.toContain("/demo");
  await page.goto("/demo/arbitro");
  await expect(page.getByRole("heading", { name: "¿Qué vas a entrenar?", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Inicio", exact: true })).toHaveAttribute("aria-current", "page");
});

for (const width of [320, 390, 768, 1440]) {
  test(`welcome at / presents the platform and starts the demo at ${width}px`, async ({
    page,
  }) => {
    const height = width === 320 ? 568 : width === 1440 ? 900 : 844;
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Plataforma arbitral", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Entrená tu criterio. Prepará tu partido.")).toBeVisible();
    await expect(page.getByText("Proyecto independiente", { exact: false })).toBeVisible();
    const start = page.getByRole("link", { name: "Comenzar", exact: true });
    const account = page.getByRole("link", { name: "Ya tengo cuenta", exact: true });
    await expect(account).toHaveAttribute("href", "/ingresar");
    // Las dos acciones entran en la primera pantalla.
    const box = await account.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(height);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await start.click();
    await expect(page).toHaveURL("/demo/arbitro");
    await expect(page.getByRole("note")).toContainText("datos ficticios");
    await expect(page.getByRole("heading", { name: "¿Qué vas a entrenar?" })).toBeVisible();
    const physical = page.locator(".rf-simple-pending");
    await expect(physical).toContainText("Próximamente");
    await expect(physical.locator("a, button")).toHaveCount(0);
    if (width < 1024) {
      const control = await physical.boundingBox();
      const nav = await page.getByRole("navigation", { name: "Principal" }).boundingBox();
      expect(control!.y + control!.height).toBeLessThanOrEqual(nav!.y);
    }
    for (const photo of await page.locator(".rf-simple-home img").all()) {
      await photo.scrollIntoViewIfNeeded();
      await expect(photo).toBeVisible();
      await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBeTruthy();
    }
    await page.getByRole("link", { name: "Jugadas", exact: true }).click();
    await expect(page).toHaveURL("/demo/arbitro/entrenar");
    await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Entrenar", exact: true })).toHaveAttribute("aria-current", "page");
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Inicio", exact: true }).click();
    await page.getByRole("link", { name: /Reglas del juego/ }).click();
    await expect(page).toHaveURL("/demo/arbitro/entrenar#reglas");
    await expect(page.locator("#reglas")).toBeInViewport();
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Inicio", exact: true }).click();
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Progreso", exact: true }).click();
    await expect(page).toHaveURL("/demo/arbitro/progreso");
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Inicio", exact: true }).click();
    await page.getByRole("link", { name: "Foto de referencia", exact: true }).click();
    await expect(page.locator("#creditos")).toBeInViewport();
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Inicio", exact: true }).click();
    await page.getByRole("link", { name: "Mi perfil", exact: true }).click();
    await expect(page).toHaveURL("/demo/arbitro/yo");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.goto("/");
    await account.click();
    await expect(page).toHaveURL("/ingresar");
    expect(errors).toEqual([]);
  });
}
