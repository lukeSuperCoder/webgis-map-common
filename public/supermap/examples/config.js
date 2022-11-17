/**
 * WebGL 示例配置文件：包含示例的分类、名称、缩略图、文件路径
 */
var identification = {
    name: "WebGL"
};
var exampleConfig = {
    "layer": {
        name: "图层",
        name_en: "layer",
        content: {
            "terrain": {
                name: "地形",
                name_en: "terrain",
                content: [
                    {
                        name: "地形影像",
                        name_en: "terrainAndImagery",
                        thumbnail: "terrainAndImagery.jpg",
                        fileName: "terrainAndImagery"
                    }
                ]
            },
            "imagery": {
                name: "影像",
                name_en: "imagery",
                content: [
                    {
                        name: "时态",
                        name_en: "dynamicTime",
                        thumbnail: "dynamicTime.jpg",
                        fileName: "dynamicTime"
                    },
                    {
                        name: "颜色设置",
                        name_en: "ImageryAdjustment",
                        thumbnail: "ImageryAdjustment.jpg",
                        fileName: "ImageryAdjustment"
                    },
                    {
                        name: "叠加二维地图",
                        name_en: "SuperMapTileImagery",
                        thumbnail: "SuperMapTileImagery.jpg",
                        fileName: "SuperMapTileImagery"
                    },
                    {
                        name: "安全认证",
                        name_en: "tokenCredential",
                        thumbnail: "tokenCredential.jpg",
                        fileName: "tokenCredential"
                    }
                ]
            },
            "S3M": {
                name: "三维切片缓存(S3M)",
                name_en: "S3M",
                content: [
                    {
                        name: "倾斜模型",
                        name_en: "S3MTiles_suofeiya",
                        thumbnail: "S3MTiles_suofeiya.jpg",
                        fileName: "S3MTiles_suofeiya"
                    },
                    {
                        name: "萨尔茨堡（水面特效）",
                        name_en: "S3MTiles_srsb_water",
                        thumbnail: "S3MTiles_srsb_water.jpg",
                        fileName: "S3MTiles_srsb_water"
                    },
                    {
                        name: "鸟巢（水面特效）",
                        name_en: "S3MTiles_niaochao_water",
                        thumbnail: "S3MTiles_niaochao_water.jpg",
                        fileName: "S3MTiles_niaochao_water"
                    },
                    {
                        name: "CBD",
                        name_en: "S3MTiles_jingmo",
                        thumbnail: "S3MTiles_jingmo.jpg",
                        fileName: "S3MTiles_jingmo"
                    },
                    {
                        name: "BIM",
                        name_en: "S3MTiles_BIM",
                        thumbnail: "S3MTiles_BIM.jpg",
                        fileName: "S3MTiles_BIM"
                    },
                    {
                        name: "矢量",
                        name_en: "S3MTiles_vector",
                        thumbnail: "S3MTiles_vector.jpg",
                        fileName: "S3MTiles_vector"
                    }, {
                        name: "点云",
                        name_en: "S3MTiles_pointCloud",
                        thumbnail: "S3MTiles_pointCloud.jpg",
                        fileName: "S3MTiles_pointCloud"
                    },
                    {
                        name: "地下管线",
                        name_en: "showUnderGround",
                        thumbnail: "showUnderGround.jpg",
                        fileName: "showUnderGround"
                    },
                    {
                        name: "体渲染",
                        name_en: "S3M_Volume",
                        thumbnail: "S3M_Volume.jpg",
                        fileName: "S3M_Volume"
                    },
                    {
                        name: "体数据临近采样",
                        name_en: "nearestFilterMode",
                        thumbnail: "nearestFilterMode.jpg",
                        fileName: "nearestFilterMode"
                    },
					{
                        name: "透明渲染",
                        name_en: "transparentRendering",
                        thumbnail: "transparentRendering.jpg",
                        fileName: "transparentRendering"
                    },
                    {
                        name: "柱状图",
                        name_en: "S3MTiles_histogram",
                        thumbnail: "S3MTiles_histogram.jpg",
                        fileName: "S3MTiles_histogram"
                    },
                    {
                        name: "选中偏移",
                        name_en: "offset",
                        thumbnail: "offset.jpg",
                        fileName: "offset"
                    }
                ]
            },
            "dynamic-layer": {
                name: "动态图层",
                name_en: "dynamic layer",
                content: [
                    {
                        name: "全球实时航线数据",
                        name_en: "airlines",
                        thumbnail: "airline.jpg",
                        fileName: "airlines"
                    },
                    {
                        name: "全球船舶动态效果",
                        name_en: "dynamicLayer",
                        thumbnail: "dynamicLayer.jpg",
                        fileName: "dynamicLayer"
                    },
                    {
                        name: "风车",
                        name_en: "fan",
                        thumbnail: "fan.jpg",
                        fileName: "fan"
                    },
                    {
                        name: "交通仿真",
                        name_en: "trafficSimulation",
                        thumbnail: "trafficSimulation.jpg",
                        fileName: "trafficSimulation"
                    }
                ]
            }
        }
    },
    "online-base-map": {
        name: "在线底图",
        name_en: "online base map",
        content: {
            "map": {
                name: "在线底图",
                name_en: "online base map",
                content: [
                    {
                        name: "本地图片",
                        name_en: "SingleTileImageryProvider",
                        thumbnail: "SingleTileImageryProvider.jpg",
                        fileName: "image"
                    },
                    {
                        name: "天地图",
                        name_en: "tianditu",
                        thumbnail: "tianditu.jpg",
                        fileName: "tianditu"
                    },
                    {
                        name: "BingMap",
                        name_en: "BingMap",
                        thumbnail: "bingMap.jpg",
                        fileName: "bingMap"
                    },
                    {
                        name: "STK地形",
                        name_en: "STKterrain",
                        thumbnail: "STKterrain.jpg",
                        fileName: "STKterrain"
                    }
                ]
            }/*,
            "data": {
                name: "数据",
                name_en: "data service",
                content: [
                    {
                        name: "夜晚地图",
                        name_en: "flightFly.html",
                        thumbnail: "flightFly.jpg",
                        fileName: "flightFly"
                    },
                    {
                        name: "三维瓦片",
                        name_en: "3D Tiles Photogrammetry",
                        thumbnail: "3D Tiles Photogrammetry.jpg",
                        fileName: "3D Tiles Photogrammetry"
                    },
                    {
                        name: "绘制点线面",
                        name_en: "draw",
                        thumbnail: "draw.jpg",
                        fileName: "draw"
                    }
                ]
            },
            "spatialAnalyst": {
                name: "空间分析",
                name_en: "spatial analysis service",
                content: [     {
                    name: "PM2.5",
                    name_en: "pm",
                    thumbnail: "pm.jpg",
                    fileName: "pm"
                }, ]
            },
            "processingService": {
                name: "分布式分析",
                name_en: "distributed analysis services",
                content: [  {
                    name: "STK地形",
                    name_en: "STKterrain",
                    thumbnail: "STKterrain.jpg",
                    fileName: "STKterrain"
                }, {
                    name: "Scene模式切换",
                    name_en: "switchSceneMode",
                    thumbnail: "switchSceneMode.jpg",
                    fileName: "switchSceneMode"
                }]
            }*/
        }
    },
    "Scene": {
        name: "场景",
        name_en: "Scene",
        content: {
            "PostProcessing": {
                name: "后期处理",
                name_en: "PostProcessing",
                content: [
                    {
                        name: "颜色校正",
                        name_en: "colorCorrection",
                        thumbnail: "colorCorrection.jpg",
                        fileName: "colorCorrection"
                    },
                    {
                        name: "后期特效",
                        name_en: "aftertreatment",
                        thumbnail: "aftertreatment.jpg",
                        fileName: "aftertreatment"
                    },
                    {
                        name: "线框模式",
                        name_en: "wireframe",
                        thumbnail: "wireframe.jpg",
                        fileName: "wireframe"
                    },
                    {
                        name: "设置光源",
                        name_en: "lightSource",
                        thumbnail: "lightSource.jpg",
                        fileName: "lightSource"
                    }
					,
                    {
                        name: "按特征值显隐",
                        name_en: "visibleByFeatureValue",
                        thumbnail: "visibleByFeatureValue.jpg",
                        fileName: "visibleByFeatureValue"
                    }
                ]
            },
            "split": {
                name: "分屏",
                name_en: "split",
                content: [
                    {
                        name: "分屏显示",
                        name_en: "multiViewport",
                        thumbnail: "multiViewport.jpg",
                        fileName: "multiViewport"
                    },
                    {
                        name: "kml图层分屏显示",
                        name_en: "multiViewport_kml",
                        thumbnail: "multiViewport_kml.jpg",
                        fileName: "multiViewport_kml"
                    }
                ]
            },
            "globe-mode": {
                name: "地球模式",
                name_en: "globe mode",
                content: [
                    {
                        name: "模式切换",
                        name_en: "switchGlobeMode",
                        thumbnail: "switchGlobeMode.jpg",
                        fileName: "switchGlobeMode"
                    },
                    {
                        name: "二三维切换",
                        name_en: "sceneModeSwitching",
                        thumbnail: "sceneModeSwitching.jpg",
                        fileName: "sceneModeSwitching"
                    }
                ]
            },
            "position-info": {
                name: "位置信息",
                name_en: "position information",
                content: [
                    {
                        name: "拾取位置",
                        name_en: "pickPosition",
                        thumbnail: "pickPosition.jpg",
                        fileName: "pickPosition"
                    }
                ]
            },
            "output-Of-Scene": {
                name: "场景出图",
                name_en: "Screenshot of scene",
                content: [
                    {
                        name: "场景出图",
                        name_en: "Screenshot of scene",
                        thumbnail: "S3MTiles_niaochao_water.jpg",
                        fileName: "outputScene"
                    }
                ]
            }
        }
    },
    "search": {
        name: "查询",
        name_en: "search",
        content: {
            "online-search": {
                name: "在线检索",
                name_en: "online search",
                content: [
                    {
                        name: "POI检索",
                        name_en: "location",
                        thumbnail: "location.jpg",
                        fileName: "location"
                    }
                ]
            },
            "attribute-search": {
                name: "属性查询",
                name_en: "attribute search",
                content: [
                    {
                        name: "倾斜摄影属性查询",
                        name_en: "S3MTiles",
                        thumbnail: "S3MTiles.jpg",
                        fileName: "S3MTiles"
                    },
                    {
                        name: "SQL查询",
                        name_en: "getFeatureBySQL",
                        thumbnail: "getFeatureBySQL.jpg",
                        fileName: "getFeatureBySQL"
                    },
                    {
                        name: "空间查询",
                        name_en: "getFeatureByGeometry",
                        thumbnail: "getFeatureByGeometry.jpg",
                        fileName: "getFeatureByGeometry"
                    },
                    {
                        name: "分层分户查询",
                        name_en: "individualInformation",
                        thumbnail: "individualInformation.jpg",
                        fileName: "individualInformation"
                    },
                    {
                        name: "动态单体化",
                        name_en: "dynamicDTH",
                        thumbnail: "dynamicDTH.jpg",
                        fileName: "dynamicDTH"
                    }
                ]
            }
        }
    },
    "measurement": {
        name: "量算",
        name_en: "measurement",
        content: {
            "measurement": {
                name: "量算",
                name_en: "online measurement",
                content: [
                    {
                        name: "量算",
                        name_en: "measurement",
                        thumbnail: "measureHandler.jpg",
                        fileName: "measureHandler"
                    }
                ]
            }
        }
    },
    "analysis": {
        name: "分析",
        name_en: "analysis",
        content: {
            "hypsometric": {
                name: "分层设色",
                name_en: "hypsometric",
                content: [
                    {
                        name: "淹没分析（模型）",
                        name_en: "flood",
                        thumbnail: "flood.jpg",
                        fileName: "flood"
                    },
                    {
                        name: "淹没分析（地形）",
                        name_en: "floodex",
                        thumbnail: "floodex.jpg",
                        fileName: "floodex"
                    }
                ]
            },
            "3D anylysis": {
                name: "三维空间分析",
                name_en: "3D anylysis",
                content: [
                    {
                        name: "通视分析",
                        name_en: "sightline",
                        thumbnail: "sightline.jpg",
                        fileName: "sightline"
                    },
                    {
                        name: "可视域分析",
                        name_en: "viewshed3D",
                        thumbnail: "viewshed3D.jpg",
                        fileName: "viewshed3D"
                    },
                    {
                        name: "阴影分析",
                        name_en: "shadowQuery",
                        thumbnail: "shadowQuery.jpg",
                        fileName: "shadowQuery"
                    },
                    {
                        name: "天际线分析",
                        name_en: "skyline",
                        thumbnail: "skyline.jpg",
                        fileName: "skyline"
                    },
                    {
                        name: "剖面分析",
                        name_en: "profile",
                        thumbnail: "profile.jpg",
                        fileName: "profile"
                    },
                    {
                        name: "视频投放",
                        name_en: "projectionImage",
                        thumbnail: "RTSPprojectionImage.jpg",
                        fileName: "projectionImage"
                    },
                    {
                        name: "RTSP视频投放",
                        name_en: "RTSPprojectionImage",
                        thumbnail: "RTSPprojectionImage.jpg",
                        fileName: "RTSP"
                    },
                    {
                        name: "平面裁剪",
                        name_en: "clip",
                        thumbnail: "clip.jpg",
                        fileName: "clip"
                    },
                    {
                        name: "Box裁剪",
                        name_en: "clipbox",
                        thumbnail: "clipbox.jpg",
                        fileName: "clipbox"
                    },
                    {
                        name: "Cross裁剪",
                        name_en: "clipCross",
                        thumbnail: "clipCross.jpg",
                        fileName: "clipCross"
                    },
                    {
                        name: "多边形裁剪",
                        name_en: "clipPolygon",
                        thumbnail: "clipPolygon.jpg",
                        fileName: "clipPolygon"
                    },
					 {
                        name: "ID过滤裁剪",
                        name_en: "clipById",
                        thumbnail: "clipById.jpg",
                        fileName: "clipById"
                    },
					 {
                        name: "裁剪封边",
                        name_en: "clipWithSeal",
                        thumbnail: "clipWithSeal.jpg",
                        fileName: "clipWithSeal"
                    },
                    {
                        name: "坡度坡向分析",
                        name_en: "terrainSlopeAnalysis",
                        thumbnail: "terrainSlopeAnalysis.jpg",
                        fileName: "terrainSlopeAnalysis"
                    },
                    {
                        name: "地形开挖",
                        name_en: "digTerrain",
                        thumbnail: "digTerrain.jpg",
                        fileName: "digTerrain"
                    },
                    {
                        name: "地形修改",
                        name_en: "modifyTerrain",
                        thumbnail: "modifyTerrain.jpg",
                        fileName: "modifyTerrain"
                    },
                    {
                        name: "退线分析",
                        name_en: "backLineAnalysis",
                        thumbnail: "backLineAnalysis.jpg",
                        fileName: "backLineAnalysis"
                    },
                    {
                        name: "限高分析",
                        name_en: "limitHeightAnalysis",
                        thumbnail: "limitHeightAnalysis.jpg",
                        fileName: "limitHeightAnalysis"
                    },
                    {
                        name: "贴线分析",
                        name_en: "onLineAnalysis",
                        thumbnail: "onLineAnalysis.jpg",
                        fileName: "onLineAnalysis"
                    },
                    {
                        name: "服务区分析",
                        name_en: "serviceAreaAnalysis",
                        thumbnail: "serviceAreaAnalysis.jpg",
                        fileName: "serviceAreaAnalysis"
                    }
                ]
            }/*,
            "2D analysis":{
                name: "二维空间分析",
                name_en: "2D anylysis",
                content:[
                    {
                        name: "剖面分析",
                        name_en: "profileAnalyze",
                        thumbnail: "profileAnalyze.jpg",
                        fileName: "profileAnalyze"
                    },
                    {
                        name: "缓冲区分析",
                        name_en: "bufferAnalyze",
                        thumbnail: "bufferAnalyze.jpg",
                        fileName: "bufferAnalyze"

                    },
                    {
                        name: "叠加分析",
                        name_en: "overlayAnalyze",
                        thumbnail: "overlayAnalyze.jpg",
                        fileName: "overlayAnalyze"
                    },
                    {
                        name: "栅格运算",
                        name_en: "mathExpression",
                        thumbnail: "mathExpression.jpg",
                        fileName: "mathExpression"
                    },
                    {
                        name: "地形曲率",
                        name_en: "terrainCurvature",
                        thumbnail: "terrainCurvature.jpg",
                        fileName: "terrainCurvature"
                    }
                ]
            }*/
        }
    },
    "fly": {
        name: "飞行",
        name_en: "fly",
        content: {
            "fly": {
                name: "飞行",
                name_en: "fly",
                content: [
                    {
                        name: "沿线飞行",
                        name_en: "flyRoute",
                        thumbnail: "flyRoute.jpg",
                        fileName: "flyRoute"
                    }
                ]
            }
        }
    },
    "KMLAndModel": {
        name: "KML&模型",
        name_en: "KML&model",
        content: {
            "model-edit": {
                name: "模型编辑",
                name_en: "model edit",
                content: [
                    {
                        name: "模型编辑（旋转、平移、缩放）",
                        name_en: "KML_edit",
                        thumbnail: "KML_edit.jpg",
                        fileName: "KML_edit"
                    }
                ]
            },
            "animation-model": {
                name: "动画模型",
                name_en: "animation model",
                content: [
                    {
                        name: "吊塔",
                        name_en: "KML_crane",
                        thumbnail: "KML_crane.jpg",
                        fileName: "KML_crane"
                    },
                    {
                        name: "gltf",
                        name_en: "gltf",
                        thumbnail: "gltf.JPG",
                        fileName: "gltf"
                    }
                ]
            },
            "node-animation": {
                name: "节点动画",
                name_en: "node animation",
                content: [
                    {
                        name: "小车移动",
                        name_en: "KML_car",
                        thumbnail: "KML_car.jpg",
                        fileName: "KML_car"
                    }
                ]
            },
            "line-snap-to-ground": {
                name: "线贴地/贴对象",
                name_en: "line snap to ground",
                content: [
                    {
                        name: "北京地铁路线及站点标注",
                        name_en: "KML_beijing",
                        thumbnail: "KML_beijing.jpg",
                        fileName: "KML_beijing"
                    },
                    {
                        name: "四姑娘山登山路线",
                        name_en: "KML_route",
                        thumbnail: "KML_route.jpg",
                        fileName: "KML_route"
                    },
                ]
            },
            "polygon-snap-to-ground": {
                name: "面贴地/贴对象",
                name_en: "polygon snap to ground",
                content: [
                    {
                        name: "矢量面",
                        name_en: "Polygon",
                        thumbnail: "Polygon.jpg",
                        fileName: "Polygon"
                    },
                    {
                        name: "矢量面拉伸",
                        name_en: "extrude",
                        thumbnail: "extrude.jpg",
                        fileName: "extrude"
                    }
                ]
            }
        }
    },
    "online-draw": {
        name: "在线绘制",
        name_en: "online draw",
        content: {
            "point-polyline-polygon-drawing": {
                name: "绘制点线面",
                name_en: "point/polyline/polygon drawing",
                content: [
                    {
                        name: "绘制点线面",
                        name_en: "drawHandler",
                        thumbnail: "drawHandler.jpg",
                        fileName: "drawHandler"
                    },
                    {
                        name: "线型",
                        name_en: "Polyline",
                        thumbnail: "Polyline.jpg",
                        fileName: "Polyline"
                    }
                ]
            },
            "geometry": {
                name: "几何体对象",
                name_en: "geometry",
                content: [
                    {
                        name: "几何体对象",
                        name_en: "Geometry",
                        thumbnail: "Geometry.jpg",
                        fileName: "Geometry"
                    }
                ]
            },
            "online-symbol": {
                name: "在线符号",
                name_en: "online symbol",
                content: [
                    {
                        name: "添加小品",
                        name_en: "addSymbols",
                        thumbnail: "addSymbols.jpg",
                        fileName: "addSymbols"
                    }
                ]
            }
        }
    },
    "visualization": {
        name: "可视化",
        name_en: "visualization",
        content: {
            "air-quality": {
                name: "空气质量",
                name_en: "air quality",
                content: [
                    {
                        name: "全球实时空气质量状况",
                        name_en: "aqi",
                        thumbnail: "aqi.jpg",
                        fileName: "aqi"
                    }
                ]
            },
            /*"air-direction-map": {
                name: "风向图",
                name_en: "air direction map",
                content: [
                    {
                        name: "Wind map",
                        name_en: "Wind map",
                        thumbnail: "windmap.jpg",
                        fileName: "windmap"
                    }
                ]
            },*/
            "split-comparation": {
                name: "卷帘对比",
                name_en: "split comparation",
                content: [
                    {
                        name: "灯光数据卷帘对比",
                        name_en: "Nightlight",
                        thumbnail: "Nightlight.jpg",
                        fileName: "Nightlight"
                    },
                    {
                        name: "模型卷帘",
                        name_en: "rollerShutter",
                        thumbnail: "rollerShutter.jpg",
                        fileName: "rollerShutter"
                    }
                ]
            },
            "time-space-effect": {
                name: "时空效果",
                name_en: "time&space effect",
                content: [
                    {
                        name: "全球陆地温度变化时空效果",
                        name_en: "LandTemChange",
                        thumbnail: "LandTemChange.jpg",
                        fileName: "LandTemChange"
                    }
                ]
            },
            "heat-map": {
                name: "热力图",
                name_en: "heat map",
                content: [
                    {
                        name: "热力图叠加S3M",
                        name_en: "Project_heatmap",
                        thumbnail: "Project_heatmap.jpg",
                        fileName: "Project_heatmap"
                    }
                ]
            },
            "Thematic-map": {
                name: "专题图",
                name_en: "Thematic map",
                content: [
                    {
                        name: "专题图",
                        name_en: "ThematicMap",
                        thumbnail: "ThematicMap.jpg",
                        fileName: "ThematicMap"
                    }
                ]
            },
            "particle": {
                name: "粒子",
                name_en: "particle",
                content: [
                    {
                        name: "火焰",
                        name_en: "flame",
                        thumbnail: "flame.jpg",
                        fileName: "Particle System"
                    },
                    {
                        name: "鸟巢火炬",
                        name_en: "Particle System_Fire",
                        thumbnail: "Particle System_Fire.jpg",
                        fileName: "Particle System_Fire"
                    },
                    {
                        name: "喷泉",
                        name_en: "Particle System_fountain",
                        thumbnail: "Particle System_fountain.jpg",
                        fileName: "Particle System_fountain"
                    },
                    {
                        name: "雨水",
                        name_en: "Particle System_rain",
                        thumbnail: "Particle System_rain.jpg",
                        fileName: "Particle System_rain"
                    }
                ]
            },
            "stream-map": {
                name: "流地图",
                name_en: "stream map",
                content: [
                    {
                        name: "出租车流",
                        name_en: "taxiFlow",
                        thumbnail: "taxiFlow.jpg",
                        fileName: "taxiFlow"
                    },
                    {
                        name: "飞机航线动态可视化",
                        name_en: "Dynamic flight visualization",
                        thumbnail: "flightnew.jpg",
                        fileName: "flightnew"
                    },
                    {
                        name: "人口迁移流地图",
                        name_en: "migration",
                        thumbnail: "migration.jpg",
                        fileName: "migration"
                    },
                    {
                        name: "光晕",
                        name_en: "polylingGlow",
                        thumbnail: "polylingGlow.jpg",
                        fileName: "polylineGlow"
                    },
                    {
                        name: "扫描线",
                        name_en: "scanEffect",
                        thumbnail: "scanEffect.jpg",
                        fileName: "scanEffect"
                    },
                ]
            }, 
			"special-effect": {
                name: "特效",
                name_en: "special effect",
                content: [
                    {
                        name: "泛光扫描线",
                        name_en: "scanLine",
                        thumbnail: "scanLine.jpg",
                        fileName: "scanLine"
                    },
                    {
                        name: "泛光尾迹线",
                        name_en: "trailLine",
                        thumbnail: "trailLine.jpg",
                        fileName: "airlinesTrailLines"
                    },
                    {
                        name: "动态自发光纹理",
                        name_en: "emissionTexture",
                        thumbnail: "emissionTexture.jpg",
                        fileName: "emissionTexture"
                    },
                    {
                        name: "动态图层汽车灯光",
                        name_en: "carLamp",
                        thumbnail: "carLamp.jpg",
                        fileName: "carLamp"
                    },
                    {
                        name: "泛光光源",
                        name_en: "tx_lightSource",
                        thumbnail: "tx_lightSource.jpg",
                        fileName: "tx_lightSource"
                    },
                ]
            }
        }
    },
    "stereoscopic-show": {
        name: "立体显示",
        name_en: "stereoscopic show",
        content: {
            "polarization": {
                name: "偏振立体",
                name_en: "polarization stereoscopic show",
                content: [
                    {
                        name: "偏振立体",
                        name_en: "polarizedStereoscopic",
                        thumbnail: "polarizedStereoscopic.jpg",
                        fileName: "polarizedStereoscopic"
                    }
                ]
            }
        }
    },
    "plot": {
        name: "三维标绘",
        name_en: "3D plotting",
        content: {
            "plotting": {
                name: "标绘",
                name_en: "plotting",
                content: [
                    {
                        name: "动态标绘",
                        name_en: "dynamic plot",
                        thumbnail: "plot_dynamicPlot.jpg",
                        fileName: "plot_dynamicPlot"
                    },
                    {
                        name: "属性修改",
                        name_en: "modify symbol style",
                        thumbnail: "plot_modifySymbolStyle.jpg",
                        fileName: "plot_modifySymbolStyle"
                    },
                    {
                        name: "缺省属性",
                        name_en: "default symbol style",
                        thumbnail: "plot_defaultStyle.jpg",
                        fileName: "plot_defaultStyle"
                    },
                    {
                        name: "自定义属性",
                        name_en: "extend symbol properties",
                        thumbnail: "plot_symbolExtendProperty.jpg",
                        fileName: "plot_symbolExtendProperty"
                    },
                    {
                        name: "多注记",
                        name_en: "annotations",
                        thumbnail: "plot_Annotations.jpg",
                        fileName: "plot_Annotations"
                    },
                    {
                        name: "标号库加载",
                        name_en: "load symbol library",
                        thumbnail: "plot_loadSymbolLib.jpg",
                        fileName: "plot_loadSymbolLib"
                    },
                    {
                        name: "查询标号",
                        name_en: "query symbol",
                        thumbnail: "plot_querySymbolLib.jpg",
                        fileName: "plot_querySymbolLib"
                    }

                ]
            },
            "Situational inference": {
                name: "态势推演",
                name_en: "situational inference",
                content: [
                    {
                        name: "态势推演",
                        name_en: "situational inference",
                        thumbnail: "plot_plotGOAnimation.jpg",
                        fileName: "plot_plotGOAnimation"
                    },
                    {
                        name: "态势图叠加",
                        name_en: "situational map superposition",
                        thumbnail: "plot_addfile.jpg",
                        fileName: "plot_addfile"
                    },
                    {
                        name: "态势图上传下载",
                        name_en: "plot symbol file upload and download",
                        thumbnail: "plot_filetransfer.jpg",
                        fileName: "plot_filetransfer"
                    }

                ]
            },
            "Layer operation": {
                name: "图层操作",
                name_en: "layer operation",
                content: [

                    {
                        name: "图层操作",
                        name_en: "layer operations",
                        thumbnail: "plot_operPlottingLayer.jpg",
                        fileName: "plot_operPlottingLayer"
                    },
                    {
                        name: "图层编辑",
                        name_en: "layer editing",
                        thumbnail: "plot_editPlottingLayer.jpg",
                        fileName: "plot_editPlottingLayer"
                    }

                ]
            }
        }
    }
};

