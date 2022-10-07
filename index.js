const express = require("express"); //express : react와 mysql을 연결해주는 웹 서버 프레임워크
const cors = require("cors");
const app = express();
const port =  process.env.PORT || 8000; //헤로쿠에서 지정하는게 있다면 그걸 쓰고 없다면 8000번 사용
const fs = require('fs');
const dataj = fs.readFileSync("./database.json");
const parseData = JSON.parse(dataj);
const mysql = require('mysql');
const multer = require("multer");
// 회원가입 / 로그인
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');     // 쿠키 사용
// const session = require('express-session');  
// const cookie = require('react-cookie');
// const crypto = require('crypto');
// const salt = require('salt');

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

//get으로 불러올 수 있는 애를
// https://dress-shop-server.herokuapp.com/dresses  --> heroku로 하면 뜸!!!

//1. 전체상품
app.get('/dresses', async (req, res)=>{
    connection.query(
        "select * from dress_table",
        (err, rows, fields)=>{
            res.send(rows);
            console.log(err);
        }
    )
})

//2. 상품 하나씩
app.get('/dress/:id', async (req, res)=>{
    const params = req.params;
    connection.query(
        `select * from dress_table where id=${params.id}`,
        (err, rows, fields)=>{
            res.send(rows);
        }
    )
})

// 카트 전체
// app.get('/carts', async (req, res)=>{
//     connection.query(
//         "select * from cart_table",
//         (err, rows, fields)=>{
//             res.send(rows);
//             console.log(err);
//             // console.log(fields);
//         }
//     )
// })

// 카트 
app.get('/cart/:ids', async (req, res)=>{
    const params = req.params;
    const { ids } = params;  //userid마다 장바구니 구분
    connection.query(
        `select * from cart_table where userid='${ids}' `,
        (err, rows, fields)=>{
            res.send(rows);
            console.log(err);
            // console.log(fields);
        }
    )
})

// 카트 등록
app.post('/addToCart', async (req, res) => {
    const { c_img, c_name, c_price, c_size, c_amount, c_userid, c_productid } = req.body;
    console.log(req.body);
    connection.query(
        `select * from cart_table where userid='${c_userid}' and name='${c_name}'`,
        (err, rows, fields)=>{
            if(rows.length == 1) {
                console.log(req.body);
                console.log(rows);
                res.send('있음');
            } else {
                connection.query(
                    "INSERT INTO cart_table(`imgsrc`,`name`,`price`,`size`,`amount`,`userid`,`productid`) values(?,?,?,?,?,?,?)",
                [c_img,c_name,c_price,c_size,c_amount,c_userid,c_productid],
                (err, result, fields)=>{
                    if(result){
                        console.log(fields);
                        console.log(result);
                        res.send("카트 등록이 완료되었습니다.");
                    }
                })
            }
        }
    )
})
// 카트 삭제
app.delete('/delCart', async (req, res)=>{
    console.log("카트 상품 삭제");
    connection.query(`delete from cart_table where id = ${req.body.id}`,
    (err, rows, fields) => {
        res.send(rows);
    })    
})

// 서치 타입
app.get('/dress/:type', async (req, res)=>{
    const params = req.params;
    connection.query(
        `select * from dress_table where type=${params.type}`,
        (err, rows, fields)=>{
            res.send(rows);
            console.log(fields);
        }
    )
})


//회원가입
app.post("/join",async (req, res)=>{
    let myPlanintextPass = req.body.c_password;
    let myPass = "";
    if(myPlanintextPass != '' && myPlanintextPass != undefined){
        bcrypt.genSalt(saltRounds, function(err,salt){
            bcrypt.hash(myPlanintextPass,salt, function(err,hash){
                myPass = hash;
                const { c_id, c_name, c_gender, c_phone, c_phone2, c_phone3, c_add, c_adddetail, c_email } = req.body;
                console.log(req.body)
                connection.query("insert into member(`userid`, `pw`, `username`, `gender`, `phone`, `phone2`, `phone3`, `add1`, `adddetail`, `email`) values(?,?,?,?,?,?,?,?,?,?)",
                    [c_id, myPass, c_name, c_gender, c_phone, c_phone2, c_phone3, c_add, c_adddetail, c_email] ,
                    (err,result,fields )=>{
                    console.log(result)
                    console.log(err)
                    res.send("등록 되었습니다.")
                })
            })
        })
    }   
})
// 🧑예시용 만든 계정 -> id: didi / pw: 1234   // dddd / 1234
// 👧관리자 계정 -> admin / admin1234

