const express = require("express");
const app = express();
app.use(express.static("html")); //public폴더를 사용한다고 알려줌
app.use(express.json()); //json()
const db = require("./db");
const dir = "localhost:3000";
app.listen(3000, () => {
  console.log("server실행. http://localhost:3000");
});
app.get("/getcount", async (req, res) => {
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
    res.json({ retcode: "NG", remsg: "오류" });
  }
});
app.get("/", async (req, res) => {
  // console.log("/");
});
app.get("/boards", async (req, res) => {
  const page = Number(req.query.page); //페이지넘버
  const sta = req.query.sta; //기준
  const word = req.query.word; //단어

  let subqry = `select board_no,title,writer,write_date,count from board `;
  if (sta != "") {
    subqry += ` WHERE ${sta} like '%${word}%'`;
  }
  subqry += `ORDER BY BOARD_NO DESC`;

  let mainqry = `SELECT board_no,title,writer,write_date,count from(SELECT ROWNUM rn,b1.* FROM(${subqry}) b1 WHERE  ROWNUM <=${
    page * 10
  })WHERE rn>${(page - 1) * 10}`;
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(mainqry);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.json({ retcode: "NG", remsg: "오류" });
  }
});
app.get("/board", async (req, res) => {});
app.post("/board_write", async (req, res) => {
  const { title, content } = req.body;
  const qry = `insert into board(board_no,title,content,writer) values(board_no_seq.nextval,'${title}','${content}','master')`;
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(qry);
    connection.commit();
    res.json({ title, content });
  } catch (err) {
    console.log(err);
    res.json({ retcode: "NG", remsg: "오류" });
  }
});
app.get("/boards.html");
app.get("/board.html");
app.get("/board_wrtie.html");
