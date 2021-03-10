<template>
  <div>
    <!-- 面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>回聊用户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">

      <!--查询区-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入用户账号" v-model="queryEntity.userName" ><el-button slot="append" icon="el-icon-search" @click="getUserXxList"></el-button></el-input>
        </el-col>
        <el-col :span="17"><el-button>dcwe</el-button></el-col>
      </el-row>

      <!-- 数据表格-->
      <el-table border :data="userXxList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="账号" width="180"></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="180"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="lastLoginDate" label="上一次登录时间" :formatter="formatDate" ></el-table-column>
        <el-table-column label="是否冻结" >
          <template slot-scope="scope">
            {{scope.row.valid}}
            <el-switch v-model="scope.row.valid" active-value="1" inactive-value="0" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-tooltip class="item" effect="dark" content="查看" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-search" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="冻结" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryEntity.pageNum"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="queryEntity.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>


    </el-card>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    data(){
      return{
        userXxList:[],
        total:0,
        queryEntity:{
          userType:'1',
          userName:'',
          pageNum:1,
          pageSize:5
        }
      }
    },
    mounted () {
      this.getUserXxList();
    },
    methods:{
      userStateChange(row){
        // console.log(row.valid);
        this.$axios.get("/api/user/modifyByZdmc?userId="+row.id+"&zdmc=is_valid&value="+row.valid).then(resp =>{
            if(resp.data.code=='200'){
              sessionStorage.setItem("currentUser",JSON.stringify(resp.data.data.currentUser));
              this.$message({message:"修改成功！",type: 'success'});
            }
            else{
              this.$message.error("修改失败，"+resp.data.message);
              //更新失败，switch的状态修改为原来的
              if(row.valid=='1') {row.valid='0';}
              else if(row.valid=='0') {row.valid='1';};

            }
          }
        ).catch(error=>{
          console.log(error);
          //更新失败，switch的状态修改为原来的
          if(row.valid=='1') {row.valid='0';}
          else if(row.valid=='0') {row.valid='1';}
          this.$message.error("服务端发生错误，请联系管理员！");

        })
      },
      formatDate(row, column, cellValue){
        // console.log(cellValue);
        if(cellValue == null || cellValue =='' ) return "";
        return this.$moment.unix(cellValue/1000).format("YYYY-MM-DD HH:mm:ss");
      },
      handleSizeChange(param){
        console.log(param);
        this.queryEntity.pageSize=param;
        this.getUserXxList();
      },
      handleCurrentChange(param){
        console.log(param);
        this.queryEntity.pageNum=param;
        this.getUserXxList();
      },
      async getUserXxList(){
        //{data:resp} 表示从数据中取出data属性，并且重命名为resp
        var resp = await this.$axios.post("/api/user/queryUserPage",this.queryEntity);

         if(resp.data.code!='200') {
           this.$message.error("获取用户列表失败"+resp.data.message)
         }

         this.userXxList = resp.data.data.pageUserXx.content;
         this.total = resp.data.data.pageUserXx.totalElements;
         console.log("userList",this.userXxList);

      }
    }

  }

</script>

<style scoped>

</style>
