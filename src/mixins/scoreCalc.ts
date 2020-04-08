import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ScoreCalc extends Vue {
  get players() {
    return this.$store.getters["ScoreBoard/players"]
  }

  get scores() {
    return this.$store.getters["ScoreBoard/scores"]
  }

  get rule() {
    return this.$store.getters["ScoreBoard/rule"]
  }

  get playerScores() {
    const playerScores: any = []
    this.players.forEach((player: any) => {
      const playerScore: any = []
      this.scores.forEach((scoresItem: any) => {
        scoresItem.forEach((e: any) => {
          if (e.uid === player.uid) playerScore.push({
            score: e.score,
            pt: e.pt,
            rank: e.rank,
          })
        })
      })
      playerScores.push({
        uid: player.uid,
        scores: playerScore
      })
    });
    return playerScores
  }

  getScore(index: number, uid: string) {
    const game = this.scores[index - 1]
    if (!game) return null
    else {
      const score = game.find((score: any) => {
        return score.uid === uid;
      });
      return !score ? null : score.pt
    }
  }

  getTotal(uid: string) {
    const myData = this.playerScores.filter((e: any) => e.uid === uid)[0]
    return myData.scores.reduce((total: number, item: any) => {
      return item.pt + total
    }, 0)
  }

  getYen(uid: string) {
    return this.getTotal(uid) * this.rule.rate * 10
  }

  getChip(uid: string) {
    const chips = this.$store.getters["ScoreBoard/chips"]
    const userChip = chips.find((e: any) => e.uid === uid).chip
    if (userChip || userChip === 0) return userChip * this.rule.chip
    else return null
  }
}