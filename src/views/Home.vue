<template>
  <el-container>
    <el-header>
      <div>XXX系统</div>
      <div style="flex: 1"></div>
      <div>
        <span class="timer">{{ currentTime }}</span>
        <div class="sxwCls">{{ weekDay + "&emsp;" + sxw }}</div>
      </div>
      <div>
        <div class="rightHeader">
          <img class="imgCls" src="../assets/image/home/user.png" />
          <a class="username">{{ name }}</a>
        </div>
        <div class="uCls">{{ userName }}</div>
      </div>
      <img
        src="../assets/image/home/logout.png"
        alt="退出"
        title="退出"
        @click="logout"
      />
    </el-header>
    <el-container>
      <el-aside>
        <el-menu :default-active="activeIndex" router>
          <nav-menu :navMenus="menuData"></nav-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import NavMenu from "../components/NavMenu.vue";
import { sessionClear } from "../utils/auth";
import dateUtil from "../utils/dateUtil";
export default {
  name: "Home",
  components: { NavMenu },
  data() {
    return {
      menuData: [],
      activeIndex: "UserManagement",
      currentTime: new Date(), // 获取当前时间
      sxw: "上午",
      weekDay: "",
      timer: "", //定义一个定时器的变量
      userName: "单位",
      name: "Administrator",
    };
  },
  created() {
    let that = this;
    that.timer = setInterval(() => {
      let ho = that.appendZero(new Date().getHours());
      //修改数据date
      that.currentTime = dateUtil.formatDateYmdhms(new Date());
      that.sxw = parseInt(ho) > 12 ? "下午" : "上午";
    }, 1000);
    let wk = new Date().getDay();
    let weeks = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    that.weekDay = weeks[wk];
  },
  mounted() {
    this.initMenu();
  },
  methods: {
    initMenu() {
      this.menuData = require("../assets/data/menus.json");
    },
    appendZero(obj) {
      if (obj < 10) {
        return "0" + obj;
      } else {
        return obj;
      }
    },
    logout() {
      sessionClear();
      this.$router.replace({ name: "Login" });
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>
<style lang="scss" scoped>
.el-header ::v-deep {
  background: url("../assets/image/home/top_bg.png");
  background-size: cover;
  color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  img {
    cursor: pointer;
  }
}

.el-aside ::v-deep {
  width: 200px !important;
  color: #fff;
  text-align: left !important;
  background: url("../assets/image/home/left_bg.png");
  z-index: 1;
  .el-menu-item.is-active {
    background: #2e92d1 !important;
    text-align: center !important;
  }
  .el-submenu.is-active .el-submenu__title {
    background: #1b386d;
  }
  .el-submenu__title:hover {
    background-color: rgba(3, 19, 33, 0.3) !important;
  }
  .el-menu-item:hover {
    background-color: rgba(3, 19, 33, 0.3) !important;
  }
  .el-menu-item {
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    box-shadow: 0px -1px 0px 0px #136fbf;
    color: whitesmoke;
  }
  .el-menu {
    background: rgba(255, 255, 255, 0) !important;
  }
  .el-submenu__title i {
    color: white !important;
  }
  .el-submenu__title {
    font-size: 18px;
    font-weight: 500;
    text-align: left;
    box-shadow: 0px -1px 0px 0px #136fbf;
    background: rgba(27, 56, 109, 0.61);
    color: #fff;
  }
  .el-icon-arrow-down:before {
    content: "\e791";
  }
  .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    -webkit-transform: rotateZ(90deg);
    transform: rotateZ(90deg);
  }
  .el-menu-item-group__title {
    color: #fff !important;
  }
}

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  background: url("../assets/image/home/table_bg.png") round !important;
  background-size: cover !important;
  padding: 0;
}

.rightHeader {
  .imgCls {
    width: 14px;
    height: 15px;
    margin-right: 10px;
  }
}
</style>
