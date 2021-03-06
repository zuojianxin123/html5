/*
 * Created by LemonHall on 2015/4/
 */
var util            = require('util');
var model           = require(process.cwd() + "/libs/model.js");

var chk_login       = require(process.cwd() + "/libs/check_login_middle.js");

var cinemaInfoData  = require(process.cwd() + "/route/wecinema/util/cinemaInfoData.js");

// var returnErrorPage = model.returnErrorPage;

var os       = require('os');
var pid      = process.pid;
var hostname = os.hostname();
var my_name  = hostname + ':' + pid;
var viewColor;


// 首页
app.get(['/', '/index.html'], function (req, res) {
    var render_data = {};
    var my_api_addr = "/queryAdvertisements.aspx";
    var options = {
        uri: my_api_addr,
        args: {
            type: '1,2,3'
        }
    };
    render_data.data = {};
    render_data.data = {
        reversion: global.reversion,
        staticBase: global.staticBase,
        firstAds: [],
        secondAds: [],
        thirdAds: []
    }
    model.getDataFromPhp(options, function (err, data) {
        // console.log(data.advertisements);
        render_data.data.err = err;
        if (!err && data) {
            var ads = data.advertisements;
            var _len = ads.length;
            for(var i = 0; i < _len; i++){
                if(ads[i].advertisementType == 1){
                    render_data.data.firstAds.push(ads[i]);
                }else if(ads[i].advertisementType == 2){
                    render_data.data.secondAds.push(ads[i]);

                }else{
                    render_data.data.thirdAds.push(ads[i]);
                }
            }
            render_data.data.baseData = data;
        }
        res.render("wecinema/index", render_data);
    });
});

// 头条电影列表
app.get(['/hotmovienews/:pageindex'], function (req, res) {
    var render_data = {};
    var my_api_addr = "/queryTopLineMovieNews.aspx";
    var _pageIndex = req.params["pageindex"];
    var options = {
        uri: my_api_addr,
        args: {
            type: '-1',
            pageIndex: _pageIndex,
            pageSize: 5
        }
    };
    render_data.data = {};
    model.getDataFromPhp(options, function (err, data) {
        // console.log(data);
        render_data.data.err = err;
        if (!err && data) {
            if(data.movieNews.length == 0){
                res.send('');
            }else{
                render_data.data.movieNews = data.movieNews;
                res.render("wecinema/indexmovienews", render_data);
            }
            
        }else{
            res.send('');
        }
    });
});


