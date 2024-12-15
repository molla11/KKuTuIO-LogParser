const roomList = document.getElementById("room-list");
const chatList = document.getElementById("Chat");

function loadRoomList() {
  clearRoomList();
  const keys = Array.from(rooms.keys()).sort();
  for (const key of keys) {
    const value = rooms.get(key);
    console.log(value);
    const roomElement = document.createElement("div");

    roomElement.id = `room-${value.roomNum}`;
    roomElement.className = "rooms-item";

    roomElement.innerHTML = `
        <div class="rooms-channel"></div>
        <div class="rooms-number" style="user-select: none">${value.roomNum}</div>
        <div class="rooms-title ellipse">
          <div style="max-width: unset; overflow-x: hidden">${value.roomTitle ? value.roomTitle : '<span style="color: red;">알 수 없음</span>'}</div>
        </div>
        <div class="rooms-limit">${value.members.size}명</div>
        <div style="width: 270px">
        <div class="rooms-time"><span style="user-select: none">생성 시각: </span>${value.created ? value.created : '<span style="color: red;">알 수 없음</span>'}</div>
        <div class="rooms-creator"><span style="user-select: none">생성자: </span>${value.creator ? value.creator : '<span style="color: red;">알 수 없음</span>'}</div>
        </div>
    `;

    roomElement.addEventListener("click", () => {
      loadChat(key, value.chat);
    });

    roomList.appendChild(roomElement);
  }
}

function clearRoomList() {
  roomList.innerHTML = "";
}

function loadChat(roomNum, chat) {
  clearChat();

  const chatTitleEl = document.querySelector(".ChatBox h5 span");
  chatTitleEl.innerHTML = `<i class="fa-solid fa-comment"></i>Log | 채팅: @${roomNum}`;

  for (let i = 0; i < chat.length; i++) {
    const [chatType, userId, content, time] = chat[i];
    const chatElement = document.createElement("div");

    chatElement.className = "chat-item";
    chatElement.innerHTML = `
      <div class="chat-head ellipse" style="color: black; user-select: none;">${userId}</div>
      <div class="chat-body" style="color: black;">${content}</div>
      <div class="chat-stamp" style="user-select: none;">${chatType} | ${time.substring(11)}</div>
    `;

    switch (chatType) {
      case "relay":
        chatElement.style.backgroundColor = "#adb";
        break;

      case "setRoom":
        chatElement.style.backgroundColor = "#FCC";
        break;

      case "enter":
      case "leave": // intended fall-through
        chatElement.style.backgroundColor = "#CCC";
        break;
    }

    chatElement.childNodes[1].addEventListener("click", () => {
      toggleUserIdChat(chatElement);
    });

    chatList.appendChild(chatElement);
  }
}

function clearChat() {
  chatList.innerHTML = "";
}

function toggleUserIdChat(element) {
  const userIdBox = element.childNodes[1];
  const chatBox = element.childNodes[3];

  [userIdBox.innerText, chatBox.innerText] = [chatBox.innerText, userIdBox.innerText];

  if (chatBox.style.color == "black") {
    chatBox.style.color = "blue";
  } else {
    chatBox.style.color = "black";
  }

  if (userIdBox.style.color == "black") {
    userIdBox.style.color = "blue";
  } else {
    userIdBox.style.color = "black";
  }
}
