import { IStudioApiResponse, Role } from "./Auth";

export interface IChannelApiData {
  id: string;
  name: string;
  type: string;
}

export type ChannelInfoProps = {
  channelName: string;
  channelId: string;
  channelType: string;
  studioName: string;
  studioId: string;
  studioType: string;
};

export type IFinal = [number, boolean];
export interface IApiResponseChannelData {
  uid: string;
  name: string;
  summary: string;
  type: string;
  studio: IStudioApiResponse;
  lang: string;
  status: number;
  created_at: string;
  updated_at: string;
  role?: Role;
  final?: IFinal[];
}
export interface IApiResponseChannel {
  ok: boolean;
  message: string;
  data: IApiResponseChannelData;
}
export interface IApiResponseChannelList {
  ok: boolean;
  message: string;
  data: {
    rows: IApiResponseChannelData[];
    count: number;
  };
}
