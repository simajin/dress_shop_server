// // 회원가입 - 클라이언트에서 값을 받아오기
// router.post('/register', (req,res,next) =>{
// 	console.log(req.body)
//     res.end()
// })

// // 코드 작성
// // db(데이터베이스)에 회원정보 업로드되게 하기
// const db = require('./database.json')
// // 비밀번호 보안 - bcrypt 사용(bcrypt에서 제공하는 hash 함수를 사용)
// const bcrypt = require('bcrypt')
// const saltRounds = 10       // saltRounds : 암호화를 몇번 진행할 것인지

// router.post('/register', async (req,res,next) =>{
// 	const param = [req.body.c_id, req.body.c_password, req.body.c_name, req.body.c_gender, req.body.c_phone, req.body.c_phone2, req.body.c_phon3, req.body.c_add, req.body.c_adddetail, req.body.c_email] 
    
//     // 비밀번호 보안- hash
//     bcrypt.hash(param[1], saltRounds, (error , hash)=>{
//     	param[1] = hash
//         // 쿼리문 작성
//         db.query('INSERT INTO member(`userid`,`pw`,`name`,`gender`,`phone`,`phone2`,`phon3`,`add`,`adddetail`,`email`) VALUES (?,?,?,?,?,?,?,?,?,?)' , 
//         param , (err, row) =>{
//             if(err) console.log(err);
//             console.log(row);
//             res.send("회원가입완료");
//         })
//     })
//     res.end()
// })


// 
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


// --session 이용해서 회원가입 로그인 한거--
// //로그인 - 쿠키 사용
// //미들웨어 설정
// app.use(cors({
//     // origin: ["http://localhost:3000"],
//     origin: ["https://dress-shop-server.herokuapp.com"],
//     methods: ["GET","POST","DELETE","PUT"],
//     // methods: ["GET","POST"],
//     credentials: true
// }));
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }))  // 회원가입 - 클라이언트로부터 값 받아오기
// //세션
// app.use(session({
//     key: "userId",                      //name of cookie
//     secret: "subscribe",                //중요
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         expires: 60 * 60 * 24,      //24hours
//     },
// }))
// //쿠키 접근
// //ex>
// // cookie.save('userId',"test"
// //     ,{  
// //         path: '/',
// //         expires: 60 * 60 * 24,
// //     }
// // )
// function componentDidMount() {
//     const expires = new Date()
//     expires.setMinutes(expires.getMinutes() + 60)
//     cookie.save('userId',"test",
//     {
//         path: '/',
//         expires,
//     })
//     setTimeout(function() {
//         alert(cookie.load('userId'))
//     },1000)
// };

// //3. 회원가입 - 클라이언트에서 값을 받아오기
// // db(데이터베이스)에 회원정보 업로드되게 하기
// // const db = require('./database.json')
// // 비밀번호 보안 - bcrypt 사용(bcrypt에서 제공하는 hash 함수를 사용)
// const bcrypt = require('bcrypt');
// const saltRounds = 10       // saltRounds : 암호화를 몇번 진행할 것인지

// app.post('/register', async (req,res,next) =>{
// 	const param = [req.body.c_id, req.body.c_password, req.body.c_name, req.body.c_gender, req.body.c_phone, req.body.c_phone2, req.body.c_phone3, req.body.c_add, req.body.c_adddetail, req.body.c_email] 
        
//         // *비밀번호 보안- hash
//         //param[1] --> req.body.c_password
//         bcrypt.hash(param[1], saltRounds, (err , hash) => {
//             // param[1] = hash
//             if (err) {
//                 console.log(err);
//             }


