<template>
  <div class="container">
    <h1>
      <el-link
        type="success"
        href="https://github.com/anncwb/vite-plugin-mock/tree/main/examples/ts-example"
        target="_blank"
        class="_link"
        >测试vite-plugin-mock（TS版本）</el-link
      >
    </h1>
    <el-space wrap>
      <el-card class="box-card" v-for="(item, key) in requestLists" :key="key">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
            <el-button
              class="button"
              size="small"
              type="primary"
              plain
              @click="sendRequest(key, item)"
              >Send</el-button
            >
          </div>
        </template>
        <div v-loading="item.show">{{ item.info }}</div>
      </el-card>
    </el-space>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { bailingStudentDetail } from './request/student';
export default defineComponent({
  name: 'App',
  setup() {
    const requestLists = ref([
      {
        name: 'Get Request',
        info: '暂无数据',
        show: false,
      },
      {
        name: 'Get Restful',
        info: '暂无数据',
        show: false,
      },
      {
        name: 'Post Request',
        info: '暂无数据',
        show: false,
      },
      {
        name: 'Post Restful',
        info: '暂无数据',
        show: false,
      },
      {
        name: 'Post Form-data',
        info: '暂无数据',
        show: false,
      },
      {
        name: 'UserDetail',
        info: '暂无数据',
        show: false,
      },
    ])

    const getRoleById = () => {
      requestLists.value[0].show = true
      axios.get('/api/getRoleById2', { params: { id: 2 } }).then(({ data }) => {
        requestLists.value[0].info = data
        requestLists.value[0].show = false
      })
    }

    const testRestful = () => {
      requestLists.value[1].show = true
      axios.get('/api/testRestful2/1').then(({ data }) => {
        requestLists.value[1].info = data
        requestLists.value[1].show = false
      })
    }

    const createUser = () => {
      requestLists.value[2].show = true
      axios
        .post('/api/createUser', {
          name: 'vben',
          gender: 'man',
        })
        .then(({ data }) => {
          requestLists.value[2].info = data
          requestLists.value[2].show = false
        })
    }

    const testPostRestful = () => {
      requestLists.value[3].show = true
      axios.post('/api/testRestful/1').then(({ data }) => {
        requestLists.value[3].info = data
        requestLists.value[3].show = false
      })
    }

    const testPostFormData = () => {
      requestLists.value[4].show = true
      axios
        .post(
          '/api/createUser?a=1',
          {
            name: 'vben',
            gender: 'man',
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .then(({ data }) => {
          requestLists.value[4].info = data
          requestLists.value[4].show = false
        })
    }


    const studentDetail = () => {
      requestLists.value[5].show = true

      bailingStudentDetail({
        assistantUid: 4271322074,
        courseId: 3160759,
        studentUid: 2634528742,
        personUid: 3000137423,
        studentRemoteId: 7881300169079775
      }).then((data) => {
        console.log(data)
        requestLists.value[5].info = data
        requestLists.value[5].show = false

      })
    }

    const sendRequest = (key, item) => {
      switch (key) {
        case 0:
          getRoleById()
          break
        case 1:
          testRestful()
          break
        case 2:
          createUser()
          break
        case 3:
          testPostRestful()
          break
        case 4:
          testPostFormData()
          break
        case 5:
          studentDetail()
          break
        default:
          getRoleById()
      }
    }

    return {
      requestLists,
      sendRequest,
    }
  },
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
._link {
  font-size: 30px;
}
.box-card {
  width: 360px;
}
.el-space {
  align-items: flex-start !important;
}
</style>