// 로그인 요청
app.post('/login', async (req, res)=> {
    const { c_id, c_password } = req.body;  
    connection.query(`select * from member where userid = '${c_id}'`,
        (err, rows, fileds)=>{
            if(rows != undefined) {     //결과가 있을 때
                if(rows[0] == undefined) {
                    // res.send(null)
                    res.send("실패1");
                    // console.log(err);
                } else {
                    // Load hash from your password DB.
                    //https://www.npmjs.com/package/bcrypt 에서 긁어오기
                    bcrypt.compare(c_password, rows[0].pw, function(err, result) {  //rows[0].pw : hash자리  --> 암호화한 비번
                        // result == true
                        if(result == true) {
                            res.send(rows[0])
                        } else {
                            console.log(err);
                            res.send('실패2')
                        }
                    });
                }
            } else {
                res.send('실패')
            }
        }
    )
})


//멀터 - 이미지 업로드
const storage = multer.diskStorage({
    destination: "./shopImg",
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 }
});
//이미지 여러개 등록 - array / 하나 등록 - single
app.post("/shopImg", upload.single("c_pic1"), function(req, res, next){
    res.send({
        imgsrc: 'shopImg/' + req.file.filename,
    })
    console.log(req.file.filename);
})
app.post("/shopImg2", upload.single("c_pic2"), function(req, res, next){
    res.send({
        imgsrc2: 'shopImg/' + req.file.filename,
    })
    console.log(req.file.filename);
})
app.post("/shopImg3", upload.single("c_pic3"), function(req, res, next){
    res.send({
        imgsrc3: 'shopImg/' + req.file.filename,
    })
    console.log(req.file.filename);
})
app.post("/shopImg4", upload.single("c_pic4"), function(req, res, next){
    res.send({
        imgsrc4: 'shopImg/' + req.file.filename,
    })
    console.log(req.file.filename);
})
app.post("/shopImg5", upload.single("c_pic5"), function(req, res, next){
    res.send({
        imgsrc5: 'shopImg/' + req.file.filename,
    })
    console.log(req.file.filename);
})
app.post("/shopImg6", upload.single("c_pic6"), function(req, res, next){
    res.send({
        imgsrc6: 'shopImg/' + req.file.filename,
    })
    console.log(req.file.filename);
})
app.use("/shopImg",express.static("shopImg"))
app.use("/shopImg2",express.static("shopImg"))
app.use("/shopImg3",express.static("shopImg"))
app.use("/shopImg4",express.static("shopImg"))
app.use("/shopImg5",express.static("shopImg"))
app.use("/shopImg6",express.static("shopImg"))



// ** 관리자 권한으로 로그인시에만 등록/삭제/수정 되게 나중에 할거임..!
//6. 상품등록
app.post('/uploadDress', async (req, res) => {
    const { c_name, c_price, c_size1, c_size2, c_size3, c_type, c_desc1, c_desc2, c_pic1, c_pic2, c_pic3 } = req.body;
    console.log(req.body)
    connection.query("INSERT INTO dress_table(`name`,`price`,`size1`,`size2`,`size3`,`type`,`desc1`,`desc2`,`imgsrc`,`imgsrc2`,`imgsrc3`) values(?,?,?,?,?,?,?,?,?,?,?)",
    [c_name,c_price,c_size1,c_size2,c_size3,c_type,c_desc1,c_desc2,c_pic1,c_pic2,c_pic3],
    (err, result, fields)=>{
        if(result){
            // [c_pic1] = value.replace('C:\\fakepath\\','images/'); 
            console.log(result);
            res.send("드레스 등록이 완료되었습니다.");
        }
       
    })
})
//7. 상품삭제
app.delete('/delDress/:id', async (req, res)=>{
    const params = req.params;
    console.log("상품 삭제");
    connection.query(`delete from dress_table where id = ${params.id}`,
    (err, rows, fields) => {
        res.send(rows);
    })    
})
//8. 상품수정
app.put('/editDress/:id', async (req, res)=>{
    const params = req.params;
    const { c_name, c_price, c_size1, c_size2, c_size3, c_type, c_desc1, c_desc2, c_pic1, c_pic2, c_pic3 } = req.body;
    console.log(req.body)
    connection.query(`UPDATE dress_table SET name='${c_name}', price=${c_price}, size1=${c_size1}, size2=${c_size2}, size3=${c_size3}, type='${c_type}', desc1='${c_desc1}', desc2='${c_desc2}', imgsrc='${c_pic1}', imgsrc2='${c_pic2}', imgsrc3='${c_pic3}' where id=${params.id}`,
    (err, result, fields)=>{
        if(err) {
            console.log("에러발생!!");
            console.log(err);
        }
        res.send(result);
    })
})

// 서버실행
app.listen(port, () => {
    console.log('고객서버가 돌아가고 있습니다.');
})