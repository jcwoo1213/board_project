let login;
getme();
async function getme() {
  const result = await fetch("/me");
  const me = await result.json();
  if (me.grade != "master") {
    alert("관리자 전용 페이지 입니다");
    // location.href = "/boards.html";
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
document.querySelector("#searchbtn").addEventListener("submit", (e) => {
  e.preventDefault();
  word = document.querySelector("#word").value;
  if (word == "") {
    return;
  }
  sta = document.querySelector("select").value;
  location.href = `http://localhost:3000/admin_users.html?page=${page}&sta=${sta}&word=${word}`;
});
async function getList() {
  try {
    const res = await fetch(`/users?page=${page}&sta=${sta}&word=${word}`);
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
async function getcount() {
  const res = await fetch(`/getusercount?page=${page}&sta=${sta}&word=${word}`);
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
        a.href = `http://localhost:3000/admin_user.html?board_no=${elements["BOARD_NO"]}`;
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

//페이지
function printPageNum(now_page = 1) {
  const pagingarea = document.querySelector(".pagination");
  pagingarea.innerHTML = "";
  now_page = Number(now_page);
  console.log(page_num);
  console.log(now_page);
  let button;
  button = document.createElement("button");
  button.innerText = 1;
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = e.target.innerText;
    location.href = `http://localhost:3000/admin_user.html?page=${page}&sta=${sta}&word=${word}`;
  });
  pagingarea.appendChild(button);
  for (
    let i = Math.max(2, now_page - 2);
    i <= Math.min(page_num - 1, now_page + 2);
    i++
  ) {
    button = document.createElement("button");
    button.innerText = i;
    button.className = "page-btn";
    button.addEventListener("click", (e) => {
      page = e.target.innerText;
      location.href = `http://localhost:3000/admin_user.html?page=${page}&sta=${sta}&word=${word}`;
    });
    pagingarea.appendChild(button);
  }
  button = document.createElement("button");
  button.innerText = page_num;
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = e.target.innerText;
    location.href = `http://localhost:3000/admin_user.html?page=${page}&sta=${sta}&word=${word}`;
  });
  pagingarea.appendChild(button);
}
