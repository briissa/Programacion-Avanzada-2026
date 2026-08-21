// ----  ESTO ES LO QUE YO ANOTE DE LA CLASE ---- 


// arreglos 
const numero = [1, 2, 3, 4, 5];

console.log(numero);


// si quiero ver los arrgelos separados, lo vemos mejor en el js 
// hay un metodo length que con el vemos la cantidad de elementos que tiene el arreglo 

// en otro ejemplo si queremos ver un carrito de compras 

const carrito = [ 
    {nombre: 'camisa', precio: 20},
    {nombre: 'pantalon', precio: 30},
    {nombre: 'zapatos', precio: 50}
]; 

// creo un array y luego lo que contiene es un objeto, y dentro de ese objeto hay dos 
// propiedades que son --> nombre y precio. 



//otro ejemplo de lo que hace  -- METODO CONCAT -- que es para concatenar arreglos.
const carrito1 = [producto1, producto2, producto3];
const carrito2 = [producto4, producto5, producto6];

const carrito3 = carrito1.concat(carrito2);
// este concat es lo que hace que se concatenen las dos cosas, osea los dos carritos y 
//luego se guarden en un nuevo arreglo que es el carrito3.


// CONCATENACION CON SPREAD OPERATOR
const carrito1 = [producto1, producto2, producto3];
const carrito2 = [producto4, producto5, producto6];

const carrito3 = [...carrito1, ...carrito2];



// lo que vamos a ir haciendo es refrescando un poco todos los conceptos que vimos anteriormente. 
//javascrit es debilmente tipado --> esto lo que hace es que podamos crear variables y demas sin tanto problema 
//declarar variables con let o var 
// let nombre = "juan"; 

// - para ver si es mayor de edad/ comparacion- 
// let esmayordeedad = edad >= 18; 

// - para contantes que nunca cambian - 
    const pi = 3.14; 
    const 
// 


// - para imprimir variables - 
// console.log(nombre);
// console.log('es mayor de edad: ' + esmayordeedad);



// - para concatenar templates string - 
// console.log(`hola ${nombre} tu edad es ${edad} y es mayor de edad: ${esmayordeedad}`);
//--> este es mas utilizado que concatenar con el simbolo +, este template string solo declaramos las variables 
//dentro de ${} y se imprimen automaticamente, llamando a cada una de las variables que yo ubique ahi dentro .
//

// DATO IMPORTANTE 
// todo lo que se encuentra en la paginahtml, en donde entramos en herramietas o codigo, 
// vamos a console, despues donde dice WINDOW, ahi vamos a poder ver todo lo que imprime.



// function declaration 

function myFunction() {
  // function body
    return "Hello, World!";
}

// otro ejemplo de funcion seria: 
function saludar (nombre) {
    console.log (hola ) 

}

saludar ('juan');
saludar ('brisa');
saludar ('lucas');


//function expression
const saludar = function(nombre) {
    console.log(`hola, ${nombre}!`);
};



// function arrow 
const saludar = (nombre) => {
    console.log (`hola, ${nombre}`);
}


//funciones con parametros por defecto 
// los parametros son funiciones primitivas, objetos o variables. tambien puede ser otra funcion. 
// const actividad = (nombre , rol ) => 


// parametros por default de las funciones 
const atividad = (nombre, rol = 'estudiante') => {
    console.log(`la persona ${nombre}, tiene el rol de ${rol}`);
} 
