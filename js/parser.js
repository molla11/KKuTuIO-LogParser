const regex = /\[(.*?)\]\[([\w가-힣]+(?:\(손님\))?)-(MASTER|SLAVE-\d{1,2})\/(.*?)\]: (.*)/;
const regexForMsg = /\[([\d\.]+)\] Room @(.*?) Msg #(.*?): ({.*})/;

const rooms = new Map();
let roomCnt = [];
for (let i = 0; i < 1000; i++) {
  roomCnt.push(0);
}

let waitingRoom = [];

function parseLog() {
  const data = getLogContent();
  const lines = data.split("\n");

  for (const line of lines) {
    const parsed = parse(line);
    if (!parsed) continue;

    if (parsed.isMsg) {
      switch (parsed.content.type) {
        case "enter":
          if (parsed.content.hasOwnProperty("id")) {
            // id 속성 있음: 방 입장 기록 (생성 x)
            enterRoom(parsed.content.id, parsed.userId);
          } else {
            // else: 방 생성 기록
            waitMatchingRoom(parsed.userId, parsed.content.title);
          }
          break;

        default:
          break;
      }
    }

    if (!parsed.isMsg) {
      switch (parsed.content.type) {
        case "enter":
          matchRoom(parsed.userId, parsed.roomNum);
          break;

        default:
          break;
      }
    }
  }
}

function parse(line) {
  const match = line.match(regex);
  if (!match) return; // 마지막 줄: null.

  const [, time, location, hierarchy, logType, remains] = match; // [time][location]: remains

  const isMsg = remains[0] == "[";

  // Msg가 아니라, 다른 정보일 경우
  if (!isMsg) return parseNotMsg(match);

  const remainsMatch = remains.match(regexForMsg);
  if (!remainsMatch) return;
  const [, ip, roomNum, userId, content] = remainsMatch;

  return {
    isMsg,
    time,
    serverName: location.replace(/\(손님\)/, ""),
    isGuest: /\(손님\)/.test(location),
    hierarchy,
    logType,
    ip,
    roomNum,
    userId,
    content: JSON.parse(content),
  };

  function parseNotMsg(match) {
    const [, time, location, hierarchy, logType, remains] = match;

    // 방 입장 로그
    if (remains.slice(-10, remains.length) == "방에 입장했습니다.") {
      const enterMatch = remains.match(/.*?\((.*?)\) 님이 (\d{1,3})번 방에 입장했습니다./);
      return {
        isMsg: false,
        time,
        serverName: location.replace(/\(손님\)/, ""),
        isGuest: /\(손님\)/.test(location),
        hierarchy,
        logType,
        roomNum: enterMatch[2],
        userId: enterMatch[1],
        content: {
          type: "enter",
        },
      };
    }
  }
}

function enterRoom(roomNum, userId) {
  if (roomCnt[roomNum] == 0) {
    makeRoom(null, roomNum, userId, false);
    return;
  }

  const room = rooms.get(roomName(roomNum));
  room.members.push(userId);
}

function makeRoom(roomTitle, roomNum, userId, logExist) {
  roomCnt[roomNum]++;
  console.log(roomTitle, userId, roomNum, roomCnt[roomNum], logExist);
  rooms.set(roomName(roomNum), {
    roomNum: roomNum,
    roomTitle,
    members: [userId],
    logExist,
  });
}

function roomName(roomNum) {
  return roomNum + "-" + roomCnt[roomNum];
}

function waitMatchingRoom(userId, roomTitle) {
  waitingRoom.push([userId, roomTitle]);
}

function matchRoom(userId, roomNum) {
  if (waitingRoom.length == 0) {
    if (roomCnt[roomNum] == 0) makeRoom(null, roomNum, userId, false);
    return false;
  } else {
    for (let i = 0; i < waitingRoom.length; i++) {
      if (waitingRoom[i][0] == userId) {
        makeRoom(waitingRoom[i][1], roomNum, userId, true);
        waitingRoom.splice(i, 1);
      }
    }
  }

  return false;
}
