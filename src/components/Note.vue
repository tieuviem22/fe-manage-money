<template>
  <div style="margin: 20px ;">
    <span class="btn-back" v-if="createNote || editItem" @click="back()"><arrow-left-outlined /> Back</span>
    <div v-if="!createNote && !editItem">
      <div style="margin: 8px 0px">
        <a-row type="flex" justify="space-between">
          <div>
            <a-button @click="redirectCreatePage()" type="primary" ghost>New Note + </a-button>
            <span style="margin-left: 8px; margin-right: 8px">
              <template v-if="true">
                <a-button :disabled="!hasSelected" @click="visible = true" type="danger" ghost>Remove {{ ` ${selectedRowKeys.length} items` }}</a-button>
              </template>
            </span>
            <a-button :disabled="!hasSelected" @click="exportFile" type="primary" ghost>Export {{ ` ${selectedRowKeys.length} items` }}</a-button>
          </div>
          <div>
          <a-select
            ref="select"
            v-model:value="pageSize"
            style="width: 120px; margin-right:10px"
            :options="options"
            @change="handleChange"
          ></a-select>
            <a-range-picker v-model="params.createdAt" @change="changeSelectDate">
              <template #dateRender="{ current }">
                <div class="ant-picker-cell-inner">
                  {{ current.date() }}
                </div>
              </template>
            </a-range-picker>
          </div>
        </a-row>
        </div>
        <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columnTableNotes"
          :data-source="dataTable"
          :loading="loading" 
          bordered 
          height="100vh"
          size="large"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'createdAt'">
              {{ convertDate(record.createdAt) }}
            </template>
            <template v-if="column.key === 'money'">
              {{ fomatNumber(record.money) }}
            </template>
            <template v-if="column.key === 'operation'">
              <a @click="setEditItem(record)">Edit <highlight-outlined /></a>
            </template>
          </template>
        </a-table>
      </div>

    <!-- modal create -->
    <div v-if="createNote || editItem" class="form-container">
      <div class="form-create">
        <h4>Enter the values</h4>
        <a-form name="time_related_controls">
          <a-form-item label="Title *">
            <a-input v-model:value="formData.title"/>
          </a-form-item>
          <a-form-item label="Description">
            <a-input type="textarea" v-model:value="formData.description"/>
          </a-form-item>
          <a-form-item label="Total Money *">
            <a-input-number v-model:value="formData.money" />
          </a-form-item>
          <a-form-item label="Time">
            <a-date-picker v-model:value="formData.createdAt" value-format="YYYY-MM-DD" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" @click="onSubmit">Save</a-button>
            <a-button style="margin-left: 10px" @click="clearForm">Clear All</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <a-modal
      v-model:visible="visible"
      ok-text="Remove"
      cancel-text="Close"
      @ok="removeNotes"
    >
      <h4 style="text-align: center;margin-top: 20px;"><b>Remove {{ selectedRowKeys.length }} item ?</b></h4>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { generateExcel } from '@/utils/export';
