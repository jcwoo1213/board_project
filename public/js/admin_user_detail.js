//////해당 페이지에서 페이징은 저장하고 자름
let login;
let list;
getme();
//로그인 여부 검사
async function getme() {
  const result = await fetch("/me");
  console.log(result);
  //로그인 안했으면 로그인 페이지로 이동
  // if (result.status == 401) {
  //   alert("로그인 해주세요.");
  //   location.href = "/login.html";
  //   return;
  // }
  const me = await result.json();
  //로그인 하였지만 관리자가 아니면 다시 돌아감
  // if (me.grade != "master") {
  //   alert("관리자 전용 페이지 입니다");
  //   location.href = "/boards.html";
  //   return;
  // }
  document.querySelector(".brand-title").innerText = me.name;
}

//유저 상세정보 받아오기
async function getuser() {
  const urlParams = new URLSearchParams(location.search);

  const target = urlParams.get("id");
  console.log(target);
  const res = await fetch(`/user?id=${target}`);
  const result = await res.json();
  document.getElementById("id").innerText = result[0].ID;
  document.getElementById("name").innerText = result[0].USER_NAME;
  document.getElementById("email").innerText = result[0].EMAIL;
  document.getElementById("grade").innerText = result[0].GRADE;
  document.getElementById("canuse").innerText = result[0].CANUSE;
}
// 유저가 작성한 글 받아오기
async function getlist() {
  const urlParams = new URLSearchParams(location.search);
  const id = urlParams.get("id");
  const result = await fetch(`/getboardlist?id=${id}`);
  const res = await result.json();
  list = res;
  printlist(list);
}
//유저가 작성한 글 출력(출력)
function printlist(list, page = 1) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  let num = list.length;

  if (num <= 10) {
    list.forEach((elements) => {
      const tr = document.createElement("tr");
      for (const key in elements) {
        const td = document.createElement("td");
        if (key == "TITLE") {
          const a = document.createElement("a");
          a.innerText = elements[key];
          a.href = `admin_board.html?board_no=${elements["TITLE"]}`;
          td.appendChild(a);
        } else {
          td.innerText = elements[key];
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
  } else {
    for (let i = (page - 1) * 10; i < page * 10; i++) {
      const tr = document.createElement("tr");
      for (const key in list[i]) {
        const td = document.createElement("td");
        if (key == "TITLE") {
          const a = document.createElement("a");
          a.innerText = list[i][key];
          a.href = `admin_board.html?board_no=${list[i]["TITLE"]}`;
          td.appendChild(a);
        } else {
          td.innerText = list[i][key];
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    printPageNum(page, Math.ceil(num / 10));
  }
}
//페이지 넘버 출력
function printPageNum(now_page = 1, page_num) {
  const pagingarea = document.querySelector(".pagination");
  pagingarea.innerHTML = "";
  now_page = Number(now_page);

  let button;
  button = document.createElement("button");
  button.innerText = "<<";
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = 1;
    printlist(list, page);
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
      printlist(list, page);
    });
    pagingarea.appendChild(button);
  }
  button = document.createElement("button");
  button.innerText = ">>";
  button.className = "page-btn";
  button.addEventListener("click", (e) => {
    page = page_num;
    printlist(list, page);
  });
  pagingarea.appendChild(button);
}
getuser();
getlist();
