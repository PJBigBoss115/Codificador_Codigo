//Definir expresiones regulares
/*
Palabras de sistema
*/
var palabraSistema = XRegExp('^_(if|else|for|while|return|class|public|main|int|string|double|bool|return|void|imprime)$');
/*
Identificadores
*/
var identificador = XRegExp('^(?!if$|imprime$|else$|for$|while$|return$|class$|public$|main$|int$|string$|double$|bool$|void$)[a-z][A-Za-z0-9]*$');
/*
Signos
*/
var signo = XRegExp('^[+=*/<>!|&-]{1,2}$');
/*
Literales
*/
var literal = XRegExp('^-?\\d+\\.?\\d*|".*"|true|false$');
/*
Separadores
*/
var separador = XRegExp('^[().;{}\\[\\]]$');
/*
Comentarios
*/
var comentario = XRegExp('^-->(.|\\s)*<--$');

//Otras variables
//Boton
const copilar = document.querySelector('#copilar_');
//Salida, Tabla, Problemas
var salida = document.getElementById('textarea1');
var problemas = document.getElementById('textarea2');
//Extrae el codigo
var codigo = "";
var codigo_2 = "";
//Extrae los comentarios
var extComentarios = "";
//Numeradores
var pS = 0;
var iD = 0;
var sG = 0;
var lR = 0;
var sP = 0;
//Formato del los numeradores
var formato;

//Arrays id con estructura set
var arrayId = new Set();
var tipoDato = [];
var valores = [];

//Iniciamos una variable array para ir pasando los datos
var resultado = [];

//Variable para pasar id a el array
var temporal = "";

//Arrays de las expresiones regulares
var expresiones = [palabraSistema, identificador, signo, literal, separador, comentario];

//Al presionar el boton copilar llamaremos a la funcion analizarTexto
copilar.addEventListener('click', analizarTexto);

//Funcion para traer datos del Textarea
function analizarTexto() {
  pS = 0;
  iD = 0;
  sG = 0;
  lR = 0;
  sP = 0;
  codigo_2 = "";
  //Pasamos el campo a una variable
  codigo = document.getElementById("editor");
  //Evaluamos lo que esta en el campo como texto y lo pasamos a la variable texto
  var texto = codigo.value.trim();
  //Por medio del texto que es una cadena larga mediante los spacios y saltos de lineas
  //tomaremos palabras por palabras esto en un array 
  var palabras = texto.split(/\s+/);
  //Iniciamos una variable array para ir pasando los datos
  resultado = [];
  // Variable para controlar si se encuentra una subcadena activa
  var subcadenaActiva = false;
  //Vamos pasando los datos segun el array
  for (var i = 0; i < palabras.length; i++) {
    //Pasamos segun la posicion del arrays
    var palabra = palabras[i].trim();
    //Inicio
  //Si esta activo estamos copiando un comentario
  if (subcadenaActiva) {
    if (palabra.endsWith("<--") || palabra.endsWith('"')) {
      extComentarios += palabra;
      //Metemos el comentario al array
      resultado.push(extComentarios);
      //Y reiniciamos la variable
      subcadenaActiva = false;
      if(palabra.endsWith('"')) {
        salida.value += extComentarios;
      }
    } else {
      //Vamos concatenando palabra por palabra
      extComentarios += palabra + " ";
      //Si llegamos al final
    }
    //Si encontramos la subcadena "-->" se significa
    //que encontramos un comentario
  } else if (palabra.startsWith("-->") || palabra.startsWith('"')) {
    //Vaciamos la variable conmentario
    extComentarios = "";
    //Concatenamos
    extComentarios += palabra + " ";
    //He iniciamos conpiar un comentario (SubcadenaActiva = true)
    subcadenaActiva = true;
    //Si no se cumple nada de lo anterior estamos de manera normal
  } else {
    if (palabra !== '') {
      analizarPalabra(palabra);
      //Segun va encontrado se va agregando
      // Muestra el código ya procesado normalmente
      salida.value += palabra;
      codigo_2 += palabra;
    }
  }
  }

  //Analizador de lexemas Inicia en este punto <----------- Aqui iniciamos a analizar
  //Damos un espacio entre la salida de datos
  salida.value += "\n\n";
  //Vamos a recorrer el dato por medio de un for
  for(var i = 0; i < resultado.length; i++) {
    //Lo pasamos a una variable para poder analiarlo con las
    //expresiones regulares
    var palabra = resultado[i];
    //console.log(palabra + "\n"); <----------------------------Esto veia que estoy
    //Evaluando...!
    //Otro for que nos ayuda a pasar por cada una de las
    //expresiones regulares
    for(var j = 0; j < expresiones.length; j++) {
      //segun sea la expresion vamos a evaluar
      var expresion = expresiones[j];
      //Si se cumple tomara el valor de true si no false
      var match = XRegExp.exec(palabra, expresion);
      //Preguntamos
      if (match) {
        //No se debe de procesar los comentarios
        if(j != (expresiones.length-1)) {
          //Imprimimos el lexema
          salida.value += palabra + "\t";
          temporal = palabra;
          //Y clasificamos el codigo y contamos
          encontrarCategorias(j);
          //Interumpimos el ciclo
        }
        break;
      }
      //Detectar errores
      if(j == (expresiones.length-1)) {
        problemas.value += "cadena no reconocido: " + palabra;
      }
    }
  }
  valorDeclarado(codigo_2);
  crearTabla();
}

