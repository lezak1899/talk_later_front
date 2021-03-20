<template>
  <div>
    <!-- 面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card class="box-card">
      <div class="formContainer">
      <el-form :model="userInfo" :rules="userInfoFormRules" ref="userInfoFormRef" label-width="120px" label-position="left">

        <el-form-item label="id" prop="id" style="display: none">
          <el-input v-model="userInfo.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="userInfo.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="userInfo.nickname" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userInfo.password" ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="userInfo.sex" placeholder="性别" >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="usertype">
          <el-select v-model="userInfo.usertype" placeholder="用户类型" :disabled="true">
            <el-option label="回聊用户" value="1"></el-option>
            <el-option label="运维人员" value="2"></el-option>
            <el-option label="系统管理员" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号创建时间" prop="createdDate" >
          <el-input v-model="userInfo.createdDate" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="上一次登录时间" prop="lastLoginDate" >
          <el-input v-model="userInfo.lastLoginDate" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="上一次登录设备" prop="lastloginEquipment" >
          <el-input v-model="userInfo.lastloginEquipment" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存修改</el-button>
        </el-form-item>

      </el-form>
      </div>
    </el-card>


  </div>
</template>

<script>

  export default {
    data(){
      return{

        userInfoFormRules: {
          nickname: [
            {required: true, message: '用户昵称不能为空', trigger: 'blur'},
            {min: 1, max: 8, message: '请输入10位以内的字符，且不能包括特殊字符', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'},
            {min: 1, max: 6, message: '请输入6位以内的字符，且不能包括特殊字符', trigger: 'blur'},
          ]
        },
        userInfo:{},
      }
    },
    mounted () {
      this.getPersonInfo();
    },
    methods: {

      onSubmit(){
        this.$refs.userInfoFormRef.validate(valid=> {
            if (!valid) return;
        this.$axios.post("/api/user/modifyUser", this.userInfo).then(resp => {
            if (resp.data.code == '200') {
              this.getPersonInfo();
              this.$message({message: "修改成功！", type: 'success'});
            } else {
              this.$message.error("修改失败，" + resp.data.message);
            }
          }
        ).catch(error => {
          console.log(error);
          this.$message.error("服务端发生错误，请联系管理员！");
        })
        })
      },
      async getPersonInfo(){
        var str = sessionStorage.getItem("currentUser");
        var currentUser = JSON.parse(str);
        console.log(currentUser);

        //{data:resp} 表示从数据中取出data属性，并且重命名为resp
        var resp = await this.$axios.get("/api/user/check/"+currentUser.id);

        if(resp.data.code!='200') {
          this.$message.error("获取个人信息失败："+resp.data.message)
        }else{

          this.userInfo=resp.data.data.userInfo;
          sessionStorage.setItem("currentUser",JSON.stringify(resp.data.data.userInfo));

        }


      }
    }


  }

</script>

<style scoped>

  .formContainer{
    width: 50%;
    margin: auto;
  }


</style>
