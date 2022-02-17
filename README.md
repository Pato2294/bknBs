# Ejercicio

Este ejercicio consiste en construir una tienda online que despliegue productos agrupados por la categoría a la que pertenecen, generando por separado backend (API REST) y frontend(aplicación que la consuma) y utilizando la base de datos que se disponibiliza para
su desarrollo.

# Requisitos

- Conociemientos basicos de git(crear ,actualizar repositorios).
- Conocimietos basicos de Nodejs, Express y Cors.
- Conociemientos basicos de ECMAScript 6(ES6).
- Editor de codigo(Visual Studio Code, SublimeText,NotePad++,etc.).
- Tener instalado git
- Lo más importante una PC propia o prestada.

# Instalación de requisitos y composición del Backend (API REST)

Comenzando por la instalción de git, sigue los pasos indicados en la pagina oficial de git  https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git. Luego procedemos a la instalación del editor de codigo a utilizar ,en este caso Visual Studio code (VS code), para eso iremos a la pagina oficial de VS code ,ingresamos a https://code.visualstudio.com/download y descargamos el archivo y instalación y seguimos los pasos indicados en este link https://support.academicsoftware.eu/hc/es/articles/360006916138-C%C3%B3mo-instalar-Microsoft-Visual-Studio-Code#:~:text=Paso%201%3A%20Ve%20a%20la,acepta%20el%20acuerdo%20de%20licencia. 

Para la instalación de Nodejs seguiremos los pasos indicados en esta pagina https://www.cursosgis.com/como-instalar-node-js-y-npm-en-4-pasos/ ,para luego  comezar a crear nuestro proyecto e instalar las dependecias de los modulos requeridos (Express,Cors,MySql).
Una vez instalado NodeJs y NPM (que viene con la instalción de NodeJs), Nos vamos a la ubicacíon de nuestro proyecto a traves de cmd o abrir la carpeta con VSCode  y abrir una terminal que se iniciara desde el directorio del proyecto.
Para agregar Node y sus dependecias a nuestro proyecto debemos ejecutar los siguientes comandos:

Para la creacion de nuestro archivo package.json  que contendra la información de nuestro proyecto
``` 
npm init
```
Luego instalaremos los modulos de NodeJs a nuestro proyecto y otros modulos que necesitamos
``` 
npm install cors
npm install express
npm instal mysql
npm install --save-dev nodemon //Que se encargara de iniciar nuestro Servidor
```
Una vez lo tenemos listo Nuestro package.json quedara así:
``` 
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "ApiRestfulController.js",//Original queda predeterminado con un archivo llamado index.js, pero ustedes pueden llamarlo como necesiten, pero tienen que modificar estas secciones para que al iniciar el servidor parta en el archivo correcto
  "scripts": {
    "start": "nodemon ApiRestfulController.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.2",
    "mysql": "^2.18.1",
    "nodemon": "^2.0.15"
  }
}

``` 

Este proyecto esta conformado de la  siguiente manera :
- carpeta node_modules donde se guardan los modulos de node cuando lo agregamos con el comando "npm install" a nuestro proyecto
- Carpeta config que contiene nuestro archivo conexion.js el cual genera la conexion a la base de datos
- Archivo ApiRestController.js que sera encargado de crear las peticiones al servidor, hacer las consultas a la base de datos y enviar repuestas a una aplicación cliente(Fronted)
- Archivo package.json
-  Archivo package-lock.json

Sobre estos dos ultimos archivos vaya al link de documentación de nodejs  para una explicación más detallada https://nodejs.dev/learn/the-package-lock-json-file , en el caso que no sepa inglés ocupe el explorador Google Chrome que le sugiere traducción para más comodidad.
Finalmente quedaria asi nuestro proyecto.

