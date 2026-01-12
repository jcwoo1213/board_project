document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector("#userId").value;
  const pw = document.querySelector("#userPw").value;
  const user = { id, pw };
  console.log(user);
  const res = await fetch("/login", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const result = await res.json();
  const me = await fetch("/me").then((r) => r.json());
  console.log(me);
  if (result.code == "200" && result.match == "성공") {
    alert("로그인 성공");
    location.href = "/boards.html";
  } else {
    alert("로그인 실패");
  }
});
