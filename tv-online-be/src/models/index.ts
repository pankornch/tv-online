import User from "./user";
import Channel from "./channel";
import ChannelLog from "./channelLog";
import ChannelChat from "./channelChat";

ChannelLog.belongsTo(Channel, {
  foreignKey: {
    name: "channelID",
  },
});

export { User, Channel, ChannelLog, ChannelChat };
