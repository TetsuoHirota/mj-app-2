<template>
  <v-dialog v-model="show" max-width="400px">
    <v-card>
      <v-card-title>
        <h3 class="display-1 font-weight-medium grey--text">プレイヤー変更</h3>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-row
          v-for="(player, index) in players"
          :key="player.uid"
          class="playerRow px-4 py-2"
        >
          <h4 :class="{ 'teal--text': player.isLinked }">{{ player.name }}</h4>
          <v-spacer></v-spacer>
          <v-btn icon @click="changePlayer(index)">
            <v-icon>{{ icons.mdiPencil }}</v-icon>
          </v-btn>
          <v-btn icon @click="deletePlayer(player, index)">
            <v-icon>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
        </v-row>

        <transition name="error">
          <v-alert type="error" class="py-2 mt-6 mb-0" v-if="errorMessage">
            {{ errorMessage }}
          </v-alert>
        </transition>

        <v-row justify="center">
          <v-btn outlined color="primary" class="my-8" @click="addPlayer">
            <v-icon class="mr-2">{{ icons.mdiAccountPlus }}</v-icon>
            追加
          </v-btn>
        </v-row>
        <v-subheader class="caption"
          >プレイヤーを変更、削除すると元のプレイヤーのデータは失われます。</v-subheader
        >
      </v-card-text>
    </v-card>

    <PlayerSearch ref="playerSearch" />
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PlayerSearch from "./PlayerSearch.vue";

@Component({
  components: {
    PlayerSearch,
  },
})
export default class PlayersChange extends Vue {
  show = false;

  @Watch("show")
  reset() {
    this.errorMessage = "";
  }

  errorMessage = "";

  get players() {
    return this.$store.getters["ScoreBoard/players"];
  }

  get rule() {
    return this.$store.getters["ScoreBoard/rule"];
  }

  open() {
    this.show = true;
  }

  deletePlayer(player: any, index: number) {
    const playersLength = this.players.length;
    const playersRule = this.rule.players;
    if (playersLength <= playersRule)
      this.errorMessage = `${playersRule}人以下にはできません`;
    else {
      this.errorMessage = "";
      const result = confirm("本当に削除しますか？");
      if (result)
        this.$store.dispatch("ScoreBoard/deletePlayer", {
          player: player,
          index: index,
        });
    }
  }

  changePlayer(index: number) {
    this.errorMessage = "";
    (this.$refs as any).playerSearch.open(false, index);
  }

  addPlayer() {
    this.errorMessage = "";
    (this.$refs as any).playerSearch.open(true, -1);
  }
}
</script>

<style lang="scss" scoped>
.playerRow {
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  &:first-of-type {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
  h4 {
    flex: 0 0 100px;
  }
}

.error {
  &-enter-active,
  &-leave-active {
    transition: all 0.5s;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