![](https://raw.githubusercontent.com/Pato2294/fronted-bs/main/ReadmeIMG/BkndCarpetas.png)
 
 
 #  Funcionamiento
 
 En esta sección veremos el  funcionamiemto de nuestro proyecto, mostrando a travez de muestras de codigo con su respectiva descripción.
 
 
 ## Conexión
En esta sección veremos como generamos la conexión a la base de datos dispuesta para el proyecto.
```javascript
// Se importa el modulo de MySql para generar la conexion a la base de datos definida
const mysql = require('mysql');
//se generan los parametros de conexion url,usuario,contraseña,y por ultimo a la base de datos que queremos ingresar
const conexion = mysql.createConnection({
    host :'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
    user :'bsale_test',
    password :'bsale_test',
    database:'bsale_test'
});

//Generamos la conexion y verificamos que no haya ningun error y de ser asi retorna el error para ser identificado y solucionado, y si no hay problemas se realiza la conexion con exito y
//listo para obtener y exportar la conexion que sera utlizada en el servidor
conexion.connect((err)=>{
    if(err){
        console.log('Error DB:',err);
        return err;
    }

    console.log('Conexion exitosa!')
})
// De esta manera exportamos la conexion para ser utilizada en otras secciones del backend en este caso por ApiResfulController.js el cual gestiona el servidor
//y responderlas segun lo pedido
module.exports=conexion;
```

## API REST
Aqui veremos como esta compuesto nuestra Api, como estan creadas las peticiones y la gestion de la respuestas. 
El primer segmento de codigo es importando los modulos que nececitamos para que nuestro servidor funcione correctamente.

```javascript
//importamos los modulos que necesitamos para establecer nuestra Backend
const express = require('express');
const db = require('./config/conexion');
const cors = require('cors');

//instanciamos los modulos para ocupar su propiedades y metodos
const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
//Declaramos el puerto del servidor
const PORT = process.env.PORT||5050;// En el caso de no obtener ningun puerto asignado se le asigna un puerto manualmente.
```
Teniendo esto la creación de peticiones y consultas a la base de datos tendran exito en su funcionamiento como se muestra a continuación
```javascript
//Generamos las peticiones que seran consumidas desde el fronted

//Esta peticion se encargara de enviar los productos  en respuesta a la consulta a la base de datos en respuesta a la direccion defenida
app.get('/productos', (req,res)=> {
    db.query('SELECT * FROM product order by category',(err,data)=>
    {
      if(err){// Si hay un error esta seccion se encarga de mandar la respuesta para que el fronted le muestre al usuario su inconveniente
                res.json({
                    mensaje:'Error',
                    err
                })
            }//Una vez procesado sin ningun error se envia la respuesta al cliente listo para ser procesados por el fronted
                res.json({
                    mensaje:'Productos',
                    data
                })
    })
    
})

//Esta peticion se encargara de enviar los categorias de la base de datos en respuesta a la direccion defenida, mediante la consulta y respuesta de la base de datos que en este caso entregara las categorias con todos sus datos
app.get('/categorias', (req,res)=> {
    db.query('SELECT * FROM category ',(err,data)=>
    {
        if(err){
            res.json({
                mensaje:'Error',
            
                err
            })
            throw err;
            
        }
        res.json({
            mensaje:'Categorias',
        
            data
        }) 
    })
    
})
 //Esta peticion se encargara de enviar los resultados de la busqueda solicitada recibiendo como paramentro "busqueda" y asi realizar la consulta sql de la busqueda con los parametros de busqueda. 
 //dando a conocer que tendra en cuenta el nombre del producto y de la categoria
app.get('/buscar/:busqueda', (req,res)=> {
    const busqueda=req.params.busqueda;
    db.query(`SELECT p.id ,p.name,p.url_image,p.price ,p.discount, p.category FROM product p inner join category c on p.category=c.id where p.name like '%${busqueda}%' or c.name like '%${busqueda}%' order by category`,(err,data)=>
    {
        if(err){
            res.json({
                mensaje:'Error',
            
                err
            })
            throw  err;
        }
        res.json({
            mensaje:'Resultados Busqueda',
            data
        })
    })

})
//Esta peticion se encargara de enviar los resultados del filtrado de los productos solicitados, recibiendo como paramentro el "body",
// que contendra los filtros aplicados por el cliente por medio de la peticion POST  
app.post('/filtros', (req,res)=> {
    //console.log(req);
    const rangoPrecio=req.body.fRango;
    const descuento=req.body.fDesc;
    const categorias=req.body.fCat||[];
    let condicionCat="";
    let productosFiltrados=[];
   
    if(categorias.length)
    {
        condicionCat= `where category in (${categorias})`;//se aplica la condicion de las categorias de manera que se filtre en la consulta y las demas condiciones con metodos ES6(EcmaScript 6)
    }

    db.query(`SELECT * FROM product ${condicionCat} order by category`,(err,data)=>
    {   
        if(err){
            res.json({
                mensaje:'Error',
            
             err
            })
            return err;
        }
        // En esta seccion se empieza a filtrar y de armar la variable que contendra los productos filtrados para ser enviados al cliente
        productosFiltrados=data;
        if(rangoPrecio>1)
        {

            if(rangoPrecio==2)
            { 
                productosFiltrados=productosFiltrados.filter(producto=>producto.price<5000).reduce((total,valor,index)=>{total[index]=valor; return total;},[]);
            }

            if(rangoPrecio==3)
            {
                productosFiltrados=productosFiltrados.filter(producto=>producto.price>4999&&producto.price<10000).reduce((total,valor,index)=>{total[index]=valor; return total;},[])
            }

            if(rangoPrecio==4)
            {
                productosFiltrados=productosFiltrados.filter(producto=>producto.price>9999&&producto.price<15000).reduce((total,valor,index)=>{total[index]=valor; return total;},[])
            }

            
            if(rangoPrecio==5)
            {
                productosFiltrados=productosFiltrados.filter(producto=>producto.price>14999).reduce((total,valor,index)=>{total[index]=valor;return total;},[])
            }
        }
        
        if(descuento>1)
        {
            descuento==2? productosFiltrados=productosFiltrados.filter(producto=>producto.discount>0).reduce((total,valor,index)=>{total[index]=valor; return total;},[]):
            productosFiltrados=productosFiltrados.filter(producto=>producto.discount==0).reduce((total,valor,index)=>{total[index]=valor; return total;},[]);
        }
     
    //Una vez filtrado se envia la respuesta al cliente listo para ser procesados por el fronted
  
        res.json({
            mensaje:'Resultados Busqueda',
            productosFiltrados
        })
    })
    
})
//inicio server
//Essta Seccion se encarga de detectar cualquier cambio en el codigo para realizar y actualizar el servidor
app.listen(PORT,()=>{
    console.log(`Servidor andando en el puerto : ${PORT}`);
})  
```
Ejemplo de como responde nuestro servidor a una peticion en este caso la traida de productos [Haz click aquí](https://backend-bss.herokuapp.com/productos)

Para saber la Aplicación cliente(fronted) consume la API [Haz click aquí](https://github.com/Pato2294/bkndBs)
