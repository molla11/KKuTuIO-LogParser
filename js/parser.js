let parsedLog = [];

function parseLog() {
  const data = getLogContent();
  const lines = data.split("\n");

  for (const line of lines) {
    const parsed = parse(line);
    if (!parsed) continue;

    console.log(parsed);
  }
}

function parse(line) {
  const regex = /\[(.*?)\]\[([\w가-힣]+(?:\(손님\))?)-(MASTER|SLAVE-\d{1,2})\/(.*?)\]: (.*)/;
  const remainsRegex = /\[([\d\.]+)\] Room @(\d+) Msg #(.*?): ({.*})/;

  const match = line.match(regex);
  if (!match) return; // 마지막 줄: null.

  const [, time, location, hierarchy, logType, remains] = match;

  const isMsg = remains[0] == "[";
  if (!isMsg) return; // Msg가 아니라, 다른 정보일 경우

  const remainsMatch = remains.match(remainsRegex);
  if (!remainsMatch) return;
  const [, ip, roomNum, userId, content] = remainsMatch;

  return {
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
}
