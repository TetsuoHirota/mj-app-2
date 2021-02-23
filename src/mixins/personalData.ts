import { Vue, Component } from "vue-property-decorator";
import scoreBoard from "@/store/modules/scoreBoard";

@Component
export default class PersonalData extends Vue {
  get me() {
    return this.$store.getters["User/user"];
  }

  getRanks(scoreBoard: any) {
    const ranks: number[] = [];
    Object.values(scoreBoard.scoress).forEach((data: any) => {
      data.forEach((e: any) => {
        if (e.uid === this.me.uid) ranks.push(e.rank);
      });
    });
    return ranks;
  }

  getRank(ranks: any) {
    const rank: number[] = [0, 0, 0, 0];
    ranks.forEach((e: number) => {
      rank[e - 1] += 1;
    });
    let percent: string[] = [];
    let average = "";
    if (ranks.length !== 0) {
      percent = rank.map((e: number) => ((e / ranks.length) * 100).toFixed(1));
      average = (
        ranks.reduce((a: number, x: number) => a + x, 0) / ranks.length
      ).toFixed(2);
    }
    return {
      matches: ranks.length,
      average: average,
      ranks: ranks,
      rank: rank,
      percent: percent
    };
  }

  getData(scoreBoards: any) {
    let ranks: number[] = [];
    scoreBoards.forEach((scoreBoard: any) => {
      ranks = ranks.concat(this.getRanks(scoreBoard));
    });
    return this.getRank(ranks);
  }
}