/**
 *key值：为exampleConfig配置的key值或者fileName值
 *      （为中间节点时是key值，叶结点是fileName值）
 *value值：fontawesome字体icon名
 *不分层
 */
var sideBarIconConfig = {
    "online-base-map": "fa-globe",
    "Scene": "fa-university",
    "fly": "fa-send",
    "layer": "fa-object-group",
    "KMLAndModel": "fa-cubes",
    "online-draw": "fa-edit",
    "search": "fa-search",
    "measurement": "fa-arrows-v",
    "analysis": "fa-map",
    "visualization": "fa-eye",
    "stereoscopic-show": "fa-cube",
    "plot": "fa-pencil"
};

/**
 *key值：为exampleConfig配置的key值
 *value值：fontawesome字体icon名
 *与sideBarIconConfig的区别：sideBarIconConfig包括侧边栏所有层级目录的图标，exampleIconConfig仅包括一级标题的图标
 */
var exampleIconConfig = {
    "online-base-map": "fa-globe",
    "Scene": "fa-university",
    "fly": "fa-send",
    "layer": "fa-object-group",
    "KMLAndModel": "fa-cubes",
    "online-draw": "fa-edit",
    "search": "fa-search",
    "measurement": "fa-arrows-v",
    "analysis": "fa-map",
    "visualization": "fa-eye",
    "stereoscopic-show": "fa-cube",
    "plot": "fa-pencil"
};