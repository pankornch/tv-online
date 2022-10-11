import { Request, Response } from "express";
import { Channel } from "../models";
import { Op } from "sequelize";

export async function getListChannel(_req: Request, res: Response) {
  const channels = await Channel.findAll();
  res.json(channels.map((e) => e.toJSON()));
}

export async function getChannelById(req: Request, res: Response) {
  const channel = await Channel.findByPk(req.params.id);

  if (!channel) {
    res.status(404).json({ message: "channel not found" });
    return;
  }

  await channel.increment("views");

  res.json(channel.toJSON());
}

export async function getSuggestChannel(req: Request, res: Response) {
  const channelID = req.query.channelID;
  const channels = await Channel.findAll({
    raw: true,
    where: {
      id: {
        [Op.ne]: channelID,
      },
    },
    limit: 4,
    order: [["views", "DESC"]],
  });
  res.json(channels);
}
