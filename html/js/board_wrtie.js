//작성
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.querySelector(`input[name="title"]`).value;
  const content = document.querySelector(`textarea[name="content"]`).value;
  const data = { title, content };
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
        window.location.href = "http://localhost:3000/boards.html";
      } else {
        alert("실패하였습니다");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
