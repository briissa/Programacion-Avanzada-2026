// Funcion suma
function sumar(a, b) {
  return a + b;
}

console.log(sumar(2, 3));
console.log(sumar(10, -5));
console.log(sumar(0, 0));




// Funcion que multiplica
function multiplicar(a, b) {
  return a * b;
}

console.log(multiplicar(4, 5));
console.log(multiplicar(-2, 3));
console.log(multiplicar(0, 7));




// Funcion con parametro por defecto
function saludar(nombre = "Invitado") {
  return `Hola, ${nombre}`;
}

console.log(saludar("Ana"));
console.log(saludar());




// Funcion que devuelve un objeto
function crearPersona(nombre, edad) {
  return {
    nombre: nombre,
    edad: edad
  };
}

const persona1 = crearPersona("Carlos", 28);
console.log(persona1);




// Funcion que modifica un objeto
function actualizarEdad(persona, nuevaEdad) {
  persona.edad = nuevaEdad;
}

actualizarEdad(persona1, 29);
console.log(persona1);




// Funcion recursiva
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log(factorial(5));
console.log(factorial(0));
console.log(factorial(7));




// Funcion con funcion interna
function despedir() {
  function adios() {
    return "Adiós, que tengas un buen día";
  }
  return adios();
}

console.log(despedir());




// Funcion que usa otra funcion
function procesarArray(array, funcion) {
  return array.map(funcion);
}

function multiplicarPorDos(numero) {
  return numero * 2;
}

const numeros = [1, 2, 3, 4, 5];
const resultado = procesarArray(numeros, multiplicarPorDos);

console.log(resultado);