<template>
  <el-container class="home_container">
    <el-header style="height: 80px">
      <div>
        <img src="../assets/img/liaotian.png" height="70px" >
        <span>回聊后台管理系统</span>
      </div>
      <el-button  type="primary" @click="logout">退出登录</el-button>

    </el-header>
    <el-container >
      <el-aside width="200px">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          :default-active="activePath">
          <el-submenu :index="item.url" v-for="item in menuList" :key="item.id">
            <!--一级菜单-->
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>
                  <!--二级菜单-->
                  <el-menu-item :index="child.url" v-for="child in item.childs" :key="child.id" @click="saveActivePath(child.url)">
                    <template slot="title">
                      <i :class="child.icon"></i>
                      <span>{{child.name}}</span>
                    </template>
                  </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
<!--        主体-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data(){
      return{
        menuList:[],
        currentUser:JSON.parse(sessionStorage.getItem("currentUser")),
        activePath:''
      }
    },
    mounted () {
      this.getMenuList();
      this.activePath=sessionStorage.getItem("activePath");
    },
    methods:{
      async logout(){

        const that = this
        this.$confirm('是否退出当前账号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           that.$axios.get("/api/user/logout").then(resp=>{
              if(resp.data.code==200){
                sessionStorage.clear();
                this.$router.push("/login")
                this.$message.success("注销成功，"+resp.data.message);
              }else {
                this.$message.error("注销失败，"+resp.data.message);
              }
              }
            );
        });

        // var {data:resp} = await this.$axios.get("/api/user/logout");
        //
        // if(resp.code==200){
        //   sessionStorage.clear();
        //   this.$router.push("/login")
        //   this.$message.error("注销成功，"+resp.data.message);
        // }else {
        //   this.$message.error("注销失败，"+resp.data.message);
        // }


      },
      getMenuList(){
        this.$axios.post("/api/menu/getMenuList/"+this.currentUser.id).then(resp =>{
          // console.log(resp);
          if(resp.data.code!='200'){
            this.$message.error("获取菜单失败失败，"+resp.data.message);
          }
          this.menuList=resp.data.data.menuList;
          // console.log(this.menuList);
        }).catch(error=>{
          this.fullscreenLoading = false;
          console.log(error);
          this.$message.error("服务端发生错误，请联系管理员！");
        })
      },
      saveActivePath(activePath){
        sessionStorage.setItem("activePath",activePath);
      }
    }
  }
</script>

<style scoped>

  .home_container{
    height: 100%;
  }

  .el-header{
    background-color: #333744;
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 20px;
    align-items: center;
  }

  .el-header div{
    display: flex;
    align-items: center;
  }

  .el-header div span{
    margin-left: 15px;
  }
  .el-header .el-button{
    height: 40px;

  }

  .el-aside{
     background-color: #545c64;
   }

  .el-aside .el-menu{
    border: 0px;
  }

  .el-main{
    background-color: #eaedf1;
  }

</style>
