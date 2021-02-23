import { ScoreBoard, Score, Rule, Round } from "@/models/scoreBoard";
import { UserInfo } from "@/models/user";

export function getPlayerResults(scoreBoard: ScoreBoard) {
  const results: {
    [uid: string]: {
      ranks: { index: number; rank: number }[];
      avarageRank: number;
    };
  } = {};
  const players = scoreBoard.players;
  return 3;
}

interface ScoreBoardResult extends ScoreBoard {
  table: {
    uid: string;
    pt: number | null;
    score: number | null;
    rank: number | null;
    isMinus: boolean;
  }[][];
}

function gosya(score: number) {
  const int = Math.floor(score / 1000);
  const dec = score % 1000;
  let ans = 0;
  if (int >= 0) {
    if (dec >= 600) {
      ans = int + 1;
    } else {
      ans = int;
    }
  } else if (int < 0) {
    if (dec <= -600 || dec == 0) {
      ans = int;
    } else {
      ans = int + 1;
    }
  }
  return ans;
}

function sisya(score: number) {
  const int = Math.floor(score / 1000);
  const dec = score % 1000;
  let ans = 0;
  if (int >= 0) {
    if (dec >= 500) {
      ans = int + 1;
    } else {
      ans = int;
    }
  } else if (int < 0) {
    if (dec <= -500 || dec == 0) {
      ans = int;
    } else {
      ans = int + 1;
    }
  }
  return ans;
}

function kiriage(score: number) {
  const int = Math.floor(score / 1000);
  const dec = score % 1000;
  let ans = 0;
  if (score > 0) {
    if (dec > 0) {
      ans = int + 1;
    } else {
      ans = int;
    }
  } else if (score < 0) {
    if (dec >= 0) {
      ans = int;
    } else {
      ans = int + 1;
    }
  }
  return ans;
}

function kirisute(score: number) {
  const int = Math.floor(score / 1000);
  const dec = score % 1000;
  let ans = 0;
  if (score >= 0) {
    ans = int;
  } else if (score < 0) {
    if (dec > 0) {
      ans = int - 1;
    } else {
      ans = int;
    }
  }
  return ans;
}

// 清算方法
export function round(round: Round, score: number) {
  let rounded = 0;
  switch (round) {
    case "goshya":
      rounded = gosya(score);
      break;
    case "sisya":
      rounded = sisya(score);
      break;
    case "kirisute":
      rounded = kirisute(score);
      break;
    case "kiriage":
      rounded = kiriage(score);
      break;
  }
  return rounded;
}
