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
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入用户账号" v-model="menuQueryEntity.menuName" ><el-button slot="append" icon="el-icon-search" @click="getMenuList"></el-button></el-input>
          </el-col>
        </el-row>

      <!-- 数据表格-->
      <el-table border :data="menuXxList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="菜单名称" width="150"></el-table-column>
        <el-table-column prop="fid" label="等级" width="150" :formatter="formatFid"></el-table-column>
        <el-table-column prop="url" label="url" width="200"></el-table-column>
        <el-table-column prop="order" label="排序号" width="150"></el-table-column>
        <el-table-column prop="createdDate" label="创建时间" :formatter="formatDate" ></el-table-column>
        <el-table-column prop="bz" label="备注" ></el-table-column>
        <el-table-column label="是否启用" >
          <template slot-scope="scope">
<!--                        {{scope.row.valid}}-->
            <el-switch active-color="#13ce66" inactive-color="#ff4949"
                       v-model="scope.row.valid" active-value="1" inactive-value="0" @change="roleStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
<!--        <el-table-column label="操作" width="200">-->
<!--          <template slot-scope="scope">-->
<!--            <el-tooltip class="item" effect="dark" content="编辑菜单" placement="top" :enterable="false" >-->
<!--              <el-button type="primary" icon="el-icon-edit" size="mini" @click="distribute(scope.row)"></el-button>-->
<!--            </el-tooltip>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="menuQueryEntity.pageNum"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="menuQueryEntity.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


  </div>
</template>

<script>

  export default {
    data(){
      return{
        total:0,//数据总量
        menuXxList:[],
        menuQueryEntity:{
          menuName:'',
          pageNum:1,
          pageSize:5
        }
      }
    },
    mounted () {
      this.getMenuList();
    },
    methods: {

      //分配权限
      distribute(row){

      },
      //更改角色状态
      roleStateChange(row){
        // console.log(row.valid);
        this.$axios.get("/api/menu/modifyByZdmc?menuId="+row.id+"&zdmc=is_valid&value="+row.valid).then(resp =>{
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
        this.menuQueryEntity.pageSize=param;
        this.getMenuList();
      },
      //更改分页当前页码
      handleCurrentChange(param){
        console.log(param);
        this.menuQueryEntity.pageNum=param;
        this.getMenuList();
      },
      //等级转换
      formatFid(row, column, cellValue){
        if(cellValue == null || cellValue =='' ) return "";
        if(cellValue == '1') return "一级菜单";
        return "二级菜单";
      },
      //转换时间戳
      formatDate(row, column, cellValue){
        // console.log(cellValue);
        if(cellValue == null || cellValue =='' ) return "";
        return this.$moment.unix(cellValue/1000).format("YYYY-MM-DD HH:mm:ss");
      },
      //请求角色分页数据
      async getMenuList(){
        //{data:resp} 表示从数据中取出data属性，并且重命名为resp
        var resp = await this.$axios.post("/api/menu/queryMenuPage",this.menuQueryEntity);

        if(resp.data.code!='200') {
          this.$message.error("获取角色列表失败"+resp.data.message)
        }
        console.log(resp);

        this.menuXxList = resp.data.data.pageMenuXx.content;
        this.total = resp.data.data.pageMenuXx.totalElements;
      }
    }

  }

</script>

<style scoped>

</style>
