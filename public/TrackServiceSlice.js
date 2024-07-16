//类定义
ShipxyAPI.TrackServiceSliceImpl = L.Class.extend({
    initialize: function (map, options) {
        let that = this;
        that._map = map;
        that._urlGroup = "pro0412"; //group1
        that._urls = {
            // dev: {
            //     name: "dev",
            //     bounds: "http://192.168.1.173:19090/getTrackExtent",
            //     data: "http://192.168.1.173:19090/getTrackVacuate",
            // },
            // pro: {
            //     name: "pro",
            //     bounds: "http://103.131.168.211:19090/getTrackExtent",
            //     data: "http://103.131.168.211:19090/getTrackVacuate",
            // },
            // dev0412: {
            //     name: "dev0412",
            //     bounds: "http://192.168.1.173:19090/getTrackExtent",
            //     data: "http://192.168.1.173:19090/getTrackVacuate",
            // },
            pro0412: {
                name: "pro0412",
                bounds: "https://106.3.96.176:8083/getTrackExtent",
                data: "https://106.3.96.176:8083/getTrackVacuate",
            },
            // dev2: {
            //     name: "dev2",
            //     bounds: "http://192.168.1.96:8888/api/bigData/layeredtrackapi/getTrackExtent",
            //     data: "http://192.168.1.96:8888/api/bigData/layeredtrackapi/getTrackVacuate",
            // }
        };
        that.options = {
            //轨迹服务参数
            //轨迹播放服务参数
        };
        //参数覆盖
        that.options = $.extend(true, {}, that.options, options);
        that._tracks = {}; //存储轨迹集合
    },
    show: function (mmsi, start, end, options) {
        let that = this;
        //参数覆盖
        that.options = $.extend(true, {}, that.options, options);
        //地图监听
        that._map.on("moveend", function () {
            //根据范围加载对应轨迹点
            that.showTrackData();
        });
        that._map.on("zoomstart", function () {
            //根据范围加载对应轨迹点
            that.clearTimeLabel();
        });
        //初始化轨迹信息，获取相应数据
        return new Promise((res, rej) => {
            that._map.messagebox.show("轨迹绘制中，请稍后...", 10000);
            that.initTrack(mmsi, start, end, that.options).then((data) => {
                that._map.messagebox.hide();
                res(data);
            }).catch((err) => {
                if(err!=='轨迹已存在') {
                    delete that._tracks[key];
                }
                that._map.messagebox.hide();
                rej(err);
            });
        })
    },
    hide: function () {

    },
    /**
     * 查询轨迹显示范围
     * @summary 15、查询轨迹数据
     * @memberof ShipxyAPI.TrackServiceImpl
     * @param mmsi {string} mmsi
     * @param start {number} 起始时间戳，秒
     * @param end {number} 结束时间戳，秒
     * @param options {object} 是相关配置信息
     * @returns {Array} 轨迹范围
     */
    getTrackBounds: function (mmsi, start, end, options) {
        let that = this;
        let bounds = null;
        let _options = $.extend(true, {
            isFlyPoint: 0,
            sogEventVac: 1
        }, options);
        $.ajax({
            url: that._urls[that._urlGroup].bounds,
            type: "get",
            async: false,
            data: {
                mmsi: mmsi,
                btime: start,
                etime: end,
                containsFlyPt: _options.isFlyPoint,
                sogEventVac: _options.sogEventVac,
            },
            success: function (res) {
                if (res.code == 0) {
                    bounds = L.latLngBounds(
                        [res.datas.minLat / 1000000, res.datas.minLon / 1000000],
                        [res.datas.maxLat / 1000000, res.datas.maxLon / 1000000]
                    );
                } else {
                    bounds = that.map.getBounds();
                }
            },
            error: function () {
                bounds = that.map.getBounds();
            }
        });
        return bounds;
    },
    /**
     * 根据可视范围查询轨迹信息
     * @summary 15、查询轨迹数据
     * @memberof ShipxyAPI.TrackServiceImpl
     * @param mmsi {string} mmsi
     * @param start {number} 起始时间戳，秒
     * @param end {number} 结束时间戳，秒
     * @param options {object} 是相关配置信息
     * @returns {Array} 轨迹范围
     */
    requestTrackData: function (mmsi, start, end, ship, options) {
        let that = this;
        let trackDatas = [];
        let knTotal = 0;
        let bounds = that.getMapBounds();
        let zoom = that._map.getZoom();
        let _options = $.extend(true, {
            isFlyPoint: 0,
            sogEventVac: 2
        }, options);
        let requestData = {
            mmsi: mmsi,
            btime: start,
            etime: end,
            zoom: zoom,
            showExtent: bounds,
            containsFlyPt: _options.isFlyPoint,
            sogEventVac: _options.sogEventVac
        }
        return new Promise((resolve, reject) => {
            $.ajax({
                url: that._urls[that._urlGroup].data,
                type: "get",
                async: false,
                data: requestData,
                success: function (res) {
                    if (res.code == 0) {
                        if (res.datas.segs.length == 0) {
                            // console.log("船舶【"+requestData.mmsi+"】无轨迹");
                            reject("抱歉！,暂无轨迹信息！")
                        } else {
                            knTotal = res.datas.totalKn;
                            trackDatas = res.datas.segs.map(track => {
                                return track.map(point => {
                                    return {
                                        ...point,
                                        utc: point.utc,
                                        lat: point.lat / 1000000,
                                        lng: point.lon / 1000000,
                                        sog: (point.sog / 514).toFixed(2),
                                        sog2: (point.sog2 / 514).toFixed(2),
                                        cog: point.cog / 100,
                                        kn: point.kn / 100,
                                        isFlyPoint: point.isFlyPt == 1 ? "是" : "不是",
                                        time: CommUtils.dataFormat(point.utc * 1000),
                                        isStart: point.utc === res.datas.totalBeginUtc ? true : false,
                                        isEnd: point.utc === res.datas.totalEndUtc ? true : false,
                                        name: ship.cnname || ship.name || ship.mmsi
                                    }
                                });
                            });
                            let data = {
                                trackCoords: trackDatas,
                                knTotal: knTotal
                            }
                            resolve(data);
                        }
                    } else {
                        console.log("船舶【" + requestData.mmsi + "】轨迹查询失败")
                    }
                },
                error: function (err) {
                    reject("抱歉！服务器异常！")
                }
            });
        })
    },
    showTrackData: function () {
        let that = this;
        if (that._requestAndDrawTimeout) {
            clearTimeout(that._requestAndDrawTimeout);
        }
        return new Promise((res, rej) => {
            that._requestAndDrawTimeout = setTimeout(() => {
                //编辑轨迹集合，更新轨迹点位信息
                for (const key in that._tracks) {
                    let trackParams = that._tracks[key];
                    if (trackParams.show) {
                        that.requestTrackData(trackParams.mmsi, trackParams.start, trackParams.end, trackParams.ship, {
                            isFlyPoint: trackParams.isFlyPoint,
                            sogEventVac: trackParams.sogEventVac
                        }).then((data) => {
                            if (!that._tracks[key].coords) {
                                that._tracks[key].coords = data.trackCoords;
                            } else {
                                that._tracks[key].cacheCoords = data.trackCoords;
                            }
                            that._tracks[key].knTotal = data.knTotal;
                            if (that._tracks[key].coords.length > 0) {
                                that._tracks[key].symbol.showTrack(key, that._tracks[key]);
                                res(data);
                            } else {
                                rej(err)
                            }
                        }).catch((err) => {
                            if(err!=='轨迹已存在') {
                                delete that._tracks[key];
                            }
                            rej(err)
                        })
                    }
                }
                return that._tracks;
            }, 50);
        })
    },
    initTrack(mmsi, start, end, options) {
        let that = this;
        //将当前轨迹存入集合
        let key = "track" + "_" + mmsi + "_" + start + "_" + end + "_" + options.isFlyPoint;
        return new Promise((res, rej) => {
            if (that._tracks[key]) {
                rej('轨迹已存在')
                return;
            }
            that._tracks[key] = {
                show: true,
                mmsi: mmsi,
                start: start,
                end: end,
                isSlice: true,
                trackId: key,
                symbol: null,
                ...options
            };
            that._tracks[key].symbol = ShipxyAPI.trackSymbolSliceImpl(that._map, options);
            // 查询船舶静态数据(以来区域船服务)
            let ship = {};
            if (that._map.shipsService == null) {
                // 初始化区域船服务
                let ss = ShipxyAPI.ShipService(that._map, {
                    enableAreaShip: false, // 区域船
                    enableFleetShip: false, // 船队船
                });
            }
            if (that._map.shipsService != null) {
                // that._map.shipsService.setZIndex();
                ship = that._map.shipsService.getShipByMmsi(mmsi, true);
            }
            if (ship == null) {
                ship = {};
            }
            ship.mmsi = mmsi;
            that._tracks[key].ship = ship;
            that._tracks[key].name = ship.cnname || ship.name || ship.mmsi;
            if (options != null) {
                if (options.shipColor != null) {
                    ship.color = options.shipColor;
                }
                if (options.shipLineColor != null) {
                    ship.lineColor = options.shipLineColor;
                }
            }
            //获取轨迹边界范围
            let bounds = that.getTrackBounds(mmsi, start, end, that.options);
            if (bounds) {
                that._map.fitBounds(bounds);
            }
            //根据范围加载对应轨迹点
            that.showTrackData().then((datas) => {
                // if(!that._tracks[key].coords) {
                //     that._tracks[key].coords = datas.trackCoords;
                // } else {
                //     that._tracks[key].cacheCoords = datas.trackCoords;
                // }
                // that._tracks[key].knTotal = datas.knTotal;
                //展示轨迹
                res(datas)
            }).catch((err) => {
                rej(err);
            });
        })
    },
    //判断是否存在显示的轨迹
    hasTrackIsShow() {
        let that = this;
        let flag = false;
        for (key in that._tracks) {
            if (that._tracks[key].show) {
                flag = true;
                return flag;
            }
        }
        return flag;
    },
    //数组形式返回轨迹列表
    getTracksToArray() {
        let that = this;
        let trackList = [];
        for (var key in that._tracks) {
            trackList.push(that._tracks[key]);
        }
        return trackList;
    },
    //根据key删除轨迹
    removeTrackById(key) {
        let that = this;
        if (that._tracks[key].symbol) {
            that._tracks[key].symbol.removeTrackById(key);
            delete that._tracks[key];
        }
    },
    changeTrackByIdVisible(key) {
        let that = this;
        if (that._tracks[key].symbol) {
            let show = that._tracks[key].symbol.changeTrackByIdVisible(key);
            that._tracks[key].show = show;
        }

    },
    //移除所有轨迹
    removeAll() {
        let that = this;
        for (var key in that._tracks) {
            if (that._tracks[key].symbol) {
                that._tracks[key].symbol.clearTrack();
            }
        }
        that._tracks = {};
    },
    clearTimeLabel() {
        let that = this;
        for (var key in that._tracks) {
            if (that._tracks[key].symbol) {
                that._tracks[key].symbol.clearTimeLabel(key);
            }
        }
    },
    /**
     * 设置层级
     * @summary 3、设置层级
     * @memberof ShipxyAPI.TrackSymbolImpl
     * @param zindex
     */
    setZIndex: function (zindex) {
        let that = this;
        if (that._map.canvas_track == null || that._map.canvas_track._container == null) {
            console.error("canvas_track is null");
            return;
        }
        that._map.canvas_track._container.style["z-index"] = zindex;
    },
    getMapBounds: function () {
        let that = this;
        let mapBounds = that._map.getBounds();
        let bounds = [mapBounds.getWest(), mapBounds.getEast(), mapBounds.getSouth(), mapBounds.getNorth()];
        return bounds.map(item => {
            return parseInt(item * 1000000)
        }).join();
    },
});
//实例化
ShipxyAPI.trackServiceSliceImpl = function (map, options) {
    return new ShipxyAPI.TrackServiceSliceImpl(map, options);
};