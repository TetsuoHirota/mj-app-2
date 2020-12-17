import { UserInfo } from './user';

export interface Rule {
  playerNumber: number;
  rate: number;
  chip: number;
  defaultScore: number;
  round: 'goshya'|'sisya'|'kirisute'|'kiriage';
  tobisyou: number;
  oka: number;
  uma: [number, number];
}

export interface ScoreBoard {
  id: string;
  players: UserInfo[];
  rule: Rule;
  createdAt: Date;
}
