<template>
  <router-view/>
  <FooterVue />
</template>
<script lang="ts">
import { defineComponent } from 'vue'; 
import FooterVue from './components/common/Footer.vue';
export default defineComponent ({
  components: {
    FooterVue
  }
})
</script>
<style>

</style>
