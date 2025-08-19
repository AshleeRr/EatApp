import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

describe("Pruebas Editar Serie", function () {
  let driver;
  this.timeout(20000);

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();

    await driver.get("http://localhost:3000/series/index");
  });

  after(async () => {
    await driver.quit();
  });

  it("Editar una serie existente", async () => {
    await driver.wait(until.elementLocated(By.css("a.btn-warning")), 5000);
    await driver.findElement(By.css("a.btn-warning")).click();

    await driver.wait(until.urlContains("/series/edit"), 5000);

    const nombreInput = await driver.findElement(By.id("NombreSerie"));
    await nombreInput.clear();
    await nombreInput.sendKeys("Serie Editada Selenium");

    await driver.findElement(By.css("button.btn-success")).click();

    await driver.wait(until.urlContains("/series/index"), 5000);

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    expect(bodyText).to.include("Serie Editada Selenium");
  });

  it("Intentar editar dejando campos vacíos", async () => {
    await driver.get("http://localhost:3000/series/index");
    await driver.wait(until.elementLocated(By.css("a.btn-warning")), 5000);
    await driver.findElement(By.css("a.btn-warning")).click();
    await driver.wait(until.urlContains("/series/edit"), 5000);

    const nombreInput = await driver.findElement(By.id("NombreSerie"));
    await nombreInput.clear();

    await driver.findElement(By.css("button.btn-success")).click();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("/series/edit");
  });

  it("Editar con nombre muy largo", async () => {
    await driver.get("http://localhost:3000/series/index");
    await driver.wait(until.elementLocated(By.css("a.btn-warning")), 5000);
    await driver.findElement(By.css("a.btn-warning")).click();
    await driver.wait(until.urlContains("/series/edit"), 5000);

    const nombreInput = await driver.findElement(By.id("NombreSerie"));
    await nombreInput.clear();
    await nombreInput.sendKeys("A".repeat(255));

    await driver.findElement(By.css("button.btn-success")).click();

    await driver.wait(until.urlContains("/series/index"), 5000);
    const bodyText = await driver.findElement(By.tagName("body")).getText();
    expect(bodyText).to.include("A".repeat(255));
  });
});
