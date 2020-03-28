<template>
  <v-dialog v-model="show">asfsf</v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import {

} from '@mdi/js';

@Component({
  components: {
  }
})
export default class PlayerChange extends Vue {
  // 表示非表示切り替え
  @Prop() parentShow: any
  get show() {
    return this.parentShow
  }
  set show(value) {
    this.$emit("show", value)
  }
}
</script>

<style lang="scss" scoped>

</style>