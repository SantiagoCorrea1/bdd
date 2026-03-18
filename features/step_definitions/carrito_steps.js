const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');

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

Before(() => { app = new Carrito(); });

Given('un inventario con {string} a {int} USD y {int} unidades disponibles', (nombre, precio, stock) => {
app.inventario[nombre] = { precio, stock };
});

Given('que ya tengo {int} {string} en el carrito', (cant, nombre) => {
app.agregar(nombre, cant);
});

When('agrego {int} unidad(es) de {string} al carrito', (cant, nombre) => {
app.agregar(nombre, cant);
});

When('elimino la {string} del carrito', (nombre) => {
app.eliminar(nombre);
});

Then('el total del carrito debería ser {int} USD', (esperado) => {
assert.strictEqual(app.obtenerTotal(), esperado);
});

Then('el inventario de {string} debería ser {int}', (nombre, esperado) => {
assert.strictEqual(app.inventario[nombre].stock, esperado);
});

Then('debería recibir un error de {string}', (msg) => {
assert.strictEqual(app.error, msg);
});

Then('el carrito debería estar vacío', () => {
assert.strictEqual(app.items.length, 0);
});

Then(/^el total debería tener un (\d+)% de descuento \((\d+) USD\)$/, function (porcentaje, esperado) {
assert.strictEqual(app.obtenerTotal(), Number(esperado));
});