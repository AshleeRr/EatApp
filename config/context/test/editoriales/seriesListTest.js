import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

describe("Pruebas Eliminar Serie", function () {
  let driver;
  this.timeout(20000);

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:3000/series/index");
  });

  after(async () => {
    await driver.quit();
  });

  it("Eliminar la primera serie", async () => {
    await driver.wait(until.elementLocated(By.css("button.btn-danger")), 5000);
    const primerTitulo = await driver
      .findElement(By.css(".card-title"))
      .getText();
    await driver.findElement(By.css("button.btn-danger")).click();

    try {
      await driver.switchTo().alert().accept();
    } catch (e) {}

    await driver.wait(async () => {
      const textos = await driver.findElements(By.css(".card-title"));
      for (let t of textos) {
        const texto = await t.getText();
        if (texto === primerTitulo) return false;
      }
      return true;
    }, 5000);

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    expect(bodyText).to.not.include(primerTitulo);
  });

  it("Cancelar eliminación", async () => {
    await driver.get("http://localhost:3000/series/index");
    await driver.wait(until.elementLocated(By.css("button.btn-danger")), 5000);
    const primerTitulo = await driver
      .findElement(By.css(".card-title"))
      .getText();

    let alert = await driver.switchTo().alert();
    await alert.dismiss();

    await driver.findElement(By.css("button.btn-danger")).click();
    await driver.switchTo().alert().dismiss();

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    expect(bodyText).to.include(primerTitulo);
  });
});
