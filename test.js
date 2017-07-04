var sqlClient = require("./src/sqlclient/sqlClient");

var client = new sqlClient({
  mysql: {
    host: "10.20.66.244",
    port: 3306,
    database: "pcbeta",
    user: "root",
    charset: 'utf8mb4',
    password: "ljj123"
  }
});

client.query('select * from sierra').then(data=>{
  client.query('select * from sierra').then(data=>{
    console.log(data);
  });

});
