<template>
    <div style="width: 100%;height: 100%">
        <div id="container" style="width: 100%;height: 100%"></div>
    </div>
</template>

<script>
import mapUtil from "../../utils/mapUtil.js";
import mapboxgl from "mapbox-gl";
import WMTS from "ol/source/WMTS";
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import TilegridWMTS from "ol/tilegrid/WMTS";
import { getTopLeft, getWidth } from "ol/extent";
import MVT from "ol/format/MVT";
import OSM from "ol/source/OSM";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import {createXYZ} from "ol/tilegrid";
import { Style, Icon, Fill, Stroke, RegularShape, Text } from "ol/style";
import { transform, get, fromLonLat } from "ol/proj";
import XYZ from 'ol/source/XYZ'

export default {
    name: "MapinstanceView",
    components:{
    },
    data() {
        return {
            mapInstance: null,
            container: 'container',
        }
    },
    mounted() {
        let vm = this;
        vm.mapInit();
    },
    methods: {

        initOlMap() {
            let vecUrl = "http://t0.tianditu.gov.cn/vec_c/wmts?tk=f48d91fe78765d6f57475c87e8a244f2";
            let cvaUrl = "http://t0.tianditu.com/cva_c/wmts?tk=f48d91fe78765d6f57475c87e8a244f2";
            let projC = "EPSG:4326";
            let projection = get(projC);
            let projectionExtent = projection.getExtent();
            let size = getWidth(projectionExtent) / 256;
            let resolutions = new Array(18);
            let matrixIds = new Array(18);

            let osm = new TileLayer({
            	source: new OSM()
            });
            for (let z = 1; z < 19; ++z) {
                // generate resolutions and matrixIds arrays for this WMTS
                resolutions[z] = size / Math.pow(2, z);
                matrixIds[z] = z;
            }
            //定义天地图的图层源
            let source = new WMTS({
                url: vecUrl,
                layer: "vec", //注意每个图层这里不同
                matrixSet: "c",
                format: "tiles",
                style: "default",
                projection: projection,
                tileGrid: new TilegridWMTS({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions,
                    matrixIds: matrixIds,
                }),
                wrapX: true,
                crossOrigin: "anonymous"
            })

            //定义天地图的图层
            let vecTileLayer = new TileLayer({
                zIndex: 0,
                name: "vec-layer",
                opacity: 1,
                isGroup: true,
                source : source
            })
            
            let mvtProviceVectorTileSource = new VectorTileSource({
                format: new MVT(),
                projection: projection,
                tilePixelRatio:1,
               // tileGrid:createXYZ({extent : projectionExtent}),
                url:  "http://127.0.0.1:7002/v1/mvt/2021qg_sheng/{z}/{x}/{y}?geomColumn=geom",
                crossOrigin: 'Anonymous',
            });


            let mvtCityVectorTileSource = new VectorTileSource({
                format: new MVT(),
                projection: projection,
                tilePixelRatio:1,
               // tileGrid:createXYZ({extent : projectionExtent}),
                url:  "http://127.0.0.1:7002/v1/mvt/2021qg_shi/{z}/{x}/{y}?geomColumn=geom",
                crossOrigin: 'Anonymous',
            });

            let mvtVectorTileSource = new VectorTileSource({
                format: new MVT(),
                projection: projection,
                tilePixelRatio:1,
               // tileGrid:createXYZ({extent : projectionExtent}),
                url:  "http://127.0.0.1:7002/v1/mvt/2021qg_xian/{z}/{x}/{y}?geomColumn=geom",
                crossOrigin: 'Anonymous',
            });


            let style = new Style({
                //填充色
                fill: new Fill({
                    color:  '#000000',
                }),
                //边线颜色
                stroke: new Stroke({
                    color:  '#0000ff',
                    width: 3
                }) 
            });

            

            this.mapInstance = new Map({
                target: 'container', // 地图容器 对应id
                layers: [vecTileLayer], // 图层
                view: new View({ // 视图
                    projection: projection, // 坐标系
                    // 初始化地图中心 可以去地图坐标拾取网站获取想要的坐标
                    center: [118.339408, 32.261271],
                    // 缩放
                    zoom: 12,
                    // 最大缩放
                    maxZoom: 18,
                    // 最小缩放
                    minZoom: 1
                })
            })
            //this.mapInstance.addLayer(MVTVectorTileLayer);

            this.$emit('getMap', this.mapInstance)
        },

        mapInit() {
            let vecUrl = "http://t0.tianditu.gov.cn/img_c/wmts?tk=f48d91fe78765d6f57475c87e8a244f2";
            let cvaUrl = "http://t0.tianditu.com/cva_c/wmts?tk=f48d91fe78765d6f57475c87e8a244f2";

            let tdtVec = {
                //类型为栅格瓦片
                "type": "raster",
                'tiles': [
                    //请求地址
                    vecUrl + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles"
                ],
                //分辨率
                'tileSize': 256
            };
            /*let tdtCva = {
                "type": "raster",
                'tiles': [
                    cvaUrl + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles"
                ],
                'tileSize': 256
            }*/

            //mapbox 定义Map
            mapboxgl.accessToken ="pk.eyJ1IjoiY2h1emhhbyIsImEiOiJjbGE5YXoxYjYwMTNuM25zNnVuNms5YzIxIn0.9Le8NQOBv4iVcuF4zSraaw";    //你的accessToken
            this.mapInstance = new mapboxgl.Map({
                container: this.container,   //地图容器的id
                center: [108.552778, 32.549168], //中心点
                zoom:6.5,              //地图初始化时的层级
                style: {
                    //设置版本号，一定要设置
                    "version": 8,
                    //添加来源
                    "sources": {
                        "tdtVec": tdtVec
                    },
                    "layers": [
                        {
                            //图层id，要保证唯一性
                            "id": "tdtVec",
                            //图层类型
                            "type": "raster",
                            //数据源
                            "source": "tdtVec",
                            //图层最小缩放级数
                            "minzoom": 0,
                            //图层最大缩放级数
                            "maxzoom": 20
                        }
                    ] 
                } 
                //style: "mapbox://styles/mapbox/streets-v11",
            });
            let mapInstance2 =  this.mapInstance;
            this.mapInstance.on("load", function () {
                mapInstance2.addLayer({
                    'id': '2021qg_sheng',
                    source: {
                        type: "vector",
                        tiles: ["http://127.0.0.1:7002/v1/mvt/2021qg_sheng/{z}/{x}/{y}?geomColumn=geom"],
                        minzoom: 0, 
                        maxzoom: 6
                    },
                    "source-layer": "2021qg_sheng",
                    "type" : "line",
                    paint: {
                    'line-color': '#fffff0',
                    "line-opacity": 1 /* 透明度 */
                    }
                });
                mapInstance2.addLayer({
                    'id': '2021qg_shi',
                    source: {
                        type: "vector",
                        tiles: ["http://127.0.0.1:7002/v1/mvt/2021qg_shi/{z}/{x}/{y}?geomColumn=geom"],
                        minzoom: 6, 
                        maxzoom: 9
                    },
                    "source-layer": "2021qg_shi",
                    "type" : "line",
                    paint: {
                    'line-color': '#fffff0',
                    "line-opacity": 1 /* 透明度 */
                    }
                });
                mapInstance2.addLayer({
                    'id': '2021qg_xian',
                    source: {
                        type: "vector",
                        tiles: ["http://127.0.0.1:7002/v1/mvt/2021qg_xian/{z}/{x}/{y}?geomColumn=geom"],
                        minzoom: 9, 
                        maxzoom: 12
                    },
                    "source-layer": "2021qg_xian",
                    "type" : "line",
                    paint: {
                    'line-color': '#fffff0',
                    "line-opacity": 1 /* 透明度 */
                    }
                });
            })

           // this.mapInstance = mapUtil.initMap(this.container, "img");
            //mapUtil._mapInstance = this.mapInstance;
            
        },
    }
}
</script>

<style lang="scss">

</style>
