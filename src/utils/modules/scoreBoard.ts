import { ScoreBoard } from "@/models";

export const scoreBoardResult = (scoreBoard: ScoreBoard) => {
  const {
    scoress = [],
    players = [],
    rule,
    chips: scoreBoardChips = []
  } = scoreBoard;

  let results: {
    totalPt: number;
    chip: number | null;
    ranks: (number | null)[];
    rankCounts: number[];
    rankPercentages: string[];
    totalRank: number;
    avarageRank: string;
    yen: number;
  }[] = [];

  for (let i = 0; i < players.length; i++) {
    const chip = scoreBoardChips.find(c => c.uid === players[i].uid);
    results.push({
      totalPt: 0,
      chip: chip ? chip.chip : null,
      ranks: [],
      rankCounts: Array(rule.playerNumber).fill(0),
      rankPercentages: [],
      totalRank: 0,
      avarageRank: "",
      yen: 0
    });
  }

  scoress.forEach(scores => {
    scores.forEach(score => {
      players.forEach((player, idx) => {
        if (score.uid === player.uid) {
          const result = results[idx];
          result.totalPt += score.pt || 0;
          result.ranks.push(score.rank);
          if (score.rank !== null) {
            result.totalRank += score.rank;
            result.rankCounts[score.rank - 1] += 1;
          }
        }
      });
    });
  });

  results = results.map(result => {
    const { totalPt, chip, totalRank, rankCounts } = result;
    let yen = totalPt * rule.rate * 10;
    yen += (chip || 0) * rule.chip;
    const avarageRank = (totalRank / scoress.length).toFixed(2);
    const rankPercentages = rankCounts.map(rankCount =>
      ((rankCount / rankCounts.length) * 100).toFixed(1)
    );
    return {
      ...result,
      avarageRank,
      yen,
      rankPercentages
    };
  });

  return results;
};
