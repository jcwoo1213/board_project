//회원가입 영역
let id;
//중복체크
async function check() {
  id = document.querySelector("#userId").value;
  const res = await fetch(`/check?id=${id}`);
  const result = await res.json();
  if ((await result.code) == 200) {
    if (result.usable == "사용가능") {
      alert("사용가능한 아이디 입니다");
      document.querySelector("#usable").value = "true";
    } else {
      alert("사용중인 아이디 입니다");
    }
  } else {
    alert("error");
    console.log(res);
  }
}
//id 변경되면 중복체크 안했다고 변경
document.querySelector("#userId").addEventListener("input", () => {
  document.querySelector("#usable").value = "false";
});
//회원가입
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  id = document.querySelector("#userId");
  if (id.value == "") {
    alert("아이디를 입력하세요");
    id.focus();
    return;
  }
  const id_che = document.querySelector("#usable");
  if (id_che.value == "false") {
    alert("아이디 중복체크 하세요");
    return;
  }
  const pw = document.querySelector("#userPw");
  const pwchk = document.querySelector("#userPwChk");
  if (pw.value != pwchk.value) {
    alert("비밀번호가 일치하지 않습니다");
    pw.focus();
    return;
  }
  const name = document.querySelector("#userName");
  if (name.value == "") {
    alert("이름을 입력하세요");
    name.focus();
    return;
  }
  const email = document.querySelector("#email");
  if (email.value == "") {
    email.focus();
    alert("email을 입력하세요");
    return;
  }
  const user = {
    id: id.value,
    pw: pw.value,
    name: name.value,
    email: email.value,
  };
  console.log(user);
  const res = await fetch("/signup", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const result = await res.json();
  if ((result.code = 200 && result.result == "성공")) {
    alert("가입되었습니다");
    location.href = "/login.html";
  } else {
    alert("실패");
  }
});
