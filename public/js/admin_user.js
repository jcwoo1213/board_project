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
document.querySelector(".select").value = sta;
document.querySelector("#word").value = word;
document.querySelector("#searchbtn").addEventListener("click", (e) => {
  word = document.querySelector("#word").value;
  if (word == "") {
    return;
  }
  sta = document.querySelector("select").value;
  location.href = `admin_user.html?page=${page}&sta=${sta}&word=${word}`;
});
//목록 받아오기
async function getList() {
  try {
    const res = await fetch(`/users?page=${page}&sta=${sta}&word=${word}`);
    const result = await res.json();
    await getcount();
    document.querySelector(".pill").innerText = `Total ${qry_cnt}`;
    page_num = Math.ceil(qry_cnt / viewcnt);
    printlist(result);
    printPageNum(page);
    console.log(qry_cnt);
  } catch (err) {
    console.log(err);
  }
}
getList();
//총갯수 받아오기
async function getcount() {
  const res = await fetch(`/getusercount?page=${page}&sta=${sta}&word=${word}`);
  const result = await res.json();
  qry_cnt = result[0].COUNT;
}
//출력
function printlist(list) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  list.forEach((elements) => {
    const tr = document.createElement("tr");
    for (const key in elements) {
      const td = document.createElement("td");
      const element = elements[key];
      if (key == "ID") {
        const a = document.createElement("a");
        a.href = `admin_user_detail.html?id=${element}`;
        a.innerText = elements[key];
        td.appendChild(a);
      } else if (key == "CANUSE") {
        const btn = document.createElement("button");
        if (element == "true") {
          btn.innerText = "비활성화";
        } else {
          btn.innerText = "활성화";
        }
        btn.classList.add("btn", "danger", "sm");
        btn.dataset.id = elements["ID"];
        btn.dataset.canuse = element;
        btn.addEventListener("click", updateuser);
        tr.appendChild(btn);
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
  button.innerText = "<<";
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = 1;
    location.href = `admin_user.html?page=${page}&sta=${sta}&word=${word}`;
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
      location.href = `admin_user.html?page=${page}&sta=${sta}&word=${word}`;
    });
    pagingarea.appendChild(button);
  }
  button = document.createElement("button");
  button.innerText = ">>";
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = page_num;
    location.href = `admin_user.html?page=${page}&sta=${sta}&word=${word}`;
  });
  pagingarea.appendChild(button);
}
//유저 활성화 관리
async function updateuser(e) {
  const target = await e.target.dataset;
  const data = { id: target.id, canuse: target.canuse };
  const result = await fetch(`/updateuser`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const res = await result.json();
  console.log(res);
  if (res.retcode == "20") {
    alert("성공적으로 변경되었습니다");
    location.reload();
  } else {
    alert("변경실패");
  }
}
