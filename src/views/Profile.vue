<template>
<div class="profile">

  <v-app-bar color="indigo" dark>
    <v-toolbar-title class="pl-2">麻雀成績管理</v-toolbar-title>
  </v-app-bar>

  <v-row justify="center" align="center">
    <div>
      <p><span>{{email}}</span>さん</p>
      <p>あなたのプロフィールを完成させてください</p>
      <v-card class="pa-5">
        <ProfileComponent @save="save"></ProfileComponent>
      </v-card>
    </div>
  </v-row>

</div>  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mdiEmail, mdiLock } from '@mdi/js'
import ProfileComponent from '@/components/Profile.vue'

@Component({
  components: {
    ProfileComponent
  }
})
export default class Profile extends Vue {
  get email() {
    return this.$store.getters["User/user"].email
  }
  icons = {
    mdiEmail,
    mdiLock
  }

  save() {
    this.$router.push({name: 'Home'})
  }
}
</script>

<style lang="scss" scoped>
.profile {
  height: 100%;
  display: grid;
  grid-auto-rows: max-content 1fr;
}
</style>