<template>
<div class="body_container" v-loading.fullscreen.lock="fullscreenLoading">
  <!-- Backgrounds -->

<!--  <div id="login-bg" class="container-fluid">-->

<!--    <div class="bg-img"></div>-->
<!--    <div class="bg-color"></div>-->
<!--  </div>-->
  <div class="container" id="login" >
    <div class="row justify-content-center" >
      <div class="col-lg-8">
        <div class="login">

          <h1>login</h1>
          <br>

          <!-- Loging form -->
          <el-form :rules="loginFormRules" :model="loginForm" ref="loginFormRef" class="formContainer">
            <el-form-item class="form-group" prop="username">
              <el-input type="text" v-model="loginForm.username" placeholder="账号"></el-input>
            </el-form-item>

            <el-form-item class="form-group" prop="password">
              <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
            </el-form-item>


            <div class="form-check">



              <label class="forgot-password"><a href="#">忘记密码?</a></label>
            </div>

            <br>
            <el-form-item>
            <el-button class="btn-block " style="background-color: #EB3D72;color: white;height: 50px;border-radius: 10px" @click="Login">登录</el-button>

              <el-button class="btn-block " style="background-color: #FED150;color: white;height: 50px;border-radius: 10px;margin:0px;margin-top: 10px" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>

<!--          <el-button :plain="true" @click="tip_success">登录成功</el-button>-->
<!--          <el-button type="text" @click="tip_error">点击打开 Message Box</el-button>-->


        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

  export default {
    data() {
      return {
        fullscreenLoading: false,
        loginForm:{
          username:'',
          password:''
        },
        loginFormRules:{
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入秘密', trigger: 'blur' }
          ],
        },
      };
    },
    methods:{

      resetForm() {
        this.$refs.loginFormRef.resetFields();

      },
      login(){
        console.log("11");
        this.$refs.loginFormRef.validate(valid=>{
            console.log(valid);
            if(!valid) return ;

            this.fullscreenLoading = true;
            this.$axios.post("/api/user/login",this.loginForm).then(resp =>{
                this.fullscreenLoading = false;
                console.log(resp);
                if(resp.data.code=='200'){
                  this.$message({message:"登陆成功！",type: 'success'});
                }
                else{
                  this.$message.error("登录失败，"+resp.data.message);
                }
              }
            ).catch(error=>{
              this.fullscreenLoading = false;
              console.log(error);
              this.$message.error("服务端发生错误，请联系管理员！");
            })
        }
        )
      }
    }


  }
</script>

<style  scoped>

  .el-button {
        width: 100%;
        margin: 20px auto;
        display: block;
        height: 20px;
        background-color: #5182b3;
        border-color: #5182b3;
        font-size: 16px;
  }

  .body_container{
    background-color: #612273;
    height: 100%;
  }

  /*#login-bg.container-fluid {*/
  /*  padding: 0;*/
  /*  height: 100%;*/
  /*  position: absolute;*/
  /*}*/

  /* Background image an color divs*/

  /*.bg-img , .bg-color {*/
  /*  min-width: 50%;*/
  /*  vertical-align: top;*/
  /*  padding: 0;*/
  /*  margin-left: 0;*/
  /*  height: 100%;*/
  /*  background-color: #CAF0D3;*/
  /*  display: inline-block;*/
  /*  overflow: hidden;*/
  /*}*/

  /*.bg-color {*/
  /*  margin-left: -5px;*/
  /*}*/

  /*.bg-img {*/
  /*  background: url(../../assets/img/bg-image.jpeg);*/
  /*  background-size: cover;*/
  /*}*/

  #login{
    padding-top: 10%;
    text-align: center;
    text-transform: uppercase;
  }


  .login {
    width: 100%;
    height: 500px;
    background-color: #fff;
    padding: 15px;
    padding-top: 30px;
  }

  .login h1 {
    margin-top: 30px;
    font-weight: bold;
    font-size: 60px;
    letter-spacing: 3px;
  }

  .login .formContainer {
    max-width: 420px;
    margin: 30px auto;
  }

  .login .btn {
    border-radius: 50px;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 2px;
    font-size: 20px;
    padding: 14px;
    background-color: #00B72E;
  }

  .form-group input {
    font-size: 20px;
    font-weight: lighter;
    border: none;
    background-color: #F0F0F0;
    color: #465347!important;
    padding: 26px 30px;
    border-radius: 50px;
    transition : 0.2s;
  }




  /* Form check styles*/

  .form-check {
    padding: 0;
    text-align: left;
  }

  .form-check label {
    vertical-align: top;
    padding-top: 5px;
    padding-left: 5px;
    font-size: 15px;
    color: #606060;
    font-size: 14px;
  }

  .forgot-password {
    text-align: right;
    float: right;
    font-weight: bold;
  }

  .forgot-password a {
    color: #00B72E;
    opacity: 0.6;
  }

  .forgot-password a:hover {
    opacity: 1;
  }


  /* Switch styles */

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
  }

  /* Hide default HTML checkbox */
  .switch input {display:none;}

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #F0F0F0;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #00B72E;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px ##00B72E;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(30px);
    -ms-transform: translateX(30px);
    transform: translateX(30px);
  }



  /* Media queries */

  @media(max-width: 500px) {
    .bg-img , .bg-color {
      min-width: 100%;
      height: 50%;
      margin: 0;
    }

    .forgot-password {
      text-align: right;
      float: left;
      padding: 20px 0;
    }


    #login {
      padding-top: 50px;
    }

  }
</style>
