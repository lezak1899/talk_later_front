<template>
  <div>
    <!-- 面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card class="box-card">
<!--      查询区-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入角色名称" v-model="roleQueryEntity.roleName" ><el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button></el-input>
        </el-col>
      </el-row>

      <!-- 数据表格-->
      <el-table border :data="roleXxList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
        <el-table-column prop="createdDate" label="创建时间" :formatter="formatDate" ></el-table-column>
        <el-table-column prop="bz" label="备注" ></el-table-column>
        <el-table-column label="是否启用" >
          <template slot-scope="scope">
<!--            {{scope.row.valid}}-->
            <el-switch active-color="#13ce66" inactive-color="#ff4949"
                       v-model="scope.row.valid" active-value="1" inactive-value="0" @change="roleStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="权限分配" width="200">
          <template slot-scope="scope">
<!--            {{scope.row.type}}-->
<!--            <el-tooltip class="item" effect="dark" content="查看" placement="top" :enterable="false">-->
<!--              <el-button type="primary" icon="el-icon-search" size="mini" @click="checkUser(scope.row)"></el-button>-->
<!--            </el-tooltip>-->
            <el-tooltip v-if="scope.row.type!=='1'" content="分配权限" placement="top" :enterable="false" >
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="openDistributionDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="roleQueryEntity.pageNum"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="roleQueryEntity.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


    <!--权限分配弹出框-->
    <el-dialog
      title="权限分配"
      :visible.sync="distributionDialogVisible"
      width="50%">
      <!--主体区-->
      <el-table border :data="roleMenuList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="菜单名称" width="120"></el-table-column>
        <el-table-column prop="fid" label="等级" width="120" :formatter="formatFid"></el-table-column>
        <el-table-column prop="url" label="url" width="200"></el-table-column>
        <el-table-column prop="bz" label="备注" ></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
