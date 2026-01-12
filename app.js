const express = require("express");
const session = require("express-session");
const app = express();
app.use(express.static("html")); //public폴더를 사용한다고 알려줌
app.use(express.json()); //json()
app.use(
  session({
    secret: "my-secret-key", // 아무 문자열이나 OK (운영에선 환경변수)
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // sameSite, secure는 지금 구조에선 건드릴 필요 없음
    },
  })
);
const db = require("./db");
const dir = "localhost:3000";
app.listen(3000, () => {
  console.log("server실행. http://localhost:3000");
});

//총 개시글 갯수
app.get("/getboardcount", async (req, res) => {
  const page = Number(req.query.page); //페이지넘버
  const sta = req.query.sta; //기준
  const word = req.query.word; //단어
  let qry = `select count(*) count from board`;
  if (sta != "") {
    qry += ` WHERE ${sta} like '%${word}%'`;
  }
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.json({
      retcode: "NG",
      remsg: "오류",
    });
  }
});

//보드 목록 받아오기
app.get("/boards", async (req, res) => {
  const page = Math.max(Number(req.query.page), 1) || 1; //페이지넘버
  const sta = req.query.sta || ""; //기준
  const word = req.query.word || ""; //단어
  const binds = {
    maxRn: page * 10,
    minRn: (page - 1) * 10,
  };
  if (sta != "" && sta != "title" && title == "writer") {
    console.log("잘못된접근");
    return;
  }
  let subqry = `select board_no,title,writer,write_date,count from board `;

  if (sta != "") {
    subqry += ` WHERE ${sta} like '%${word}%'`;
  }
  subqry += `ORDER BY BOARD_NO DESC`;

  let mainqry = `SELECT board_no,title,writer,write_date,count from(SELECT ROWNUM rn,b1.* FROM(${subqry}) b1 WHERE  ROWNUM <=
    :maxRn
  )WHERE rn>:minRn`;
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(mainqry, binds);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.json({
      retcode: "NG",
      remsg: "오류",
    });
  }
});
//보드 상세
app.get("/board", async (req, res) => {
  try {
    const no = req.query.board_no;
    const connection = await db.getConnection();
    const qry = `select * from board where board_no=:no`;
    const result = await connection.execute(qry, { no });
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
//조회수 증가
app.get("/count", async (req, res) => {
  try {
    const no = req.query.board_no;
    const connection = await db.getConnection();
    const qry = `update board set count=count+1 where board_no=${no}`;
    const result = await connection.execute(qry);
    await connection.commit();
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
//보드 작성
app.post("/board_write", async (req, res) => {
  const { title, content, writer } = req.body;
  console.log(req.body);
  const qry = `insert into board(board_no,title,content,writer) values(board_no_seq.nextval,':title',':content',':writer')`;
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry, { title, content, writer });
    await connection.commit();
    res.json({
      title,
      content,
    });
  } catch (err) {
    console.log(err);
    res.json({
      retcode: "NG",
      remsg: "오류",
    });
  }
});
//업데이트
app.post("/update", async (req, res) => {
  try {
    // console.log(req.body);
    const { board_no, title, content, writer } = req.body;
    if (req.session.user.id != writer) {
      // console.log("권한없음");
      res.send("권한없음");
      return;
    }
    const connection = await db.getConnection();
    const qry = `update board set title=:title,content=:content where board_no=:board_no`;
    // console.log(qry);
    const result = await connection.execute(qry, { title, content, board_no });
    connection.commit();
    res.send("성공");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
//삭제
app.delete("/delete/:board_no/:writer", async (req, res) => {
  const { board_no, id } = {
    board_no: Number(req.params.board_no),
    id: req.params.writer,
  };
  console.log(req.params);
  if (req.session.user.id != id) {
    console.log("권한없음");
    res.send("권한없음");
    return;
  }
  const connection = await db.getConnection();
  try {
    const qry = `delete from board where board_no=:board_no`;
    const result = await connection.execute(qry, { board_no });
    connection.commit();
    // console.log(result);
    res.send("성공");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//여기서부터 유저 관련 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//중복체크
app.get("/check", async (req, res) => {
  // console.log(req.query);
  const tartget = req.query.id;
  try {
    const connection = await db.getConnection();
    const qry = `select id from users where id=:target`;
    console.log(qry);
    const result = await connection.execute(qry, tartget);
    if (result.rows.length == 0) {
      res.json({ code: "200", usable: "사용가능" });
    } else {
      res.json({ code: "200", usable: "사용불가" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//회원가입
app.post("/signup", async (req, res) => {
  const user = req.body;
  console.log(user);
  try {
    const connection = await db.getConnection();
    const qry = `insert into users (id,password,user_name,email) values(:id,:pw,:name,:email)`;
    const result = await connection.execute(qry, user);
    console.log(result);
    res.json({ code: "200", result: "성공" });
    connection.commit();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
//유저 목록
app.get("/users", async (req, res) => {
  const page = Math.max(Number(req.query.page), 1) || 1; //페이지넘버
  const sta = req.query.sta || ""; //기준
  const word = req.query.word || ""; //단어
  const binds = {
    maxRn: page * 10,
    minRn: (page - 1) * 10,
  };
  if (sta != "" && sta != "id" && title == "name" && title != "email") {
    console.log("잘못된접근");
    return;
  }
  let subqry = `select id,user_name,email from users `;

  if (sta != "") {
    subqry += ` WHERE ${sta} like '%${word}%'`;
  }
  subqry += `ORDER BY GRADE`;

  let mainqry = `SELECT id,user_name,email from(SELECT ROWNUM rn,b1.* FROM(${subqry}) b1 WHERE  ROWNUM <=
    :maxRn
  )WHERE rn>:minRn`;
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(mainqry, binds);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.json({
      retcode: "NG",
      remsg: "오류",
    });
  }
});
//유저수
app.get("/getusercount", async (req, res) => {
  const page = Number(req.query.page); //페이지넘버
  const sta = req.query.sta; //기준
  const word = req.query.word; //단어
  let qry = `select count(*) count from users`;
  if (sta != "") {
    qry += ` WHERE ${sta} like '%${word}%'`;
  }
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.json({
      retcode: "NG",
      remsg: "오류",
    });
  }
});
//아래는 로그인 관련 ///////////////////////////////////////////////////////////////
//로그인
app.post("/login", async (req, res) => {
  const user = req.body;
  console.log(user);
  try {
    const connection = await db.getConnection();
    const qry = `select * from users where id=:id and password=:pw`;
    const result = await connection.execute(qry, user);
    console.log(result.rows);
    const rows = result.rows;
    const login = rows[0];
    req.session.user = {
      id: login.ID,
      name: login.USER_NAME,
      grade: login.GRADE,
    };
    console.log("LOGIN sessionID:", req.sessionID, req.session.user);
    if (result.rows.length == 1) {
      res.json({ code: "200", match: "성공" });
    } else {
      res.json({ code: "200", match: "실패" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

//세션에서 정보 받아오기
app.get("/me", (req, res) => {
  // console.log("ME sessionID:", req.sessionID, req.session.user);
  if (!req.session.user) {
    return res.status(401).json({ login: false });
    // 또는: return res.json({ login: false });
  }
  res.status(200).json({
    id: req.session.user.id,
    name: req.session.user.name,
    grade: req.session.user.grade,
  });
});
//로그아웃
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("로그아웃 실패");

    // 세션 쿠키 이름이 기본(connect.sid)일 때
    res.clearCookie("connect.sid");
    res.send("ok");
  });
});
