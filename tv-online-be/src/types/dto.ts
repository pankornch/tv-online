export interface OnInitDTO {
  uid: string;
}

export interface OnWatchingDTO {
  channelID: string;
}

export interface OnGetUsersChannelDTO {
  channelID: string;
}

export interface OnLeaveChannelDTO {
  channelID: string;
}

export interface OnSendChatDTO {
  channelID: string;
  text: string;
}
