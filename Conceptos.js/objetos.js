//objetos literales 

const producto = {
    nombre: 'tablet',  // la estrctua es nombre : valor 
    precio: 500,
    disponible: true

}   
console.log (producto) 
// cuando lo reproducimos con el html (index) vamos a ver en pantalla que dice >objeto 

//Podemos extraer un solo atributo de este objeto. 

//objeto con constructor 
const producto2 = new Object()
  producto2.nombre = 'laptop'
  producto2.precio = 800
  producto2.disponible = true

console.log(producto2)

//Para extraer un atributo en particular es producto.nombre --> procuto.atributo 
console.log(producto.nombre)
