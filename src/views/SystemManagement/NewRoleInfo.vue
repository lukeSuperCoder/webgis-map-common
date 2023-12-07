<template>
  <div class="planCls">
    <el-row class="heads">
      <el-page-header @back="cancelHandle" content="角色信息"> </el-page-header>
    </el-row>
    <el-row class="form_div" :style="{ height: scrollerHeight }">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称:" prop="roleName">
          <el-input
            v-model="form.roleName"
            class="inputWt"
            :disabled="title === '查看'"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否默认角色:">
          <el-select
            v-model="form.roleDefault"
            class="inputWt"
            value=""
            :disabled="title === '查看'"
          >
            <el-option
              v-for="item in form.roleDefaultList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否内置角色:">
          <el-select
            v-model="form.sysInit"
            class="inputWt"
            value=""
            :disabled="title === '查看'"
          >
            <el-option
              v-for="item in form.sysInitList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建人:">
          <!--          <el-input v-model=""></el-input>-->
          {{ form.createUserName }}
        </el-form-item>
        <el-row class="btnSave">
          <el-form-item>
            <el-button
              class="btnClsing"
              size="small"
              v-show="title === '新建'"
              @click="saveDataHandle('form')"
              >确定</el-button
            >
            <el-button
              class="btnClsing"
              size="small"
              v-show="title === '编辑'"
              @click="upDataDataHandle"
              >修改</el-button
            >
            <el-button
              class="btnCancel"
              size="small"
              v-show="title !== '查看'"
              @click="cancelHandle"
              >取消</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { addRoleInfo, updateRoleInfo } from "../../utils/request";
export default {
  name: "NewRoleInfo",
  props: {
    rowData: Object,
    title: String,
    type: String,
  },
  data() {
    return {
      form: {
        roleName: "",
        createUserName: "",
        sysInitList: [
          {
            label: "非默认",
            value: 0,
          },
          {
            label: "默认",
            value: 1,
          },
        ],
        sysInit: 0,
        roleDefault: 0,
        roleDefaultList: [
          {
            label: "非内置",
            value: 0,
          },
          {
            label: "内置",
            value: 1,
          },
        ],
      },
      disabled: false,
      data: [],
      value: [],
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      operateType: "",
    };
  },
  computed: {
    scrollerHeight: function () {
      return window.innerHeight - 190 + "px";
    },
  },
  mounted() {
    this.operateType = this.type;
    //this.getRoleInfoData();//查询角色
    this.fillValueHandle();
    this.form.createUserName = sessionStorage.getItem("userName");
  },
  methods: {
    fillValueHandle() {
      if (this.rowData !== null && this.title !== "新建") {
        if (this.title === "查看") {
          this.disabled = true;
        }
        this.form.roleName = this.rowData.roleName;
        this.form.roleDefault = this.rowData.roleDefault;
        this.form.sysInit = this.rowData.sysInit;
        this.form.createUserName = this.rowData.createUserName;
      }
    },
    saveDataHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          let params = {
            roleName: this.form.roleName,
            roleDefault: this.form.roleDefault,
            sysInit: this.form.sysInit,
            createUserName: this.form.createUserName,
            createUserId: sessionStorage.getItem("id"),
            createTime: this.getNowFormatDate(),
          };
          addRoleInfo(params)
            .then((response) => {
              if (response["code"] === 0) {
                this.ifShow = 1;
                this.$emit("update:changeShow", this.ifShow);
                this.$emit("getRoleInfoData");
                that.$message.success("新增角色成功！");
              } else {
                that.$message.warning("新增角色失败！");
              }
            })
            .catch(() => {
              this.$message.warning("新增角色失败！");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    upDataDataHandle() {
      let that = this;
      let params = {
        roleId: this.rowData.roleId,
        roleName: this.form.roleName,
        roleDefault: this.form.roleDefault,
        sysInit: this.form.sysInit,
        createUserName: this.form.createUserName,
        createUserId: sessionStorage.getItem("id"),
        createTime: this.getNowFormatDate(),
      };
      updateRoleInfo(params)
        .then((response) => {
          if (response["code"] === 0) {
            this.ifShow = 1;
            this.$emit("update:changeShow", this.ifShow);
            this.$emit("getRoleInfoData");
            that.$message.success("修改角色信息成功！");
          } else {
            that.$message.warning("修改角色信息失败！");
          }
        })
        .catch(() => {
          this.$message.warning("修改角色信息失败！");
        });
    },
    cancelHandle() {
      this.ifShow = 1;
      this.$emit("update:changeShow", this.ifShow);
    },
    getNowFormatDate() {
      var date = new Date(); //获取当前时间
      var month = date.getMonth() + 1; //月份处理
      var day = date.getDate();
      month = month < 10 ? "0" + month : month; //月份为1-9月,在其前面加0
      day = day < 10 ? "0" + day : day; //日期为1-9号,在其前面加了0
      var s1 = "-"; //定义年月日分隔符-
      var s2 = ":"; //定义时分秒分隔符:
      //拼接年月日,时分秒
      var currDate =
        date.getFullYear() +
        s1 +
        month +
        s1 +
        day +
        " " +
        date.getHours() +
        s2 +
        date.getMinutes() +
        s2 +
        date.getSeconds();
      return currDate;
    },
  },
};
</script>

<style scoped>
.planCls {
  width: 100%;
  height: 100%;
}
.heads {
  height: 50px;
  background: #ffffff;
  padding-left: 22px;
}
.planCls ::v-deep.el-page-header {
  font-size: 14px;
  font-weight: 400;
  color: #45b2e0;
  padding: 10px;
}
.planCls ::v-deep.el-page-header__content {
  font-size: 16px;
  font-weight: 400;
  color: #505255;
}
.form_div {
  margin: 18px 20px;
  /*width: 1680px;*/
  /*height: 100%;*/
  background: #ffffff;
  display: flex;
  /*align-items: center;*/
  justify-content: center;
}
.demo-ruleForm {
  padding-top: 25px;
}
.btnClsing {
  width: 92px;
  background: #45b2e0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
}
.btnCancel {
  width: 92px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #505255;
}
.inputWt {
  width: 360px !important;
}
.btnSave {
  text-align: center;
  margin-top: 10px;
  padding-bottom: 48px;
}
</style>
