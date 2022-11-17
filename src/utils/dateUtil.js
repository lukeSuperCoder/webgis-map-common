let now = new Date(); //当前日期
let nowDayOfWeek = now.getDay(); //今天本周的第几天
let nowDay = now.getDate(); //当前日
let nowMonth = now.getMonth(); //当前月
let nowYear = now.getYear(); //当前年
nowYear += nowYear < 2000 ? 1900 : 0; //

let lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
let lastYear = lastMonthDate.getYear();
let lastMonth = lastMonthDate.getMonth();

let dateUtil = {
  // 获取几天前/后的日期
  getDay: function (day) {
    let today = new Date();
    let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    let tYear = today.getFullYear();
    let tMonth = today.getMonth();
    let tDate = today.getDate();
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
  },
  /**
   * 获取指定时间指定延迟的时间
   * @param date 当前时间
   * @param day 延迟时间
   * @returns {string}
   */
  getAppointedDay: function (date, day) {
    let today = new Date(date);
    let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    let tYear = today.getFullYear();
    let tMonth = today.getMonth();
    let tDate = today.getDate();
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + "-" + tMonth + "-" + tDate;
  },
  doHandleMonth: function (month) {
    let m = month;
    if (month.toString().length === 1) {
      m = "0" + month;
    }
    return m;
  },

  //格式化日期：yyyy-MM-dd
  formatDate: function (date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return myyear + "-" + mymonth + "-" + myweekday;
  },
  //格式化日期：yyyy-MM
  formatDateYm: function (date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    return myyear + "-" + mymonth;
  },

  //格式化日期：yyyy-MM-dd HH:mm:ss
  formatDateYmdhms: function (date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();
    let myhour = date.getHours();
    let myminute = date.getMinutes();
    let mysecond = date.getSeconds();

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return (
      myyear +
      "-" +
      mymonth +
      "-" +
      myweekday +
      " " +
      myhour +
      ":" +
      myminute +
      ":" +
      mysecond
    );
  },

  //获得某月的天数
  getMonthDays: function (myMonth) {
    let monthStartDate = new Date(nowYear, myMonth, 1);
    let monthEndDate = new Date(nowYear, myMonth + 1, 1);
    let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  },

  //获得本周的开始日期
  getWeekStartDate: function () {
    let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    let newDate = this.getAppointedDay(weekStartDate, 1);
    return this.formatDate(new Date(newDate));
  },

  //获得本周的结束日期
  getWeekEndDate: function () {
    let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
    return this.formatDate(weekEndDate);
  },

  //获得本月的开始日期
  getMonthStartDate: function () {
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    return this.formatDate(monthStartDate);
  },

  //获得本月的结束日期
  getMonthEndDate: function () {
    let monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
    return this.formatDate(monthEndDate);
  },

  //获得上月开始时间
  getLastMonthStartDate: function () {
    let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return this.formatDate(lastMonthStartDate);
  },

  //获得上月结束时间
  getLastMonthEndDate: function () {
    let lastMonthEndDate = new Date(
      nowYear,
      lastMonth,
      this.getMonthDays(lastMonth)
    );
    return this.formatDate(lastMonthEndDate);
  },
  //根据生日获取年龄
  getAge: function (str) {
    let r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/);
    if (r == null) return false;

    let d = new Date(r[1], r[3] - 1, r[4]);
    let returnStr = "输入的日期格式错误！";

    if (
      d.getFullYear() === parseInt(r[1]) &&
      d.getMonth() + 1 === parseInt(r[3]) &&
      d.getDate() === parseInt(r[4])
    ) {
      let date = new Date();
      let yearNow = date.getFullYear();
      let monthNow = date.getMonth() + 1;
      let dayNow = date.getDate();
      let largeMonths = [1, 3, 5, 7, 8, 10, 12], //大月， 用于计算天，只在年月都为零时，天数有效
        lastMonth = monthNow - 1 > 0 ? monthNow - 1 : 12, // 上一个月的月份
        isLeapYear = false, // 是否是闰年
        daysOFMonth = 0; // 当前日期的上一个月多少天

      if ((yearNow % 4 === 0 && yearNow % 100 !== 0) || yearNow % 400 === 0) {
        // 是否闰年， 用于计算天，只在年月都为零时，天数有效
        isLeapYear = true;
      }

      if (largeMonths.indexOf(lastMonth) > -1) {
        daysOFMonth = 31;
      } else if (lastMonth === 2) {
        if (isLeapYear) {
          daysOFMonth = 29;
        } else {
          daysOFMonth = 28;
        }
      } else {
        daysOFMonth = 30;
      }

      let Y = yearNow - parseInt(r[1]);
      let M = monthNow - parseInt(r[3]);
      let D = dayNow - parseInt(r[4]);
      if (D < 0) {
        D = D + daysOFMonth; //借一个月
        M--;
      }
      if (M < 0) {
        // 借一年 12个月
        Y--;
        M = M + 12; //
      }

      if (Y < 0) {
        returnStr = "出生日期有误！";
      } else if (Y === 0) {
        if (M === 0) {
          returnStr = D + "天";
        } else {
          returnStr = M + "月";
        }
        returnStr = 0;
      } else {
        if (M === 0) {
          returnStr = Y + "年";
        } else {
          returnStr = Y + "年" + M + "月";
        }
        returnStr = Y;
      }
    }
    return returnStr;
  },
  getWeekDay: function (dateString) {
    let dateArray = dateString.split("-");
    let date = new Date(
      dateArray[0],
      parseInt((dateArray[1] - 1).toString()),
      dateArray[2]
    );
    return "星期" + "日一二三四五六".charAt(date.getDay());
  },
};

Date.prototype.Format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

let parserDate = function (date) {
  let t = Date.parse(date);
  if (!isNaN(t)) {
    return new Date(Date.parse(date.replace(/-/g, "/")));
  } else {
    return new Date();
  }
};

export default dateUtil;
