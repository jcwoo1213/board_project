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
        const no = urlParams.get("board_no")
        counting(no);
        const result = await fetch(`/board?board_no=${no}`);
        const board = await result.json();
        print(board[0]);
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
    write_date.innerText = `작성일시:${new Date(board.WRITE_DATE).toLocaleString()}`;
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
    console.log(board);
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
        content: update_content
    }

    try {
        const result = await fetch("/update", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (await result.text() == "성공") {
            alert("수정되었습니다");
        } else {
            alert("변경에 실패하였습니다")
        };
        location.reload();
    } catch (error) {
        console.log(error);
        alert("실패");
    }


}