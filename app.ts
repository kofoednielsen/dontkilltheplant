import { WebSocket } from "ws";
import * as sdk from "matrix-js-sdk";
import "dotenv/config";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
if (!ACCESS_TOKEN) {
  throw Error("Missing environment variable ACCESS_TOKEN");
}
console.log(ACCESS_TOKEN);

const main = async () => {
  const matrixClient = sdk.createClient({
    baseUrl: "https://olli.ng:8448",
    accessToken: ACCESS_TOKEN,
    userId: "@plantbot:olli.ng",
  });

  await matrixClient.startClient({ initialSyncLimit: 10 });

  const wsClient = new WebSocket("ws://192.168.1.233/dashws");
  wsClient.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    console.log(data);
    const soilLevel = data.cards.find(
      ({ id, value}: any) => id === 873366061
    ).value;

    if (soilLevel < 10) {
      const content = {
        body: `I am dying! 🌱😱\nSoil Level: ${soilLevel}%`,
        msgtype: "m.text",
      };
      matrixClient.sendEvent(
        "!RGwEkDtOUIOwOUQuku:olli.ng",
        "m.room.message",
        content,
        "",
        (err, res) => {
          console.log(err);
        }
      );
    }
  });
};

console.log("Keeping plant alive 🌱🚑");
main();
