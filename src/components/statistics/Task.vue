<template>
  <div>
    <!-- 面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card class="box-card">
      <!--查询区-->
      <!--      <el-row :gutter="20">-->
      <!--        <el-col :span="8">-->
      <!--          <el-input placeholder="请输入用户账号" v-model="queryEntity.userName" ><el-button slot="append" icon="el-icon-search" @click="getUserXxList"></el-button></el-input>-->
      <!--        </el-col>-->
      <!--        <el-col :span="8">-->
      <!--          <el-input placeholder="请输入用户昵称" v-model="queryEntity.nickname" ><el-button slot="append" icon="el-icon-search" @click="getUserXxList"></el-button></el-input>-->
      <!--        </el-col>-->
      <!--        <el-col :span="8" ><el-button type="primary" @click="showAddUserDialog">录入新用户</el-button></el-col>-->
      <!--      </el-row>-->

      <!-- 数据表格-->
      <el-table border :data="taskXxList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="任务名称" width="150"></el-table-column>
        <el-table-column prop="cron" label="cron" width="150"></el-table-column>
        <el-table-column prop="lastExcuteTime" label="上一次执行时间" width="200" :formatter="formatDate"></el-table-column>
        <el-table-column prop="bz" label="备注" ></el-table-column>
        <el-table-column label="是否启用" >
          <template slot-scope="scope">
            <!--                        {{scope.row.valid}}-->
            <el-switch active-color="#13ce66" inactive-color="#ff4949"
                       v-model="scope.row.valid" active-value="1" inactive-value="0" @change="stateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false" >
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="openDilog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="taskQueryEntity.pageNum"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="taskQueryEntity.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


    <!--查看或者修改用户信息的弹出框-->
    <el-dialog
      title="任务详细信息"
      :visible.sync="checkDialogVisible"
      width="50%"
      @close="checkDialogVisible=false">
      <!--主体区-->
      <el-form :model="checkTaskForm" :rules="checkTaskFormRules" ref="checkTaskFormRef" label-width="120px" label-position="left">

        <el-form-item label="id" prop="id" style="display: none">
          <el-input v-model="checkTaskForm.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="统计名称" prop="name">
          <el-input v-model="checkTaskForm.name" ></el-input>
        </el-form-item>
        <el-form-item label="cron" prop="cron">
          <el-input v-model="checkTaskForm.cron"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer" >
        <el-button @click="checkDialogVisible = false">退出</el-button>
        <el-button type="primary" @click="commitChanges">提交修改</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    data(){
      var handleCronValidate=(rule,value,callback)=>{
        if(!!value){
          let parser=require('cron-parser');
          try{
            let interval=parser.parseExpression(value);
          } catch (e) {
            callback("非Cron表达式格式:"+e.message);
          }
        } else {
          callback("Cron表达式不能为空！");
        }
        callback();
      }
      return{
        checkTaskFormRules:{
          name:[
            { required: true, message: '名称不能为空', trigger: 'blur' },
            { min: 1, max: 10, message: '请输入10位以内的字符，且不能包括特殊字符', trigger: 'blur' },
          ],
          cron:[
            { required: true, message: 'cron', trigger: 'blur' },
            {required:true,validator:handleCronValidate,trigger: 'blur'}
          ]

        },
        checkTaskForm:{
          id:'',
          name:'1',
          cron:''
        },
        checkDialogVisible:false,
        total:0,//数据总量
        taskXxList:[],
        taskQueryEntity:{
          menuName:'',
          pageNum:1,
          pageSize:5
        }
      }
    },
    mounted () {
      this.getTaskList();
    },
    methods: {
      commitChanges(){
        this.$refs.checkTaskFormRef.validate(valid=> {
          this.$axios.post("/api/task/modify", this.checkTaskForm).then(resp => {
              this.getTaskList();
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
      openDilog(row){
        this.checkTaskForm.id=row.id;
        this.checkTaskForm.name=row.name;
        this.checkTaskForm.cron=row.cron;
        this.checkDialogVisible=true;
        console.log(this.checkTaskForm);
      },
      stateChange(row){
        // console.log(row.valid);
        this.$axios.get("/api/task/modifyByZdmc?taskId="+row.id+"&zdmc=is_valid&value="+row.valid).then(resp =>{
            if(resp.data.code=='200'){
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
      //更改分页size
      handleSizeChange(param){
        // console.log(param);
        this.taskQueryEntity.pageSize=param;
        this.getTaskList();
      },
      //更改分页当前页码
      handleCurrentChange(param){
        console.log(param);
        this.taskQueryEntity.pageNum=param;
        this.getTaskList();
      },
      formatDate(row, column, cellValue){
        // console.log(cellValue);
        if(cellValue == null || cellValue =='' ) return "";
        return this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      },
      //请求定时任务分页数据
      async getTaskList(){
        //{data:resp} 表示从数据中取出data属性，并且重命名为resp
        var resp = await this.$axios.post("/api/task/queryTaskPage",this.taskQueryEntity);

        if(resp.data.code!='200') {
          this.$message.error("获取任务列表失败:"+resp.data.message)
        }
        console.log(resp);

        this.taskXxList = resp.data.data.taskXxPage.content;
        this.total = resp.data.data.taskXxPage.totalElements;
      }
    }

  }

</script>

<style scoped>

</style>
