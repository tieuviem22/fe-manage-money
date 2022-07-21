<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" style="cursor: pointer;" @click="$router.push('/home')">VNEY</div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="general" @click="$router.push('/manage/general')">
          <pie-chart-outlined />
          <span>General</span>
        </a-menu-item>
        <a-menu-item key="note" @click="$router.push('/manage/note')">
          <desktop-outlined />
          <span>Note Lists</span>
        </a-menu-item>
        <a-menu-item key="profile" @click="$router.push('/manage/profile')">
          <user-outlined />
          <span>{{ userName }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <router-view ></router-view>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { openNotificationWithIcon } from '@/common';
import ApiService from '@/config/api.service';
import jwtService from '@/config/jwt.service';
import router from '@/router';
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
} from '@ant-design/icons-vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: {
    PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
    TeamOutlined,
    FileOutlined,
  },
  setup() {
    const collapsed = ref<boolean>(false)
    const routerName = router.currentRoute.value.name
    var selectedKeys = ref<any[]>([routerName])
    
    var userName = ref<string>('')
	  const initDataUser = async() => {
		  if(jwtService.getToken()) {
        await ApiService.getApi('/api/user/profile')
        .then(res => {
          if(res.request.status == 200)
          userName.value = res.data.profile.username || ''
          
        })
        .catch(err => {
          openNotificationWithIcon('error', err.response.data.message, '');
        })
		  }else {
        router.push({name: 'login'})
      }
	  }
    initDataUser()
    return { userName, collapsed, selectedKeys }
  },
});
</script>
<style>
.logo {
  color: #fff;
  font-size: 19px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  color: white;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
