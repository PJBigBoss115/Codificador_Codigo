var regex = XRegExp('(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})');
var text = 'Fecha: 2023-05-16';
var match = XRegExp.exec(text, regex);

console.log(match[1]);  // Resultado: 2023 (grupo 1 - año)
console.log(match[2]);  // Resultado: 05 (grupo 2 - mes)
console.log(match[3]);  // Resultado: 16 (grupo 3 - día)

var regex = XRegExp('^(perro|gato|conejo)$');

// Ejemplos de cadenas que cumplen con la expresión regular
console.log(regex.test('perro'));   // Resultado: true
console.log(regex.test('gato'));    // Resultado: true
console.log(regex.test('conejo'));  // Resultado: true

// Ejemplos de cadenas que no cumplen con la expresión regular
console.log(regex.test('pato'));    // Resultado: false
console.log(regex.test('ratón'));   // Resultado: false
console.log(regex.test('perro '));  // Resultado: false