<template>
  <div id="map" class="main">
    <el-button @click="removeDraw">123</el-button>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import drawStyles from '@mapbox/mapbox-gl-draw/src/lib/theme'
import * as turf from '@turf/turf'
import Terraformer from 'terraformer-wkt-parser'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import dongchengquGeoJSON from '../../assets/data/dongchengqu.json'
import dongchengquLineGeoJSON from '../../assets/data/dongchengqu_line.json'
import {
    CircleMode,
    DragCircleMode,
    DirectMode,
    SimpleSelectMode
} from 'mapbox-gl-draw-circle';
import SimpleSelectWithoutMiddleVertexMode from '../../assets/libs/SimpleSelectWithoutMiddleVertexMode';
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode';
import FreehandMode from 'mapbox-gl-draw-freehand-mode'
export default {
    data() {
        return{
            mapInstance: {},
            initBounds: new mapboxgl.LngLatBounds(
                new mapboxgl.LngLat(137.0546875, 54.092504809039376),
                new mapboxgl.LngLat(72.806640625, 16.47274101999902)
            ),
            controlID: null,
            line_list: []
        }
    },
    mounted() {
        this.initTdtMap();
    },
    methods: {
        initTdtMap() {
            //天地图
            mapboxgl.accessToken = 'pk.eyJ1IjoibHVjaGFuZzY2NiIsImEiOiJjbDAyMDVyMXMweW9qM2RuZnZiemxzbGdoIn0.JhMWPCeC_5h0k0eM3LdOTA';
            var vecUrl = "http://t0.tianditu.com/vec_w/wmts?tk=9254b8157f0ff0a6331196e4afc27cb6";
            var cvaUrl = "http://t0.tianditu.com/cva_w/wmts?tk=9254b8157f0ff0a6331196e4afc27cb6";
            var iboUrl = "http://t0.tianditu.gov.cn/ibo_w/wmts?tk=9254b8157f0ff0a6331196e4afc27cb6";
            //使用严格模式
            "use strict";
            //实例化source对象
            var tdtVec = {
                //类型为栅格瓦片
                "type": "raster",
                'tiles': [
                    //请求地址
                    vecUrl + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles"
                ],
                //分辨率
                'tileSize': 256
            };
            var tdtCva = {
                "type": "raster",
                'tiles': [
                    cvaUrl + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles"
                ],
                'tileSize': 256
            };
            var tdtIbo = {
                "type": "raster",
                'tiles': [
                    iboUrl + "&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles"
                ],
                'tileSize': 256
            }
            //实例化Map地图对象
            this.mapInstance = new mapboxgl.Map({
                //地图容器div的id
                container: 'map',
                style: {
                    //设置版本号，一定要设置
                    "version": 8,
                    //添加来源
                    "sources": {
                        "tdtVec": tdtVec,
                        // "tdtCva": tdtCva,
                        // "tdtIbo": tdtIbo
                    },
                    // sprite: 'mapbox://sprites/mapbox/streets-v11',
                    // glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
                    glyphs:
                    'http://120.46.161.91:30859/v1/rest/fileproxy/dataobjects/default/font/{fontstack}/{range}.pbf',
                    sprite:
                    'http://120.46.161.91:30859/v1/rest/fileproxy/dataobjects/default/icon/common',
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
                            "maxzoom": 17
                        },
                        // {
                        //     "id": "tdtCva",
                        //     "type": "raster",
                        //     "source": "tdtCva",
                        //     "minzoom": 0,
                        //     "maxzoom": 17
                        // },
                        // {
                        //     "id": "tdtIbo",
                        //     "type": "raster",
                        //     "source": "tdtIbo",
                        //     "minzoom": 0,
                        //     "maxzoom": 17
                        // }
                    ],
                },
                //地图中心点
                center: [113.14371373500097,27.939001572414696],
                //地图当前缩放级数
                zoom: 5,
                minZoom:3.5
            });
            //实例化导航控件
            var nav = new mapboxgl.NavigationControl(
                {
                    //是否显示指南针，默认为true
                    "showCompass": true,
                    //是否显示缩放按钮，默认为true
                    "showZoom":true
                }
            );
            //添加导航控件，控件的位置包括'top-left', 'top-right','bottom-left' ,'bottom-right'四种，默认为'top-right'
            this.mapInstance.addControl(nav, 'top-left');
            this.mapInstance.on('load', () => {
                // this.addPieServise()
                // this.addPieServiseByWangGe()
                this.addPieServiseByPutong()
                // this.addShuiYinLayer()
                // this.addShuiYinLayer1()
                this.addMvtService()
                this.addMvtService1()
                const fillLayer = {
                        type: 'fill',
                        id: 'dongchengqu',
                        source: {
                            type: 'geojson',
                            data: dongchengquGeoJSON,
                        },
                        paint: {
                            'fill-color': '#68A2EA',
                            'fill-opacity': 0.3,
                        },
                    }
                    const lineLayer = {
                        type: 'line',
                        id: 'dongchengquLIN',
                        source: {
                            type: 'geojson',
                            data: dongchengquLineGeoJSON,
                        },
                        paint: {
                            'line-color': '#68A2EA',
                            'line-width': 3,
                            'line-dasharray': [0.2, 3],
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                    }
                    this.mapInstance.addLayer(lineLayer)
                    this.mapInstance.addLayer(fillLayer)
                    // this.addImgMarker(1)
                    // this.addImgMarker(2)
                    var arr = [[116.105419,39.214714],[115.405419,38.914714],[116.805419,38.914714],[112.405419,39.914714],[111.405419,39.514714]]
                    var imgarr = ['logout.png','logout.png','logout.png','user.png','user.png']
                    for (let index = 0; index < 5; index++) {
                       this.addImgPoint(index+'',index+'',arr[index],imgarr[index])       
                    }
                    this.mapInstance.on('click', (e) => {
                        
                        console.log(this.mapInstance.getZoom());
                    })
                    // this.addCrontor()
            })
        },
        addImgMarker(type) {
            var symbol = require('../../assets/image/home/logout.png') //养老机构
            var symbol1 = require('../../assets/image/home/user.png') //养老机构
            // //symbol = require('../../assets/image/data/map_ic_people.png');  //流浪乞讨人员救助
            // this.mapInstance.loadImage(symbol, (error, image) => {
            //     if (error) throw error
            //     if (!this.mapInstance.hasImage('count-icon')) {
            //         this.mapInstance.addImage('count-icon', image)
            //     }
            // })
            this.mapInstance.loadImage(
                type===1?symbol:symbol1,
                (error, image) => {
                    if (error) throw error;

                    // Add the image to the map style.
                    this.mapInstance.addImage(type+'', image);
                    
                    // Add a data source containing one point feature.
                    this.mapInstance.addSource(type+'', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [{
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': type===1?[116.405419,39.914714]:[116.105419,39.114714]
                                }
                            }]
                        }
                    });

                    // Add a layer to use the image to represent the data.
                    this.mapInstance.addLayer({
                        'id': type+'',
                        'type': 'symbol',
                        'source': type+'', // reference the data source
                        'layout': {
                            'icon-image': type+'', // reference the image
                            'icon-size': 1
                        }
                    });
                }
            );
        },
        addCrontor() {
                const draw = new MapboxDraw({
                defaultMode: "draw_circle",
                displayControlsDefault: true,
                userProperties: true,
                boxSelect: false,
                touchEnabled: false,
                keybindings: false,
                modes: {
                    ...MapboxDraw.modes,
                    draw_circle  : CircleMode,
                    drag_circle  : DragCircleMode,
                    direct_select: DirectMode,
                    simple_select: SimpleSelectMode,
                    draw_polygon: FreehandMode,
                    draw_rectangle: DrawRectangle
                }
                });
                console.log(draw);
                this.mapInstance.addControl(draw, 'top-right');
                this.controlID = draw;
                draw.changeMode('draw_circle', { initialRadiusInKm: 100 });
                // draw.changeMode("draw_polygon");
                this.mapInstance.on('draw.create', this.createArea);
                this.mapInstance.on('draw.update', this.updateArea);
                // this.mapInstance.on('draw.create', draw)
                // draw.changeMode('draw_circle', { initialRadiusInKm: 0.5 });
        },
        changeControl() {
            this.controlID.changeMode("draw_rectangle");
        },
        removeDraw() {
            this.controlID.deleteAll()
            this.line_list.forEach((id) => {
                this.deleteArea(id)
            })
            this.line_list = []
        },
        addImgPoint(id,type,point,imgUrl) {
            var symbol = require('../../assets/image/home/'+imgUrl) //养老机构
            this.mapInstance.loadImage(
                symbol,
                (error, image) => {
                    if (error) throw error;
                    if (!this.mapInstance.hasImage(id)) {
                        this.mapInstance.addImage(id, image)
                    }
                    
                    // Add a data source containing one point feature.
                    this.mapInstance.addSource(id, {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [{
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': point
                                }
                            }]
                        }
                    });

                    // Add a layer to use the image to represent the data.
                    this.mapInstance.addLayer({
                        'id': id,
                        'type': 'symbol',
                        'source': id, // reference the data source
                        'layout': {
                            'icon-image': id, // reference the image
                            'icon-size': 1
                        }
                    });
                }
            );
        },
        createArea(e) {
            const polygon = e.features[0]
            this.addTextPoint(polygon)
        },
        updateArea(e) {
             const polygon = e.features[0]
             this.deleteArea(polygon.id);
             this.addTextPoint(polygon)
        },
        deleteArea(id) {
             if (this.mapInstance.getSource(id)) {
                this.mapInstance.removeLayer(id)
                this.mapInstance.removeSource(id)
             }
        },
        highLight() {
            this.addImgPoint(10+'',10+'',[116.105419,39.214714],'user.png')
        },
        //地图添加弹框
        addTextPoint(data) {
            const { id, geometry } = data;
            this.line_list.push(id)
            let area = 0;
            let center = {}
            if(geometry.type === "Polygon") {
                area = String(turf.area(geometry)/1000).replace(/^(.*\..{4}).*$/,"$1")+'km²';
                center = turf.centerOfMass(geometry)
                center.properties.area = area;
            } else if(geometry.type === "LineString") {
                let line = turf.lineString(geometry.coordinates);
                area = String(turf.length(line)/1000).replace(/^(.*\..{4}).*$/,"$1")+'km²';
                center = {
                    geometry: {
                        coordinates: geometry.coordinates[geometry.coordinates.length-1],
                        type: "Point"
                    },
                    properties: {
                        area: area
                    },
                    type: "Feature"       
                }
            }
            this.mapInstance.addSource(id,{
                type: 'geojson',
                data: center
            });
            this.mapInstance.addLayer({
                id: id,
                type: 'symbol',
                source: id,
                layout: {
                    'text-field': '{area}',
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top',
                    'text-size': 14
                },
                paint: {
                    'text-color': '#000000',
                },
                // layout: {
                //     'icon-image': 'count-icon',
                //     'icon-size': 0.5,
                //     'icon-allow-overlap': true,
                //     'icon-ignore-placement': true
                // },
            });
        },
        //添加pie地图服务
        addPieServise() {
            const url = 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0674c119458e1001/wmts?TILEROW={y}&TileMatrixSet=WorldWebMercatorQuad&REQUEST=GetTile&VERSION=1.0.0&format=image/png&SERVICE=WMTS&style=default&TILEMATRIX={z}&layer=l0674c119464e1000&TILECOL={x}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
            const sourceId = 'ows_0662eeefb90e1001'
            const id = 'quanguosheng'
            this.mapInstance.addSource(id, {
                type: 'vector',
                url:url
            })
            this.mapInstance.addLayer(
                {
                    id: id,
                    type: 'line',
                    source: id,
                    'source-layer': sourceId,
                    paint: {
                            'fill-color': '#0033cc',
                            'fill-opacity': 0.5,
                    },
                }
            )
        },
        //添加标注信息
        addShuiYinLayer() {
            const id = 'isclear_shuiyin'
            const url = 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0676368f17ce1001/wmts?TILEROW={y}&TileMatrixSet=WorldWebMercatorQuad&REQUEST=GetTile&VERSION=1.0.0&format=image/png&SERVICE=WMTS&style=default&TILEMATRIX={z}&layer=l0677847c7fce1000&TILECOL={x}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
            this.mapInstance.addSource(id, {
                type: 'raster',
                tiles: [url],
                tileSize: 256,
                // bounds: [75, -80.051129, 130, 85.051129],
            })
            this.mapInstance.addLayer({
                id,
                type: 'raster',
                source: id,
            })
        },
        //添加标注信息1
        addShuiYinLayer1() {
            const id = 'isclear_shuiyin1'
            const url = 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_06763678cc0e1001/wmts?TILEROW={y}&TileMatrixSet=WorldWebMercatorQuad&REQUEST=GetTile&VERSION=1.0.0&format=image/png&SERVICE=WMTS&style=default&TILEMATRIX={z}&layer=l0677849a908e1000&TILECOL={x}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
            this.mapInstance.addSource(id, {
                type: 'raster',
                tiles: [url],
                tileSize: 256,
                // bounds: [75, -80.051129, 130, 85.051129],
            })
            this.mapInstance.addLayer({
                id,
                type: 'raster',
                source: id,
            })
        },
        addMvtService() {
            var that = this;
            fetch(
                    'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0678de70e20e1001/mvt?SERVICE=MVT&LAYER=l0678de70e30e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
                )
                .then((res) => res.json())
                .then((res1) => {
                    console.log('res1', res1);
                    that.mapInstance.addSource('id', {
                        type: 'vector',
                        url: 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0678de70e20e1001/mvt?SERVICE=MVT&LAYER=l0678de70e30e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY',
                    });
                    let creatLayers = JsonToMapbox(
                        JSON.parse(
                            `{"Others":{"Scale":{"Min":0,"Max":24}},"Type":"point","Filter":{"Attribute":{"LogicalOperator":"And","Rule":[]}},"Mode":"simple","Label":{"Field":"sheng","OutlineColor":{"Hex":"#FFFFFF","Opacity":0},"Position":{"Anchor":"bottom","Angle":0},"Color":{"Hex":"#000000","Opacity":1},"Blur":0,"YOffset":0,"Scale":{"Min":0,"Max":24},"XOffset":0,"Overlap":true,"Font":{"Size":14,"Family":"Noto Sans Regular"},"OutlineWidth":1},"Style":[{"Type":"vector","OutlineColor":{"Hex":"#474747","Opacity":0.9},"Size":2,"Color":{"Hex":"#2483EB","Opacity":1},"Visible":false,"Blur":0,"Style":"circle","YOffset":0,"XOffset":0,"OutlineWidth":1}]}`
                        ),
                        'id',
                        'id',
                        res1.vector_layers[0].id
                    );
                    console.log(creatLayers);
                    creatLayers.forEach((v) => {
                        that.mapInstance.addLayer(v);
                    });
                });
        },
        addMvtService1() {
            var that = this;
            fetch(
                    'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0678de85844e1001/mvt?SERVICE=MVT&LAYER=l0678de85854e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
                )
                .then((res) => res.json())
                .then((res1) => {
                    console.log('res1', res1);
                    that.mapInstance.addSource('test_mvt1', {
                        type: 'vector',
                        url: 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0678de85844e1001/mvt?SERVICE=MVT&LAYER=l0678de85854e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY',
                    });
                    let creatLayers = JsonToMapbox(
                        JSON.parse(
                            `{"Others":{"Scale":{"Min":0,"Max":24}},"Type":"point","Filter":{"Attribute":{"LogicalOperator":"And","Rule":[]}},"Mode":"simple","Label":{"Field":"shengcode","OutlineColor":{"Hex":"#FFFFFF","Opacity":0},"Position":{"Anchor":"top","Angle":0},"Color":{"Hex":"#000000","Opacity":1},"Blur":0,"YOffset":0,"Scale":{"Min":0,"Max":24},"XOffset":0,"Overlap":true,"Font":{"Size":14,"Family":"Noto Sans Regular"},"OutlineWidth":1},"Style":[{"Type":"vector","OutlineColor":{"Hex":"#474747","Opacity":0.9},"Size":2,"Color":{"Hex":"#2483EB","Opacity":1},"Visible":false,"Blur":0,"Style":"circle","YOffset":0,"XOffset":0,"OutlineWidth":1}]}`
                        ),
                        'test_mvt1',
                        'test_mvt1',
                        res1.vector_layers[0].id
                    );
                    console.log(creatLayers);
                    creatLayers.forEach((v) => {
                        that.mapInstance.addLayer(v);
                    });
                });
        },
        //添加高碑店网格地图服务
        addPieServiseByWangGe() {
            const url = 'https://engine-dev.piesat.cn/engine-server-test/v1/external/access/dispatch/services/l05f03ee72a8e1000/MVT?REQUEST=GetTile&VERSION=1.3.0&SERVICE=MVT&layer=l05f03ee72ace1000&token=d319112a0f95a137ffb288588b4d595f'
            const sourceId = 'l05f03ee72ace1000'
            const id = 'gaobeidianwangge'
            this.mapInstance.addSource(id, {
                type: 'vector',
                url:url
            })
            this.mapInstance.addLayer(
                {
                    id: id,
                    type: 'fill',
                    source: id,
                    'source-layer': sourceId,
                    paint: {
                            'fill-color': '#ff3333',
                            'fill-opacity': 0.3,
                    },
                }
            )
        },
        //添加普通地图服务
        addPieServiseByPutong() {
            const url = 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0674c059d24e1001/wmts?TILEROW={y}&TileMatrixSet=WorldWebMercatorQuad&REQUEST=GetTile&VERSION=1.0.0&format=image/png&SERVICE=WMTS&style=default&TILEMATRIX={z}&layer=l0674c059d34e1000&TILECOL={x}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
            const id = 'gaobeidianputong'
            this.mapInstance.addSource(id, {
                type: 'raster',
                tiles: [url],
                tileSize: 256,
                // bounds: [75, -80.051129, 130, 85.051129],
            })
            this.mapInstance.addLayer(
                {
                    id: id,
                    type: 'raster',
                    source: id,
                    // 'source-layer': id,
                    // paint: {
                    //     "fill-color": "rgb(53, 175, 109)",
					// 	"fill-opacity": 0.5,
					// 	"fill-outline-color": "rgb(53, 175, 109)"
                    // },
                },
            )
        }
}
}
</script>

<style lang="scss">
.main {
    width: 100%;
    height: 100%;
    .mapboxgl-ctrl-top-right {
        border: 1px solid red !important;
    }
}
</style>