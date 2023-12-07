<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="sys-title">
          <!--<img src="../../assets/image/logo.png" width="40px">-->
          <span>XXX系统</span>
          <!--<h3>Intelligent emergency comprehensive management system of Ganyu Economic Development Zone</h3>-->
        </div>
        <div class="login-main">
          <div class="divPanel">
            <div class="wcl">
              <span>Welcome!</span>
              <div class="wcl1">登录综合管理系统</div>
            </div>
          </div>
          <div class="divPanel1">
            <!--<h3 class="login-title">登录</h3>-->
            <el-form
              :model="dataForm"
              :rules="dataRule"
              ref="dataForm"
              @keyup.enter.native="dataFormSubmit()"
              status-icon
            >
              <el-form-item prop="userName">
                <el-input
                  prefix-icon="el-icon-user"
                  v-model="dataForm.userName"
                  placeholder="请输入用户手机号"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  prefix-icon="el-icon-lock"
                  v-model="dataForm.password"
                  type="password"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
              <el-form-item
                style="text-align: right; line-height: 20px !important"
              >
                <span
                  style="color: #cccccc; font-size: 12px; cursor: pointer"
                  @click="forgotPassword"
                  >忘记输入密码？</span
                >
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn-submit"
                  type="primary"
                  @click="dataFormSubmit()"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sessionSet } from "../../utils/auth";
export default {
  name: "Login",
  data() {
    return {
      dataForm: {
        userName: "",
        password: "",
      },
      dataRule: {
        userName: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    dataFormSubmit: function () {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          //模拟设置token
          sessionSet("token", "123456");
          //处理登录相关逻辑
          this.$router.replace({ name: "Home" });
        }
      });
    },
    forgotPassword: function () {
      this.$alert("请联系管理员", "提醒", {
        confirmButtonText: "确定",
        callback: (action) => {},
      });
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url("../../assets/image/login/login_bg.png") no-repeat;
  background-size: cover;
  overflow: hidden;
  font-family: Source Han Sans CN, serif;
  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
  }

  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }

  .site-content {
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-main ::v-deep {
    position: fixed;
    width: 1200px;
    height: 700px;
    /*background-color: rgba(255, 255, 255, 0.4);*/
    margin-top: 150px;
    background: url("../../assets/image/login/login_main_bg.png") round;
    background-size: cover;
    .el-form-item__content {
      line-height: 60px;
    }
    .el-icon-user:before,
    .el-icon-lock:before {
      font-size: 26px;
      padding-top: 5px;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 40px;
    }
    .el-input__prefix {
      padding-top: 5px;
    }
    .el-input input::-webkit-input-placeholder {
      font-size: 24px;
      font-family: Source Han Sans CN Normal, serif;
      font-weight: 400;
      color: #999;
    }
    .el-input__inner {
      height: 60px;
    }
    .el-input input::-ms-input-placeholder {
      font-size: 24px;
      font-family: Source Han Sans CN Normal, serif;
      font-weight: 400;
      color: #999;
    }
    display: flex;
    .divPanel {
      flex: 1;
      /*align-items: center;*/
      justify-content: center;
      display: flex;
      .el-input {
        width: 110%;
      }
      .el-input__inner {
        border: 0 solid;
        border-bottom: 1px solid #ccc;
        font-size: 24px;
        font-family: Source Han Sans CN Normal, serif;
        line-height: 48px;
      }
      .wcl {
        margin-top: 250px;
        font-size: 40px;
        font-family: Source Han Sans CN Normal, serif;
        font-weight: 400;
        color: #fbf6f4;
        line-height: 48px;
      }
      .wcl1 {
        margin-top: 25px;
      }
    }
    .divPanel1 {
      flex: 1;
      align-items: center;
      justify-content: left;
      display: flex;
      margin-left: 120px;
      .el-input {
        width: 500px;
      }
      .el-input__inner {
        border: 0 solid;
        border-bottom: 1px solid #ccc;
      }
      .wcl {
        font-size: 32px;
        font-family: Source Han Sans CN, serif;
        font-weight: 400;
        color: #fbf6f4;
        line-height: 48px;
      }
    }
  }

  .login-title {
    font-size: 20px;
    width: 100%;
    text-align: center;
    letter-spacing: 30px;
    /*color: #3aabd4;*/
    margin: 40px 0;
  }

  .login-btn-submit {
    /*width: 150%;*/
    /*margin-top: 38px;*/
    background-color: #3aabd4;
    border-radius: 40px;
    height: 70px;
    width: 500px;
    font-family: Source Han Sans CN Normal, serif;
    font-size: 32px;
  }

  .sys-title {
    color: #ffffff;
    z-index: 1;
    position: fixed;
    top: 15%;
    text-align: center;
    font-family: Source Han Sans CN Medium, serif;
    /*left:3%;*/
  }

  .sys-title span {
    font-size: 48px;
    letter-spacing: 2px;
    color: #fcfeff;
    font-family: Source Han Sans CN Medium, serif;
    font-weight: 500;
    line-height: 28px;
  }
}
</style>
