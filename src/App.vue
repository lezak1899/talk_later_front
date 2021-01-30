<template>
  <div id="app">
    <el-page-header @back="goBack" content="登录"></el-page-header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="name">
        <el-input v-model="ruleForm.name" placeholder=" 请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.name" placeholder=" 请输入密码"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button type="primary" @click="registerForm('ruleForm')">立即注册</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        password: '',
      }
    }
  },
  methods: {
    goBack() {
      console.log('go back');
    },
    submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
          alert('submit!'+process.env.BASEURL);
          var _this = this;
          // this.$axios.post('localhost:8088/user/login')

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    registerForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('register!');
        } else {
          console.log('error register!!');
          return false;
        }
      });
    }
  }
}
</script>

<style>
.el-page-header{
  background-color: rgba(228,228,228,0.7);
  height: 50px;
  line-height: 50px;
}
.el-form{
  width:50%;
  margin: 100px auto;
}
.el-button{
  width: 20%;
  margin: 50px auto;
  display: inline-block;
}
</style>
