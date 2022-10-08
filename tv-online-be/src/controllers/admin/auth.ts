import { Request, Response } from "express";
import Joi from "joi";
import { EUserRole, IUser } from "../../types";
import { User } from "../../models";
import { createAccessToken } from "../../utils/token";
import bcrypt from "bcryptjs";

export async function adminLogin(req: Request, res: Response) {
  const { value, error } = Joi.object<{ username: string; password: string }>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).validate(req.body);

  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const user = await User.findOne({
    where: {
      username: value.username,
    },
  });

  if (!user) {
    res.status(400).json({ message: "username or password incorrect" });
    return;
  }

  const userJson = user.toJSON();

  if (!(await bcrypt.compare(value.password, userJson.password))) {
    res.status(400).json({ message: "username or password incorrect" });
    return;
  }

  const accessToken = createAccessToken({
    username: value.username,
    role: userJson.role,
  });

  delete userJson.password;

  return res.json({
    accessToken,
    user: userJson,
  });
}

export async function adminRegister(req: Request, res: Response) {
  const { value, error } = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).validate(req.body);

  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  try {
    const params: Partial<IUser> = {
      username: value.username,
      password: await bcrypt.hash(value.password, 10),
      role: EUserRole.ADMIN,
    };

    const user = User.build(params);

    await user.save();

    res.json({ message: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