<!--            {{scope.row.roleMenuId}}-->
            <el-tooltip class="item" effect="dark" content="移除" placement="top" :enterable="false" >
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeMenu(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="distributionDialogVisible=false">退出</el-button>
        <el-button type="primary" @click="openAddMenuDialog()">分配新菜单</el-button>
      </span>
    </el-dialog>

    <!--新增菜单弹出框-->
    <el-dialog
      title="分配新菜单"
      :visible.sync="addMenuDialogVisible"
      width="50%">
      <!--主体区-->
      <el-row>
        <el-col :span="12">
          <span class="demonstration">一级菜单</span>
          <el-cascader
            v-model="selectedMenu1"
            :options="menuOptions1"
            @change="handleChange1"></el-cascader>
        </el-col>
        <el-col :span="12">
          <span class="demonstration">二级菜单</span>
          <el-cascader
            v-model="selectedMenu2"
            :options="menuOptions2"
            @change="handleChange2"></el-cascader>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogReturn">返 回</el-button>
        <el-button type="primary" @click="distribute">分 配</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    data(){
      return{
        selectedMenu2:'',//被选中的二级菜单
        selectedMenu1:'',//被选中的一级菜单
        value:'',//下拉列表默认不选
        currentRoleId:'123',//当前操作角色的Id
        menuOptions1:[],//一级菜单
        menuOptions2:[],//二级菜单
        addMenuDialogVisible:false,//控制新增菜单弹窗的显示和隐藏
        distributionDialogVisible:false,//控制分配权限的显示和隐藏
        roleMenuList:[],//角色菜单关联表
        total:0,//数据总量
        roleXxList:[],//分页查询返回的数据
        roleQueryEntity:{//分页查询的条件
          roleName:'',
          pageNum:1,
          pageSize:5
        }
      }
    },
    mounted () {
      this.getRoleList();
    },
    methods: {
      async removeMenu(row){
        var {data:resp} = await this.$axios.get("/api/menu/deleteCorrelation?roleMenuId="+row.roleMenuId)

        if(resp.code=='200'){
          this.$message.success("移除菜单成功！");
        }else{
          this.$message.error("移除菜单失败,"+resp.message);
        }
        //刷新数据
        this.$axios.get("/api/menu/queryMenuListByRoleId?roleId="+this.currentRoleId).then(resp =>{
            if(resp.data.code=='200'){
              // console.log(resp);
              this.roleMenuList=resp.data.data.roleMenuList;
            }
            else{
              this.$message.error("获取数据失败，"+resp.data.message);
            }
          }
        ).catch(error=>{
          console.log(error);
          this.$message.error("服务端发生错误，请联系管理员！");

        })
      },
      async distribute(){//分配菜单
        var {data:resp} = await this.$axios.get("/api/menu/distributeMenu?roleId="+
          this.currentRoleId+"&menuId1="+this.selectedMenu1+"&menuId2="+this.selectedMenu2);
        if(resp.code=='200'){
          this.$message.success("分配权限成功！");
        }else{
          this.$message.error("分配权限失败:"+resp.message);
        }
      },
      dialogReturn(){//新增菜单弹窗返回
        this.distributionDialogVisible=true;
        this.addMenuDialogVisible=false;
      },
      //一级菜单被修改时触发
      async handleChange1(value) {
        this.selectedMenu1=value[0];
        var {data:resp} = await this.$axios.get("/api/menu/queryMenuOptions?fid="+value[0]);
        if(resp.code=='200'){
          this.menuOptions2=resp.data.menuOptions;
        }else{
          this.$message.error("获取菜单数据失败:"+resp.message);
        }
      },
      //二级菜单被修改时触发
      handleChange2(value) {
        this.selectedMenu2=value[0];
      },
      //打开新增菜单弹窗
      async openAddMenuDialog(){
        this.distributionDialogVisible=false;
        this.addMenuDialogVisible=true;
        this.menuOptions2=[];//置空二级菜单下拉菜单
        this.selectedMenu1='';//置空被选中一级菜单
        this.selectedMenu2='';//置空被选中一级菜单
        //加载一级菜单
        var {data:resp} = await this.$axios.get("/api/menu/queryMenuOptions?fid=1");
        if(resp.code=='200'){
          this.menuOptions1=resp.data.menuOptions;
        }else{
          this.$message.error("获取菜单数据失败:"+resp.message);
        }
      },
      //等级转换
      formatFid(row, column, cellValue){
        if(cellValue == null || cellValue =='' ) return "";
        if(cellValue == '1') return "一级菜单";
        return "二级菜单";
      },
      //打开分配权限页面
      openDistributionDialog(row){
        this.currentRoleId=row.id;//更新当前操作用户的Id
        this.distributionDialogVisible=true;
        this.$axios.get("/api/menu/queryMenuListByRoleId?roleId="+row.id).then(resp =>{
            if(resp.data.code=='200'){
              // console.log(resp);
              this.roleMenuList=resp.data.data.roleMenuList;
            }
            else{
              this.$message.error("获取数据失败:"+resp.data.message);
            }
          }
        ).catch(error=>{
          console.log(error);
          this.$message.error("服务端发生错误，请联系管理员！");
        })

      },
      //更改角色状态
      roleStateChange(row){
        // console.log(row.valid);
        this.$axios.get("/api/role/modifyByZdmc?roleId="+row.id+"&zdmc=is_valid&value="+row.valid).then(resp =>{
            if(resp.data.code=='200'){
              this.$message({message:"修改成功！",type: 'success'});
            }
            else{
              this.$message.error("修改失败:"+resp.data.message);
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
        this.roleQueryEntity.pageSize=param;
        this.getRoleList();
      },
      //更改分页当前页码
      handleCurrentChange(param){
        console.log(param);
        this.roleQueryEntity.pageNum=param;
        this.getRoleList();
      },
      //转换时间戳
      formatDate(row, column, cellValue){
        // console.log(cellValue);
        if(cellValue == null || cellValue =='' ) return "";
        return this.$moment.unix(cellValue/1000).format("YYYY-MM-DD HH:mm:ss");
      },
      //请求角色分页数据
      async getRoleList(){
        //{data:resp} 表示从数据中取出data属性，并且重命名为resp
        var resp = await this.$axios.post("/api/role/queryRolePage",this.roleQueryEntity);

        if(resp.data.code!='200') {
          this.$message.error("获取角色列表失败:"+resp.data.message);
        }
        console.log(resp);
        this.roleXxList = resp.data.data.pageRoleXx.content;
        this.total = resp.data.data.pageRoleXx.totalElements;
        console.log("userList",this.userXxList);
      }
      }
  }

</script>

<style scoped>

</style>
