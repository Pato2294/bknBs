//importamos los modulos que necesitamos para establecer nuestra Backend
const express = require('express');
const db = require('./config/conexion');
const cors = require('cors');
/* const http=require('http');

const host='201.239.251.81'; */


//instanciamos 
const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
//Declaramos el puerto del servidor
const PORT = process.env.PORT||5050;

//Generamos las peticiones que seran consumidas desde el fronted
//Esta peticion se encargara de enviar los productos de la base de datos en respuesta a la direccion defenida
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

//Esta peticion se encargara de enviar los categorias de la base de datos en respuesta a la direccion defenida
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
 //Esta peticion se encargara de enviar los resultados de la busqueda solicitada recibiendo como paramentro "busqueda" para aplicar en el filtro,
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
        condicionCat= `where category in (${categorias})`;//se aplica la condicion de las categorias de manera que se filtre en la consulta y las demas condiciones con metodos ES6(EsmaScrpt 6)
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

//Essta Seccion se encarga de detectar cualquier cambio en el codigo para realizar y actualizar el servidor
app.listen(PORT,()=>{
    console.log(`Servidor andando en el puerto : ${PORT}`);
})  

  