import { Round } from "@/models";

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

function round(round: Round, score: number) {
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

export { gosya, sisya, kirisute, kiriage, round };
