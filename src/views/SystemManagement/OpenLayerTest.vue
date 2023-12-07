<template>
    <div id="map" class="map-contain">
        <div></div>
    </div>
</template>
<script>
    import "ol/ol.css"; //地图的css样式
    import Map from 'ol/Map.js';
    import OSM from 'ol/source/OSM.js';
    import TileLayer from 'ol/layer/Tile.js';
    import View from 'ol/View.js';
    import WMTS from 'ol/source/WMTS.js';
    import TWMTS from "ol/tilegrid/WMTS";
    import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
    import {
        get as getProjection
    } from 'ol/proj.js';
    import {
        getTopLeft,
        getWidth
    } from 'ol/extent.js';

    export default {
        data() {
            return {
                map: null
            };
        },
        methods: {
            init() {
                const projection = getProjection('EPSG:4326');
                let projectionExtent = projection.getExtent();
                let size = getWidth(projectionExtent) / 256;
                let resolutions = new Array(18);
                let matrixIds = new Array(18);
                for (let z = 1; z < 19; ++z) {
                    // generate resolutions and matrixIds arrays for this WMTS
                    resolutions[z] = size / Math.pow(2, z);
                    matrixIds[z] = z;
                }
                this.map = new Map({
                        layers: [
                            new TileLayer({
                                source: new OSM(),
                            }),
                            new TileLayer({
                                opacity: 0.7,
                                source: new WMTS({
                                    url: 'http://t0.tianditu.gov.cn/vec_c/wmts?tk=f48d91fe78765d6f57475c87e8a244f2',
                                    layer: "vec", //注意每个图层这里不同
                                    matrixSet: "c",
                                    format: "tiles",
                                    style: "default",
                                    projection: projection,
                                    tileGrid: new TWMTS({
                                        origin: getTopLeft(projectionExtent),
                                        resolutions: resolutions,
                                        matrixIds: matrixIds,
                                    }),
                                    wrapX: true,
                                    crossOrigin: "anonymous",
                                }),
                            }),
                        ],
                        target: 'map',
                        view: new View({
                            center: [106.642778, 35.549168],
                            zoom: 4,
                        }),
                    })
                    this.setMapHeight()
            },
             setMapHeight() {
                if (this.map && document.getElementById('map')) {
                    document.getElementById('map').style.height = window.screen.height + "px";
                    this.map.updateSize();
                }
            },
        },
        mounted() {
            this.init();
            this.setMapHeight();
            window.addEventListener("resize", this.setMapHeight);
        }
    };
</script>
<style lang="scss" scoped>
    .map-contain {
        font-size: 16px;
        height: 100%;
        width: 100%;
    }
</style>