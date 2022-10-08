import { Server } from "socket.io";
import { ChannelLog, Channel, ChannelChat } from "../models";

interface IChannelChat {
  id: string;
  uid: string;
  text: string;
  channelID: string;
  createdAt: string;
}

// channelID: [uid]
const channelMap: Record<string, string[]> = {};
// socketID: uid
const userSocketIdMap: Record<string, string> = {};

function getUserIDs(userMap: typeof userSocketIdMap) {
  return new Set(Object.values(userMap));
}

function intervalUser() {
  setInterval(() => {
    const userIDs = getUserIDs(userSocketIdMap);
    for (const [channelID, users] of Object.entries(channelMap)) {
      channelMap[channelID] = users.filter((u) => userIDs.has(u));
    }
  }, 5000);
}

function setupSocket(io: Server) {
  intervalUser();
  io.on("connection", (socket) => {
    console.log("\n--------------- a user connected", socket.id, "\n");

    socket.on("init", (data: { uid: string }) => {
      console.log("\n", ">>>>>>>>>> socket: init", "\n");
      console.log(data.uid, socket.id);
      if (!data?.uid) return;
      userSocketIdMap[socket.id] = data.uid;
      const userIDs = getUserIDs(userSocketIdMap);
      io.emit("users_online", [...userIDs]);
    });

    socket.on("watching", async (data: { channelID: string }) => {
      console.log("\n", ">>>>>>>>>> socket: watching", "\n");

      const uid = userSocketIdMap[socket.id];

      if (!uid) return;

      if (!channelMap[data.channelID]) channelMap[data.channelID] = [];
      if (!channelMap[data.channelID].includes(uid)) {
        channelMap[data.channelID].push(uid);
      }

      const nsp = `channel|${data.channelID}`;

      io.emit(nsp, channelMap[data.channelID]);

      console.log(channelMap);

      const params = {
        eventName: "watch",
        uid: uid,
        channelID: data.channelID,
      };
      await ChannelLog.create(params);
    });

    socket.on("get_users_channel", (data: { channelID: string }) => {
      console.log("\n", ">>>>>>>>>> socket: get_users_channel", "\n");

      const nsp = `channel|${data.channelID}`;

      io.emit(nsp, channelMap[data.channelID] || []);
    });

    socket.on("leave_channel", (data) => {
      console.log("\n", ">>>>>>>>>> socket: leave_channel", "\n");

      if (!channelMap[data.channelID]) return;
      leaveChannel(channelMap, data.channelID, data.uid);

      const nsp = `channel|${data.channelID}`;

      io.emit(nsp, channelMap[data.channelID]);
    });

    socket.on("get_users_online", () => {
      console.log("\n", ">>>>>>>>>> socket: get_users_online", "\n");
      const userIDs = [...getUserIDs(userSocketIdMap)];
      console.log(userIDs);
      socket.emit("users_online", userIDs);
    });

    socket.on("get_hot_channels", async () => {
      console.log("\n", ">>>>>>>>>> socket: get_hot_channels", "\n");

      console.log(channelMap);

      const sortChannels = Object.entries(channelMap)
        .filter(([_, users]) => users.length)
        .slice(0, 5)
        .sort((a, b) => b[1].length - a[1].length);
      const channels = await Promise.all(
        sortChannels.map(async (item) => {
          const [channelID, users] = item;
          return {
            channel: await Channel.findOne({
              where: { id: channelID },
              raw: true,
            }),
            users,
          };
        })
      );
      io.emit("hot_channels", channels);
    });

    socket.on(
      "send_chat",
      async (data: { channelID: string; uid: string; text: string }) => {
        const now = new Date();

        const params: Partial<IChannelChat> = {
          channelID: data.channelID,
          text: data.text,
          uid: data.uid,
          createdAt: now.toISOString(),
        };

        const res = await ChannelChat.create(params);

        // channelChatsMap[data.channelID].push(params);

        io.emit(`channel_chats|${data.channelID}`, res.toJSON());
      }
    );

    // ----------------------- DISCONNECT -----------------------

    socket.on("disconnect", () => {
      console.log("\n", ">>>>>>>>>> socket: disconnect", socket.id, "\n");

      const uid = userSocketIdMap[socket.id];

      console.log(uid, userSocketIdMap);

      if (!uid) return;

      for (const [socketID, userID] of Object.entries(userSocketIdMap)) {
        if (userID === uid) delete userSocketIdMap[socketID];
      }

      for (const [channelID, users] of Object.entries(channelMap)) {
        if (users.includes(uid)) {
          leaveChannel(channelMap, channelID, uid);
          break;
        }
      }
    });
  });
}

function leaveChannel(
  _channelMap: typeof channelMap,
  channelID: string,
  uid: string
) {
  _channelMap[channelID] = _channelMap[channelID].filter(
    (user: string) => user !== uid
  );

  return _channelMap;
}

export default setupSocket;
