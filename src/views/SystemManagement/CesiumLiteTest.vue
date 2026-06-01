<template> 
  <div class="cesium-lite-test">
    <div id="cesiumContainer" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script>
import CesiumLite from 'cesium-lite';
import 'cesium-lite/dist/style.css';

export default {
  name: 'CesiumLiteTest',
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    this.initCesium();
  },
  methods: {
    initCesium() {
        // 初始化地图
        const cesiumLite = new CesiumLite('cesiumContainer', { 
            // 配置选项
        });
    }
  }
};

</script>
<style scoped>
.cesium-lite-test {
  width: 100%;
  height: 100%;
}
</style>