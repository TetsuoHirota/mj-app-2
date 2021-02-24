import { UserInfo } from "./user";
import "firebase/firestore";

export type Round = "goshya" | "sisya" | "kirisute" | "kiriage";
export interface Rule {
  playerNumber: number;
  rate: number;
  chip: number;
  defaultScore: number;
  round: Round;
  tobisyou: number;
  oka: number;
  uma4?: [number, number];
  uma3?: [number, number];
  uma: [number, number];
}

export interface Score {
  uid: string;
  pt: number | null;
  score: number | null;
  rank: number | null;
}

export interface ScoreBoard {
  id?: string;
  players: UserInfo[];
  scoress: Score[][];
  rule: Rule;
  createdAt: Date
}

export type InputMode = "pt" | "score";
