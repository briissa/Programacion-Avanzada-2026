// Creacion de un objeto basico 
const libro = {
  titulo: "Cien años de soledad",
  autor: "Gabriel García Márquez",
  añoDePublicacion: 1967
};

console.log("--- Ejercicio 1 ---");
console.log(libro.titulo);
console.log(libro.autor);
console.log(libro.añoDePublicacion);




//Anidacion de objetos 
const estudiante = {
  nombre: "Juan Pérez",
  edad: 21,
  direccion: {
    calle: "lucilo lopez",
    ciudad: "concepcion del uruguay",
    pais: "Argentina"
  }
};
 
console.log(
  `${estudiante.direccion.calle}, ${estudiante.direccion.ciudad}, ${estudiante.direccion.pais}`
);





//  Metodos de objetos  --> agregamos el metodo descripcion al objeto libro

libro.descripcion = function () {
  return `${this.titulo} fue escrito por ${this.autor}`;
};
 
console.log(libro.descripcion());




// Iteración sobre Propiedades de un Objeto 
const producto = {
  nombre: "Notebook",
  precio: 1200,
  disponible: true
};
 
for (const clave in producto) {
  console.log(`${clave}: ${producto[clave]}`);
}



//Actualizacion de propiedades de un objeto  --> cambiamos el precio del producto
console.log("Antes:", producto);
 
producto.precio = 1500;
 
console.log("Después:", producto);




//comprobacion de propiedad de un objeto  --> verificamos si el objeto producto tiene la propiedad "precio" y "descuento"   
function tienePropiedad(obj, prop) {
  return obj.hasOwnProperty(prop);
}
 
console.log(tienePropiedad(producto, "precio"));    // true
console.log(tienePropiedad(producto, "descuento"));  // false



//Combinar objetos  --> combinamos dos objetos en uno solo
const persona1 = { nombre: "Ana", edad: 30 };
const persona2 = { ciudad: "Córdoba", pais: "Argentina" };
 
const personaCombinada = Object.assign({}, persona1, persona2);

console.log(personaCombinada);





//Copiarobjetos  --> creamos una copia del objeto estudiante y modificamos la copia sin afectar al original
const copiaEstudiante = JSON.parse(JSON.stringify(estudiante));
 
// Modificamos la copia
copiaEstudiante.direccion.ciudad = "Buenos Aires";
 
//mostramos los resultados
console.log("Original:", estudiante.direccion.ciudad);   // No cambia
console.log("Copia:", copiaEstudiante.direccion.ciudad); // Cambia
 






// Metodos GETTERS Y SETERS --> creamos un objeto con propiedades privadas y metodos getter y setter para acceder a ellas
const libroConGetSet = {
  titulo: "1984",
  autor: "George Orwell",
  _añoDePublicacion: 1949,
 
  get añoDePublicacion() {
    return this._añoDePublicacion;
  },
 
  set añoDePublicacion(nuevoAño) {
    this._añoDePublicacion = nuevoAño;
  }
};
 
//mostramos los resultados
console.log("Año original:", libroConGetSet.añoDePublicacion);
 
libroConGetSet.añoDePublicacion = 2003; // usa el setter
 
console.log("Año actualizado:", libroConGetSet.añoDePublicacion); // usa el getter