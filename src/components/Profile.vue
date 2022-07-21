<template>
  <div class="hello">
      <div class="container">
        <div class="header">
          <div class="avatar">
            <img src="https://nuockhoangtinhkhiet24h.com/upload/img/inuser/Avatar-Facebook-tr%E1%BA%AFng.jpg" alt="image">
          </div>
        </div>
        <div class="content">
          <div class="info">
            <span>
              <h5><i><b>{{ userName }}</b></i></h5>
            </span>
            <a-button type="primary" style="background: rgba(0,33,64,1);border: none;" @click="logout"><logout-outlined /></a-button>
          </div>
          <div class="setting">
            <a-tabs v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="Change Info">
                <div >
                  Not found
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="Setting" force-render>
                <div class="form-create">
                  <p >Change password <span style="cursor: pointer;" @click="changePass = !changePass"><caret-down-outlined /></span></p>
                  <a-form name="time_related_controls" v-show="changePass">
                    <a-form-item>
                      <a-input-password type="password" v-model:value="formData.password" placeholder="Old Password"/>
                    </a-form-item>
                    <a-form-item>
                      <a-input-password type="password" v-model:value="formData.new_password" placeholder="New Password" autocomplete="new-password"/>
                    </a-form-item>
                    <a-form-item>
                      <a-input-password type="password" v-model:value="formData.confirm_password" placeholder="Confirm New Password"/>
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" @click="evenSaveBtn">Save</a-button>
                      <a-button style="margin-left: 10px" @click="clearForm">Clear All</a-button>
                    </a-form-item>
                  </a-form>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    <a-modal
      v-model:visible="visible"
      ok-text="Sure"
      cancel-text="Close"
      size="small"
      style="width: 350px;"
      @ok="onSubmit"
    >
      <h4 style="text-align: center;margin-top: 20px;font-weight: 300;">Are you sure?</h4>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import jwtService from '@/config/jwt.service';
import router from '@/router';
import ApiService from '@/config/api.service';
import { openNotificationWithIcon } from '@/common';
import { LogoutOutlined } from '@ant-design/icons-vue';
import { CaretDownOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: 'Profile',
  props: {
    msg: String,
  },
  components: {LogoutOutlined, CaretDownOutlined},
  setup() {
    var state = reactive<{
      activeKey: string,
      visible: boolean,
      userName: string,
      formData: {
        password: string,
        new_password: string,
        confirm_password: string
      },
      changePass: boolean
    }>({
      visible: false,
      activeKey:'1',
      userName: "",
      formData: {
        password: "",
        new_password: "",
        confirm_password: ""
      },
      changePass: false
    })
    const logout = () => {
      jwtService.destroyToken()
      router.push({name : 'login'})
    }
	  const initDataUser = async() => {
		  if(jwtService.getToken()) {
        await ApiService.getApi('/api/user/profile')
        .then(res => {
          if(res.request.status == 200)
          state.userName = res.data.profile.username || ''
          
        })
        .catch(err => {
          openNotificationWithIcon('error', err.response.data.message, '');
        })
		  }else {
        router.push({name: 'login'})
      }
	  }
    initDataUser()
    const evenSaveBtn = () => {
      if(state.formData.password === "") {
        openNotificationWithIcon("warning", "Password is required!", '')
      }else if(state.formData.new_password === "") {
        openNotificationWithIcon("warning", "Password is required!", '')
      }else if(state.formData.new_password !== state.formData.confirm_password) {
        openNotificationWithIcon("warning", "Confirm password incorrect!", '')
      }else {
        onSubmit()
      }
    }
    const onSubmit = async() => {
      await ApiService.postApi('/api/auth/change_password', {
        "password" : state.formData.password,
        "new_password" : state.formData.new_password
      })
        .then(res => {
          if(res.status == 200) {		
            clearForm()
            openNotificationWithIcon('success', res.data.message, '')
            logout()
          }else {
            openNotificationWithIcon('error', res.data.message, '')
          }
        })
        .catch(err => {
          openNotificationWithIcon('error', err.response.data.message, '');
        })
    }
    const clearForm = () => {
      state.formData = {
        password: "",
        new_password: "",
        confirm_password: ""
      }
    }
    return { logout, ...toRefs(state), onSubmit, clearForm, evenSaveBtn }
  }
});
</script>

<style scoped lang="scss">
.form-create {
  width: 350px;
}
.container {
  padding: 20px;
  .header {
    height: 15vh;
    background: rgba(0,0,0,.3);
    position: relative;
    .avatar{
      position: absolute;
      left: 80px;
      bottom: -30px;
      img {
        height: 100px;
        width: 100px;
        border-radius: 10px;
      }
    }
  }
  .content {
    .info {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
    .setting {
      padding-top: 0px ;
    }
  }
}
</style>
