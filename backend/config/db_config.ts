import mysql, {Connection} from 'mysql2';

console.log('====================================');
console.log('server connected to db');
console.log('====================================');

let connection: Connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'cities_app',
    multipleStatements: true
});

export {connection};