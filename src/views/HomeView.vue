<template>
  <div class="home">
    <UserLayout />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UserLayout from '@/components/layout/UserLayout.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    UserLayout,
  },
});
</script>
