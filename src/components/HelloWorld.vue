<template>
  <div style="height: 100%;width: 100%">
    <div style="padding-left: 20%;float: left;padding-bottom: 10%;width: 25%">
      <el-upload
          class="upload-demo"
          drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          show-file-list
          :auto-upload="false"
          :on-change="onChange"
      >
        <el-icon class="el-icon--upload">
          <el-image style="width: 100px; height: 100px" :src="upload" fit="fill"/>
        </el-icon>
        <div class="el-upload__text">
          点击或者拖拽文件
        </div>
      </el-upload>
      <div style="float: right">
        <el-button type="primary" @click="uploadFile">上传</el-button>
      </div>
    </div>
    <div style="padding-right: 20%;float: right;padding-bottom: 10%;width: 25%;">
      <div class="downloadDiv">
        <el-image style="width: 67px;height: 100px;display: block;margin: auto;padding-top: 20px" :src="download"
                  fit="fill" @click="pickUpCodeVisible=true"/>
        <span style="font-size: 14px">点击或者拖拽文件</span>
      </div>
    </div>
    <div style="padding-right: 30%;float: right;padding-bottom: 10%;width: 25%;">
      <div style="float: contour">
        <el-button type="primary" @click="storageTimeVisible=true">延长存放时间</el-button>
      </div>
    </div>
  </div>

  <el-dialog
      v-model="pickUpCodeVisible"
      title="请输入取货码"
      width="30%"
      show-close
      style="text-align: center;width: 300px"
  >
    <el-input v-model="pickUpCode" placeholder="Please input"/>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="pickUpCodeVisible = false">取消</el-button>
        <el-button type="primary" @click="downloadFile">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
      v-model="storageTimeVisible"
      title="选择延长的时间"
      width="30%"
      show-close
      style="text-align: center;width: 300px"
  >
    <el-input v-model="stPickUpCode" placeholder="输入你的取货码" style="width: 225px"/>
    <el-divider/>
    <el-select v-model="storageTime" placeholder="Select">
      <el-option
          v-for="item in storageTimes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="storageTimeVisible = false">取消</el-button>
        <el-button type="primary" @click="extendStorageTime">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script setup lang="ts">
import {ElMessage, ElMessageBox, UploadFile, UploadFiles} from "element-plus";
import {ref, h} from 'vue'
import request from "@/utils/request";

const pickUpCodeVisible = ref(false)
const storageTimeVisible = ref(false)
const pickUpCode = ref('')
const storageTime = ref('')
const stPickUpCode = ref('')
const storageTimes = [
  {
    value: '1',
    label: '1天',
  },
  {
    value: '3',
    label: '3天',
  },
  {
    value: '5',
    label: '5天',
  },
  {
    value: '7',
    label: '7天',
  }
]
const upload = ref('src/assets/upload.svg')
const download = ref('src/assets/download.svg')
let fileList: any[] = []
const onChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  fileList.push(uploadFile)
}
const uploadFile = () => {
  let formData = new FormData();
  if (fileList.length > 0) {
    fileList.forEach(file => {
      formData.append("files", file.raw, file.name);
    })
  }
  // TODO 上传文件
  request.upload("/upload_file", formData).then((res: any) => {
    ElMessageBox.alert(res.data, '请保管好取货码', {
      confirmButtonText: 'OK',
      center: true
    })
  })
}
const downloadFile = () => {
  // TODO 获取文件
  request.download("/download_file", {pick_up_code: pickUpCode.value}).then((res: any) => {
    let temp = res.headers['content-disposition'].length
    let filename = res.headers['content-disposition'].slice(21, temp - 1)
    // TODO 下载文件时获取到的file_name一直是乱码的，现在只能下载英文的
    let url = window.URL.createObjectURL(new Blob([res.data]))
    let a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    // 这里要把字符的 "" 去掉，不然下载的文件名会多出_
    a.download = filename
    document.body.appendChild(a)
    a.click() //执行下载
    window.URL.revokeObjectURL(a.href) //释放url
    document.body.removeChild(a) //释放标签
  })
}
const extendStorageTime = () => {
  request.post("/extend_storage_time", {
    pick_up_code: stPickUpCode.value,
    storage_time: parseInt(storageTime.value)
  }).then((res: any) => {
    console.log(res.data)
    ElMessage({
      message: res.data ? '更新成功' : '更新失败',
      type: res.data ? 'success' : 'error'
    })
    storageTimeVisible.value = false
  })
}
</script>

<style scoped>
.downloadDiv {
  width: 480px;
  height: 186px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  box-sizing: border-box;
  text-align: center;
}

.downloadDiv :hover {
  width: 480px;
  height: 186px;
  border: 1px dashed red;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
}
</style>
