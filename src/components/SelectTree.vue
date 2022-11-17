<template>
  <el-select
    v-bind="$attrs"
    :style="styles"
    v-model="selectId"
    :multiple="multiple"
    :props="defaultProps"
    @clear="handleClear"
    ref="selectUpResId"
    @remove-tag="handleRemoveTag"
    :filter-method="handleFilterMethod"
    @visible-change="selectVisibleChange"
  >
    <!-- 设置一个空option 不然selectData为空下拉不显示，这样处理无需用js去处理显示和隐藏了 -->
    <el-option hidden value="x" label="x" key="x"></el-option>
    <el-option
      hidden
      v-for="(item, _index) in selectData"
      :value="item[defaultProps['id']]"
      :label="getLable(item)"
      :key="_index"
    ></el-option>
    <!-- 设置树形组件-->
    <el-tree
      v-bind="$attrs"
      :show-checkbox="multiple"
      :node-key="defaultProps['id']"
      :props="defaultProps"
      :default-checked-keys="checkIds"
      @node-click="handleNodeClick"
      @check="handCheck"
      :filter-node-method="handleFilterNode"
      ref="tree"
    >
    </el-tree>
  </el-select>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "SelectTree",
  props: {
    // ********* 自定义的属性 如有需要自行添加 ****
    multiple: Boolean, //是否多选 默认：false
    onlyLeaf: {
      // 是否只包含叶子节点
      type: Boolean,
      default: false,
    },
    styles: {
      // 给一个样式属性
      type: String,
      default: "width:100%",
    },
    defaultProps: {
      type: Object,
      required: false,
      default: () => ({
        parent: "parentId", // 父级唯一标识
        id: "id", // 唯一标识
        label: "code", // 标签显示
        children: "children", // 子级
      }),
    },
    checkIds: [String, Number, Object, Array],
    value: [String, Number, Object, Array],
  },
  data() {
    return {
      selectId: "",
      selectData: [],
    };
  },
  mounted() {
    if (this.checkIds) {
      this.value = this.checkIds;
    }
  },
  watch: {
    value: {
      handler(v, ov) {
        this.$nextTick(() => {
          // 针对第一次请求，如果data延迟加载而出现赋值显示不是label的属性问题
          if (this.$refs.tree.data.length) {
            this.setDefaultValue(v);
          } else {
            this.$refs.tree.$watch("data", () => {
              this.setDefaultValue(v);
            });
          }
        });
      },
      immediate: true, // watch立即执行
      deep: true,
    },
  },
  methods: {
    getLable(item) {
      return typeof this.defaultProps["label"] === "string"
        ? item[this.defaultProps["label"]]
        : this.defaultProps["label"](item);
    },
    // 回填值
    setDefaultValue(v) {
      if (!v) {
        return;
      }
      if (this.multiple) {
        // 多选
        // this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(v, this.onlyLeaf);
        this.handCheckSetValue(v, null);
        // });
      } else {
        // 其他
        this.$refs.tree.setCurrentKey(v);
        this.handleNodeSetValue();
      }
    },
    // 单选点击事件
    handleNodeClick(data) {
      if (this.multiple) return;
      // 隐藏下拉框的效果
      this.$refs.selectUpResId.blur();
      this.$emit("input", this.handleNodeSetValue());
      // console.log('handleNodeClick', this.value)
    },
    handleNodeSetValue() {
      var cNode = this.$refs.tree.getCurrentNode();
      this.selectData = cNode ? [cNode] : [];
      // 设置值
      var _value = cNode ? cNode[this.defaultProps["id"]] : null;
      this.selectId = _value;
      return this.selectId;
    },

    // 多选选择勾选
    handCheck(currentNode, checkedNodesState) {
      // console.log('handCheck', checkedNodesState)
      if (!this.multiple) return;
      this.$emit("input", this.handCheckSetValue());
      // console.log('multiple handleNodeClick', this.value)
    },
    /**
     * 特殊处理下多选值处理，解决父子节点强关联的时候用
     * checkedKeys选中的keys
     * checkedNodes 选中的nodes
     *
     */
    handCheckSetValue(checkedKeys, checkedNodes) {
      // console.log('handCheckSetValue')
      this.selectData = this.$refs.tree.getCheckedNodes(this.onlyLeaf, false);
      this.selectId =
        checkedKeys || this.$refs.tree.getCheckedKeys(this.onlyLeaf);

      return this.selectId;
    },

    // 清空触发
    handleClear() {
      this.$emit("input", this.multiple ? [] : null);
    },
    // 多选模式移除tag
    handleRemoveTag(v) {
      // console.log('handlRemoveTag formData.id', this.selectId, v)
      this.$emit("input", this.selectId);
    },
    // select搜索调用tree过滤
    handleFilterMethod(query) {
      this.$refs.tree.filter(query);
    },
    // tree 过滤
    handleFilterNode(value, data) {
      if (!value) return true;
      var _label = this.getLable(data);
      return _label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    // select 失去焦点并重置过滤器
    selectVisibleChange(v) {
      if (v || !this.filterable) return;
      this.handleFilterMethod(null);
      // console.log('selectVisibleChange', v, this.filterable)
    },
  },
};
</script>

// tips： // > selectVisibleChange方法中 this.selectVisibleChange 改为 // >
this.$refs.selectUpResId.selectVisibleChange
