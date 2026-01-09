const oracledb = require("oracledb");
//조회된 데이터 => 객체방식
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: "pj_ac",
  password: "pj_ac",
  connectString: "localhost:1521/xe",
};

//db접속 얻기위한 session얻어오는 함수
async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (error) {
    return error;
  }
}
//비동기처리->동기방식 처리
async function execute() {
  const qry = `insert into board (board_no,title,content,writer)values(5,'db입력','연습중입니다.','user01')`;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(qry);
    connection.commit();
    console.log(result);
    console.log("등록성공");
  } catch (error) {
    console.log(`예외 발생 =>${error}`);
  }
}
// execute();
//session 획득
module.exports = { getConnection, execute };
