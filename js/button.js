import { setLogContent } from "./logModule";

const LogUploadBtn = document.getElementById("LogUploadBtn");
const LogUploadDialog = document.getElementById("LogUploadDialog");

LogUploadBtn.addEventListener("click", () => {
  LogUploadDialog.style.display = "block";
});

const closeBtns = document.getElementsByClassName("closeBtn");

Array.from(closeBtns).forEach((btn) => {
  btn.addEventListener("click", () => {
    const dialog = btn.closest(".dialog");
    dialog.style.display = "none";
  });
});

const LogConfirmBtn = document.getElementById("LogConfirmBtn");
LogConfirmBtn.addEventListener("click", () => {
  const FileInput = document.getElementById("FileInput");
  const file = FileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (event) {
      const logContent = event.target.result;
      setLogContent(logContent);
    };

    reader.readAsText(file);
  } else {
    alert("파일을 선택하세요.");
  }
});
