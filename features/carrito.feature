Feature: Gestión del Carrito de Compras

Background:
    Given un inventario con "Camiseta" a 20 USD y 5 unidades disponibles

Scenario: Agregar un producto existente
    When agrego 1 unidad de "Camiseta" al carrito
    Then el total del carrito debería ser 20 USD

Scenario: Agregar múltiples unidades del mismo producto
    When agrego 2 unidades de "Camiseta" al carrito
    Then el total del carrito debería ser 40 USD
    And el inventario de "Camiseta" debería ser 3

Scenario: Intentar agregar más unidades de las disponibles
    When agrego 10 unidades de "Camiseta" al carrito
    Then debería recibir un error de "Stock insuficiente"
    And el carrito debería estar vacío

Scenario: Eliminar un producto del carrito
    Given que ya tengo 1 "Camiseta" en el carrito
    When elimino la "Camiseta" del carrito
    Then el total del carrito debería ser 0 USD

Scenario: Aplicar un descuento automático por volumen
    When agrego 5 unidades de "Camiseta" al carrito
    Then el total debería tener un 10% de descuento (90 USD)