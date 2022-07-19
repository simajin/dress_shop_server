const express = require("express"); //express : react와 mysql을 연결해주는 웹 서버 프레임워크
const cors = require("cors");
const app = express();
const port =  process.env.PORT || 8000;
const fs = require('fs');
const dataj = fs.readFileSync("./database.json");
const parseData = JSON.parse(dataj);
const mysql = require('mysql');
const session = require('express-session');  
const bodyParser = require('body-parser');

//데이터베이스 연결
const connection = mysql.createConnection({
    host: parseData.host,
    user:parseData.user,
    password:parseData.password,
    port:parseData.port,
    database: parseData.database
})

app.use(express.json()) //json형식의 데이터를 처리할수 있도록설정
app.use(cors()) //브라우저의 다양한 사용을 위해 설정
app.use(bodyParser.urlencoded({ extended: true }))  // 회원가입 - 클라이언트로부터 값 받아오기

//전체상품
app.get('/dresses', async (req, res)=>{
    connection.query(
        "select * from dress_table",
        (err, rows, fields)=>{
            res.send(rows);
            console.log(err);
            console.log(fields);
        }
    )
})
//상품 하나씩
app.get('/dress/:id', async (req, res)=>{
    const params = req.params;
    connection.query(
        `select * from dress_table where id=${params.id}`,
        (err, rows, fields)=>{
            res.send(rows);
            console.log(fields);
        }
    )
})
// 회원가입 - 클라이언트에서 값을 받아오기
// app.post('/register', (req,res,next) =>{
// 	console.log(req.body)
//     res.end()
// })

// 코드 작성
// db(데이터베이스)에 회원정보 업로드되게 하기
// const db = require('./database.json')
// 비밀번호 보안 - bcrypt 사용(bcrypt에서 제공하는 hash 함수를 사용)
const bcrypt = require('bcrypt')
const saltRounds = 10       // saltRounds : 암호화를 몇번 진행할 것인지

// app.post('/login',function(req,res){
//     db.collection('post').findOne({id:req.body.id},function(error,result){
//       console.log(result.id)
//       if(result.id == req.body.id ){res.send('중복된 아이디입니다.')}
//       else{db.collection('post').insertOne({id:req.body.id, pw:req.body.pw} , function(error,result){
//         console.log(result)
//         res.redirect('/');
//       })}
//     })
//   })

app.post('/register', async (req,res,next) =>{
	const param = [req.body.c_id, req.body.c_password, req.body.c_name, req.body.c_gender, req.body.c_phone, req.body.c_phone2, req.body.c_phone3, req.body.c_add, req.body.c_adddetail, req.body.c_email] 
    
        // 비밀번호 보안- hash
        // bcrypt.hash(param[1], saltRounds, (error , hash)=>{
        // param[1] = hash
        // const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');
        // // id 중복처리하가위한 쿼리문
        // const query = "SELECT userid FROM member where userid='" + id + "';";
        // connection.query(query, function(error, result){
        //     console.log(result.id)
        // })
        // 쿼리문 작성\
        console.log("여기에요!!!!")
        console.log(param)
        connection.query('INSERT INTO member(`userid`,`pw`,`name`,`gender`,`phone`,`phone2`,`phone3`,`add`,`adddetail`,`email`) VALUES (?,?,?,?,?,?,?,?,?,?)' , 
        param , (err, row) =>{
            if(err) { console.log("가입안됨");} 
            else {
                console.log("가입완료")
            }
        }) 
    // })
    res.end()
})


// 서버실행
app.listen(port, () => {
    console.log('고객서버가 돌아가고 있습니다.');
})