function analizarPalabra(palabra) {
  var cadena = "";

  if(esNumeroEntero(palabra)) {
    resultado.push(palabra);
    //console.log("NumeroEntero " + palabra);

  } else if(esNumeroDecimal(palabra)) {
    resultado.push(palabra);
    //console.log("NumeroDecimal " + palabra);
  } else {

    for (var i = 0; i < palabra.length; i++) {
      var caracter = palabra[i];
  
      if (XRegExp('\\(|\\)|\\.|;|\\{|\\}|\\[|\\]').test(caracter)) {
        resultado.push(caracter);
        //console.log("Simbolo " + caracter);
        if(i == (palabra.length-1)) {
          break;
        }
      } else if (XRegExp('\\d').test(caracter)) {
        resultado.push(caracter);
      } else if(caracter === '-' || caracter === '"') {
        resultado.push(comentarioString(palabra));
        break;
      } else {
        cadena += caracter;
      }
    }
    if(i == palabra.length) {
      resultado.push(cadena);
      //console.log("Cadena " + cadena);
    }
  }
}

function comentarioString(palabra) {
  // Variable para controlar si se encuentra una subcadena activa
  var subcadenaActiva = false;

  for (var i = 0; i < palabra.length; i++) {
    var caracter = palabra[i];
    extComentarios += caracter;
  }
  //Inicio
  //Si esta activo estamos copiando un comentario
  if (subcadenaActiva) {
    if (palabra.endsWith("<--") || palabra.endsWith('"')) {
      extComentarios += palabra;
      //Metemos el comentario al array
      resultado.push(extComentarios);
      //Y reiniciamos la variable
      subcadenaActiva = false;
      if(palabra.endsWith('"')) {
        salida.value += extComentarios;
      }
    } else {
      //Vamos concatenando palabra por palabra
      extComentarios += palabra + " ";
      //Si llegamos al final
    }
    //Si encontramos la subcadena "-->" se significa
    //que encontramos un comentario
  } else if (palabra.startsWith("-->") || palabra.startsWith('"')) {
    //Vaciamos la variable conmentario
    extComentarios = "";
    //Concatenamos
    extComentarios += palabra + " ";
    //He iniciamos conpiar un comentario (SubcadenaActiva = true)
    subcadenaActiva = true;
    //Si no se cumple nada de lo anterior estamos de manera normal
  }

  return extComentarios;
}

function esNumeroDecimal(cadena) {
  //Verificar si la cadena contiene solo caracteres numéricos y un único punto decimal
  if (/^\d+(\.\d+)?$/.test(cadena)) {
    return !isNaN(parseFloat(cadena));
  }
  return false;
}

function esNumeroEntero(cadena) {
  //Verificar si la cadena contiene solo caracteres numéricos
  if (/^\d+$/.test(cadena)) {
    return !isNaN(parseInt(cadena));
  }
  return false;
}