import { openNotificationWithIcon } from '@/common';
import ApiService from '@/config/api.service';
import jwtService from '@/config/jwt.service';
import { defineComponent, reactive, toRefs } from 'vue';
import { paramsTable, itemNote } from '@/interface';
import { columnTableNotes } from '@/constants';
import { computed } from '@vue/reactivity';
import { convertDate } from '@/utils';
import {
  ArrowLeftOutlined,
  HighlightOutlined
} from '@ant-design/icons-vue';
import { Dayjs } from 'dayjs';
//interface param create new note
interface FormState {
    createdAt: string ,
    description: string,
    money: number,
    title: string,
    _id: string
}
export default defineComponent({
  name: 'Note',
  props: {
  },
  emits: [""],
  components: {ArrowLeftOutlined, HighlightOutlined},
  setup(props, context) {
    const state = reactive<{
      dataTable: itemNote[];
      params: paramsTable;
      loading: boolean;
      selectedRowKeys: string[];
      createNote: boolean;
      formData: FormState;
      visible: boolean;
      editItem: boolean;
      options: {
        value: number,
        label: string
      }[]
      pageSize: number;
    }>({
      options: [
        {
          value: 10,
          label: "10 / page"
        },
        {
          value: 20,
          label: "20 / page"
        },
        {
          value: 50,
          label: "50 / page"
        }
      ],
      pageSize: 10,
      dataTable: [], 
      params: {
        total: 0,
        current: 1,
        pageSize: 10,
        createdAt: ['','']
      },
      loading: false,
      selectedRowKeys: [],
      createNote: false,
      formData: {
        createdAt: '',
        description: '',
        money: 0,
        title: '',
        _id: ''
      },
      visible: false,
      editItem: false,
    });
    state.dataTable = []
    //change size page function
    const handleChange = (value: number) => {
      state.params.current = 1
      state.params.pageSize = value
      initData()
    };
    const pagination = computed(() => ({
      total: state.params.total,
      current: state.params.current,
      pageSize: state.params.pageSize,
    }));
    const fomatNumber = (n: number) => {
      return (Math. round(n * 100) / 100). toLocaleString() + " VND" ;
    }
    //open modal
    const redirectCreatePage = () => {
      state.createNote = true      
    }
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);

    //table change fuction
    const handleTableChange = (val: paramsTable) => {
      state.params.current = val.current
      state.params.total = val.total
      state.params.pageSize = val.pageSize
      initData()
    }
    //back home fuction
    const back = () => {
      state.createNote = false
      state.editItem = false
      state.formData = {
        createdAt: '',
        description: '',
        money: 0,
        title: '',
        _id: ''
      }
    }
    const onSelectChange = (selectedRowKeys: string[]) => {
      state.selectedRowKeys = selectedRowKeys;
    };
    //click button edit
    const setEditItem = (item: FormState) => {
      state.editItem = true
      state.formData = item
    }
    //get data table
	  const initData = async() => {
		  if(jwtService.getToken()) {
        await ApiService.postApi('/api/work',state.params)
        .then(res => {
          if(res.status == 200) {				
            const items = res.data.items.data.map((item: any) => ({
              ...item,
              key: item._id
            }))
            state.dataTable = items
            
            // if()
            state.params.total = res.data.items.count
            // openNotificationWithIcon('success', res.data.message, '')
          }else {
            openNotificationWithIcon('error', res.data.message, '')
          }
        })
        .catch(err => {
          openNotificationWithIcon('error', err.response.data.message, '');
        })
		  }
	  }
    const removeNotes = async() => {
      state.loading = true
      await ApiService.postApi('/api/work/remove',state.selectedRowKeys)
        .then(res => {
          if(res.status == 200) {		
            state.selectedRowKeys = []
            openNotificationWithIcon('success', res.data.message, '')
            state.visible = false
            initData()
          }else {
            openNotificationWithIcon('error', res.data.message, '')
          }
        })
        .catch(err => {
          openNotificationWithIcon('error', err.response.data.message, '');
        })
        .finally(()=> {
          state.loading = false
        })
    }
    //init data
    initData()

    //create or edit item function
    const onSubmit = async() => {
      state.loading = true
      if(!state.formData.createdAt) {
        state.formData.createdAt = Date.now() + ''
      }
      await ApiService.postApi(state.editItem ? '/api/work/edit' : '/api/work/create',state.formData)
        .then(res => {
          if(res.status == 200) {		
            clearForm()
            state.createNote = false
            state.editItem = false
            openNotificationWithIcon('success', res.data.message, '')
            initData()
          }else {
            openNotificationWithIcon('error', res.data.message, '')
          }
        })
        .catch(err => {
          openNotificationWithIcon('error', err.response.data.message, '');
        })
        .finally(()=> {
          state.loading = false
        })
    }
    const changeSelectDate = (date: [Dayjs, Dayjs], dateString: [string, string]) => {
      state.params.createdAt = dateString
      initData()
    }
    const clearForm = () => {
      state.formData = {
        createdAt: '',
        description: '',
        money: 0,
        title: '',
        _id: ''
      }
    }
    //export data => file excel function
    const exportFile = () => {
      let dataExport: any = [];
      state.dataTable.filter((item) => {
        state.selectedRowKeys.forEach(element => {
          if(item._id == element) {
            dataExport.push(item) 
          }
        });
      })
      let data:any = [];
      dataExport.map((item: any, index: number) => {
        let arrayData = [
          index+1,
          item.title || '',
          item.description || '',
          fomatNumber(item.money) || '',
          convertDate(item.createdAt) || ''
        ];
        data.push(arrayData);
      });
      let headerTable = [
        'STT',
        'Title',
        'Description',
        'Money',
        'Date'
      ]
      const date = new Date();
      
      generateExcel(data, headerTable, "", 'M', "VNEY_Report (" + (date+'').slice(0,15) + ").xlsx");
    }

    return { 
      ...toRefs(state), 
      columnTableNotes, 
      onSelectChange, 
      hasSelected, 
      redirectCreatePage, 
      onSubmit, 
      clearForm, 
      convertDate,
      fomatNumber,
      removeNotes,
      setEditItem,
      back,
      pagination,
      handleTableChange,
      changeSelectDate,
      handleChange,
      exportFile
    }
  }

});
</script>

<style scoped lang="scss">
.form-create {
  width: 400px;
  ::v-deep .ant-form-item-label{
    label {
      width: 100px;
    };
  }
}
.btn-back {
  cursor: pointer;
}
.ts {
  color: #002140;
}
.form-container {
  display: flex;
  justify-content: center;
  height: 70vh;
  align-items: center;
}
</style>
