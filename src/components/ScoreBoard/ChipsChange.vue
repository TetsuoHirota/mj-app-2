<template>
  <v-dialog
    v-model="show"
    max-width="400px"
  >
    <v-card>

      <v-card-title>
        <h3 class="display-1 font-weight-medium grey--text">チップ</h3>
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-row>
          <v-spacer></v-spacer>
          <v-subheader class="autoInput-nav">自動入力</v-subheader>
        </v-row>
        <v-row
          v-for="(chip, index) in chips"
          :key="players[index].uid"
          class="form__li"
        >
          <h4>{{ players[index].name }}</h4>
          <v-text-field
            type="number"
            :value="chip.chip"
            @input="value => changeInput(index, value)"
            class="mx-2"
            suffix="枚"
          >
          </v-text-field>
          <v-btn
            icon
            color="indigo"
            @click="inputAuto(index)"
          >
            <v-icon>{{ icons.mdiCircleEditOutline }}</v-icon>
          </v-btn>
        </v-row>

        <transition name="error">
          <v-alert
            type="error"
            class="py-2 mt-6 mb-0"
            v-if="errorMessage"
          >
            {{ errorMessage }}
          </v-alert>
        </transition>
        
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="show = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="save">保存</v-btn>
      </v-card-actions>

    </v-card>

  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  mdiCircleEditOutline
} from '@mdi/js';

@Component({
  components: {
  }
})
export default class ChipsChange extends Vue {
  show = false

  @Watch("show")
  reset() {
    this.errorMessage = ""
  }

  icons = {
    mdiCircleEditOutline
  }

  errorMessage = ""
  chips: any = []
    
  get players() {
    return this.$store.getters["ScoreBoard/players"]
  }

  get total() {
    return this.chips.reduce((total: number, chip: any) => {
      return Number(chip.chip) + total
    }, 0)
  }

  open() {
    this.show = true
    const chips = this.$store.getters["ScoreBoard/chips"]
    const newChips = []
    for (let i = 0; i < this.players.length; i ++) {
      const chip = chips.find((e: any) => e.uid === this.players[i].uid)
      if (chip) {
        newChips.push({
          uid: chip.uid,
          chip: chip.chip
        })
      } else {
        newChips.push({
          uid: this.players[i].uid,
          chip: null
        })
      }
    }
    this.chips = newChips
  }

  changeInput(index: number, value: string) {
    const number = value ? Number(value) : null
    this.chips[index].chip = number
  }

  inputAuto(index: number) {
    this.chips[index].chip = 0
    this.chips[index].chip -= this.total
  }

  save() {
    console.log(this.chips);
    if (this.total !== 0) {
      this.errorMessage = `合計が${this.total}枚になるように入力してください (現在合計: ${this.total}枚)`
    } else {
      this.$store.dispatch("ScoreBoard/changeChips", this.chips)
      this.show = false
    }
  }

}
</script>

<style lang="scss" scoped>
.form__li {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
}

.autoInput-nav {
  height: 0;
  font-size: 10px;
  position: relative;
  left: 16px;
}
.error {
  &-enter-active, &-leave-active {
    transition: all .5s;
  }
  &-enter, &-leave-to {
    opacity: 0;
  }
}
</style>