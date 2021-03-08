import { ScoreBoard } from "@/models";

export const scoreBoardResult = (scoreBoard: ScoreBoard) => {
  const {
    scoress = [],
    players = [],
    rule,
    chips: scoreBoardChips = []
  } = scoreBoard;
  const totalPts: number[] = [];
  const chips: (number | null)[] = [];
  console.debug(players);

  for (let i = 0; i < players.length; i++) {
    totalPts.push(0);
    const chip = scoreBoardChips.find(c => c.uid === players[i].uid);

    chips.push(chip ? chip.chip : null);
  }
  scoress.forEach(scores => {
    scores.forEach(score => {
      players.forEach((player, idx) => {
        if (score.uid === player.uid) {
          totalPts[idx] += score.pt || 0;
        }
      });
    });
  });

  const yens = totalPts.map(p => {
    return p * rule.rate;
  });

  return {
    totalPts,
    yens,
    chips
  };
};
