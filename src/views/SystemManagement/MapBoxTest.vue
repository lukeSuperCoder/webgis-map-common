<template>
  <div id="map" class="main">
    <el-button @click="removeDraw">删除</el-button>
    <el-button @click="addCrontor">添加绘制</el-button>
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
                    sprite: 'mapbox://sprites/mapbox/streets-v11',
                    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
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
                // style: "mapbox://styles/mapbox/streets-v11",
                //地图中心点
                center: [113.14371373500097,27.939001572414696],
                //地图当前缩放级数
                zoom: 5,
                minZoom:3.5,
                transformRequest: (url, resourceType) => {
                if (url.indexOf('http://10.1.140.55:7006') > -1) {
                    return {
                        url: url,
                        // headers: {'my-custom-header': true},
                        // credentials: 'include'  // Include cookies for cross-origin requests,
                        method: 'POST'
                    };
                    }
                }
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
                // this.addPieServiseByPutong()
                // this.addShuiYinLayer()
                // this.addShuiYinLayer1()
                this.addMvtService()
                this.addMvtService1()
                // this.addMvtService2()
                // this.addMvtService3()
                // this.addMvtService4()
                // this.addMvtService5()
                // this.addMvtFill()
                // const fillLayer = {
                //         type: 'fill',
                //         id: 'dongchengqu',
                //         source: {
                //             type: 'geojson',
                //             data: dongchengquGeoJSON,
                //         },
                //         paint: {
                //             'fill-color': '#68A2EA',
                //             'fill-opacity': 0.3,
                //         },
                //     }
                //     const lineLayer = {
                //         type: 'line',
                //         id: 'dongchengquLIN',
                //         source: {
                //             type: 'geojson',
                //             data: dongchengquLineGeoJSON,
                //         },
                //         paint: {
                //             'line-color': '#68A2EA',
                //             'line-width': 3,
                //             'line-dasharray': [0.2, 3],
                //         },
                //         layout: {
                //             'line-join': 'round',
                //             'line-cap': 'round',
                //         },
                //     }
                //     this.mapInstance.addLayer(lineLayer)
                //     this.mapInstance.addLayer(fillLayer)
                    // this.addImgMarker(1)
                    // this.addImgMarker(2)
                    // var arr = [[116.105419,39.214714],[115.405419,38.914714],[116.805419,38.914714],[112.405419,39.914714],[111.405419,39.514714]]
                    // var imgarr = ['ic_gonggongweisheng.svg']
                    // for (let index = 0; index < 5; index++) {
                    //    this.addImgPoint(index+'',index+'',arr[index],imgarr[index])       
                    // }
                    const symbol = "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png";
                    this.mapInstance.loadImage(symbol, (error, image) => {
                    if (error) throw error;
                    this.mapInstance.addImage('image123321', image);
                    console.log(this.mapInstance.hasImage('image123321'),'image123321');
                    // Add a data source containing one point feature.
                    
                    });
                    console.log(this.mapInstance.style._layers);
                    this.mapInstance.on('click',"2021qg_sheng", (e) => {
                        console.log(e.features);
                        // console.log(this.mapInstance.getZoom());
                    })
                    // this.addCrontor()
                    this.mapInstance.on('click', this.mapClickEvent);
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
            console.log(symbol);
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
                            'icon-size': 20
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
            this.addImgPoint(10+'',10+'',[116.105419,39.214714],'ic_gonggongweisheng.svg')
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
            const url = 'http://120.46.161.91:30440/v1/rest/services/tile/KtXNwxZBUMDBslAJgdFry/ows_0662eeefb90e1001/mvt?SERVICE=MVT&LAYER=l0662eeefba0e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Ikt0WE53eFpCVU1EQnNsQUpnZEZyeSIsImlkIjoiMDYyZTBkNTM4ZTRlMTAwMCIsInVzZXJJZCI6IjN1NWlRamU4Q0cyZERWMUtRdVNPdCJ9.neEdjw4EkDgyJVMAVASQj4qyy0cup18bhP4FCdcMC9Q'
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
            const url = 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0693713f620e1000/wmts?TILEROW={y}&TileMatrixSet=WorldWebMercatorQuad&REQUEST=GetTile&VERSION=1.0.0&format=image/png&SERVICE=WMTS&style=default&TILEMATRIX={z}&layer=l0693713f63ce1000&TILECOL={x}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
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
            var areacode = ["410000000000"]
            fetch(
                    `http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_06961533fd0e1000/mvt?SERVICE=MVT&LAYER=l06961533fe0e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY`
                )
                .then((res) => res.json())
                .then((res1) => {
                    console.log('res1', res1);
                    that.mapInstance.addSource('test_mvt', {
                        type: 'vector',
                        url: `http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_06961533fd0e1000/mvt?SERVICE=MVT&LAYER=l06961533fe0e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY`,
                    });
                    let creatLayers = JsonToMapbox(
                        JSON.parse(
                             '{"Others":{"Scale":{"Min":0,"Max":24}},"Type":"point","Filter":{"Attribute":{"LogicalOperator":"And","Rule":[]}},"Mode":"simple","Label":{"Field":"sheng","OutlineColor":{"Hex":"#FF0000","Opacity":0},"Position":{"Anchor":"bottom","Angle":0},"Color":{"Hex":"#000000","Opacity":1},"Blur":0,"YOffset":0,"Scale":{"Min":0,"Max":24},"XOffset":0,"Overlap":true,"Font":{"Size":14,"Family":"Noto Sans Regular"},"OutlineWidth":0},"Style":[{"Type":"vector","OutlineColor":{"Hex":"#474747","Opacity":0.9},"Size":15,"Color":{"Hex":"#2483EB","Opacity":1},"Visible":false,"Blur":0,"Style":"circle","YOffset":0,"XOffset":0,"OutlineWidth":8}]}'
                        ),
                        'test_mvt',
                        'test_mvt',
                        res1.vector_layers[0].id
                    );
                    console.log(creatLayers);
                    creatLayers.forEach((v) => {
                        that.mapInstance.addLayer(v);
                    });
                    that.mapInstance.setLayerZoomRange('test_mvt_0_0', 0, 6);
                });
                this.mapInstance.on('click',(e) => {
                    console.log(e);
                    var min_x = 110.3753969824229;
                    var min_y = 32.576747359269504;
                    var max_x = 115.05517036570535;
                    var max_y = 29.776378554578216;
                    const features = that.mapInstance.queryRenderedFeatures(
                        [
                            [min_x, min_y],
                            [max_x, max_y],
                        ],
                        { layers: ["test_mvt_0_0"] }
                    );
                    console.log(features,'123321');

                })
                
        },
        addMvtService1() {
            var that = this;
            fetch(
                    'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0696520f430e1000/mvt?SERVICE=MVT&LAYER=l0696520f440e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
                )
                .then((res) => res.json())
                .then((res1) => {
                    console.log('res1', res1);
                    that.mapInstance.addSource('test_mvt1', {
                        type: 'vector',
                        url: 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0696520f430e1000/mvt?SERVICE=MVT&LAYER=l0696520f440e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY',
                    });
                    let creatLayers = JsonToMapbox(
                        JSON.parse(
                            '{"Others":{"Scale":{"Min":0,"Max":24}},"Type":"point","Filter":{"Attribute":{"LogicalOperator":"And","Rule":[]}},"Mode":"simple","Label":{"Field":"shengcode","OutlineColor":{"Hex":"#FF0000","Opacity":0},"Position":{"Anchor":"top","Angle":0},"Color":{"Hex":"#000000","Opacity":1},"Blur":0,"YOffset":0,"Scale":{"Min":0,"Max":24},"XOffset":0,"Overlap":true,"Font":{"Size":14,"Family":"DIN Offc Pro Medium"},"OutlineWidth":0},"Style":[{"Type":"vector","OutlineColor":{"Hex":"#474747","Opacity":0.9},"Size":15,"Color":{"Hex":"#2483EB","Opacity":1},"Visible":false,"Blur":0,"Style":"circle","YOffset":0,"XOffset":0,"OutlineWidth":8}]}'
                        ),
                        'test_mvt1',
                        'test_mvt1',
                        res1.vector_layers[0].id
                    );
                    console.log(creatLayers);
                    creatLayers.forEach((v) => {
                        that.mapInstance.addLayer(v);
                    });
                    that.mapInstance.setLayerZoomRange('test_mvt1_0_0', 7, 10);

                });
        },
        addMvtService2() {
            var that = this;
            fetch(
                    'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068aab533f8e1001/mvt?SERVICE=MVT&LAYER=l068aab53404e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
                )
                .then((res) => res.json())
                .then((res1) => {
                    console.log('res1', res1);
                    that.mapInstance.addSource('test_mvt2', {
                        type: 'vector',
                        url: 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068aab533f8e1001/mvt?SERVICE=MVT&LAYER=l068aab53404e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY',
                    });
                    let creatLayers = JsonToMapbox(
                        JSON.parse(
                            '{"Others":{"Scale":{"Min":6,"Max":24}},"Type":"polygon","Filter":{"Attribute":{"LogicalOperator":"And","Rule":[]}},"Mode":"simple","Label":{"Field":""},"Style":[{"Type":"vector","OutlineColor":{"Hex":"#E1E1E1","Opacity":1},"Color":{"Hex":"#F5F4EE","Opacity":1},"OutlineStyle":"solid","Visible":true,"OutlineWidth":0.28}]}'
                        ),
                        'test_mvt2',
                        'test_mvt2',
                        res1.vector_layers[0].id
                    );
                    console.log(creatLayers);
                    creatLayers.forEach((v) => {
                        that.mapInstance.addLayer(v);
                    });
                    that.mapInstance.setLayerZoomRange('test_mvt2_0_0', 7, 15);
                });
        },
        addMvtService3() {
            var that = this;
            fetch(
                    'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068aaeacd3ce1001/mvt?SERVICE=MVT&LAYER=l068aaeacd4ce1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
                )
                .then((res) => res.json())
                .then((res1) => {
                    console.log('res1', res1);
                    that.mapInstance.addSource('test_mvt3', {
                        type: 'vector',
                        url: 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068aaeacd3ce1001/mvt?SERVICE=MVT&LAYER=l068aaeacd4ce1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY',
                    });
                    let creatLayers = JsonToMapbox(
                        JSON.parse(
                            '{"Others":{"Scale":{"Min":0,"Max":24}},"Type":"polygon","Filter":{"Attribute":{"LogicalOperator":"And","Rule":[]}},"Mode":"simple","Label":{"Field":""},"Style":[{"Type":"vector","OutlineColor":{"Hex":"#B2B2B2","Opacity":1},"Color":{"Hex":"#F5F4EE","Opacity":1},"OutlineStyle":"dash","OutlineDashes":[20,20],"Visible":true,"OutlineWidth":0.28}]}'
                        ),
                        'test_mvt3',
                        'test_mvt3',
                        res1.vector_layers[0].id
                    );
                    console.log(creatLayers);
                    creatLayers.forEach((v) => {
                        that.mapInstance.addLayer(v);
                    });
                    that.mapInstance.setLayerZoomRange('test_mvt3', 6, 9);
                });
        },
        addMvtService4() {
            var that = this;
            fetch(
                    'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068aaeacd3ce1001/mvt?SERVICE=MVT&LAYER=l068aaeacd4ce1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
                )
                .then((res) => res.json())
                .then((res1) => {
                    console.log('res1', res1);
                    that.mapInstance.addSource('test_mvt4', {
                        type: 'vector',
                        url: 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068aaeacd3ce1001/mvt?SERVICE=MVT&LAYER=l068aaeacd4ce1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY',
                    });
                    let creatLayers = JsonToMapbox(
                        JSON.parse(
                            '{"Others":{"Scale":{"Min":0,"Max":24}},"Type":"polygon","Filter":{"Attribute":{"LogicalOperator":"And","Rule":[]}},"Mode":"simple","Label":{"Field":""},"Style":[{"Type":"vector","OutlineColor":{"Hex":"#B2B2B2","Opacity":1},"Color":{"Hex":"#F5F4EE","Opacity":1},"OutlineStyle":"dash","OutlineDashes":[8,2],"Visible":true,"OutlineWidth":0.28}]}'
                        ),
                        'test_mvt4',
                        'test_mvt4',
                        res1.vector_layers[0].id
                    );
                    console.log(creatLayers);
                    creatLayers.forEach((v) => {
                        that.mapInstance.addLayer(v);
                    });
                    that.mapInstance.setLayerZoomRange('test_mvt', 9, 12);
                });
        },
        addMvtService5() {
            var that = this;
            fetch(
                    'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068aaeede8ce1000/mvt?SERVICE=MVT&LAYER=l068aaeede98e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
                )
                .then((res) => res.json())
                .then((res1) => {
                    console.log('res1', res1);
                    that.mapInstance.addSource('test_mvt5', {
                        type: 'vector',
                        url: 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068aaeede8ce1000/mvt?SERVICE=MVT&LAYER=l068aaeede98e1000&VERSION=1.0.0&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY',
                    });
                    let creatLayers = JsonToMapbox(
                        JSON.parse(
                            '{"Others":{"Scale":{"Min":0,"Max":24}},"Type":"polygon","Filter":{"Attribute":{"LogicalOperator":"And","Rule":[]}},"Mode":"simple","Label":{"Field":""},"Style":[{"Type":"vector","OutlineColor":{"Hex":"#C8C8C8","Opacity":1},"Color":{"Hex":"#F5F4EE","Opacity":1},"OutlineStyle":"dash","OutlineDashes":[8,2],"Visible":true,"OutlineWidth":0.28}]}'
                        ),
                        'test_mvt5',
                        'test_mvt5',
                        res1.vector_layers[0].id
                    );
                    console.log(creatLayers);
                    creatLayers.forEach((v) => {
                        that.mapInstance.addLayer(v);
                    });
                    that.mapInstance.setLayerZoomRange('test_mvt5', 12, 15);
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
            const url = 'http://192.168.200.133:30080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_068bb977770e1001/wmts?TILEROW={y}&TileMatrixSet=WorldWebMercatorQuad&REQUEST=GetTile&VERSION=1.0.0&format=image/png&SERVICE=WMTS&style=default&TILEMATRIX={z}&layer=l068bb977780e1000&TILECOL={x}&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6Im10VlZhdXFCMnN0WHNucnlWazZ2ZSIsImlkIjoiMDY0Nzg0YWY2YjBlMTAwMCIsInVzZXJJZCI6IllSTlZhd05oOFFiUU50anJYU25TcyJ9.wv9Re0NLNthhgfb9pwPAxI99WuzzBRwHkjQ8c7kKziY'
            const id = 'gaobeidianputong'
            this.mapInstance.addSource(id, {
                type: 'raster',
                tiles: [url],
                tileSize: 256,
                bounds: [75, -80.051129, 130, 85.051129],
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
        },
        addMvtFill() {
            var areacode = ["410000000000"]
            var geom = 'POLYGON ((102.59489801311975 39.15501852419044, 122.15014865909001 39.15501852419044, 122.15014865909001 28.202327317289075, 102.59489801311975 28.202327317289075, 102.59489801311975 39.15501852419044))'
            this.mapInstance.addLayer({
                'id': '2021qg_sheng',
                source: {
                    type: "vector",
                    tiles: [`http://10.1.140.175:7002/v1/mvt/sys_area_year/{z}/{x}/{y}?geomColumn=mgeom`],
                    minzoom: 0,
                    maxzoom: 24
                },
                
                "source-layer": 'sys_area_year',
                "type" : "fill",
                "paint": {
                    'fill-color': '#f0f000',
                    'fill-opacity': 1
                }
                // 'layout': {
                // 'visibility': 'visible',
                // // coalesce 当请求的图片找不到时，用fallbackImage替代
                // // "icon-image": ["coalesce", ["image", "custom-marker"], ["image", "arrow"]],
                // "icon-image": ["coalesce", ["image", "image123321"]],
                // 'text-font': [
                // 'Open Sans Semibold',
                // 'Arial Unicode MS Bold'
                // ],
                // 'text-offset': [0, 1.25],
                // 'text-anchor': 'top'
                //     }      
            });
        },
        mapClickEvent(e) {
            let features = this.mapInstance.queryRenderedFeatures(e.point)
            this.popup = this.createPopup(e, features[0]);
                // this.popup.addTo(mapUtil._mapInstance);
                // mapUtil._mapInstance.setPaintProperty(`${element.id}Fill`, 'fill-opacity', 0.5);
                // mapUtil._mapInstance.setPaintProperty(`${element.id}Line`, 'line-width', 4);
        },
        // 创建popup
        createPopup(e, feature) {
            if (this.popup) {
                this.popup.remove();
            }
            let name = `123`
            // 取区域的颜色
            let html = `<div class="title" style="background:red" title="${name}">${
                name
            }</div>
            `;
            
            let popup = new mapboxgl.Popup({
                offset: [0, -15],
                anchor: 'bottom',
                closeButton: false,
                className: 'popup'
            })
                .setLngLat([e.lngLat.lng,e.lngLat.lat])
                .setHTML(html)
                .addTo(this.mapInstance);
            // return popup;
            },
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