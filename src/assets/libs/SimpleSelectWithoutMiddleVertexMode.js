import * as MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import * as Constants from '@mapbox/mapbox-gl-draw/src/constants';
import * as CommonSelectors from '@mapbox/mapbox-gl-draw/src/lib/common_selectors';

const SimpleSelectWithoutMiddleVertexMode = MapboxDraw.modes.simple_select;

SimpleSelectWithoutMiddleVertexMode.onTap = SimpleSelectWithoutMiddleVertexMode.onClick = function (state, e) {
 // 目的是为了避免绘制区域被选中而被拖拽编辑（clickOnFeature）等操作。自带属性没有发现可以实现这种功能
 // Click (with or without shift) on no feature
 if (CommonSelectors.noTarget(e)) return this.clickAnywhere(state, e); // also tap
 if (CommonSelectors.isOfMetaType(Constants.meta.VERTEX)(e)) return this.clickOnVertex(state, e); //tap
 if (CommonSelectors.isFeature(e)) return; // 直接return 简单粗暴 而不是this.clickOnFeature(state, e);
};
export default SimpleSelectWithoutMiddleVertexMode;