function encontrarCategorias(categoria) {
  //Imprimimos los datos de la categoria
  //En cada uno de los campos vamos a darle un formato a lo que
  //vamos a ir imprimiendo
  switch(categoria) {
    case 0:
      pS += 1;
      formato = pS.toString().padStart(3, 0);
      salida.value += "100\t";
      salida.value += formato + "\n";

      controlaDeclaraciones(temporal);
    break;

    case 1:
      //AQUI VAMOS IR AGREGANDO AL ARRAY PARA VER SI YA EXISTE
      //ADEMAS DE IR IMPRIMIENDO EN LA TABLA DE VALORES
      controladorId();
    break;

    case 2:
      sG += 1;
      formato = sG.toString().padStart(3, 0);
      salida.value += "300\t";
      salida.value += formato + "\n"; 
    break;

    case 3:
      lR += 1;
      formato = lR.toString().padStart(3, 0);
      salida.value += "400\t";
      salida.value += formato + "\n"; 
    break;

    case 4:
      sP += 1;
      formato = sP.toString().padStart(3, 0);
      salida.value += "500\t";
      salida.value += formato + "\n"; 
    break;

    default:
      console.log("El número no coincide con ningún caso");
      console.log(categoria);
    break;
  }
}

//Funcion que gestiona los id
function controladorId() {
  //Primero preguntamos si ya existe el id en el array
  if(arrayId.has(temporal)) {
    //Si existe lo convertimos en array ya que estamos usando
    //la estructura set
    var miArray = Array.from(arrayId);
    //Elemento es lo que buscamos y eso es la variable temporal
    var elemento = temporal;
    //Y buscamos la posicion
    var posicion = miArray.indexOf(elemento);
    //Le sumamos 1 para tener el numero que lo identifica
    posicion = posicion + 1;
    //Formateamos como lo siempre
    salida.value += "200\t";
    //Le pasamos al formato la posicion 
    formato = posicion.toString().padStart(3, 0);
    //Mostramos
    salida.value += formato + "\n"; 
  } else {
    //Si no existe se hace el proceso normal
    //Sumamos
    iD += 1;
    //Enviamos al array
    arrayId.add(temporal);
    //mostramos el formato
    formato = iD.toString().padStart(3, 0);
    salida.value += "200\t";
    salida.value += formato + "\n"; 
  }
}

//Funcion para manejar los tipos de datos
function controlaDeclaraciones(declaracion) {
  //expresion regular que maneja los tipos de datos
  var tipo = XRegExp('^_(int|string|double|bool)$');
  //Si el valor es admitido es agregado a la tabla
  if(tipo.test(declaracion)) {
    tipoDato.push(declaracion);
  }
}

//Funcion para extraer valores declarados
function valorDeclarado(cadena) {
  //Expresion de literales
  var declaracion = /=(\d+\.?\d*|"[^"]*"|true|false)/g;
  var match;
  //Siempre que el valor coincida sera agregado a la tabla
  while ((match = declaracion.exec(cadena)) !== null) {
    valores.push(match[1]);
  }
}

//Crear tabla de variables
function crearTabla() {
  //Variable donde se inyectara el HTML
  var tablaContainer = document.getElementById("tab2");

  // Crear la tabla
  var tabla = document.createElement("table");

  // Agregar el encabezado
  var cabecera = tabla.createTHead();
  var filaCabecera = cabecera.insertRow();

  var encabezado = document.createElement("th");
  encabezado.textContent = "Id";
  filaCabecera.appendChild(encabezado);

  encabezado = document.createElement("th");
  encabezado.textContent = "Tipo";
  filaCabecera.appendChild(encabezado);

  encabezado = document.createElement("th");
  encabezado.textContent = "Valor";
  filaCabecera.appendChild(encabezado);

  encabezado = document.createElement("th");
  encabezado.textContent = "Incidencia";
  filaCabecera.appendChild(encabezado);
  //Finaliza agregar el encabezado
  
  // Crear las filas y celdas de los datos
  var miArray = Array.from(arrayId);
  //Cuerpo de la tabla
  var cuerpo = tabla.createTBody();
  //Segun la cantidad de variables sera la cantidad
  //de filas
  for (var i = 0; i < miArray.length; i++) {
    //Lo vamos creando
    var fila = cuerpo.insertRow();
    //Y agregadondo los datos correspondientes
    var celda = fila.insertCell();
    celda.textContent = miArray[i];

    celda = fila.insertCell();
    celda.textContent = tipoDato[i];

    celda = fila.insertCell();
    celda.textContent = valores[i];

    celda = fila.insertCell();
    celda.textContent = (i+1).toString().padStart(3, 0);
    //Finaliza agregar datos
  }

  // Agregar la tabla al contenedor
  tablaContainer.appendChild(tabla);
}