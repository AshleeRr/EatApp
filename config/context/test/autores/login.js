import { Builder, By, until } from "selenium-webdriver";
import { expect } from "chai";

describe("Login en web app", function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("http://localhost:3000/login");
  });

  after(async function () {
    await driver.quit();
  });

  it("Camino Feliz Correo correcto", async function () {
    await driver
      .findElement(By.id("email"))
      .sendKeys("evanazarethgonzalezvelasco1@gmail.com");
    await driver.sleep(700);
    await driver.findElement(By.id("password")).sendKeys("123456789");
    await driver.sleep(700);
    await driver.findElement(By.id("btn-login")).click();
    await driver.sleep(1200);
    await driver.wait(until.urlContains("/"), 5000);
    await driver.sleep(700);
    const bienvenida = await driver.findElement(By.id("bienvenida")).getText();
    expect(bienvenida.toLowerCase()).to.include("animes");
  });

  it("Prueba Negativa Correo incorrecto", async function () {
    await driver.get("http://localhost:3000/login");
    await driver.sleep(700);
    await driver.findElement(By.id("email")).sendKeys("xxx@gmail.com");
    await driver.sleep(700);
    await driver.findElement(By.id("password")).sendKeys("xxxx");
    await driver.sleep(700);
    await driver.findElement(By.id("btn-login")).click();
    await driver.sleep(1200);
    const error = await driver.findElement(By.id("error-msg")).getText();
    expect(error.toLowerCase()).to.include("credenciales");
  });

  it("Prueba de Límites - Correo muy largo", async function () {
    await driver.get("http://localhost:3000/login");
    await driver.sleep(700);
    await driver
      .findElement(By.id("email"))
      .sendKeys("a".repeat(255) + "@gmail.com");
    await driver.sleep(700);
    await driver.findElement(By.id("password")).sendKeys("1234");
    await driver.sleep(700);
    await driver.findElement(By.id("btn-login")).click();
    await driver.sleep(1200);
    const error = await driver.findElement(By.id("error-msg")).getText();
    expect(error.toLowerCase()).to.include("error");
  });
});
