import {test,expect} from "@playwright/test";
const root="/demo/arbitro/fisico";
test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
test("navegación y catálogo físico",async({page})=>{
 await page.goto(root);
 await expect(page.getByRole("heading",{name:"Preparación física"})).toBeVisible();
 await page.getByRole("link",{name:/Entrenar/}).last().click();
 await expect(page.getByRole("heading",{name:"Entrenar"})).toBeVisible();
 await page.getByRole("button",{name:"Velocidad"}).click();
 await expect(page.getByText("Sprints cortos")).toBeVisible();
 await page.getByText("Sprints cortos").click();
 await expect(page.getByRole("heading",{name:"Sprints cortos"})).toBeVisible();
 await expect(page.getByText("Cómo hacerlo")).toBeVisible();
});
test("cronómetro inicia, pausa, reanuda y finaliza",async({page})=>{
 page.on("dialog",dialog=>dialog.accept());
 await page.goto(root+"/sesion-ejemplo?ejercicio=sprints");
 await expect(page.getByLabel("Tiempo transcurrido")).toHaveText("00:00");
 await page.getByRole("button",{name:"Comenzar"}).click();
 await expect(page.getByRole("button",{name:"Pausar"})).toBeVisible();
 await page.waitForTimeout(1200);
 await page.getByRole("button",{name:"Pausar"}).click();
 const stopped=await page.getByLabel("Tiempo transcurrido").textContent();
 await page.waitForTimeout(1200);
 await expect(page.getByLabel("Tiempo transcurrido")).toHaveText(stopped??"");
 await page.getByRole("button",{name:"Reanudar"}).click();
 await page.getByRole("button",{name:"Detener"}).click();
 await expect(page.getByText("Resumen de sesión")).toBeVisible();
});
