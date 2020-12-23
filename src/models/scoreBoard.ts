import { UserInfo } from './user';

export interface Rule {
  playerNumber: number;
  rate: number;
  chip: number;
  defaultScore: number;
  round: 'goshya' | 'sisya' | 'kirisute' | 'kiriage';
  tobisyou: number;
  oka: number;
  uma4?: [number, number];
  uma3?: [number, number];
  uma: [number, number]
}

export interface Score {
  uid: string,
  pt: number,
  score: number,
  rank: number
}

export interface ScoreBoard {
  id?: string,
  players: UserInfo[];
  scores: Score[][];
  rule: Rule;
  createdAt: Date;
}
