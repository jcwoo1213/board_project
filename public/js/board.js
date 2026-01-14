let login;
getme();
//로그인 정보 받아오기
async function getme() {
  const result = await fetch("/me");
  const me = await result.json();
  console.log(me);
  login = me;
  console.log(login);
  if (result.status == 200) {
    const link = document.querySelector("header a");
    link.innerText = "로그아웃";
    link.href = "";
    link.addEventListener("click", async (e) => {
      fetch("/logout", {
        method: "post",
      });
      alert("로그아웃 되었습니다");
      location.replace();
    });

    if (me.grade == "master") {
      const admin = document.querySelector("#goadmin");
      admin.style.display = "inline";
    }
  }
}
let board;
start();
// console.log(board);
//게시글 결과를 비동기로 받아오기위해 함수화
async function start() {
  board = await getboard();
}
//게시글 받아오기
async function getboard() {
  try {
    const urlParams = new URLSearchParams(location.search);
    const no = urlParams.get("board_no");
    counting(no);
    const result = await fetch(`/board?board_no=${no}`);
    const board = await result.json();
    print(board[0]);
    if (board[0].WRITER != login.id) {
      disable_btns();
    }
    // console.log(board[0]);
    return board[0];
  } catch (error) {
    console.log(error);
    return;
  }
}

//게시글 출력
function print(board) {
  // console.log(board);
  const title = document.querySelector(".post-title");
  title.innerText = board.TITLE;
  const content = document.querySelector(".post-content");
  content.innerText = board.CONTENT;
  const writer = document.querySelector("#writer");
  writer.innerText = `작성자:${board.WRITER}`;
  const write_date = document.querySelector("#write_date");
  write_date.innerText = `작성일시:${new Date(
    board.WRITE_DATE
  ).toLocaleString()}`;
  const count = document.querySelector("#count");
  count.innerText = `조회수:${board.COUNT}`;
}
//조회수 증가
async function counting(board_no) {
  try {
    const result = await fetch(`/count?board_no=${board_no}`);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

//수정창 열기
function openEditModal() {
  currentBoardNo = board.BOARD_NO;
  document.getElementById("editTitle").value = board.TITLE;
  document.getElementById("editContent").value = board.CONTENT;
  document.getElementById("editModal").style.display = "block";
}
//수정창 닫기
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}
//수정
async function update(e) {
  e.preventDefault();

  const update_title = document.querySelector("#editTitle").value;
  const update_content = document.querySelector("#editContent").value;

  if (!update_title || !update_content) {
    alert("제목 또는 내용이 비어있습니다");
    return;
  }
  const data = {
    board_no: board.BOARD_NO,
    title: update_title,
    content: update_content,
    writer: board.WRITER,
  };

  try {
    const result = await fetch("/update", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if ((await result.text()) == "성공") {
      alert("수정되었습니다");
    } else {
      alert("변경에 실패하였습니다");
    }
    location.reload();
  } catch (error) {
    console.log(error);
    alert("실패");
  }
}
//삭제 창 열기
function openDelModal() {
  currentBoardNo = board.BOARD_NO;
  document.getElementById("del_number").innerText = `번호:${board.BOARD_NO}`;
  document.getElementById("del_title").innerText = `제목:${board.TITLE}`;
  document.getElementById("del_content").innerText = `내용:${board.CONTENT}`;
  document.getElementById("deleteModal").style.display = "block";
}
//삭제 창 닫기
function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}
//삭제
async function Delete() {
  const target = board.BOARD_NO;
  console.log(board.BOARD_NO);
  const result = await fetch(`/delete/${target}/${board.WRITER}`, {
    method: "delete",
  });
  if ((await result.text()) == "성공") {
    alert("삭제되었습니다");
    location.href = "boards.html";
  } else {
    alert("삭제실패");
    console.log(result);
  }
}
function disable_btns() {
  document.querySelector(".edit").style.display = "none";
  document.querySelector(".delete").style.display = "none";
}
