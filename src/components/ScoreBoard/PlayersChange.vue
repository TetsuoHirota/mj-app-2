<template>
  <v-dialog
    v-model="show"
    max-width="400px"
    persistent
    @click:outside="close()"
  >
    <v-card class="player-select">
      <v-btn icon absolute top right @click="close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-title>プレイヤー変更</v-card-title>
      <v-card-text>
        <v-col>
          <v-list>
            <v-list-item
              v-for="(player, idx) in players"
              :key="player.uid"
              two-line
              class="item"
              :class="{ 'item--delete': isDeleteMode }"
              @click="onClickPlayer(idx)"
            >
              <div>
                <v-list-item-title class="primary--text">
                  {{ player.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ player.mid ? `@${player.mid}` : "" }}
                </v-list-item-subtitle>
              </div>
              <v-spacer></v-spacer>
              <v-icon>mdi-pencil</v-icon>
              <v-btn
                v-if="isDeleteMode"
                class="delete"
                icon
                @click="deletePlayer(idx)"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <v-row class="controls my-5" no-gutters>
            <v-btn class="mr-3" outlined color="primary" @click="addPlayer">
              <v-icon class="mr-2">mdi-account-plus</v-icon>
              追加
            </v-btn>
            <v-btn
              elevation="0"
              :outlined="!isDeleteMode"
              color="error"
              @click="isDeleteMode = !isDeleteMode"
            >
              <v-icon class="mr-2">mdi-account-minus</v-icon>
              削除
            </v-btn>
          </v-row>
          <transition name="error">
            <v-alert v-if="errorMessage" type="error" class="py-2 mt-6 mb-0">
              {{ errorMessage }}
            </v-alert>
          </transition>
          <v-subheader class="caption">
            プレイヤーを変更、削除すると元のプレイヤーのデータは失われます。
          </v-subheader>
        </v-col>
      </v-card-text>

      <v-expand-transition>
        <v-card
          v-if="reveal"
          class="transition-fast-in-fast-out player-input d-flex flex-column"
        >
          <v-card-text style="flex: 1">
            <v-col class="d-flex flex-column" style="height: 100%">
              <v-form ref="form">
                <v-text-field
                  outlined
                  type="text"
                  label="プレイヤー名"
                  hide-details
                ></v-text-field>
              </v-form>
              <v-subheader>フレンドから選ぶ</v-subheader>
              <v-list class="list">
                <v-list-item v-for="friend in friends" :key="friend.uid">
                  <v-list-item-avatar>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content class="ma-0 pa-0">
                    <v-list-item-title
                      class="font-weight-medium"
                    ></v-list-item-title>
                    <v-list-item-subtitle></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-card-text>
          <v-card-actions class="pa-5">
            <v-btn color="primary" text @click="reveal = false">戻る</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="reveal = false">決定</v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ScoreBoard } from "@/models/scoreBoard";

@Component({
  components: {}
})
export default class PlayersChange extends Vue {
  isDeleteMode = false;
  errorMessage = "";
  show = true;
  reveal = false;
  friends: { uid: string }[] = [];

  get scoreBoard(): ScoreBoard {
    return this.$store.getters["scoreBoard/scoreBoard"];
  }

  get players() {
    return this.scoreBoard.players || [];
  }

  open() {
    this.show = true;
  }

  close() {
    this.show = false;
    this.isDeleteMode = false;
    this.errorMessage = "";
  }

  onClickPlayer(idx: number) {
    // this.$refs.playerChange.open(false, idx);
    this.reveal = true;
  }

  deletePlayer(idx: number) {
    // const playersLength = this.players.length;
    // const playersRule = this.rule.playerNumber;
    // if (playersLength <= playersRule)
    //   this.errorMessage = `${playersRule}人以下にはできません`;
    // else {
    //   this.errorMessage = "";
    //   const result = confirm("本当に削除しますか？");
    //   if (result)
    //     this.$store.dispatch("ScoreBoard/deletePlayer", {
    //       player: player,
    //       idx: idx
    //     });
    // }
  }

  changePlayer(idx: number) {
    this.errorMessage = "";
    (this.$refs as any).playerSearch.open(false, idx);
  }

  addPlayer() {
    this.errorMessage = "";
    (this.$refs as any).playerSearch.open(true, -1);
  }
}
</script>

<style lang="scss" scoped>
.player-select {
  .item {
    position: relative;
    margin-bottom: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
    transition: margin-right 300ms;
  }

  .item:last-child {
    margin-bottom: 0;
  }

  .item--delete {
    margin-right: 30px;
    .delete {
      position: absolute;
      top: 50%;
      left: calc(100% + 10px);
      transform: translateY(-50%);
    }
  }

  .controls .v-btn {
    flex-grow: 1;
  }

  .controls .v-btn:hover::before {
    opacity: 0;
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
}

.player-input {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;

  .list {
    flex-grow: 1;
    overflow-y: auto;
    background-color: #f5f5f5;
  }
}
</style>
