<template>
  <div class="managementCls">
    <el-row v-show="showNewAdd === 1">
      <el-row style="height: 35px; width: 100%; margin-top: 10px">
        <el-button
          style="position: absolute; right: 22px"
          class="btnCls"
          @click="AddUserHandle"
          >新建用户</el-button
        >
      </el-row>
      <div class="eltable">
        <el-table
          class="tableCls"
          :header-cell-class-name="thCls"
          :cell-class-name="tdCls"
          :data="tableData"
          :row-class-name="tableRowClassName"
          style="width: 100%"
        >
          <el-table-column type="index" width="120" align="center" label="序号">
          </el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="用户名称"
          >
          </el-table-column>
          <el-table-column
            prop="username"
            show-overflow-tooltip
            label="登录名称"
          >
          </el-table-column>
          <el-table-column prop="tel" show-overflow-tooltip label="手机号码">
          </el-table-column>
          <el-table-column prop="email" show-overflow-tooltip label="邮箱">
          </el-table-column>
          <el-table-column prop="gender" show-overflow-tooltip label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.gender === 0">男</span>
              <span v-if="scope.row.gender === 1">女</span>
            </template>
          </el-table-column>
          <el-table-column prop="position" show-overflow-tooltip label="地区">
          </el-table-column>
          <el-table-column prop="orgId" show-overflow-tooltip label="部门">
            <template slot-scope="scope">
              <span v-if="scope.row.orgId === '1'">示范区应急管理局</span>
              <span v-if="scope.row.orgId === '5'">园区企业一</span>
              <span v-if="scope.row.orgId === '6'">园区企业二</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="roleNames"
            show-overflow-tooltip
            label="系统角色"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="fixeds"
                @click="handleClick(scope.row, 'look')"
                size="small"
                >查看</el-button
              >
              <el-button
                type="text"
                class="fixeds"
                size="small"
                @click="handleClick(scope.row, 'edit')"
                >编辑</el-button
              >
              <el-button
                type="text"
                class="fixeds"
                size="small"
                @click="handleClick(scope.row, 'delete')"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-row style="text-align: center; margin-top: 15px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="pageNo"
          :page-size="pageSize"
          layout="prev, pager, next,sizes, jumper"
          background
          :total="total"
        >
        </el-pagination>
      </el-row>
    </el-row>
    <el-row v-if="showNewAdd === 2" :style="{ height: '100%' }">
      <new-user-info
        :rowData="rowData"
        :title="title"
        :changeShow.sync="showNewAdd"
        @getUserInfoData="getUserInfoData"
      ></new-user-info>
    </el-row>
    <el-calendar v-model="datevalue">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template
        slot="dateCell"
        slot-scope="{date, data}">
          <div :class="data.isSelected ? 'is-selected' : 'is-noselected'" @click="getCal(date,data)">
            {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
          </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import { getUserInfo, deleteUserInfo,systemLogin  } from "../../utils/request";
import NewUserInfo from "./NewUserInfo.vue";
export default {
  name: "UserManagement",
  components: { NewUserInfo },
  data() {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 3,
      showNewAdd: 1,
      rowData: null,
      title: "",
      datevalue: new Date()
    };
  },
  computed: {},
  mounted() {
    // this.promiseDemo();
    // this.getUserInfoData();
  },
  methods: {
    getCal(date,data) {
      // console.log(date,data);
      console.log(this.datevalue);
    },
    promiseDemo() {
      // 创建一个新的 Promise 对象
      let promise = new Promise(function (resolve, reject) {
        console.log('start');

        // 设置一个定时器，5秒后打印 'loading...' 并调用 resolve() 方法
        setTimeout(() => { console.log('loading...'); resolve(); }, 5000);
      });

      // 当 Promise 对象的状态变为 fulfilled 时，执行 then 方法中的回调函数
      promise.then(function () {
        console.log("then");
      });

      // 当 Promise 对象的状态变为 rejected 时，执行 catch 方法中的回调函数
      promise.catch(function () {
        console.log("catch");
      })
    },
    getUserInfoData: function () {
      systemLogin();
      // let that = this;
      // let params = {
      //  areaCode: 0,
      //   context: "",
      //   level: 0,
      //   typeIds: []
      // };
      // getUserInfo(params)
      //   .then((response) => {
      //     console.log(response);
      //     if (response["data"]["code"] === 0) {
      //       let data = response["data"]["list"];
      //       this.tableData = data;
      //       that.total = response["data"]["total"];
      //     } else {
      //       that.$message.warning("获取用户信息失败！");
      //     }
      //   })
      //   .catch(() => {
      //     this.$message.warning("获取用户信息失败！");
      //   });
    },
    thCls() {
      return "thCls";
    },
    tdCls() {
      return "tdCls";
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "warning-row";
      } else if (rowIndex % 2 === 1) {
        return "success-row";
      }
      return "";
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // 重新请求接口数据
      this.getUserInfoData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNo = val;
      // 请求当前页接口数据
      this.getUserInfoData();
    },
    AddUserHandle() {
      this.title = "新建";
      this.showNewAdd = 2;
    },
    handleClick: function (data, type) {
      if (type === "look") {
        // 查看
        this.title = "查看";
        this.rowData = data;
        this.showNewAdd = 2;
      }
      if (type === "edit") {
        // 编辑
        this.title = "编辑";
        this.rowData = data;
        this.showNewAdd = 2;
      }
      if (type === "delete") {
        // 删除
        let params = {
          userId: data.userId,
        };
        this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        })
          .then(() => {
            deleteUserInfo(params)
              .then((response) => {
                if (response["code"] === 0) {
                  this.getUserInfoData();
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                } else {
                  this.$message.warning("删除用户信息失败！");
                }
              })
              .catch(() => {
                this.$message.warning("删除用户信息失败！");
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.is-selected ::v-deep{
    color: #1989FA;
    border: 1px solid red;
    height: 100%;
  }
  .is-noselected ::v-deep{
    height: 100%;
  }
.fixeds {
  height: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #42a4ef;
}
.btnCls {
  background: #45b2e0;
  border-radius: 4px;
  color: white;
}
.eltable {
  //margin-left: 22px;
  padding-left: 20px;
  padding-right: 20px;
  //width: 100%;
}
.managementCls ::v-deep {
  .el-table td,
  .el-table th {
    padding: 0;
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    width: 30px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #e7e9ee;
    border-radius: 4px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #409eff;
  }
  .el-pagination__jump {
    font-size: 16px;
    font-weight: 500;
  }
  .el-table .warning-row {
    background: rgba(130, 184, 247, 0);
  }
  .el-table .success-row {
    background: rgba(130, 184, 247, 0.08);
  }
  .thCls {
    background: rgba(130, 184, 247, 0.35);
    border-top: 1px solid rgba(130, 184, 247, 1) !important;
    border-bottom: 1px solid rgba(130, 184, 247, 1) !important;
    color: #555d72;
    font-size: 16px;
    font-weight: 500;
    height: 50px;
  }
  .tableCls {
    border-bottom: 1px solid rgba(130, 184, 247, 1) !important;
  }
  .el-table th > .cell {
    min-width: 70px;
  }
  .tdCls {
    height: 50px !important;
    border-bottom: 1px solid rgba(130, 184, 247, 1) !important;
    font-size: 16px;
    font-weight: 500;
    color: #555d72;
  }
}
</style>
