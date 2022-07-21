<template>
    <div class="w3-top">
        <div class="w3-bar w3-white w3-card" id="myNavbar">
            <span  class="w3-bar-item w3-button w3-wide" @click="$router.push('/home')">LOGO</span>
            <div class="w3-right w3-hide-small">
            <span class="w3-bar-item w3-button">ABOUT</span>
            <span class="w3-bar-item w3-button"  @click="$router.push('/manage')">MANAGE</span>
            <span class="w3-bar-item w3-button"><i class="fa fa-user"></i> TEAM</span>
            <span class="w3-bar-item w3-button"><i class="fa fa-th"></i> WORK</span>
            <span class="w3-bar-item w3-button"><i class="fa fa-usd"></i> PRICING</span>
            <span class="w3-bar-item w3-button"><i class="fa fa-envelope"></i> CONTACT</span>
            </div>
            <span class="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium" @click="openNav">
                <i :class="!showNavSmall ? 'fa fa-bars' : 'fa fa-close'"></i>
            </span>
        </div>
    </div>
    <nav class="w3-sidebar w3-bar-block w3-grey w3-card w3-animate-left w3-hide-medium w3-hide-large" :style="`z-index: 1000;display: ${showNavSmall ? 'block' : 'none'}`" id="mySidebar">
        <span class="w3-bar-item w3-button w3-large w3-padding-16" @click="showNavSmall = false">Close ×</span>
        <span class="w3-bar-item w3-button">ABOUT</span>
        <span class="w3-bar-item w3-button">TEAM</span>
        <span class="w3-bar-item w3-button">WORK</span>
        <span class="w3-bar-item w3-button">PRICING</span>
        <span class="w3-bar-item w3-button">CONTACT</span>
    </nav>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent ({
    setup(){
        let showNavSmall = ref<boolean>(false);
        return {
            showNavSmall
        }
    },
    methods: {
        openNav(){
            this.showNavSmall = !this.showNavSmall;
        } 
    }
})
</script>
<style scoped>
.w3-bar .w3-button {
  padding: 16px;
}
.w3-sidebar {
    position: fixed !important;
    left: 0;
}
</style>