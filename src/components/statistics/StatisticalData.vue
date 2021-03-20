<template>
  <div>
    <!-- 面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据分析</el-breadcrumb-item>
      <el-breadcrumb-item>历史统计数据</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="12"><div id="item1"></div></el-col>
        <el-col :span="12"><div id="item2"></div></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"><div id="item3"></div></el-col>
        <el-col :span="12"><div id="item4"></div></el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
            <!--  查询区-->
            <el-row :gutter="20">
              <el-col :span="8">
                <el-input placeholder="请输统计名称" v-model="statQueryEntity.name" ></el-input>
              </el-col>
              <el-select v-model="statQueryEntity.type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button type="primary" @click="getStatList">搜索</el-button>
            </el-row>

      <!-- 数据表格-->
      <el-table border :data="statXxList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="统计名称" width="150"></el-table-column>
        <el-table-column prop="type" label="类型" :formatter="formatType"></el-table-column>
        <el-table-column prop="total" label="总量" ></el-table-column>
        <el-table-column prop="cycle" label="周期" ></el-table-column>
        <el-table-column prop="excuteDate" label="上一次执行时间" :formatter="formatDate" ></el-table-column>

      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="statQueryEntity.pageNum"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="statQueryEntity.pageSize"
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
        itemData1: {
          x:[],
          y:[]
        },
        itemData2:[],//男女比例
        itemData3: {
          x:[],
          y:[]
        },
        itemData4: {
          x:[],
          y:[]
        },
        options:[
          {label:"用户总量统计",value:"1"},
          {label:"用户活跃度统计",value:"2"},
          {label:"日增长用户量",value:"3"},
          {label:"日信息量",value:"4"},
        ],
        total:0,//数据总量
        statXxList:[],
        statQueryEntity:{
          name:'',
          type:'',
          pageNum:1,
          pageSize:5
        }
      }
    },
    mounted () {
      this.getStatList();
      this.getEchartData();
    },
    methods: {
      async getEchartData(){
        var that = this;
        //{data:resp} 表示从数据中取出data属性，并且重命名为resp
        var resp = await this.$axios.get("/api/stat/queryStatDataForEchart");

        if(resp.data.code!='200') {
          this.$message.error("获取统计数据失败"+resp.data.message)
        }

        that.itemData1.x=[];
        that.itemData1.y=[];
        for (let i = 0; i < resp.data.data.rxxlList.length; i++) {
          that.itemData1.x.push(resp.data.data.rxxlList[i].date+"日");
          that.itemData1.y.push(resp.data.data.rxxlList[i].total);
        }
        that.itemData2=resp.data.data.genterData;
        that.itemData3.x=[];
        that.itemData3.y=[];
        for (let i = 0; i < resp.data.data.rxxlList.length; i++) {
          that.itemData3.x.push(resp.data.data.rzzList[i].date+"日");
          that.itemData3.y.push(resp.data.data.rzzList[i].total);
        }
        that.itemData4.x=[];
        that.itemData4.y=[];
        for (let i = 0; i < resp.data.data.rxxlList.length; i++) {
          that.itemData4.x.push(resp.data.data.yhhydList[i].date+"日");
          that.itemData4.y.push(resp.data.data.yhhydList[i].total);
        }

        this.echartsInit();
      },
      formatType(row, column, cellValue){
        if(cellValue==1) return"用户总量查询";
        else if(cellValue==2) return "用户活跃度统计"
        else if(cellValue==3) return "日增长用户量"
        else if(cellValue==4) return "日信息量"
      },
      echartsInit() {
        //柱形图
        //因为初始化echarts 的时候，需要指定的容器 id='main'
        this.$echarts.init(document.getElementById('item1')).setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          grid:{
            x:40,
            y:40,
            x2:40,
            y2:25
          },
          legend: {
            data: ['日信息量']
          },
          xAxis: {
            type: 'category',
            data: this.itemData1.x,
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.itemData1.y,
            name:'日信息量',
            type: 'line',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }]
        });
        /**
         *
         */
        this.$echarts.init(document.getElementById('item2')).setOption({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          grid:{
            x:40,
            y:10,
            x2:40,
            y2:10
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              labelLine: {
                show: false
              },
              data:this.itemData2
            }
          ]});
        /**
         *
         */
        this.$echarts.init(document.getElementById('item3')).setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          grid:{
            x:40,
            y:40,
            x2:40,
            y2:25
          },
          legend: {
            data: ['日增长']
          },
          xAxis: {
            type: 'category',
            data: this.itemData3.x,
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.itemData3.y,
            name:'日增长',
            type: 'bar',
            showBackground: false,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }]
        });
        /**
         *
         */
        this.$echarts.init(document.getElementById('item4')).setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          grid:{
            x:40,
            y:40,
            x2:40,
            y2:25
          },
          legend: {
            data: ['日活跃度']
          },
          xAxis: {
            type: 'category',
            data: this.itemData4.x,
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.itemData4.y,
            name:'日信息量',
            type: 'line',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }]
        });
      },

      //更改分页size
      handleSizeChange(param){
        // console.log(param);
        this.statQueryEntity.pageSize=param;
        this.getStatList();
      },
      //更改分页当前页码
      handleCurrentChange(param){
        console.log(param);
        this.statQueryEntity.pageNum=param;
        this.getStatList();
      },

      //转换时间
      formatDate(row, column, cellValue){
        // console.log(cellValue);
        if(cellValue == null || cellValue =='' ) return "";
        return this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
      },
      //请求分页数据
      async getStatList(){
        //{data:resp} 表示从数据中取出data属性，并且重命名为resp
        var resp = await this.$axios.post("/api/stat/queryStatPage",this.statQueryEntity);

        if(resp.data.code!='200') {
          this.$message.error("获取统计数据失败："+resp.data.message)
        }
        console.log(resp);

        this.statXxList = resp.data.data.statXxPage.content;
        this.total = resp.data.data.statXxPage.totalElements;
      }
    }

  }

</script>

<style scoped>
  .el-card{
    margin-bottom: 20px;
  }

  .el-row .last-child {
    margin-bottom: 0;
  }

  #item1{
    height: 200px;
    width: auto;
  }
  #item2{
    height: 200px;
    width: auto;
  }
  #item3{
    height: 200px;
    width: auto;
  }
  #item4{
    height: 200px;
    width: auto;
  }


</style>
