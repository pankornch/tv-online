import { Request, Response } from "express";
import Joi from "joi";
import { Channel, ChannelChat, ChannelLog } from "../../models";
import { IChannel } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import { getDate } from "../../utils/helper";

export async function adminCreateChannel(req: Request, res: Response) {
  const { value, error } = Joi.object<Partial<IChannel>>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    name: Joi.string().required(),
    image: Joi.string().required(),
    url: Joi.string().uri().required(),
  }).validate(req.body);

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  try {
    const params = Object.assign(value, { id: uuidv4() });
    const channel = await Channel.create(params);
    res.status(201).json(channel.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function adminUpdateChannel(req: Request, res: Response) {
  const { value, error } = Joi.object<Partial<IChannel>>({
    title: Joi.string(),
    description: Joi.string(),
    name: Joi.string(),
    image: Joi.string(),
    url: Joi.string().uri(),
  }).validate(req.body);

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  const { id } = req.params;

  try {
    const channel = await Channel.findOne({ where: { id } });

    if (!channel) {
      res.status(400).json({ message: "channel not found" });
      return;
    }

    await Channel.update(value, { where: { id } });
    const updatedChannel = { ...channel, ...value };
    res.json(updatedChannel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function adminDeleteChannel(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const channel = await Channel.findOne({ where: { id } });

    if (!channel) {
      res.status(400).json({ message: "channel not found" });
      return;
    }

    await Channel.destroy({ where: { id } });
    res.json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function adminGetChannleLogByChannelID(
  req: Request,
  res: Response
) {
  const { channelID } = req.params;
  const date = (req.query.date as string) || new Date();

  const startDate = getDate(date);
  const _endDate = new Date(date);
  _endDate.setDate(_endDate.getDate() + 1);
  const endDate = getDate(_endDate);

  try {
    const channelLog = await ChannelLog.findAll({
      raw: true,
      where: {
        channelID,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    res.json(channelLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function adminGetChannelLogByUID(req: Request, res: Response) {
  const { uid } = req.params;
  try {
    const channelLog = await ChannelLog.findAll({
      where: {
        uid,
      },
      include: [Channel],
    });

    res.json(JSON.parse(JSON.stringify(channelLog)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function adminGetChannelChatsByChannelID(
  req: Request,
  res: Response
) {
  const { channelID } = req.params;

  try {
    const chats = await ChannelChat.findAll({
      where: { channelID },
      raw: true,
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
