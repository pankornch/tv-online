import { Socket, Server } from "socket.io";
import { IChannelChat } from "../types";
import { Channel, ChannelChat, ChannelLog } from "../models";
import {
  OnGetUsersChannelDTO,
  OnInitDTO,
  OnLeaveChannelDTO,
  OnSendChatDTO,
  OnWatchingDTO,
} from "../types/dto";

class SocketController {
  io: Server;

  userSocketIdMap: Record<string, string> = {};
  channelMap: Record<string, string[]> = {};

  constructor(io: Server) {
    this.configure(io);
  }

  configure(io: Server) {
    this.io = io;
  }

  setup(cb?: (io: Server, socket: Socket) => void) {
    this.intervalClearUser();

    this.io.on("connection", (socket) => {
      console.log("\n--------------- a user connected", socket.id, "\n");
      cb?.call(null, this.io, socket);

      socket
        .on("init", this.onInit.bind(this, socket))
        .on("watching", this.onWatching.bind(this, socket))
        .on("get_users_channels", this.onGetUsersChannel.bind(this, socket))
        .on("leave_channel", this.onLeaveChannel.bind(this, socket))
        .on("get_users_online", this.onGetUsersOnline.bind(this, socket))
        .on("get_hot_channels", this.onGetHotChannels.bind(this, socket))
        .on("send_chat", this.onSendChat.bind(this, socket))
        .on("disconnect", this.onDisconnect.bind(this, socket));
    });
  }

  //   On

  onInit(socket: Socket, data: OnInitDTO) {
    console.log("\n", ">>>>>>>>>> socket: init", "\n");
    console.log(data.uid, socket.id);
    if (!data?.uid) return;
    this.userSocketIdMap[socket.id] = data.uid;
    const userIDs = this.getUserIDs(this.userSocketIdMap);
    this.io.emit("users_online", [...userIDs]);
  }

  async onWatching(socket: Socket, data: OnWatchingDTO) {
    console.log("\n", ">>>>>>>>>> socket: watching", "\n");

    const channel = await Channel.findByPk(data.channelID);
    if (!channel) return;

    const uid = this.userSocketIdMap[socket.id];

    if (!uid) return;

    if (!this.channelMap[data.channelID]) this.channelMap[data.channelID] = [];
    if (!this.channelMap[data.channelID].includes(uid)) {
      this.channelMap[data.channelID].push(uid);
    }

    this.emitUsersChannel(data.channelID);

    const params = {
      eventName: "watch",
      uid: uid,
      channelID: data.channelID,
    };
    await ChannelLog.create(params);
  }

  onGetUsersChannel(_socket: Socket, data: OnGetUsersChannelDTO) {
    console.log("\n", ">>>>>>>>>> socket: get_users_channel", "\n");

    this.emitUsersChannel(data.channelID);
  }

  onLeaveChannel(socket: Socket, data: OnLeaveChannelDTO) {
    console.log("\n", ">>>>>>>>>> socket: leave_channel", "\n");

    const uid = this.userSocketIdMap[socket.id];

    if (!this.channelMap[data.channelID]) return;
    this.leaveChannel(this.channelMap, data.channelID, uid);

    this.emitUsersChannel(data.channelID);
  }

  onGetUsersOnline(socket: Socket) {
    console.log("\n", ">>>>>>>>>> socket: get_users_online", "\n");
    const userIDs = [...this.getUserIDs(this.userSocketIdMap)];
    console.log(userIDs);
    socket.emit("users_online", userIDs);
  }

  async onGetHotChannels(_socket: Socket) {
    console.log("\n", ">>>>>>>>>> socket: get_hot_channels", "\n");

    const sortChannels = Object.entries(this.channelMap)
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

    this.io.emit("hot_channels", channels);
  }

  async onSendChat(socket: Socket, data: OnSendChatDTO) {
    console.log("\n", ">>>>>>>>>> socket: send_chat", "\n");

    const channel = await Channel.findByPk(data.channelID);
    if (!channel) return;

    const now = new Date();

    const uid = this.userSocketIdMap[socket.id];
    if (!uid) return;

    const params: Partial<IChannelChat> = {
      channelID: data.channelID,
      text: data.text,
      uid: uid,
      createdAt: now.toISOString(),
    };

    const res = await ChannelChat.create(params);

    this.io.emit(`channel_chats|${data.channelID}`, res.toJSON());
  }

  onDisconnect(socket: Socket) {
    console.log("\n", ">>>>>>>>>> socket: disconnect", socket.id, "\n");

    const uid = this.userSocketIdMap[socket.id];

    console.log(uid, this.userSocketIdMap);

    if (!uid) return;

    for (const [socketID, userID] of Object.entries(this.userSocketIdMap)) {
      if (userID === uid) delete this.userSocketIdMap[socketID];
    }

    for (const [channelID, users] of Object.entries(this.channelMap)) {
      if (users.includes(uid)) {
        this.leaveChannel(this.channelMap, channelID, uid);
        break;
      }
    }
  }

  //   Emit

  emitUsersChannel(channelID: string) {
    const nsp = `channel|${channelID}`;
    const users = this.channelMap[channelID];
    this.io.emit(nsp, users);
  }

  //   ---------------------------- utils ----------------------------
  getUserIDs(userMap: typeof this.userSocketIdMap) {
    return new Set(Object.values(userMap));
  }

  leaveChannel(
    _channelMap: typeof this.channelMap,
    channelID: string,
    uid: string
  ) {
    _channelMap[channelID] = _channelMap[channelID].filter(
      (user: string) => user !== uid
    );

    return _channelMap;
  }

  intervalClearUser() {
    setInterval(() => {
      const userIDs = this.getUserIDs(this.userSocketIdMap);
      for (const [channelID, users] of Object.entries(this.channelMap)) {
        this.channelMap[channelID] = users.filter((u) => userIDs.has(u));
        this.emitUsersChannel(channelID);
      }
    }, 5000);
  }

  //   ---------------------------- end of utils ----------------------------
}

export default SocketController;
