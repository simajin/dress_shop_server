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

