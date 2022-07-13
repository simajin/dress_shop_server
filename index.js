const express = require("express");
const cors = require("cors");
const app = express();
const port =  process.env.PORT || 8000;
const fs = require('fs');
const dataj = fs.readFileSync("./database.json");
const parseData = JSON.parse(dataj);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: parseData.host,
    user:parseData.user,
    password:parseData.password,
    port:parseData.port,
    database: parseData.database
})

app.use(express.json()) //json형식의 데이터를 처리할수 있도록설정
app.use(cors()) //브라우저의 다양한 사용을 위해 설정



// 서버실행
app.listen(port, () => {
    console.log('고객서버가 돌아가고 있습니다.');
})