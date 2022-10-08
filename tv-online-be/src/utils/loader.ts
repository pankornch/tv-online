import CHANNELS from "../data/channel.json";
import Channel from "../models/channel";

async function loader() {
  await Channel.sync({ force: true });
  try {
    await Promise.all(
      CHANNELS.channels.map((channel) => {
        return Channel.create({
          id: channel.id,
          name: channel.name,
          url: channel.url,
          title: "Lorem ipsum dolor sit amet, consectetur",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          image: "https://via.placeholder.com/150",
        });
      })
    );
    console.log("DONE");
  } catch (error) {
    console.error("-------------------------------------", error);
  }
}

loader();
