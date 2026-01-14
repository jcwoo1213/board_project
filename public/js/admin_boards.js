let login;
getme();
//로그인 여부 검사
async function getme() {
  const result = await fetch("/me");
  console.log(result);
  //로그인 안했으면 로그인 페이지로 이동
  if (result.status == 401) {
    alert("로그인 해주세요.");
    location.href = "/login.html";
    return;
  }
  const me = await result.json();
  //로그인 하였지만 관리자가 아니면 다시 돌아감
  if (me.grade != "master") {
    alert("관리자 전용 페이지 입니다");
    location.href = "/boards.html";
    return;
  }
  document.querySelector(".brand-title").innerText = me.name;
}
document.querySelector(".logout").addEventListener("click", async (e) => {
  fetch("/logout", {
    method: "post",
  });
  alert("로그아웃 되었습니다");
  location.href = "login.html";
});
const urlParams = new URLSearchParams(location.search);
let page = urlParams.get("page") || 1;
let sta = urlParams.get("sta") || "";
let word = urlParams.get("word") || "";
let page_num = 1;
let qry_cnt = 0;
const viewcnt = 10;
const search_form = document.querySelector(".toolbar");
//검색 되었을때
search_form.addEventListener("submit", (e) => {
  e.preventDefault();
  word = document.querySelector(".input").value;
  sta = document.querySelector("select").value;
  if (sta == "" || word == "") {
    return;
  } else {
    location.href = `admin_boards.html?page=${page}&sta=${sta}&word=${word}`;
  }
});
//리스트 받아오기
async function getList() {
  try {
    const res = await fetch(`/boards?page=${page}&sta=${sta}&word=${word}`);
    const result = await res.json();
    await getcount();

    page_num = Math.ceil(qry_cnt / viewcnt);
    printlist(result);
    printPageNum(page);
    document.querySelector(".pill").innerText = `Total ${qry_cnt}`;
    console.log(qry_cnt);
  } catch (err) {
    console.log(err);
  }
}
getList();
//글 갯수 받아오기
async function getcount() {
  const res = await fetch(
    `/getboardcount?page=${page}&sta=${sta}&word=${word}`
  );
  const result = await res.json();
  qry_cnt = result[0].COUNT;
}
//리스트 출력
function printlist(list) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  list.forEach((elements) => {
    const tr = document.createElement("tr");
    for (const key in elements) {
      const td = document.createElement("td");
      const element = elements[key];
      if (key == "WRITE_DATE") {
        td.innerText = new Date(element).toLocaleString();
      } else if (key == "TITLE") {
        const a = document.createElement("a");
        a.href = `admin_board.html?board_no=${elements["BOARD_NO"]}`;
        a.innerText = elements[key];
        td.appendChild(a);
      } else {
        td.innerText = element;
      }

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
}

//페이지 바 출력
function printPageNum(now_page = 1) {
  const pagingarea = document.querySelector(".pagination");
  pagingarea.innerHTML = "";
  now_page = Number(now_page);
  console.log(page_num);
  console.log(now_page);
  let button;
  button = document.createElement("button");
  button.innerText = "<<";
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = 1;
    location.href = `admin_boards.html?page=${page}&sta=${sta}&word=${word}`;
  });
  pagingarea.appendChild(button);
  for (
    let i = Math.max(1, now_page - 2);
    i <= Math.min(page_num, now_page + 2);
    i++
  ) {
    button = document.createElement("button");
    button.innerText = i;
    button.className = "page-btn";

    button.addEventListener("click", (e) => {
      page = e.target.innerText;
      location.href = `admin_boards.html?page=${page}&sta=${sta}&word=${word}`;
    });
    pagingarea.appendChild(button);
  }
  button = document.createElement("button");
  button.innerText = ">>";
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = page_num;
    location.href = `admin_boards.html?page=${page}&sta=${sta}&word=${word}`;
  });
  pagingarea.appendChild(button);
}
