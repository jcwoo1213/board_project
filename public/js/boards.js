let login;
getme();
//로그인 여부
async function getme() {
  const result = await fetch("/me");
  const me = await result.json();
  // console.log(me);
  login = me;
  // console.log(login);
  if (result.status == 200) {
    const link = document.querySelector("header a");
    link.innerText = "로그아웃";
    link.href = "";
    link.addEventListener("click", async (e) => {
      await fetch("/logout", {
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
const urlParams = new URLSearchParams(location.search);
let page = urlParams.get("page") || 1;
let sta = urlParams.get("sta") || "";
let word = urlParams.get("word") || "";
let page_num = 1;
let qry_cnt = 0;
const viewcnt = 10;
const search_form = document.querySelector(".search");
document.querySelector("select").value = sta;
document.querySelector("#word").value = word;
//검색 되었을때
search_form.addEventListener("submit", (e) => {
  e.preventDefault();
  word = document.querySelector("#word").value.trim();
  sta = document.querySelector("select").value;
  if (sta == "" || word == "") {
    return; //필터나 단어 없으면 실행하지않음
  }
  location.href = `boards.html?sta=${sta}&word=${word}`;
});
//글작성 버튼 이벤트
document.querySelector(".write-btn").addEventListener("click", (e) => {
  if (login.id) {
    location.href = "/board_write.html";
  } else {
    alert("로그인 후 이용 가능합니다");
    location.href = "/login.html";
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
        a.href = `board.html?board_no=${elements["BOARD_NO"]}`;
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
    location.href = `boards.html?page=${page}&sta=${sta}&word=${word}`;
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
      location.href = `boards.html?page=${page}&sta=${sta}&word=${word}`;
    });
    pagingarea.appendChild(button);
  }
  button = document.createElement("button");
  button.innerText = ">>";
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = page_num;
    location.href = `boards.html?page=${page}&sta=${sta}&word=${word}`;
  });
  pagingarea.appendChild(button);
}
