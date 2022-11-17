<template>
  <div class="managementCls">
    <el-row v-show="showNewAdd === 1">
      <div style="height: 35px; width: 100%; margin-top: 10px">
        <el-button
          style="position: absolute; right: 22px"
          class="btnCls"
          @click="AddUserHandle"
          >新建角色</el-button
        >
      </div>
      <el-row class="eltable">
        <base-table
          class="tableCls"
          :index="true"
          :total="total"
          :select="false"
          :showPage="true"
          :table-list="tableData"
          :header="header"
          :height="470"
          :pageNo="pageNo"
          :pageSize="pageSize"
          :row-class-name="tableRowClassName"
          :header-row-class-name="thCls"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @selectionChange="selectionChangeHandle"
        ></base-table>
      </el-row>
    </el-row>
    <el-row v-if="showNewAdd === 2" :style="{ height: '100%' }">
      <new-role-info
        :type="type"
        :rowData="rowData"
        :title="title"
        :changeShow.sync="showNewAdd"
        @getRoleInfoData="getRoleInfoData"
      ></new-role-info>
    </el-row>
  </div>
</template>

<script>
import { deleteRoleInfo, getRoleInfo } from "../../utils/request";
import NewRoleInfo from "./NewRoleInfo.vue";
import BaseTable from "../../components/BaseTable.vue";
export default {
  name: "RoleManagement",
  components: { NewRoleInfo, BaseTable },
  data() {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 3,
      showNewAdd: 1,
      rowData: null,
      title: "",
      type: "details",
      header: [],
      batchDeleteBaseIds: [],
    };
  },
  computed: {},
  mounted() {
    this.getRoleInfoData();
    this.initData();
  },
  methods: {
    initData: function () {
      this.header = [
        { prop: "roleName", label: "角色名称" },
        {
          prop: "roleDefault",
          label: "是否默认角色",
          render: (data) => {
            if (data.row.roleDefault === 0) {
              return <span>非默认</span>;
            } else {
              return <span>默认</span>;
            }
          },
        },
        {
          prop: "sysInit",
          label: "是否内置角色",
          render: (data) => {
            if (data.row.sysInit === 0) {
              return <span>非内置</span>;
            } else {
              return <span>内置</span>;
            }
          },
        },
        { prop: "createUserName", label: "创建人" },
        {
          label: "操作",
          width: 300,
          align: "center",
          render: (h, data) => {
            return (
              <div style="display:flex;justify-content:center;">
                <div
                  class="viewBtnCls"
                  onClick={() => {
                    this.handleClick(data.row, "look");
                  }}
                >
                  查看
                </div>
                <div
                  class="editBtnCls"
                  onClick={() => {
                    this.handleClick(data.row, "edit");
                  }}
                >
                  编辑
                </div>
                <div
                  class="deleteBtnCls"
                  v-if="data.row.roleCode === 'sys_admin'"
                  onClick={() => {
                    this.handleClick(data.row, "delete");
                  }}
                >
                  删除
                </div>
              </div>
            );
          },
        },
      ];
    },
    getRoleInfoData: async function () {
      let that = this;
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      const { code, data } = await getRoleInfo(params);
      if (code === 0) {
        that.tableData = data["records"];
      } else {
        that.$message.warning("获取角色信息失败！");
      }
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
      // 重新请求接口数据
      this.getRoleInfoData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      // 请求当前页接口数据
      this.getRoleInfoData();
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
        this.type = "details";
      }
      if (type === "edit") {
        // 编辑
        this.title = "编辑";
        this.rowData = data;
        this.showNewAdd = 2;
        this.type = "edit";
      }
      if (type === "delete") {
        // 删除
        let params = {
          roleId: data.roleId,
        };
        this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
          type: "warning",
        })
          .then(() => {
            deleteRoleInfo(params)
              .then((response) => {
                if (response["code"] === 0) {
                  this.getRoleInfoData();
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                } else {
                  this.$message.warning("删除角色信息失败！");
                }
              })
              .catch(() => {
                this.$message.warning("删除角色信息失败！");
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
    selectionChangeHandle(val) {
      if (val.length > 0) {
        let ids = [];
        val.forEach((item) => {
          ids.push(item["id"]);
        });
        console.log("ids", ids);
        this.batchDeleteBaseIds = ids;
      }
    },
  },
};
</script>

<style scoped lang="scss">
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
.eltable ::v-deep.el-table th > .cell {
  min-width: 70px;
}
.managementCls ::v-deep {
  .el-table td,
  .el-table th {
    padding: 0;
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
}
.fixeds {
  height: 15px;
  font-size: 16px;
  font-weight: 500;
  color: #42a4ef;
}
</style>
