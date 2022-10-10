export interface IAccessTokenPayload {
  username: string;
  role: EUserRole;
  iat: number;
  exp: number;
}

export enum EUserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser {
  id: string;
  username: string;
  password: string;
  role: EUserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChannel {
  id: string;
  title: string;
  description: string;
  name: string;
  url: string;
  image: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChannelChat {
  id: string;
  uid: string;
  text: string;
  channelID: string;
  createdAt: string;
}
