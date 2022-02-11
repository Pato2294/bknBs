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
// De esta manera exportamos la conexion para ser utilizada en otras secciones del backend en este caso por ApiResfulController el cual gestiona el servidor y se encarga de recibir peticiones
//y responderlas segun lo pedido
module.exports=conexion;