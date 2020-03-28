<template>
  <v-app>
    <router-view />
  </v-app>
</template>
<style lang="scss">
#app {
  height: 100%;
}

.v-btn:hover:before,
.v-btn:hover::before,
.v-btn:focus-within:before,
.v-btn:focus::before,
.v-btn:focus:before{
  opacity: 0 !important;
}
</style>