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
  await expect(page).toHaveURL(/\/demo\/arbitro$/);
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
  await expect(page).toHaveURL(/\/demo\/arbitro$/);
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
});