//             // // *보안2
//             // let password = req.body.c_password;
//             // const hashPassword = crypto.createHash('sha512').update(password).digest('hex');
//             // const hashPassword = crypto.createHash('sha512').update(password + salt).digest('hex');
//             // // *id 중복처리하가위한 쿼리문  --> 클라이언트에서 추가하기!
//             // **table의 column인 userid가 primary_key라서 어짜피 중복이 안됨 -> 안해줘도 됨!**
//             // const query = "SELECT userid FROM member where userid=?";
//             // let user_id = req.body.c_id;
//             // connection.query(query, [user_id], function(error, rows, fields){
//             //     console.log(rows);
//             //     let checkId = new Object();
//             //     checkId.tf = false; // 이 아이디를 사용할 것인지
//             //     if(rows[0] === undefined){  // 중복되는게 없으면
//             //         checkId.tf = true;  //없음 -> 사용가능
//             //         res.send(checkId);  // 클라이언트로 다시 보낸다 checkID객체를
//             //         console.log("성공");
//             //         // 쿼리문 작성
//             //         // console.log("여기에요!!!!");
//             //         console.log(param);
//             //         connection.query('INSERT INTO member(`userid`,`pw`,`name`,`gender`,`phone`,`phone2`,`phone3`,`add`,`adddetail`,`email`) VALUES (?,?,?,?,?,?,?,?,?,?)' , 
//             //         param , (err, row) =>{
//             //             if(err) { console.log("가입안됨");} 
//             //             else {
//             //                 console.log("가입완료")
//             //             }
//             //         }) 
//             //     }
//             //     else {
//             //         checkId.tf = false;    // 중복될 경우 -> 사용X
//             //         res.send(checkId);
//             //         console.log("중복ID");
//             //     }
//             // })
//             // 쿼리문 작성
//             // console.log("여기에요!!!!");
//             console.log(param);
//             connection.query('INSERT INTO member(`userid`,`pw`,`name`,`gender`,`phone`,`phone2`,`phone3`,`add`,`adddetail`,`email`) VALUES (?,?,?,?,?,?,?,?,?,?)' , 
//             param , (err, row) =>{
//                 if(err) { console.log("가입안됨");} 
//                 else {
//                     console.log("가입완료")
//                 }
//             }) 
//         })
//     res.end()
// })
// //4. 로그인
// app.post('/login', (req, res) => {
//     const username = req.body.username;     // req.body.username의 username은 client에서 내가 값을 넘겨줄 때, 변수와? 같아야한다(username: userName 에서 여기 앞의 username!!)
//     const userpassword = req.body.userpassword;
//     console.log(req.body)
//     // connection.query('SELECT * FROM member WHERE userid = ? AND pw = ?',
//     // [username, userpassword],
//     // (err,result)=>{
//     //     if(err) {
//     //         console.log(err);
//     //         res.send({ err: err });
//     //     }
//     //     if(result.length > 0) {     // 아이디 비밀번호가 맞다면
//     //         res.send(result);
//     //         console.log('성공')
//     //     } else {
//     //         res.send({ message: "Wrong userid/password combination!" });
//     //     }
//     // });
//     //bcrypt 비밀번호 보안 후 수정
//     connection.query('SELECT * FROM member WHERE userid = ?;',        
//     username,
//     (err,result)=>{
//         console.log(result);
//         console.log(req.body);
//         if(err) {
//             console.log(err);
//             res.send({ err: err });
//         }
//         if(result.length > 0) {     // 아이디가 맞다면
//             bcrypt.compare(userpassword, result[0].pw, (error, response) => {
//                 if(userpassword == result[0].pw) {
//                     req.session.user = result;
//                     console.log(req.session.user);
//                     res.send(result);
// //                     req.session.loginData = rows;
// // //                         req.session.save(error => {
// // //                             if(error) console.log(error)
// // //                         })
// // //                         res.json({message: 'success'})
//                 } else {
//                     res.send({ message: "Wrong userid/password combination!" });
//                 }
//             })
//         } else {
//             res.send({ message: "User doesn`t exist!" });
//         }
//     });
// });

// app.get('/login', (req, res)=>{
//     if (req.session.user) {
//         res.send({loggedIn: true, user: req.session.user})
//     } else {
//         res.send({loggedIn: false })
//     }
// })
// //5. 로그아웃
// // app.get('/logout', (req, res) => {
// //     res.clearCookie("userId");       //쿠키이름 
// //     res.redirect("/");
// //     console.log("로그아웃 되었습니다!!!");
// // })
// app.post('/logout', (req,res) =>{
//     if(req.session.user){
//         req.session.destroy(error => {if(error) console.log(error) })
//         res.redirect('/');
//     }else{
//         console.log("로그인해주세요!!!");
//     }
// })