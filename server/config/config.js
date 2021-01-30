// ===========================================
//  Puerto
// ===========================================
process.env.PORT = process.env.PORT || 3001;

// ===========================================
//  Entorno
// ===========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev000';

// ===========================================
//  Base de datos
// ===========================================

let urlDB;

if (process.env.NODE_ENV === 'dev000'){
    urlDB = "mongodb+srv://test1:test1@cluster0.zwjcs.mongodb.net/infinity";
    //urlDB = "mongodb://localhost:27017/infinity";
   
}else {
    urlDB = "mongodb+srv://test1:test1@cluster0.zwjcs.mongodb.net/infinity";
             
}

process.env.URLDB = urlDB;

// ===========================================
//  Vencimiento del Token
// ===========================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ===========================================
//  SEED de autenticación
// ===========================================
process.env.SEED = process.env.SEED || 'este-es-la-clave-en-dev';
