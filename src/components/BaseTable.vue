<template>
  <div class="tCls">
    <el-table
      v-bind="$attrs"
      v-on="$listeners"
      empty-text="暂无数据"
      ref="table"
      :data="tableList"
      border
      fit
      :height="inTableHeight"
      @selection-change="selectionChange"
      @row-click="rowClick"
    >
      <!-- 序号 -->
      <el-table-column
        v-if="index"
        type="index"
        label="序号"
        width="55"
        align="center"
      /><!-- 选择框 -->
      <el-table-column
        v-if="select"
        type="selection"
        fixed="left"
        width="55"
        align="center"
      />
      <template v-for="(itm, idx) in header">
        <!-- 特殊处理列 -->
        <el-table-column
          v-if="itm.render"
          :key="idx"
          :prop="itm.prop ? itm.prop : null"
          :label="itm.label ? itm.label : null"
          :width="itm.width ? itm.width : null"
          :sortable="itm.sortable ? itm.sortable : false"
          :align="itm.align ? itm.align : 'center'"
          :fixed="itm.fixed ? itm.fixed : null"
          :show-overflow-tooltip="itm.tooltip"
          min-width="50"
        >
          <template slot-scope="scope">
            <ex-slot
              :render="itm.render"
              :row="scope.row"
              :index="scope.$index"
              :column="itm"
            />
          </template>
        </el-table-column>
        <!-- 正常列 -->
        <el-table-column
          v-else
          :key="idx"
          :prop="itm.prop ? itm.prop : null"
          :label="itm.label ? itm.label : null"
          :width="itm.width ? itm.width : null"
          :sortable="itm.sortable ? itm.sortable : false"
          :align="itm.align ? itm.align : 'center'"
          :fixed="itm.fixed ? itm.fixed : null"
          :formatter="itm.formatter"
          :show-overflow-tooltip="itm.tooltip"
          min-width="50"
        />
      </template>
    </el-table>
    <div style="padding: 10px 0" v-if="showPage">
      <el-pagination
        samll
        align="right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 自定义内容的组件
let exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h, context) => {
    const params = {
      row: context.props.row,
      index: context.props.index,
    };
    if (context.props.column) params.column = context.props.column;
    return context.props.render(h, params);
  },
};

export default {
  components: { exSlot },
  props: {
    tableList: {
      type: Array,
      default: () => [],
    },
    header: {
      type: Array,
      default: () => [],
    },
    select: {
      type: Boolean,
      default: () => false,
    },
    index: {
      type: Boolean,
      default: () => false,
    },
    showPage: {
      type: Boolean,
      default: () => false,
    },
    height: {
      type: [Number, String, Function],
      default: () => null,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageNo: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      inTableHeight: 450,
    };
  },
  created() {
    //该阶段可以接收父组件的传递参数
    this.inTableHeight = this.height;
  },
  mounted() {
    this.$nextTick(() => {
      //表格高度自适应浏览器大小
      this.changeTableHight();
      if (!this.height) {
        window.onresize = () => {
          this.changeTableHight();
        };
      }
    });
  },
  destroyed() {
    //高度自适应事件注销
    window.onresize = null;
  },
  watch: {
    /**
     * 数据变化后 高度自适应
     */
    tableList() {
      this.$nextTick(() => {
        this.changeTableHight();
      });
    },
  },
  methods: {
    /**
     * 选择框选择后更改,事件分发
     */
    selectionChange(selection) {
      this.$listeners.selectionChange(selection);
    },
    /**
     * 点击事件
     */
    rowClick(row, column, event) {
      this.$emit("row-click", row, column, event);
    },
    /**
     * 高度自适应
     * 当表格展示空间小于460按460px展示，大于的时候高度填充
     */
    changeTableHight() {
      if (this.height) {
        //如果有传进来高度就取消自适应
        this.inTableHeight = this.height;
        this.$refs.table.doLayout();
        return;
      }
      let tableHeight = window.innerHeight || document.body.clientHeight;
      //高度设置
      let disTop = this.$refs.table.$el;
      //如果表格上方有元素则减去这些高度适应窗口，66是底下留白部分
      tableHeight -= disTop.offsetTop + 66;
      if (disTop.offsetParent) tableHeight -= disTop.offsetParent.offsetTop;
      this.inTableHeight = tableHeight < 460 ? 460 : tableHeight;
      //重绘表格
      this.$refs.table.doLayout();
    },
    handleSizeChange(val) {
      this.$listeners.handleSizeChange(val);
    },
    handleCurrentChange(val) {
      this.$listeners.handleCurrentChange(val);
    },
  },
};
</script>
<style lang="scss" scoped>
.tCls ::v-deep {
  padding: 8px;
  //width: 95vw;
  //margin: 14px 0 0 14px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e2eefe;
  .el-table th {
    background: rgba(130, 184, 247, 0.35);
    border-top: 1px solid rgba(130, 184, 247, 1) !important;
    border-bottom: 1px solid rgba(130, 184, 247, 1) !important;
    color: #555d72;
    font-size: 16px;
    font-weight: 500;
    height: 50px;
  }
  .el-table--enable-row-transition .el-table__body td {
    font-size: 14px;
    font-family: AlibabaPuHuiTi-R, serif;
    color: #666666;
    height: 42px;
  }
  .el-table td,
  .el-table th {
    padding: 0;
  }
}
</style>
