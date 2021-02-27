<template>
  <div class="appbar">
    <v-app-bar flat>
      <!-- <v-app-bar-nav-icon
        v-if="isDrawerActive"
        @click.stop="handleClickNavIcon"
      ></v-app-bar-nav-icon> -->
      <v-btn v-if="isBackActive" icon @click="handleClickBack">
        <v-icon large>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title class="pl-0">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch v-model="$vuetify.theme.dark"></v-switch>
      <slot></slot>
    </v-app-bar>
    <Drawer v-if="isDrawerActive" v-model="isDrawerOpened"></Drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Drawer from "@/components/shared/Drawer.vue";
@Component({
  components: {
    Drawer
  }
})
export default class AppBar extends Vue {
  @Prop({ type: String, default: "麻雀成績管理" })
  title?: string;

  @Prop({ type: Boolean, default: false })
  isBackActive?: boolean;

  @Prop({ type: Boolean, default: false })
  isDrawerActive?: boolean;

  isDrawerOpened = false;

  handleClickBack() {
    this.$router.push({ name: "home" });
  }

  handleClickNavIcon() {
    this.isDrawerOpened = !this.isDrawerOpened;
  }
}
</script>
