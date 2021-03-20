<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="30" >
        <el-col :span="6"><div class="grid-content item1">
          <div class="up_div" >用户总量</div>
          <div class="down_div" >{{this.statTotal.yhzl}}</div>
        </div>
        </el-col>
        <el-col :span="6"><div class="grid-content item2">
          <div class="up_div" >日信息量</div>
          <div class="down_div" >{{this.statTotal.rxxl}}</div>
        </div></el-col>
        <el-col :span="6"><div class="grid-content item3">
          <div class="up_div" >日活跃度</div>
          <div class="down_div" >{{this.statTotal.rhyd}}</div>
        </div></el-col>
        <el-col :span="6"><div class="grid-content item4">
          <div class="up_div" >日用户增长</div>
          <div class="down_div" >{{this.statTotal.ryhzz}}</div>
        </div></el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
    <div style="width: auto;height: 400px" id="main"></div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Welcome',
    data(){
      return{
        statTotal:{
          rhyd:0,//日活跃度
          rxxl:0,//日信息量
          ryhzz:0,//日用户增长
          yhzl:0//用户总量
        },

        time:[],//x坐标
        Growth:[]// y坐标
      }
    },
    created () {
      // 在通过mounted调用即可
      this.queryHeadStat()
    },
    mounted(){
    },
    methods: {
      async queryHeadStat(){
        var that = this;
        //{data:resp} 表示从数据中取出data属性，并且重命名为resp
        var resp = await this.$axios.get("/api/stat/queryHeadStatData");

        if(resp.data.code!='200') {
          this.$message.error("获取统计数据失败"+resp.data.message)
        }
        this.statTotal=resp.data.data.statTotal;
        console.log(resp);
        // yhzlList
        this.time.length=0; //清空数组
        for (let i = 0; i < resp.data.data.yhzlList.length; i++) {
          that.time.push(resp.data.data.yhzlList[i].date+"日");
          that.Growth.push(resp.data.data.yhzlList[i].total);
        }
        this.echartsInit()
      },
      //初始化echarts
      echartsInit() {
        //柱形图
        //因为初始化echarts 的时候，需要指定的容器 id='main'
        this.$echarts.init(document.getElementById('main')).setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: [ 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          grid:{
            x:50,
            y:50,
            x2:50,
            y2:50
          },
          legend: {
            data: ['用户日增长量']
          },
          xAxis: {
            type: 'category',
            data: this.time,

          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.Growth,
            name:'用户总量',
            type: 'line',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }]
        })
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
  .el-col {
    border-radius: 7px;
  }
  .item1{
    background: #67c23a;
  }
  .item2{

    background: #e6a23c;
  }
  .item3{
    background: #409EFF;
  }
  .item4{
    background: #909399;
  }
  .up_div{
    font-size: 12px;
    height: 40px;
    line-height: 40px;
    color: white
  }

  .down_div{
    height: 40px;
    color: white;
    font-size: 18px;
  }



  .grid-content {
    text-align: center;
    border-radius: 4px;
    min-height: 80px;
  }


</style>
