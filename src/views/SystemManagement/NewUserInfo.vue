<template>
  <el-row class="planCls">
    <el-row class="heads">
      <el-page-header @back="cancelHandle" content="用户信息"> </el-page-header>
    </el-row>
    <el-row class="form_div" :style="{ height: scrollerHeight }">
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-position="right"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称:" prop="userName">
          <el-input
            v-model="form.userName"
            :disabled="title === '查看'"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录名称:" prop="mainUserId">
          <el-input
            v-model="form.mainUserId"
            :disabled="title === '查看' || title === '编辑'"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="title !== '查看'" label="密码:" prop="pass">
          <el-input
            type="password"
            v-model="form.pass"
            autocomplete="off"
            :disabled="title === '查看'"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item v-show="title === '查看'" label="密码:" prop="pass">
          <el-input
            v-model="form.pass"
            autocomplete="off"
            :disabled="title === '查看'"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="phone">
          <el-input
            v-model="form.phone"
            :disabled="title === '查看'"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input
            v-model="form.email"
            :disabled="title === '查看'"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio-group v-model="form.gender" :disabled="title === '查看'">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职位:">
          <el-input
            v-model="form.position"
            :disabled="title === '查看'"
            class="inputWt"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门:" prop="dept">
          <el-select
            v-model="form.dept"
            placeholder="请选择部门"
            style="width: 100%"
            :disabled="title === '查看'"
            class="inputWt"
          >
            <el-option
              v-for="item in form.depts"
              :key="item.value"
              :label="item.orgName"
              :value="item.orgId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色:" prop="role">
          <el-select
            v-model="form.role"
            placeholder="请选择角色"
            style="width: 100%"
            @change="roleChangeHandle"
            :disabled="title === '查看'"
            class="inputWt"
          >
            <el-option
              v-for="item in form.roles"
              :key="item.value"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row class="btnSave">
          <el-form-item>
            <el-button
              v-show="title === '新建'"
              class="btnClsing"
              @click="saveDataHandle('form')"
              >确定</el-button
            >
            <el-button
              v-show="title === '编辑'"
              class="btnClsing"
              @click="upDataDataHandle('form')"
              >修改</el-button
            >
            <el-button
              class="btnCancel"
              v-show="title !== '查看'"
              @click="cancelHandle"
              >取消</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
  </el-row>
</template>

<script>
import {
  getRoleInfo,
  getDepartmentInfo,
  addUserInfo,
  updateUserInfo,
} from "../../utils/request";
import * as validate from "../../utils/validate";
const validEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!validate.isEmail(value)) {
    callback(new Error("请输入正确的邮箱!"));
  } else {
    callback();
  }
};
export default {
  name: "NewUserInfo",
  props: {
    rowData: Object,
    title: String,
  },
  data() {
    return {
      form: {
        userName: "",
        mainUserId: "",
        pass: "",
        phone: "",
        email: "",
        position: "",
        gender: 0,
        depts: [],
        dept: "",
        role: "",
        roles: [],
      },
      disabled: false,
      roleIdList: [],
      data: [],
      value: [],
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        mainUserId: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
        pass: [{ required: true, message: "请输入密码", trigger: "change" }],
        dept: [{ required: true, message: "请选择部门", trigger: "change" }],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
        email: [
          {
            validator: validEmail,
            required: true,
            message: "",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    scrollerHeight: function () {
      return window.innerHeight - 190 + "px";
    },
  },
  mounted() {
    //
    this.fillValueHandle();
    this.getDepartmentInfoData();
    this.getRoleInfoData(); //查询角色
  },
  methods: {
    fillValueHandle() {
      if (this.rowData !== null && this.title !== "新建") {
        if (this.title === "查看") {
          this.disabled = true;
        }
        if (this.rowData.roleList.length > 0) {
          this.form.role = this.rowData.roleList[0].roleId;
        }
        this.form.userName = this.rowData.userName;
        this.form.mainUserId = this.rowData.mainUserId;
        this.form.pass = this.Rsa.decrypt(this.rowData.userPwd)
          ? this.Rsa.decrypt(this.rowData.userPwd)
          : this.rowData.userPwd;
        this.form.phone = this.rowData.phone;
        this.form.email = this.rowData.email;
        this.form.gender = this.rowData.gender;
        this.form.dept = parseInt(this.rowData.orgId);
        this.form.position = this.rowData.position;
      }
    },
    getDepartmentInfoData: function () {
      let that = this;
      getDepartmentInfo()
        .then((response) => {
          if (response["code"] === 0) {
            that.form.depts = response["data"];
          } else {
            that.$message.warning("获取用户信息失败！");
          }
        })
        .catch(() => {
          this.$message.warning("获取用户信息失败！");
        });
    },
    getRoleInfoData: function () {
      //查询所有角色
      let that = this;
      let params = {
        pageNo: 0,
        pageSize: -1,
      };
      getRoleInfo(params)
        .then((response) => {
          if (response["code"] === 0) {
            that.form.roles = response["data"]["records"];
          } else {
            that.$message.warning("获取用户信息失败！");
          }
        })
        .catch(() => {
          this.$message.warning("获取用户信息失败！");
        });
    },
    roleChangeHandle(val) {
      this.roleIdList = [];
      this.roleIdList.push(val);
    },
    saveDataHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          let params = {
            userName: this.form.userName,
            mainUserId: this.form.mainUserId,
            userPwd: this.form.pass,
            phone: this.form.phone,
            email: this.form.email,
            gender: this.form.gender,
            orgId: this.form.dept,
            position: this.form.position,
            roleIdList: this.roleIdList,
            createUserId: sessionStorage.getItem("id"),
            createTime: this.getNowFormatDate(),
          };
          addUserInfo(params)
            .then((response) => {
              if (response["code"] === 0) {
                this.ifShow = 1;
                this.$emit("update:changeShow", this.ifShow);
                this.$emit("getUserInfoData");
                that.$message.success("新增用户成功！");
              } else {
                that.$message.warning("新增用户失败！");
              }
            })
            .catch(() => {
              this.$message.warning("新增用户失败！");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    upDataDataHandle(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that = this;
          let params = {
            userId: this.rowData.userId,
            userName: this.form.userName,
            mainUserId: this.form.mainUserId,
            userPwd: this.form.pass,
            phone: this.form.phone,
            email: this.form.email,
            gender: this.form.gender,
            orgId: this.form.dept,
            position: this.form.position,
            roleIdList: this.roleIdList,
            createUserId: sessionStorage.getItem("id"),
            createTime: this.getNowFormatDate(),
          };
          updateUserInfo(params)
            .then((response) => {
              if (response["code"] === 0) {
                this.ifShow = 1;
                this.$emit("update:changeShow", this.ifShow);
                this.$emit("getUserInfoData");
                that.$message.success("修改用户信息成功！");
              } else {
                that.$message.warning("修改用户信息失败！");
              }
            })
            .catch(() => {
              this.$message.warning("修改用户信息失败！");
            });
        }
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
  background: #ffffff;
  display: flex;
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
