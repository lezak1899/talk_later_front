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
        <el-col :span="8">
          <el-input placeholder="请输入用户账号" v-model="queryEntity.userName" ><el-button slot="append" icon="el-icon-search" @click="getUserXxList"></el-button></el-input>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="请输入用户昵称" v-model="queryEntity.nickname" ><el-button slot="append" icon="el-icon-search" @click="getUserXxList"></el-button></el-input>
        </el-col>
        <el-col :span="8" ><el-button type="primary" @click="showAddUserDialog">录入新用户</el-button></el-col>
      </el-row>

      <!-- 数据表格-->
      <el-table border :data="userXxList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="账号" width="180"></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" width="180"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="lastLoginDate" label="上一次登录时间" :formatter="formatDate" ></el-table-column>
        <el-table-column label="是否冻结" >
          <template slot-scope="scope">
            <!--{{scope.row.valid}}-->
            <el-switch active-color="#13ce66" inactive-color="#ff4949"
                       v-model="scope.row.valid" active-value="1" inactive-value="0" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="checkUser(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="modifyUser(scope.row)"></el-button>
            </el-tooltip>
          </template>
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

    <!--新增用户弹出框-->
    <el-dialog
      title="录入新用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="closeAddUserDialog">
      <!--主体区-->
      <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="100px" >
        <el-form-item label="账号" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="addUserForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">录 入</el-button>
      </span>
    </el-dialog>

      <!--查看或者修改用户信息的弹出框-->
      <el-dialog
        title="用户信息"
        :visible.sync="checkUserDialogVisible"
        width="50%"
        @close="closeCheckUserDialog">
        <!--主体区-->
        <el-form :model="checkUserForm" :rules="checkUserFormRules" ref="checkUserFormRef" label-width="120px" label-position="left">

          <el-form-item label="id" prop="id" style="display: none">
            <el-input v-model="checkUserForm.id" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input v-model="checkUserForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="checkUserForm.nickname" :disabled="userFormdisabled"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="checkUserForm.password" :disabled="userFormdisabled"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="checkUserForm.sex" placeholder="性别" :disabled="userFormdisabled">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="usertype">
            <el-select v-model="checkUserForm.usertype" placeholder="用户类型" :disabled="userFormdisabled">
              <el-option label="回聊用户" value="1"></el-option>
              <el-option label="运维人员" value="2"></el-option>
              <el-option label="系统管理员" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号创建时间" prop="createdDate" >
            <el-input v-model="checkUserForm.createdDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="上一次登录时间" prop="lastLoginDate" >
            <el-input v-model="checkUserForm.lastLoginDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="上一次登录设备" prop="lastloginEquipment" >
            <el-input v-model="checkUserForm.lastloginEquipment" :disabled="true"></el-input>
          </el-form-item>

        </el-form>

      <span slot="footer" class="dialog-footer" >
        <el-button @click="checkUserDialogVisible = false">退出</el-button>
        <el-button type="primary" @click="commitChanges" v-if="modifyUserButton">提交修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    data(){
      return{
        userFormdisabled:false,
        modifyUserButton:false,
        checkUserFormRules:{
          nickname:[
            { required: true, message: '用户昵称不能为空', trigger: 'blur' },
            { min: 1, max: 8, message: '请输入10位以内的字符，且不能包括特殊字符', trigger: 'blur' },
          ],
          password:[
            { required: true, message: '用户昵称不能为空', trigger: 'blur' },
            { min: 1, max: 6, message: '请输入6位以内的字符，且不能包括特殊字符', trigger: 'blur' },
          ]
        },
        submitForm:{//数据提交的对象
          id:'',
          usertype:'',
          username:'',
          nickname:'',
          sex:'',
          password:'',
        },
        checkUserDialogVisible:false,
        checkUserForm:{
          username:'',
          nickname:'',
          password:'',
          lastLoginDate:'',
          sex:'',
          lastloginEquipment:'',
          createdDate:'',
          usertype:'',
          id:''
        },
        addUserFormRules:{
          username:[
            { required: true, message: '用户账号不能为空', trigger: 'blur' },
            { min: 8, max: 8, message: '请输入8位的用户账号，且不能包括特殊字符', trigger: 'blur' }
          ],
          nickname:[
            { required: true, message: '用户昵称不能为空', trigger: 'blur' },
          ],
          password:[
            { required: true, message: '密码不能为空', trigger: 'blur' },
          ]
        },
        addUserForm:{
          usertype:'1',
          username:'',
          nickname:'',
          password:'',
        },
        addUserDialogVisible:false,
        userXxList:[],
        total:0,
        queryEntity:{
          userType:'1',
          nickname:'',
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
      commitChanges(){//提交用户修改
        this.$refs.checkUserFormRef.validate(valid=> {
          if (!valid) return;
          this.checkUserDialogVisible = false;//关闭弹框

          //赋值给submitForm表单
          this.submitForm.id = this.checkUserForm.id;
          this.submitForm.usertype = this.checkUserForm.usertype;
          this.submitForm.username = this.checkUserForm.username;
          this.submitForm.nickname = this.checkUserForm.nickname;
          this.submitForm.sex = this.checkUserForm.sex;
          this.submitForm.password = this.checkUserForm.password;

          this.$axios.post("/api/user/modifyUser", this.submitForm).then(resp => {
              this.getUserXxList();
              if (resp.data.code == '200') {
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
      modifyUser(row){
        //显示控制
        this.modifyUserButton=true;//提交修改按钮显示
        this.checkUserDialogVisible=true;//显示弹框
        this.userFormdisabled=false;//输入框可以修改

        //赋值
        this.checkUserForm.username=row.username;
        this.checkUserForm.nickname=row.nickname;
        this.checkUserForm.password=row.password;
        this.checkUserForm.sex=row.sex;
        if(row.lastLoginDate != null && row.lastLoginDate !='' )
          this.checkUserForm.lastLoginDate= this.$moment.unix(row.lastLoginDate/1000).format("YYYY-MM-DD HH:mm:ss");
        if(row.createdDate != null && row.createdDate !='' )
          this.checkUserForm.createdDate= this.$moment.unix(row.createdDate/1000).format("YYYY-MM-DD HH:mm:ss");
        this.checkUserForm.lastloginEquipment=row.lastLoginEquipment;
        this.checkUserForm.usertype=row.usertype;
        this.checkUserForm.id=row.id;

      },
      checkUser(row){
        //显示控制
        this.modifyUserButton=false;//隐藏提交修改按钮
        this.checkUserDialogVisible=true;//显示弹框
        this.userFormdisabled=true;//输入框为只读状态
        // this.checkUserFormRules={};//清空校验规则

        //赋值
        this.checkUserForm.username=row.username;
        this.checkUserForm.nickname=row.nickname;
        this.checkUserForm.password=row.password;
        this.checkUserForm.sex=row.sex;
        if(row.lastLoginDate != null && row.lastLoginDate !='' )
          this.checkUserForm.lastLoginDate= this.$moment.unix(row.lastLoginDate/1000).format("YYYY-MM-DD HH:mm:ss");
        if(row.createdDate != null && row.createdDate !='' )
          this.checkUserForm.createdDate= this.$moment.unix(row.createdDate/1000).format("YYYY-MM-DD HH:mm:ss");
        this.checkUserForm.lastloginEquipment=row.lastLoginEquipment;
        this.checkUserForm.usertype=row.usertype;
        this.checkUserForm.id=row.id;

      },
      closeCheckUserDialog(){
        this.$refs.checkUserFormRef.resetFields();
      },
      addUser(){
        this.$refs.addUserFormRef.validate(valid=>{
          if(!valid) return;
          this.$axios.post("/api/user/addUser",this.addUserForm).then(resp =>{
              this.getUserXxList();
              if(resp.data.code=='200'){
                this.$message({message:"录入成功",type: 'success'});
              }
              else{
                this.$message.error("录入失败，"+resp.data.message);
              }
            }
          ).catch(error=>{
            console.log(error);
            this.$message.error("服务端发生错误，请联系管理员！");
          })
        })
      },
      closeAddUserDialog(){
        this.$refs.addUserFormRef.resetFields();
      },
      showAddUserDialog(){
        this.addUserDialogVisible=true;
      },
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
        // console.log(param);
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
