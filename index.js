const express = require("express"); //express : react와 mysql을 연결해주는 웹 서버 프레임워크
const cors = require("cors");
const app = express();
const port =  process.env.PORT || 8000;
const fs = require('fs');
const dataj = fs.readFileSync("./database.json");
const parseData = JSON.parse(dataj);
const mysql = require('mysql');
// 회원가입 / 로그인
const session = require('express-session');  
const bodyParser = require('body-parser');
// const crypto = require('crypto');
// const salt = require('salt');
const cookieParser = require('cookie-parser');      // 쿠키 사용

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

//1. 전체상품
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


//2. 상품 하나씩
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

//서치 타입
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

// 카트 



const bcrypt = require('bcrypt')
const saltRounds = 10       // saltRounds : 암호화를 몇번 진행할 것인지
//3. 회원가입 - 클라이언트에서 값을 받아오기
// db(데이터베이스)에 회원정보 업로드되게 하기
// const db = require('./database.json')
// 비밀번호 보안 - bcrypt 사용(bcrypt에서 제공하는 hash 함수를 사용)
// const bcrypt = require('bcrypt')
// const saltRounds = 10       // saltRounds : 암호화를 몇번 진행할 것인지

app.post('/register', async (req,res,next) =>{
	const param = [req.body.c_id, req.body.c_password, req.body.c_name, req.body.c_gender, req.body.c_phone, req.body.c_phone2, req.body.c_phone3, req.body.c_add, req.body.c_adddetail, req.body.c_email] 
        
        // *비밀번호 보안- hash
        // bcrypt.hash(param[1], saltRounds, (error , hash)=>{
        // param[1] = hash
        // // *보안2
        let password = req.body.c_password;
        // const hashPassword = crypto.createHash('sha512').update(password).digest('hex');
        const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');
        // // *id 중복처리하가위한 쿼리문  --> 클라이언트에서 추가하기!
        // **table의 column인 userid가 primary_key라서 어짜피 중복이 안됨 -> 안해줘도 됨!**
        // const query = "SELECT userid FROM member where userid=?";
        // let user_id = req.body.c_id;
        // connection.query(query, [user_id], function(error, rows, fields){
        //     console.log(rows);
        //     let checkId = new Object();
        //     checkId.tf = false; // 이 아이디를 사용할 것인지
        //     if(rows[0] === undefined){  // 중복되는게 없으면
        //         checkId.tf = true;  //없음 -> 사용가능
        //         res.send(checkId);  // 클라이언트로 다시 보낸다 checkID객체를
        //         console.log("성공");
        //         // 쿼리문 작성
        //         // console.log("여기에요!!!!");
        //         console.log(param);
        //         connection.query('INSERT INTO member(`userid`,`pw`,`name`,`gender`,`phone`,`phone2`,`phone3`,`add`,`adddetail`,`email`) VALUES (?,?,?,?,?,?,?,?,?,?)' , 
        //         param , (err, row) =>{
        //             if(err) { console.log("가입안됨");} 
        //             else {
        //                 console.log("가입완료")
        //             }
        //         }) 
        //     }
        //     else {
        //         checkId.tf = false;    // 중복될 경우 -> 사용X
        //         res.send(checkId);
        //         console.log("중복ID");
        //     }
        // })


            // 쿼리문 작성
            // console.log("여기에요!!!!");
            console.log(param);
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
//4. 로그인
app.get('/Login', (req, res) => {
    res.send({data: 'data'})        // 임시로 값 넣어주기
})
//
const util = require('util');
app.post('/onLogin', (req, res) => {
    console.log(`= = = > req : ${util.inspect(req)} `)
    //query: 'userid=ffff&pw=ggggg' 로그인페이지에 작성한 아이디랑 비번이 서버터미널 쿼리에 잘 담김
    // user_id, user_pw 변수로 선언
    const user_id = req.query.userid;
    const user_pw = req.query.pw;
    // 입력된 id 와 동일한 id 가 mysql 에 있는 지 확인
    const sql1 = 'SELECT COUNT(*) AS result FROM member WHERE userid = ? AND pw = ?'
    const params = [user_id, user_pw]
    connection.query(sql1, params , function(err, data){
        if(data[0].result < 1){
            res.send({'msg': '입력하신 id와 pw가 일치하지 않습니다.'})
        }else {
            res.send(data[0]);
        }
    })
    // connection.query(sql1, user_id, (err, data) => {
    //     if(!err) {
    //         // 결과값이 1보다 작다면(동일한 id가 없다면)(id가 없음)
    //         if(data[0].result < 1){
    //             res.send({ 'msg' : '입력하신 id가 일치하지 않습니다.' })
    //         } else {    // 동일한 id가 있으면 비밀번호 일치 확인
    //             const sql2 = `SELECT 
    //             CASE (SELECT COUNT(*) FROM member WHERE userid = ? AND pw = ?)
    //                 WHEN '0' THEN NULL
    //                 ELSE (SELECT userid FROM member WHERE userid = ? AND pw = ?)
    //             END AS userId
    //             , CASE (SELECT COUNT(*) FROM member WHERE userid = ? AND pw = ?)
    //                 WHEN '0' THEN NULL
    //                 ELSE (SELECT pw FROM member WHERE userid = ? AND pw = ?)
    //             END AS userPw`;
    //             // sql 란에 필요한 parameter 값을 순서대로 기재
    //             const params = [user_id, user_pw, user_id, user_pw, user_id, user_pw, user_id, user_pw]
    //             db.query(sql2, params, (err, data) => {
    //                 if(!err) {
    //                     res.send(data[0])
    //                 } else {
    //                     res.send(err)
    //                 }
    //             })
    //         }
    //     } else {
    //         res.send(err);
    //     }
    // })
})
//5. 로그아웃




// app.post('/', function (req, res, next){
//     let id = req.body.c_id;
//     let pw = req.body.c_password;
     
//     // connection.query('Select salt, pw From member where userid="id";',
//     connection.query('Select pw From member where userid="id";',
//         function(err, rows){
//             if(err) console.log(err);
//             else {
//                 if(rows.length == 0){
//                     console.log("아이디 틀림")
//                     res.redirect('/Login')
//                 }
//                 else {
//                     // let salt = rows[0].salt;
//                     let password = rows[0].pw;
//                     // console.log(rows[0].pw);
//                     // 비밀번호 보안
//                     // const hashPassword = crypto.createHash('sha512').update(pw + salt).digest('hex');
//                     const hashPassword = crypto.createHash('sha512').update(pw).digest('hex');
//                     if(password === hashPassword){  //로그인성공
//                         console.log("로그인성공");
//                         res.cookie("user", id, {
//                             expires: new Date(Date.now() + 900000),     //로그인지속시간: 로그인이 성공했을 시에 cookieparser를 사용하여 현재시간으로부터 900000ms 동안 지속되는 쿠키를 생성
//                             httpOnly: true
//                         });
//                         res.redirect('/')
//                     }
//                     else {
//                         console.log("로그인 실패 비밀번호 틀림")
//                         res.redirect('/Login')
//                     }
//                 }
//             }
//         }
//     )
// })
// //
// app.post('/Login', (req, res, next) => {
//     param = [ req.body.c_id, req.body.c_pw]
//     connection.query('SELECT * FROM member WHERE userid=?', param[0], 
//     (err, rows)=>{
//         if(err) console.log(err);
//         if(rows.length > 0 ){   //ID 존재
//             // console.log("ID가 존재합니다.")
//             //비밀번호가 맞는지 - bcrypt 에서 지원하는 compare함수 이용
//             bcrypt.compare(param[1], rows[0].pw, 
//                 (err, result)=>{
//                     if(result){     // 성공
//                         req.session.loginData = rows;
//                         req.session.save(error => {
//                             if(error) console.log(error)
//                         })
//                         res.json({message: 'success'})
//                     }else {         // 실패
//                         res.json({message: 'fail'})
//                     }
//                 })

//         }else {
//             console.log("ID가 존재하지 않습니다.")
//         }
//     })
//     res.end();
// })
// // 로그아웃
// app.post('/Logout', (req,res) =>{
//     if(req.session.loginData){
//         req.session.destroy(error => {if(error) console.log(error) })
//     }else{
//         /* 세션정보가 없을때 */
//     }
// })
// // 미들웨어 설정
// app.use(cors({
//     origin: true,       // origin : 흔히 알고있는 도메인의 형태를 띄는데 이것들을 모두 허용해준다는 뜻으로 true를 작성한다. (true나 특정 url을 적어두기)
//     credentials: true   // 교차 출처 리소스 공유 (CORS)
// }))
// app.use(cookieParser());    // 쿠키 추출
// app.use(
//     session({
//         key: "loginData",
//         secret: "testSecret",
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             expires: 60 * 60 * 24       // 쿠키 지속시간
//         },
//     })
// )
// // // Auto Check
// // app.get('/loginCheck', (req,res) =>{
// //     if(req.session.loginData){
// //         res.send({loggedIn : true, loginData: req.session.loginData})
// //     }else{
// //         res.send({loggedIn : false})
// //     }
// // })
// // 로그인 로그아웃
// // app.post('/Login', (req, res)=>{
// //     if(){       //로그인 성공
// //         req.session.loginData = 
// //         req.session.save(error => {
// //             if(error) console.log(error)
// //         })
// //         res.json({message: 'success'})
// //     }else { //로그인실패
// //         res.json({message: 'fail'})
// //     }
// // })

//6. 상품등록
app.post('/upload', async (req, res) => {
    const { c_name, c_price, c_size1, c_size2, c_size3, c_type, c_desc1, c_desc2, c_pic1, c_pic2, c_pic3 } = req.body;
    console.log(req.body)
    connection.query("INSERT INTO dress_table(`name`,`price`,`size1`,`size2`,`size3`,`type`,`desc`,`desc2`,`imgsrc`,`imgsrc2`,`imgsrc3`) values(?,?,?,?,?,?,?,?,?,?,?)",
    [c_name,c_price,c_size1,c_size2,c_size3,c_type,c_desc1,c_desc2,c_pic1,c_pic2,c_pic3],
    (err, result, fields)=>{
        if(result){
            console.log(result);
            res.send("드레스 등록이 완료되었습니다.");
        }
       
    })
})

// 서버실행
app.listen(port, () => {
    console.log('고객서버가 돌아가고 있습니다.');
})