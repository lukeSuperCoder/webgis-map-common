<template>
    <div id="map" class="map-contain">
        <div></div>
         <el-button @click="drawCircle('Circle')">Circle</el-button>
         <el-button @click="drawCircle('None')">None</el-button>
    </div>
</template>
<script>
    import "ol/ol.css"; //地图的css样式
    import Map from 'ol/Map.js';
    import OSM from 'ol/source/OSM.js';
    import View from 'ol/View.js';
    import WMTS from 'ol/source/WMTS.js';
    import TWMTS from "ol/tilegrid/WMTS";
    import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
    import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
    import {Draw, Modify, Snap} from 'ol/interaction.js';
    import {GeometryCollection, Point, Polygon} from 'ol/geom.js';
    import {Vector as VectorSource} from 'ol/source.js';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
    import {circular} from 'ol/geom/Polygon.js';
    import {getDistance} from 'ol/sphere.js';
    import {transform} from 'ol/proj.js';
    import OlFeature from 'ol/Feature';
    import OlCircle from 'ol/geom/Circle';
    
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
                map: null,
                circle_draw: null,
                circle_snap: null,
                circle_modify: null
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
                    let data = {
                        geom: '104.883712 29.272032',
                        experienceCircle: 1,
                        id: '123'
                    }
                    this.drawEvent(data)
            },
             setMapHeight() {
                if (this.map && document.getElementById('map')) {
                    document.getElementById('map').style.height = window.screen.height + "px";
                    this.map.updateSize();
                }
            },
            drawCircle(name) {
                let that = this;
                
                if(name==='None') {
                    that.map.removeInteraction(that.circle_draw)
                    that.map.removeInteraction(that.circle_snap)
                    return
                }

                const raster = new TileLayer({
                source: new OSM(),
                });

                const source = new VectorSource();

                const style = new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: '#33cc33',
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                    color: '#ffcc33',
                    }),
                }),
                });

                const geodesicStyle = new Style({
                geometry: function (feature) {
                    return feature.get('modifyGeometry') || feature.getGeometry();
                },
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: '#ff3333',
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                    color: 'rgba(0, 0, 0, 0)',
                    }),
                }),
                });

                const vector = new VectorLayer({
                source: source,
                style: function (feature) {
                    const geometry = feature.getGeometry();
                    return geometry.getType() === 'GeometryCollection' ? geodesicStyle : style;
                },
                });

                this.map.addLayer(raster)
                this.map.addLayer(vector)
                const defaultStyle = new Modify({source: source})
                .getOverlay()
                .getStyleFunction();

                that.circle_modify = new Modify({
                source: source,
                style: function (feature) {
                    feature.get('features').forEach(function (modifyFeature) {
                    const modifyGeometry = modifyFeature.get('modifyGeometry');
                    if (modifyGeometry) {
                        const modifyPoint = feature.getGeometry().getCoordinates();
                        const geometries = modifyFeature.getGeometry().getGeometries();
                        const polygon = geometries[0].getCoordinates()[0];
                        const center = geometries[1].getCoordinates();
                        const projection = that.map.getView().getProjection();
                        let first, last, radius;
                        if (modifyPoint[0] === center[0] && modifyPoint[1] === center[1]) {
                        // center is being modified
                        // get unchanged radius from diameter between polygon vertices
                        first = transform(polygon[0], projection, 'EPSG:4326');
                        last = transform(
                            polygon[(polygon.length - 1) / 2],
                            projection,
                            'EPSG:4326'
                        );
                        radius = getDistance(first, last) / 2;
                        } else {
                        // radius is being modified
                        first = transform(center, projection, 'EPSG:4326');
                        last = transform(modifyPoint, projection, 'EPSG:4326');
                        radius = getDistance(first, last);
                        }
                        // update the polygon using new center or radius
                        const circle = circular(
                        transform(center, projection, 'EPSG:4326'),
                        radius,
                        128
                        );
                        circle.transform('EPSG:4326', projection);
                        geometries[0].setCoordinates(circle.getCoordinates());
                        // save changes to be applied at the end of the interaction
                        modifyGeometry.setGeometries(geometries);
                    }
                    });
                    return defaultStyle(feature);
                },
                });

                that.circle_modify.on('modifystart', function (event) {
                event.features.forEach(function (feature) {
                    const geometry = feature.getGeometry();
                    if (geometry.getType() === 'GeometryCollection') {
                    feature.set('modifyGeometry', geometry.clone(), true);
                    }
                });
                });

                that.circle_modify.on('modifyend', function (event) {
                event.features.forEach(function (feature) {
                    const modifyGeometry = feature.get('modifyGeometry');
                    if (modifyGeometry) {
                    feature.setGeometry(modifyGeometry);
                    feature.unset('modifyGeometry', true);
                    }
                });
                that.map.removeInteraction(that.circle_draw)
                that.map.removeInteraction(that.circle_snap)
                });

                that.map.addInteraction(that.circle_modify);


                function addInteractions() {
                let value = name;
                let geometryFunction;
                if (value === 'Circle') {
                    geometryFunction = function (coordinates, geometry, projection) {
                    if (!geometry) {
                        geometry = new GeometryCollection([
                        new Polygon([]),
                        new Point(coordinates[0]),
                        ]);
                    }
                    const geometries = geometry.getGeometries();
                    const center = transform(coordinates[0], projection, 'EPSG:4326');
                    const last = transform(coordinates[1], projection, 'EPSG:4326');
                    const radius = getDistance(center, last);
                    const circle = circular(center, radius, 128);
                    circle.transform('EPSG:4326', projection);
                    geometries[0].setCoordinates(circle.getCoordinates());
                    geometry.setGeometries(geometries);
                    return geometry;
                    };
                }
                that.circle_draw = new Draw({
                    source: source,
                    type: value,
                    geometryFunction: geometryFunction,
                });
                that.map.addInteraction(that.circle_draw);
                that.circle_snap = new Snap({source: source});
                that.map.addInteraction(that.circle_snap);
                }

                /**
                * Handle change event.
                */
                // typeSelect.onchange = function () {
                // that.map.removeInteraction(draw);
                // that.map.removeInteraction(snap);
                // addInteractions();
                // };
                addInteractions();
            },
            drawEvent(data){
                let center = data.geom.substring(6, data.geom.length - 2).split(' ');
                let circleFeature = this.getCircleFeature([Number(center[0]), Number(center[1])], data.experienceCircle * 1000);
                this.radius = data.experienceCircle * 1000;
                this.vectorSource = new SourceVector({
                    features: [circleFeature]
                });
                let vectoreLayer = new LayerVector({
                    id: 'event' + data.id,
                    name: 'event' + data.id,
                    source: this.vectorSource,
                    style: new Style({
                        fill: new Fill({
                            color: "rgba(0, 197, 255,0.4)",
                        }),
                        stroke: new Stroke({
                            color: "rgba(0, 197, 255,1)",
                            width: 2,
                        }),
                    })
                });
                mapUtil._mapInstance.addLayer(vectoreLayer); 
            },
            getCircleFeature(center, radius) {
                let tempRadius = radius / this.map.getView().getProjection().getMetersPerUnit();
                console.log('unit:', this.map.getView().getProjection().getMetersPerUnit());
                console.log('tempRadius:', tempRadius);
                let geom = new OlCircle(center, tempRadius);
                let feature = new OlFeature({
                    geometry: geom
                });
                return feature;
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