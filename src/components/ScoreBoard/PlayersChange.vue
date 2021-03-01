<template>
  <v-dialog
    v-model="show"
    max-width="400px"
    persistent
    @click:outside="close()"
  >
    <v-card class="player-select" min-height="500px">
      <v-btn icon absolute top right @click="close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-title>プレイヤー設定</v-card-title>
      <v-card-text class="py-5">
        <transition-group name="tr-list">
          <v-card
            v-for="(player, idx) in players"
            :key="player.uid"
            class="item"
            color="rgba(128,128,128,0.05)"
            elevation="0"
            @click="onClickPlayer(idx)"
          >
            <v-list-item two-line>
              <div>
                <v-list-item-title class="primary--text">
                  {{ player.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ player.mid ? `@${player.mid}` : "" }}
                </v-list-item-subtitle>
              </div>
              <v-spacer></v-spacer>
              <transition name="tr-fade">
                <v-btn v-if="!isDeleteMode" class="icon" icon disabled>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  v-if="isDeleteMode"
                  class="icon"
                  icon
                  @click="deletePlayer($event, idx)"
                >
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </transition>
            </v-list-item>
          </v-card>
        </transition-group>
        <v-row class="controls my-5" no-gutters>
          <v-btn class="mr-3" outlined color="primary" @click="addPlayer()">
            <v-icon class="mr-2">mdi-account-plus</v-icon>
            追加
          </v-btn>
          <v-btn
            depressed
            :outlined="!isDeleteMode"
            color="error"
            @click="onClickDeleteModeButton()"
          >
            <v-icon class="mr-2">mdi-account-minus</v-icon>
            削除
          </v-btn>
        </v-row>
        <v-subheader class="caption">
          プレイヤーを変更、削除すると元のプレイヤーのデータは失われます。
        </v-subheader>
      </v-card-text>

      <v-expand-transition>
        <v-card
          v-if="showPlayerInput"
          class="player-input transition-fast-in-fast-out"
        >
          <v-card-text class="player-input__content">
            <div
              class="player-input__item"
              :class="{ 'player-input__item--active': selectedInput === 0 }"
              @click="onPlayerInputClick(0)"
            >
              <v-radio-group v-model="selectedInput" class="mt-0">
                <v-radio :value="0" label="プレイヤー名入力"></v-radio>
              </v-radio-group>
              <v-form ref="form">
                <v-text-field
                  v-model="selectedPlayerName"
                  outlined
                  type="text"
                  label="プレイヤー名"
                  class="flex-grow-0"
                  required
                  :rules="nameRules"
                ></v-text-field>
              </v-form>
            </div>
            <div
              class="player-input__item player-input__item--friend"
              :class="{ 'player-input__item--active': selectedInput === 1 }"
              @click="onPlayerInputClick(1)"
            >
              <v-radio-group v-model="selectedInput" class="mt-0">
                <v-radio :value="1" label="フレンドから選ぶ"></v-radio>
              </v-radio-group>
              <v-sheet class="rounded" outlined>
                <v-list>
                  <v-list-item-group v-model="selectedFriendIdx">
                    <v-list-item
                      v-for="friend in friends"
                      :key="friend.uid"
                      two-line
                    >
                      <v-list-item-avatar>
                        <v-avatar color="grey">
                          <v-icon dark>mdi-account</v-icon>
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ friend.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ friend.mid }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-sheet>
            </div>
          </v-card-text>
          <v-card-actions class="pa-5">
            <v-btn color="primary" text @click="onClickBackButton()">
              戻る
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="onClickSaveButton()">決定</v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";
import { ScoreBoard, UserInfo } from "@/models";
import { userConfig } from "@/config";
import { charCount } from "@/utils";

@Component({
  components: {}
})
export default class PlayersChange extends BaseComponent {
  $refs!: {
    form: any;
  };
  show = true;
  isDeleteMode = false;

  selectedPlayerIdx: number | null = null;
  selectedPlayerName = "";
  selectedFriendIdx: number | null = null;
  selectedInput = 0;

  nameRules = [
    (v: string) => !!v || "名前を入力してください",
    (v: string) =>
      (v && charCount(v) <= userConfig.maxPlayerNameLength) ||
      "名前が長すぎます",
    (v: string) =>
      (v && !this.players.map(p => p.uid).includes(v)) ||
      "IDが重複するため使えません"
  ];

  get showPlayerInput(): boolean {
    if (this.selectedPlayerIdx === null) {
      return false;
    } else {
      return true;
    }
  }

  set showPlayerInput(value: boolean) {
    if (!value) {
      this.selectedPlayerIdx = null;
      this.selectedPlayerName = "";
    }
  }

  get scoreBoard(): ScoreBoard {
    return this.$store.getters["scoreBoard/scoreBoard"];
  }

  get players() {
    return this.scoreBoard.players || [];
  }

  get friends(): UserInfo {
    return this.$store.getters["friends/friends"];
  }

  created() {
    this.$store.dispatch("friends/get");
  }

  open() {
    this.show = true;
  }

  close() {
    this.show = false;
    this.isDeleteMode = false;
  }

  onClickPlayer(idx: number) {
    if (!this.isDeleteMode) {
      this.selectedPlayerIdx = idx;
      this.selectedPlayerName = this.players[idx].name;
    }
  }

  addPlayer() {
    this.isDeleteMode = false;
    this.selectedPlayerIdx = -1;
  }

  deletePlayer(e: Event, idx: number) {
    e.stopImmediatePropagation();
    const playersLength = this.players.length;
    const minPlayerNumber = this.scoreBoard.rule.playerNumber;
    if (playersLength <= minPlayerNumber) {
      this._error(`${minPlayerNumber}人以下にはできません`);
    } else {
      const result = confirm("本当に削除しますか？");
      if (result) {
        this.$store.dispatch("scoreBoard/deletePlayer", idx);
      }
    }
  }

  onClickDeleteModeButton() {
    this.isDeleteMode = !this.isDeleteMode;
  }

  onClickBackButton() {
    this.showPlayerInput = false;
  }

  onClickSaveButton() {
    if (this.selectedInput === 0) {
      if (this.$refs.form.validate()) {
        this.savePlayerAsTextInput();
      }
    } else if (this.selectedInput === 1) {
      this.savePlayerAsFriend();
    }
  }

  savePlayerAsTextInput() {
    const player: UserInfo = {
      mid: "",
      name: this.selectedPlayerName,
      uid: this.selectedPlayerName
    };
    if (this.selectedPlayerIdx === -1) {
      this.$store
        .dispatch("scoreBoard/addPlayer", player)
        .then(() => {})
        .catch(err => this._error(err));
      this.showPlayerInput = false;
    } else {
      // this.$store.dispatch("scoreBoard/changePlayer", {
      //   idx: this.selectedPlayerIdx,
      //   player
      // });
    }
  }

  savePlayerAsFriend() {}

  onPlayerInputClick(idx: number) {
    this.selectedInput = idx;
    this.$refs.form.resetValidation();
  }
}
</script>

<style lang="scss" >
.player-select {
  .item {
    margin-bottom: 10px;
  }

  .item:last-child {
    margin-bottom: 0;
  }

  .icon {
    position: absolute;
    right: 15px;
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  &__item {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
    opacity: 0.5;
    * {
      pointer-events: none;
    }
    &--active {
      * {
        pointer-events: auto;
      }
      opacity: 1;
    }
  }

  &__item--friend {
    flex: 1;
    .v-sheet {
      flex: 1;
    }
  }
}
</style>
