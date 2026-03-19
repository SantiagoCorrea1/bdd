const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');

// --- CLASE DE APOYO (Lógica de la Aplicación) ---
class Carrito {
  constructor() {
    this.items = [];
    this.inventario = {};
    this.error = null;
  }

  agregar(nombre, cantidad) {
    const prod = this.inventario[nombre];
    if (cantidad > prod.stock) {
      this.error = "Stock insuficiente";
      return;
    }
    this.items.push({ nombre, cantidad, precio: prod.precio });
    prod.stock -= cantidad;
  }

  eliminar(nombre) {
    this.items = this.items.filter(i => i.nombre !== nombre);
  }

  obtenerTotal() {
    let total = this.items.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);
    const totalArticulos = this.items.reduce((sum, i) => sum + i.cantidad, 0);
    if (totalArticulos >= 5) total *= 0.9;
    return total;
  }
}

let app;

// ─── HOOKS ────────────────────────────────────────────────────────────────────

Before(() => {
  app = new Carrito();
});

// ─── GIVEN ────────────────────────────────────────────────────────────────────

Given('un inventario con {string} a {int} USD y {int} unidades disponibles', (nombre, precio, stock) => {
  app.inventario[nombre] = { precio, stock };
});

Given('que ya tengo {int} {string} en el carrito', (cantidad, nombre) => {
  app.agregar(nombre, cantidad);
});

// ─── WHEN ─────────────────────────────────────────────────────────────────────

When('agrego {int} unidad de {string} al carrito', (cantidad, nombre) => {
  app.agregar(nombre, cantidad);
});

When('agrego {int} unidades de {string} al carrito', (cantidad, nombre) => {
  app.agregar(nombre, cantidad);
});

When('elimino la {string} del carrito', (nombre) => {
  app.eliminar(nombre);
});

// ─── THEN ─────────────────────────────────────────────────────────────────────

Then('el total del carrito debería ser {int} USD', (esperado) => {
  assert.strictEqual(app.obtenerTotal(), esperado);
});

Then('el inventario de {string} debería ser {int}', (nombre, stockEsperado) => {
  assert.strictEqual(app.inventario[nombre].stock, stockEsperado);
});

Then('debería recibir un error de {string}', (mensajeEsperado) => {
  assert.strictEqual(app.error, mensajeEsperado);
});

Then('el carrito debería estar vacío', () => {
  assert.strictEqual(app.items.length, 0);
});

Then(/^el total debería tener un 10% de descuento \((\d+) USD\)$/, (esperado) => {
  assert.strictEqual(app.obtenerTotal(), Number(esperado));
});