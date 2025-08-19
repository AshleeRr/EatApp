import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

describe("Tests con login previo", function () {
  let driver;
  this.timeout(30000);

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:3000/login");
    await driver
      .findElement(By.name("email"))
      .sendKeys("evanazarethgonzalezvelasco1@gmail.com");
    await driver.findElement(By.name("password")).sendKeys("123456789");
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains("/home"), 5000);
  });

  beforeEach(async () => {
    await driver.get("http://localhost:3000/series/index");
    await driver.get("http://localhost:3000/series/create");
  });

  after(async () => {
    await driver.quit();
  });

  it("serie con datos válidos", async () => {
    // Navegación ya realizada en beforeEach

    await driver
      .findElement(By.id("ImagenSerie"))
      .sendKeys(
        "https://img.wattpad.com/30b2d42186beadedb90187c3dda388b3a2e37086/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f543242334c6771327652445255773d3d2d3330313038353936302e313436636165626130316530333765313335383633353730343339372e6a7067?s=fit&w=720&h=720"
      );
    await driver
      .findElement(By.id("NombreSerie"))
      .sendKeys("Serie Test Selenium");
    await driver
      .findElement(By.id("linkSerie"))
      .sendKeys(
        "https://www.youtube.com/watch?v=Amua77AR3Pc&list=RDAmua77AR3Pc&start_radio=1"
      );

    const generoSelect = await driver.findElement(By.id("GeneroSerie"));
    await generoSelect.click();

    const opciones = await generoSelect.findElements(By.tagName("option"));
    if (opciones.length < 2) throw new Error("No hay géneros para seleccionar");
    await opciones[1].click();

    await driver.findElement(By.css("button.btn-success")).click();

    await driver.wait(until.urlContains("/series/index"), 5000);

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    expect(bodyText).to.include("Serie Test Selenium");
  });

  it("Campos vacios", async () => {
    // Navegación ya realizada en beforeEach

    await driver.findElement(By.css("button.btn-success")).click();

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("/series/create");
  });

  it("Nombre muy largo", async () => {
    // Navegación ya realizada en beforeEach

    await driver
      .findElement(By.id("ImagenSerie"))
      .sendKeys(
        "https://img.wattpad.com/30b2d42186beadedb90187c3dda388b3a2e37086/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f543242334c6771327652445255773d3d2d3330313038353936302e313436636165626130316530333765313335383633353730343339372e6a7067?s=fit&w=720&h=720"
      );
    await driver.findElement(By.id("NombreSerie")).sendKeys("A".repeat(255));
    await driver
      .findElement(By.id("linkSerie"))
      .sendKeys(
        "https://www.youtube.com/watch?v=Amua77AR3Pc&list=RDAmua77AR3Pc&start_radio=1"
      );

    const generoSelect = await driver.findElement(By.id("GeneroSerie"));
    await generoSelect.click();
    const opciones = await generoSelect.findElements(By.tagName("option"));
    if (opciones.length < 2) throw new Error("No hay géneros para seleccionar");
    await opciones[1].click();

    await driver.findElement(By.css("button.btn-success")).click();

    await driver.wait(until.urlContains("/series/index"), 5000);

    const bodyText = await driver.findElement(By.tagName("body")).getText();
    expect(bodyText).to.include("A".repeat(255));
  });
});
