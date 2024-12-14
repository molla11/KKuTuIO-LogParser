const roomList = document.getElementById("room-list");
const chatList = document.getElementById("Chat");

function addRoomElement(roomTitle, roomNum, creator, time) {
  const roomElement = document.createElement("div");

  roomElement.id = `room-${roomName(roomNum)}`;
  roomElement.className = "rooms-item";

  roomElement.innerHTML = `
        <div class="rooms-channel"></div>
        <div class="rooms-number">${roomNum}</div>
        <div class="rooms-title ellipse">
          <div style="max-width: unset; overflow-x: hidden">${roomTitle ? roomTitle : '<span style="color: red;">알 수 없음</span>'}</div>
        </div>
        <div class="rooms-limit">1명</div>
        <div style="width: 270px">
          <div class="rooms-time">생성 시각: ${time ? time : '<span style="color: red;">알 수 없음</span>'}</div>
          <div class="rooms-creator">생성자: ${creator ? creator : '<span style="color: red;">알 수 없음</span>'}</div>
        </div>
    `;

  roomList.appendChild(roomElement);
}

function addChatElement(userId, content, time) {
  const chatElement = document.createElement("div");
  chatElement.className = "chat-item";

  chatElement.innerHTML = `
    <div class="chat-head ellipse" style="color: black; user-select: none;">${userId}</div>
    <div class="chat-body">${content}</div>
    <div class="chat-stamp">${time.substring(11)}</div>
  `;

  chatElement.childNodes[1].addEventListener("click", () => {
    toggleUserIdChat(chatElement);
  });

  chatList.appendChild(chatElement);
}

function toggleUserIdChat(element) {
  const userIdBox = element.childNodes[1];
  const chatBox = element.childNodes[3];

  [userIdBox.innerText, chatBox.innerText] = [chatBox.innerText, userIdBox.innerText];

  if (userIdBox.style.color == "black") {
    userIdBox.style.color = "blue";
  } else {
    userIdBox.style.color = "black";
  }
}
