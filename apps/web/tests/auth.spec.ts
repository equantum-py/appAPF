import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const fixture = JSON.parse(readFileSync("/tmp/apf-e03-browser.json", "utf8"));
test("Supabase Auth login, protected API scope, refresh and local logout", async ({ page, request }) => {
  let bearer = "";
  page.on("request", event => {
    if (event.url().endsWith("/v1/me/memberships")) bearer = event.headers()["authorization"] ?? "";
  });
  await page.goto("/app");
  await expect(page).toHaveURL(/\/ingresar$/);
  await page.getByLabel("Correo electrónico").fill(fixture.email);
  await page.getByLabel("Contraseña").fill(fixture.password);
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tu espacio" })).toBeVisible();
  await expect(page.getByText("Tu acceso fue verificado.")).toBeVisible();
  await expect(page.getByText(fixture.organization_name, { exact: true })).toBeVisible();
  expect(bearer.startsWith("Bearer ")).toBeTruthy();
  const denied = await request.get(`http://127.0.0.1:18000/v1/organizations/${fixture.other_organization}/access`, {
    headers: { Authorization: bearer },
  });
  expect(denied.status()).toBe(403);
  const anonymous = await request.get("http://127.0.0.1:18000/v1/me");
  expect(anonymous.status()).toBe(401);
  await page.reload();
  await expect(page.getByText("Tu acceso fue verificado.")).toBeVisible();
  await page.screenshot({ path: "../../ci-evidence/auth-account.png", fullPage: true });
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/ingresar$/);
  await page.goto("/app");
  await expect(page).toHaveURL(/\/ingresar$/);
});
