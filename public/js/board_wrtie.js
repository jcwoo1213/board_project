let login;
getme();
//로그인 했는지 검사
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
//작성
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector(`input[name="title"]`).value;
  const content = document.querySelector(`textarea[name="content"]`).value;
  const data = { title, content, writer: login.id };
  fetch("/board_write", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      console.log(result);
      if (result.title == title && result.content == content) {
        alert("정상적으로 처리되었습니다");
        window.location.href = "boards.html";
      } else {
        alert("실패하였습니다");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
