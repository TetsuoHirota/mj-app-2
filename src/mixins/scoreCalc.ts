import { Vue, Component } from "vue-property-decorator";

@Component
export default class ScoreCalc extends Vue {
  get players() {
    return this.$store.getters["ScoreBoard/players"];
  }

  get scores() {
    return this.$store.getters["ScoreBoard/scores"];
  }

  get rule() {
    return this.$store.getters["ScoreBoard/rule"];
  }

  get playerScores() {
    const playerScores: any = [];
    this.players.forEach((player: any) => {
      const playerScore: any = [];
      this.scores.forEach((scoresItem: any) => {
        scoresItem.forEach((e: any) => {
          if (e.uid === player.uid)
            playerScore.push({
              score: e.score,
              pt: e.pt,
              rank: e.rank
            });
        });
      });
      playerScores.push({
        uid: player.uid,
        scores: playerScore
      });
    });
    return playerScores;
  }

  getScore(index: number, uid: string) {
    const game = this.scores[index - 1];
    if (!game) return null;
    else {
      const score = game.find((score: any) => {
        return score.uid === uid;
      });
      return !score ? null : score.pt;
    }
  }

  getTotal(uid: string) {
    const myData = this.playerScores.filter((e: any) => e.uid === uid)[0];
    return myData.scores.reduce((total: number, item: any) => {
      return item.pt + total;
    }, 0);
  }

  getYen(uid: string) {
    return this.getTotal(uid) * this.rule.rate * 10 + Number(this.getChip(uid));
  }

  getChip(uid: string) {
    const chips = this.$store.getters["ScoreBoard/chips"];
    const userChip = chips.find((e: any) => e.uid === uid);
    if (userChip && (userChip.chip || userChip.chip === 0))
      return userChip.chip * this.rule.chip;
    else return null;
  }

  getRank(uid: string) {
    const ranks: number[] = [];
    this.scores.forEach((data: any) => {
      data.forEach((e: any) => {
        if (e.uid === uid) ranks.push(e.rank);
      });
    });
    const rank: number[] = [0, 0, 0, 0];
    ranks.forEach((e: number) => {
      rank[e - 1] += 1;
    });
    let percent: string[] = [];
    let average = "";
    if (ranks.length !== 0) {
      percent = rank.map((e: number) => ((e / ranks.length) * 100).toFixed(1));
      average = (ranks.reduce((a, x) => a + x, 0) / ranks.length).toFixed(2);
    }
    return {
      average: average,
      rank: rank,
      percent: percent
    };
  }
}
