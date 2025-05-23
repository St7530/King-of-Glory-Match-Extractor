var intervalUpdateData = void 0;
var firstInscription1 = null;
var firstInscription2 = null;
var firstMatchId = null;
var firstBattleId = null;
var firstPositionId = 0;
var showHeroId1 = 0;
var showHeroId2 = 0;
var today = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
var nowTime = new Date().getTime();
var Choose = {
    params: {
        league_id: '',
        match_id: '',
    },
    matchCalendarList: [],
    matchCalendarsSort: [],

}




//毫秒转为分秒
function formatDuring(mss) {
    var hours = parseInt(mss % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    var minutes = parseInt(mss % (1000 * 60 * 60) / (1000 * 60));
    var seconds = mss % (1000 * 60) / 1000;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    seconds = Math.ceil(seconds);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (!Public.isEmpty(hours)) {
        if (hours < 10) {
            hours = "0" + hours;
        }
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
}

//获取赛事信息
function getLeagues() {
    League.getLeagueList(function () {
        if (Public.isEmpty(League.leagueList)) {
            Public.consoleLog("获取赛事失败");
            Public.consoleLog(League);
            return false;
        }
        var newLeague = null
        for (var league_id in League.leagueList){
            if(League.leagueList[league_id].info.status == 1){
                newLeague = League.leagueList[league_id]
                break
            }
        }
        if(Public.isEmpty(newLeague)){
            newLeague = League.leagueList.slice(-1)[0];
        }
        var reqLeagueId = Public.getQueryParams("league_id");
        Public.consoleLog("reqLeagueId", reqLeagueId);
        var reqMatchId = Public.getQueryParams("match_id");
        Public.consoleLog("reqMatchId", reqMatchId);
        if (Public.isEmpty(reqLeagueId)) {
            reqLeagueId = newLeague.info.league_id;
        }
        Choose.params.league_id = reqLeagueId
        getMatchList(reqLeagueId, reqMatchId);
    }, function (err) {
        Public.consoleLog('getLeagueList fail');
        Public.consoleLog(err);
    });
}

function showMatchList() {
    var flag = true;
    var locationFlag = true;
    var appointStartTime = null;
    var appointEndTime = null;
    // var forIndex = 0;
    $('.left.content-left .team-left-list').text('')
    for (var calendarsSortKey = 0; calendarsSortKey < Choose.matchCalendarsSort.length; calendarsSortKey++) {
        var matchCalendarListKey = Choose.matchCalendarsSort[calendarsSortKey];
        if (Public.isEmpty(Choose.matchCalendarList[matchCalendarListKey])) {
            continue;
        }
        if (flag && !Public.isEmpty(Choose.params.match_calendar) && Choose.params.match_calendar.replace(/-/g,'') != matchCalendarListKey) {
            continue;
        }
        flag = false;

        var matchCalendarList = Choose.matchCalendarList[matchCalendarListKey];
        var html = '';
        var htmlHeader = true;
        for (var calendarListKey in matchCalendarList) {
            try {
                var matchData = League.leagueList[matchCalendarList[calendarListKey].league_id].match_list[matchCalendarList[calendarListKey].match_id];
                if (!Public.isEmpty(Choose.params.team_id) && (Choose.params.team_id != matchData.camp1.team_id) && (Choose.params.team_id != matchData.camp2.team_id)) {
                    continue;
                }
                if (htmlHeader) {
                    htmlHeader = false;
                    var year = matchData.start_time.substr(0, 4);
                    var mon = matchData.start_time.substr(5, 2);
                    var date = matchData.start_time.substr(8, 2);
                    var day = new Date(Date.parse(year + "/" + mon + "/" + date));
                    var dayStart = new Date(Date.parse(year + "/" + mon + "/" + date + " 00:00:00"));
                    var dayEnd = new Date(Date.parse(year + "/" + mon + "/" + date + " 23:59:59"));
                    var week = today[day.getDay()];
                    var locationClass = "";
                    appointStartTime = dayStart.getTime();
                    appointEndTime = dayEnd.getTime();
                    if (nowTime <= appointEndTime) {
                        if (locationFlag) {// && forIndex != 0
                            locationClass = "fixed-position";
                        }
                        locationFlag = false;
                    }
                    html = '<li class="' + locationClass + '"><div class="tl-title"><span class="s1">' + mon + '.' + date + '</span> <span class="s2">'+week+'</span></div>\n';
                }
                var divClass = ''
                if(Choose.params.match_id == matchData.match_id){
                    divClass = 'active'
                }
                html += '<div class="li-item '+divClass+'" onclick="selectLeftLi(\''+Choose.params.league_id+'\',\''+matchData.match_id+'\')">\n' +
                        '<div class="litem-c litem-up">' +
                        '<img src="'+matchData.camp1.team_icon+'" alt="' + matchData.camp1.team_abbreviation + '"> ' +
                        '<span class="li-tname">' + matchData.camp1.team_name + '</span> ';
                if(matchData.status == 2){
                    html += '<span class="li-tcount '+(matchData.camp1.score > matchData.camp2.score?'success':'')+'">'+matchData.camp1.score+'</span>';
                }else{
                    html += '<span class="li-tcount"></span>';
                }
                html += '</div>\n' +
                        '<div class="litem-c litem-dowm">' +
                        '<img src="'+matchData.camp2.team_icon+'" alt="' + matchData.camp2.team_abbreviation + '"> ' +
                        '<span class="li-tname">' + matchData.camp2.team_name + '</span> ';
                if(matchData.status == 2){
                    html += '<span class="li-tcount '+(matchData.camp2.score > matchData.camp1.score?'success':'')+'">'+matchData.camp2.score+'</span>';
                }else{
                    html += '<span class="li-tcount"></span>';
                }
                html += '</div>\n';
                if(matchData.status == 1){
                    html += '<div class="underway"> 进行中</div>\n';
                }else if(matchData.status == 0){
                    html += '<div class="underway"> ' + matchData.start_time.substr(11, 5) + '</div>\n';
                }
                html += '</div>\n';
            } catch (e) {
                Public.consoleLog("catch e", e);
            }
        }
        html += "</li>";
        if (!Public.isEmpty(html)) {
            $('.left.content-left .team-left-list').append(html)
        }
    }
    if (locationFlag && nowTime >= appointEndTime) {
        $('.left.content-left ul.team-left-list  li').eq($('.left.content-left ul.team-left-list li').length - 2).addClass("fixed-position");
    }
    if (Public.isEmpty(Choose.params.match_calendar) && Public.isEmpty(Choose.params.team_id) && $('.fixed-position').length > 0) {
        // $('.left.content-left .team-left-list').scrollTop($('.fixed-position').offset().top-($(window).height()/2));
        $('.left.content-left .team-left-list').scrollTop($('.li-item.active').offset().top-($(window).height()/2));
    }
}

//获取赛程列表
function getMatchList(leagueId, matchId) {
    League.getMatchList(leagueId, Public.getQueryParams('os') !== '', function () {
        Public.consoleLog('matchId', matchId);
        var nowMatch = {};
        if (Public.isEmpty(matchId)) {
            //查找最近已结束的比赛或者正在进行中的比赛
            for (var i in League.leagueList[leagueId].match_list){
                var status = League.leagueList[leagueId].match_list[i].status;
                if(status == 1 || status == 2){
                    nowMatch = League.leagueList[leagueId].match_list[i]
                }
            }
        } else {
            nowMatch = League.leagueList[leagueId].match_list[matchId];
        }
        $('.team-left-title').text(League.leagueList[leagueId].info.league_name+"对战表");
        $('.middle .middle-top .mdl-title').text(League.leagueList[leagueId].info.league_name);
        $('.live-box .live-content .live-title>span').text(League.leagueList[leagueId].info.league_name);

        document.title = League.leagueList[leagueId].info.league_name;
        if (Public.isEmpty(nowMatch)) {
           Public.sendNotice('alert',{content: '链接地址错误，请从正确途径重新进入'})
            return;
        }
        Choose.params.match_id = nowMatch.match_id

        Choose.matchCalendarList = $.extend(true, [], League.matchCalendarList);
        Choose.matchCalendarsSort = $.extend(true, [], League.matchCalendarsSort);
        showMatchList();

        if (window.addEventListener){
            listenWidth();
            setTimeout(function () {
                listenWidth();
            }, 300);
            document.addEventListener('DOMContentLoaded', listenWidth, false);
            window.addEventListener('resize', listenWidth, false);
            window.addEventListener('load', listenWidth, false);
        }

        $('.menu li a').each(function (key){
            var url = $(this).attr('data-url')
            $(this).attr('href',url+"?league_id="+Choose.params.league_id+(Public.getQueryParams('os') == "1" ? "&os=1" : ""))
        })

        var url = URL_MOBILE + '?league_id='+Choose.params.league_id+'&match_id='+Choose.params.match_id
        $('#qrcode').qrcode({width: 100,height: 100,text: url});

        //显示bo数
        $(".middle .middle-top .mdc-time").text('BO' + nowMatch.bo + " " + nowMatch.start_time.substring(5, 16));

        //显示蓝营的战队ICON/分数/名字
        $(".middle-top .md-top-left .mdl-img").attr('src', nowMatch.camp1.team_icon);
        $(".middle-top .md-top-left .mdl-name").text(nowMatch.camp1.team_name);
        $(".mdl-count-box .n").eq(0).find('span').text(nowMatch.camp1.score);
        //显示红营的战队ICON/分数/名字
        $(".middle-top .md-top-right .mdl-img").attr('src', nowMatch.camp2.team_icon);
        $(".middle-top .md-top-right .mdl-name").text(nowMatch.camp2.team_name);
        $(".mdl-count-box .n").eq(1).find('span').text(nowMatch.camp2.score);

        $('.team-right-list').text("");
        var status = null;
        if (nowMatch.status == 0) {
            status = '未开始';
        } else if (nowMatch.status == 1) {
            status = '进行中';
            $('.team-right-list').append("<li class=\"null-dom\">\n" +
                                        "<div class=\"imgbox\">\n" +
                                        "<img src=\"https://game.gtimg.cn/images/yxzj/matchdata/null.png\" alt=\"暂无数据\">\n" +
                                        "</div>\n" +
                                        "<span class=\"null-text\"> 回放视频生成中</span>\n" +
                                        "</li>")
        } else if (nowMatch.status == 2) {
            status = '已结束';
            if(parseInt(nowMatch.camp1.score) > parseInt(nowMatch.camp2.score)){
                $(".mdl-count-box .n").eq(0).addClass('active')
            }else{
                $(".mdl-count-box .n").eq(1).addClass('active')
            }
            if(!Public.isEmpty(nowMatch.match_battle_video_list)){
                showBattleVideoList(nowMatch.match_battle_video_list)
            }else{
                $('.team-right-list').append("<li class=\"null-dom\">\n" +
                    "<div class=\"imgbox\">\n" +
                    "<img src=\"https://game.gtimg.cn/images/yxzj/matchdata/null.png\" alt=\"暂无数据\">\n" +
                    "</div>\n" +
                    "<span class=\"null-text\"> 回放视频生成中</span>\n" +
                    "</li>")
            }
        } else if (nowMatch.status == 3) {
            status = '已取消';
        }
        $("#every-game-list").text('');
        $('.middle-top .status-btn').text(status);
        if (nowMatch.status == 0) {
            $('.middle-center .null-data.null-dom').show();
            $('.middle-center .data-update.null-dom').hide();
            $('.middle-center .main-context').hide();
            $("#every-game-list").append('<li class="active">第一局</li>');
            return;
        } else {
            $('.middle-center .data-update.null-dom').hide();
            $('.middle-center .null-data.null-dom').hide();
            $('.middle-center .main-context').show()
        }

        getMatchBattleInfo(leagueId, nowMatch.match_id);
    }, function (err) {
        Public.consoleLog('getMatchList fail');
        Public.consoleLog(err);
    });
}


//播放赛事
function playVideo(vid, type) {
    if (Public.isEmpty(vid)) {
        return;
    }
    var video = new tvp.VideoInfo();
    video.setVid(vid);
    var player = new tvp.Player();
    var obj = {};
    // let playerFlag = true
    if (type == 1) {
        obj = {
            width: '100%',
            height: '100%',
            type: 1,
            video: video,
            modId: "mod_player", //mod_player 是刚刚在页面添加的 div 容器
            // isHtml5UseUI:true,
            isVodFlashShowSearchBar: 0,
            isVodFlashShowEnd: 0,
            autoplay: false,
            onplay: function onplay() {}
        };
    } else {
        obj = {
            width: '100%',
            height: '100%',
            video: video,
            modId: "mod_player", //mod_player 是刚刚在页面添加的 div 容器
            // isHtml5UseUI:true,
            isVodFlashShowSearchBar: 0,
            isVodFlashShowEnd: 0,
            autoplay: false,
            onplay: function onplay() {}
        };
    }
    player.create(obj);
    var videoSnap = video.getVideoSnap();
    if (!Public.isEmpty(videoSnap) && !Public.isEmpty(videoSnap[videoSnap.length - 1])) {
        $('.video #video-snap').attr('src', videoSnap[videoSnap.length - 1].replace('http://','https://'));
    }
    Public.consoleLog('videoSnap:', videoSnap);
    $('.video').unbind("click");
    $('.video').click(function () {
        player.play();
        setTimeout(function () {
            $('#mod_player').show();
            $('.video').hide();
        }, 1000);
    });
}

function showBattleVideoList(list){
    var html = ''
    var seqList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    $('.live-box .btnbox').text('')
    var videoFlag = true
    for (var key in list){
        var videoObj = list[key]
        if(Public.isEmpty(videoObj) || Public.isEmpty(videoObj.video_list[0]) || Public.isEmpty(videoObj.video_list[0].video_id))
            continue
        if(videoFlag){
            videoFlag = false
        }

        html = '<li class="tright-item" onclick="showVideo(\''+key+'\',\''+videoObj.video_list[0].video_id+'\',\''+videoObj.video_list[0].video_url+'\')">\n' +
            '   <div class="imgbox"><img src="https://puui.qpic.cn/vpic_cover/'+videoObj.video_list[0].video_id+'/'+videoObj.video_list[0].video_id+'_hz.jpg/496" alt="赛季图片">\n' +
            '   <span class="tright-icon"> </span></div>\n' +
            '   <p class="tright-text">第'+seqList[parseInt(videoObj.battle_seq) - 1]+'局</p>\n' +
            '</li>';
        $('.team-right-list').append(html)
        if(key == 0){
            html = '<a href="javascript:void(0);" onclick="selectvideo(this,\''+videoObj.video_list[0].video_id+'\',\''+videoObj.video_list[0].video_url+'\')" class="btn live-btn">第'+seqList[parseInt(videoObj.battle_seq) - 1]+'局</a>'
        }else{
            html = '<a href="javascript:void(0);" onclick="selectvideo(this,\''+videoObj.video_list[0].video_id+'\',\''+videoObj.video_list[0].video_url+'\')" class="btn">第'+seqList[parseInt(videoObj.battle_seq) - 1]+'局</a>'
        }
        $('.live-box .btnbox').append(html)
    }
    if(videoFlag){
        $('.team-right-list').append("<li class=\"null-dom\">\n" +
            "<div class=\"imgbox\">\n" +
            "<img src=\"https://game.gtimg.cn/images/yxzj/matchdata/null.png\" alt=\"暂无数据\">\n" +
            "</div>\n" +
            "<span class=\"null-text\"> 回放视频生成中</span>\n" +
            "</li>")
    }
}

//获取赛程对局信息
function getMatchBattleInfo(leagueId, matchId) {
    if (!Public.isEmpty(leagueId) && !Public.isEmpty(matchId)) {
        League.getMatchBattleList(leagueId, matchId, Public.getQueryParams('os') !== '', function () {
            $("#every-game-list").text('');
            if (Public.isEmpty(League.matchList[matchId])) {

                $('.middle-center .null-data.null-dom').show();
                $('.middle-center .main-context').hide();
                $("#every-game-list").append('<li class="active">第一局</li>');
                Public.sendNotice('alert', {content:'页面错误，请从正确途径重新进入'});
                return;
            }
            var battleId = 0;
            for (var i in League.matchList[matchId].battleSimple) {
                if (battleId == 0) {
                    battleId = League.matchList[matchId].battleSimple[i].battle_id;
                }
                if (League.matchList[matchId].battleSimple[i].status == 1) {
                    //0:未开始 1:进行中 2:已结束 3:已取消
                    battleId = League.matchList[matchId].battleSimple[i].battle_id;
                    break;
                }
            }

            var li = void 0;
            for (var _i5 in League.matchList[matchId].battleSimple) {
                var battle = League.matchList[matchId].battleSimple[_i5];
                var seqList = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
                if (battleId == battle.battle_id) {
                    li = '<li match-id="' + matchId + '" battle-id="' + battle.battle_id + '"  class="active" onclick="switchBoard(this)">第' + seqList[parseInt(battle.battle_seq) - 1] + '局</li>';
                } else {
                    li = '<li match-id="' + matchId + '" battle-id="' + battle.battle_id + '" onclick="switchBoard(this)">第' + seqList[parseInt(battle.battle_seq) - 1] + '局</li>';
                }
                $("#every-game-list").append(li);
            }
            // everyGameListScroll();

            $('#every-game-list li').each(function () {
                var page = $(this);
                var matchId = $(this).attr('match-id');
                var battleId = $(this).attr('battle-id');
                var battleText = $(this).text();
                $(this).click(function () {
                    $('#every-game-list li.active').removeClass('active');
                    page.addClass('active');
                    endUpdateData();
                    showHeroId1 = 0;
                    showHeroId2 = 0
                    firstInscription1 = null;
                    firstInscription2 = null;
                    firstMatchId = null;
                    firstBattleId = null;
                    firstPositionId = 0;
                    getBattleInfo(matchId, battleId);
                    startUpdateData(matchId, battleId);
                });
            });
            endUpdateData();
            showHeroId1 = 0;
            showHeroId2 = 0;
            firstInscription1 = null;
            firstInscription2 = null;
            firstMatchId = null;
            firstBattleId = null;
            firstPositionId = 0;
            getBattleInfo(matchId, battleId);
            startUpdateData(matchId, battleId);
        }, function (err) {
            Public.consoleLog('getMatchBattleList fail');
            Public.consoleLog(err);
        });
    }
}

function battleDataShow(matchId, battleId) {
    if (Public.isEmpty(matchId) || Public.isEmpty(battleId)) {
        Public.consoleLog('matchId or battleId is empty');
        Public.consoleLog("matchId:", matchId);
        Public.consoleLog("battleId:", battleId);
        return false;
    }
    if (Public.isEmpty(League.matchList[matchId].battleDetail[battleId])) {
        Public.consoleLog('battleDetail is empty');
        Public.consoleLog("matchId:", matchId);
        Public.consoleLog("battleId:", battleId);
        Public.consoleLog(League);
        return false;
    }
    var battleDetail = League.matchList[matchId].battleDetail[battleId];

    if (battleDetail.status == 0 || battleDetail.status == 3) {
        $('.middle-center .null-data.null-dom').show();
        $('.middle-center .main-context').hide();
        return;
    }
    // 在这里，数据渲染前隐藏，否则某次点开查看赛事详情接口异常，展示提示文案[数据正在更新中]，便无法隐藏了
    $('.middle-center .data-update.null-dom').hide();

    var battleDuration = formatDuring(battleDetail.game_duration);
    $('.gradual-center .center1').text(battleDuration);

    if (battleDetail.win_camp == 1) {
        //蓝营胜利
        $('.gradual .gradual-left .reslute-img').show();
        $('.gradual .gradual-right .reslute-img').hide();
    } else if (battleDetail.win_camp == 2) {
        //红营胜利
        $('.gradual .gradual-left .reslute-img').hide();
        $('.gradual .gradual-right .reslute-img').show();
    } else {
        $('.gradual .gradual-left .reslute-img').hide();
        $('.gradual .gradual-right .reslute-img').hide();
    }

    // var source = Public.getQueryParams('source')
    // var hidePlayBack = null
    // if(Public.envIsZS()){
    //     hidePlayBack = Public.getQueryParams('hidePlayBack')
    // }
    // if (source !== SOURCE_BLBL &&
    //     source !== SOURCE_HUYA &&
    //     source !== SOURCE_WXLN &&
    //     source !== SOURCE_KS &&
    //     hidePlayBack != 1 &&
    //     !Public.isEmpty(battleDetail.video_list)) {
    //     var video = battleDetail.video_list[0];
    //     playVideo(video.video_id, battleDetail.status == 1 ? 1 : "");
    //     $('.container > .video').show();
    // }

    $(".gradual .gradual-left .team-img img").attr('src', battleDetail.camp1.team_icon);
    $('#tb-box2.inscriptions-box .insc-left').eq(0).find(".img-text img.insc-name").attr('src', battleDetail.camp1.team_icon);
    if (Public.isEmpty(battleDetail.camp1.team_abbreviation)) {
        $(".gradual .gradual-left .team-name").text(battleDetail.camp1.team_name);
    } else {
        $(".gradual .gradual-left .team-name").text(battleDetail.camp1.team_abbreviation);
    }
    $('#tb-box2.inscriptions-box .insc-left').eq(0).find(".img-text span.insc-name").text(battleDetail.camp1.team_name);
    $(".gradual .gradual-left .reslute-count").text(battleDetail.camp1.kill_num);

    $(".gradual .gradual-right .team-img img").attr('src', battleDetail.camp2.team_icon);
    $('#tb-box2.inscriptions-box .insc-left').eq(1).find(".img-text img.insc-name").attr('src', battleDetail.camp2.team_icon);
    if (Public.isEmpty(battleDetail.camp2.team_abbreviation)) {
        $(".gradual .gradual-right .team-name").text(battleDetail.camp2.team_name);
    } else {
        $(".gradual .gradual-right .team-name").text(battleDetail.camp2.team_abbreviation);
    }
    $('#tb-box2.inscriptions-box .insc-left').eq(1).find(".img-text span.insc-name").text(battleDetail.camp2.team_name);
    $(".gradual .gradual-right .reslute-count").text(battleDetail.camp2.kill_num);

    var camp1BanbpList = battleDetail.camp1.banbp_list;
    var camp1bpList = battleDetail.camp1.bp_list;
    var camp2BanbpList = battleDetail.camp2.banbp_list;
    var camp2bpList = battleDetail.camp2.bp_list;
    var battleSeq = battleDetail.battle_seq;
    if (!Public.isEmpty(camp1BanbpList) && !Public.isEmpty(camp2BanbpList)) {
        //显示禁用英雄
        let classVName = '.banbp4';
        let banbpListLength = 4;
        if(camp1BanbpList.length >= 5 && camp2BanbpList.length >= 5) {
            $('.gradual .gradual-left .gl2'+classVName).hide();
            $('.gradual .gradual-right .gl2'+classVName).hide();
            classVName = '.banbp5';
            banbpListLength = 5;
            $('.gradual .gradual-left .gl2'+classVName).show();
            $('.gradual .gradual-right .gl2'+classVName).show();
        }
        for (var i in camp1BanbpList) {
            if (Public.isEmpty(camp1BanbpList[i].hero_icon)) {
                $('.gradual .gradual-left .gl2'+classVName+' .gl2-img').eq(parseInt(i)).find('img').hide();
                $('.gradual .gradual-left .gl2'+classVName+' .gl2-img').eq(parseInt(i)).find('i').hide();
                continue;
            }
            $('.gradual .gradual-left .gl2'+classVName+' .gl2-img').eq(parseInt(i)).find('img').attr({ "src": camp1BanbpList[i].hero_icon, "alt": camp1BanbpList[i].hero_name }).show();
            $('.gradual .gradual-left .gl2'+classVName+' .gl2-img').eq(parseInt(i)).find('i').show();
        }
        if (camp1BanbpList.length < banbpListLength) {
            for (var key = camp1BanbpList.length; key < banbpListLength; key++) {
                $('.gradual .gradual-left .gl2'+classVName+' .gl2-img').eq(parseInt(key)).find('img').hide();
                $('.gradual .gradual-left .gl2'+classVName+' .gl2-img').eq(parseInt(key)).find('i').hide();
            }
        }

        for (var _i in camp2BanbpList) {
            if (Public.isEmpty(camp2BanbpList[_i].hero_icon)) {
                $('.gradual .gradual-right .gl2'+classVName+' .gl2-img').eq(3-parseInt(_i)).find('img').hide();
                $('.gradual .gradual-right .gl2'+classVName+' .gl2-img').eq(3-parseInt(_i)).find('i').hide();
                continue;
            }
            $('.gradual .gradual-right .gl2'+classVName+' .gl2-img').eq(3-parseInt(_i)).find('img').attr({ "src": camp2BanbpList[_i].hero_icon, "alt": camp2BanbpList[_i].hero_name }).show();
            $('.gradual .gradual-right .gl2'+classVName+' .gl2-img').eq(3-parseInt(_i)).find('i').show();
        }
        if (camp2BanbpList.length < banbpListLength) {
            for (var _key = camp2BanbpList.length; _key < banbpListLength; _key++) {
                $('.gradual .gradual-right .gl2'+classVName+' .gl2-img').eq(3-parseInt(_key)).find('img').hide();
                $('.gradual .gradual-right .gl2'+classVName+' .gl2-img').eq(3-parseInt(_key)).find('i').hide();
            }
        }
    }
    var notBpData = false;
    //显示选择英雄

    var camp1InscriptionKey = 0,
        camp2InscriptionKey = 0;
    for (var _i2 in camp1bpList) {
        var showPosition = null;
        if (Public.isEmpty(camp1bpList[_i2].hero_id)) {
            notBpData = true;
            if (Public.isEmpty(firstInscription1)) {
                firstInscription1 = camp1bpList[_i2].hero_detail.hero_id;
                $('.inscriptions-box .insc-left.pr20 span.tb-btn').attr('hero-id',firstInscription1)
                $('.inscriptions-box .insc-left.pr20 span.tb-btn').attr('battle-id',battleId)
                $('.inscriptions-box .insc-left.pr20 span.tb-btn').attr('camp-id',1)
            }
            showPosition = camp1InscriptionKey;
        } else {
            if (Public.isEmpty(firstInscription1) && camp1bpList[_i2].position == 0) {
                firstInscription1 = camp1bpList[_i2].hero_id;
                $('.inscriptions-box .insc-left.pr20 span.tb-btn').attr('hero-id',firstInscription1)
                $('.inscriptions-box .insc-left.pr20 span.tb-btn').attr('battle-id',battleId)
                $('.inscriptions-box .insc-left.pr20 span.tb-btn').attr('camp-id',1)
            }
            showPosition = camp1bpList[_i2].position;
            $('.gradual .gradual-left .gl3 .gl3-img').eq(showPosition).find('img').attr({ "src": camp1bpList[_i2].hero_detail.hero_icon, "alt": camp1bpList[_i2].hero_detail.hero_name });
        }
        $('#tb-box2 .insc-left').eq(0).find('.hero-imgbox .himg').eq(showPosition).removeClass('active');
        $('#tb-box2 .insc-left').eq(0).find('.hero-imgbox .himg').eq(showPosition).attr({ "hreo-id": camp1bpList[_i2].hero_detail.hero_id, "match-id": matchId, "battle-id": battleId });
        $('#tb-box2 .insc-left').eq(0).find('.hero-imgbox .himg').eq(showPosition).find('img').attr({ "src": camp1bpList[_i2].hero_detail.hero_icon, "alt": camp1bpList[_i2].hero_detail.hero_name });
        camp1InscriptionKey++;
    }
    for (var _i3 in camp2bpList) {
        var _showPosition = null;
        if (Public.isEmpty(camp2bpList[_i3].hero_id)) {
            notBpData = true;
            if (Public.isEmpty(firstInscription2)) {
                firstInscription2 = camp2bpList[_i3].hero_detail.hero_id;
                $('.inscriptions-box .insc-right.pl20 span.tb-btn').attr('hero-id',firstInscription2)
                $('.inscriptions-box .insc-right.pl20 span.tb-btn').attr('battle-id',battleId)
                $('.inscriptions-box .insc-right.pl20 span.tb-btn').attr('camp-id',2)
            }
            _showPosition = camp2InscriptionKey;
        } else {
            if (Public.isEmpty(firstInscription2) && camp2bpList[_i3].position == 0) {
                firstInscription2 = camp2bpList[_i3].hero_id;
                $('.inscriptions-box .insc-right.pl20 span.tb-btn').attr('hero-id',firstInscription2)
                $('.inscriptions-box .insc-right.pl20 span.tb-btn').attr('battle-id',battleId)
                $('.inscriptions-box .insc-right.pl20 span.tb-btn').attr('camp-id',2)
            }
            _showPosition = camp2bpList[_i3].position;
            $('.gradual .gradual-right .gl3 .gl3-img').eq(_showPosition).find('img').attr({ "src": camp2bpList[_i3].hero_detail.hero_icon, "alt": camp2bpList[_i3].hero_detail.hero_name });
        }
        $('#tb-box2 .insc-left').eq(1).find('.hero-imgbox .himg').eq(_showPosition).removeClass('active');
        $('#tb-box2 .insc-left').eq(1).find('.hero-imgbox .himg').eq(_showPosition).attr({ "hreo-id": camp2bpList[_i3].hero_detail.hero_id, "match-id": matchId, "battle-id": battleId });
        $('#tb-box2 .insc-left').eq(1).find('.hero-imgbox .himg').eq(_showPosition).find('img').attr({ "src": camp2bpList[_i3].hero_detail.hero_icon, "alt": camp2bpList[_i3].hero_detail.hero_name });
        camp2InscriptionKey++;
    }
    var battleLength = 7;
    try {
      battleLength = League.leagueList[Public.getQueryParams("league_id")].match_list[matchId].bo;
    } catch(e) {
      console.error(e);
    }
    if (notBpData) {
        $('.middle-center .main-context').find('.gradual.clearfix').eq(1).find('.null-tisp').show()
        $('.middle-center .main-context').find('.gradual.clearfix').eq(0).hide()
        $('.middle-center .main-context').find('.gradual.clearfix').eq(1).show()
    }else {
        $('.middle-center .main-context').find('.gradual.clearfix').eq(0).show()
        $('.middle-center .main-context').find('.gradual.clearfix').eq(1).hide()
    }

    $('.gradual .gradual-left .gl4 .gl4-icon1').text(battleDetail.camp1.push_tower_num);
    $('.gradual .gradual-left .gl4 .gl4-icon2').text(parseInt(battleDetail.camp1.kill_dark_tyrant_num) + parseInt(battleDetail.camp1.kill_tyrant_num));
    $('.gradual .gradual-left .gl4 .gl4-icon3').text(parseInt(battleDetail.camp1.kill_prophet_dragon_num) + parseInt(battleDetail.camp1.kill_shadow_dragon_num));
    $('.gradual .gradual-left .gl4 .gl4-icon4').text(battleDetail.camp1.kill_storm_dragon_king_num);

    $('.gradual .gradual-right .gl4 .gl4-icon1').text(battleDetail.camp2.push_tower_num);
    $('.gradual .gradual-right .gl4 .gl4-icon2').text(parseInt(battleDetail.camp2.kill_dark_tyrant_num) + parseInt(battleDetail.camp2.kill_tyrant_num));
    $('.gradual .gradual-right .gl4 .gl4-icon3').text(parseInt(battleDetail.camp2.kill_prophet_dragon_num) + parseInt(battleDetail.camp2.kill_shadow_dragon_num));
    $('.gradual .gradual-right .gl4 .gl4-icon4').text(battleDetail.camp2.kill_storm_dragon_king_num);

    $('.gradual .gradual-left .gl5').text(battleDetail.camp1.gold);
    $('.gradual .gradual-right .gl5').text(battleDetail.camp2.gold);
    var totalGold = battleDetail.camp1.gold + battleDetail.camp2.gold;
    var camp1GoldScale = battleDetail.camp1.gold / totalGold;
    var camp2GoldScale = battleDetail.camp2.gold / totalGold;
    camp1GoldScale = camp1GoldScale.toFixed(2) * 100;
    camp2GoldScale = camp2GoldScale.toFixed(2) * 100;
    $('.solid .solid_left').css('width', camp1GoldScale + '%');
    $('.solid .solid_right').css('width', camp2GoldScale + '%');

    for (var _i4 = 0; _i4 < 5; _i4++) {
        var camp1Bp = battleDetail.camp1.bp_list[parseInt(battleDetail.camp1.player_position[_i4].hero_id)];
        var camp2Bp = battleDetail.camp2.bp_list[parseInt(battleDetail.camp2.player_position[_i4].hero_id)];

        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-rbox .zb-text .zs.zs1').text(camp1Bp.hero_detail.player_name);
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-rbox .zb-text .zs.zs2').text(camp1Bp.hero_detail.kill_num + '/' + camp1Bp.hero_detail.death_num + '/' + camp1Bp.hero_detail.assist_num);
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-rbox .zb-text .zs.zs3').text(camp1Bp.hero_detail.gold);
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-img > img').eq(0).attr('src', camp1Bp.hero_detail.hero_icon);
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-img .c-icon > img').attr('src', camp1Bp.hero_detail.SummonerAbilityInfo.summoner_ability_icon);


        if (false && (camp1Bp.hero_detail.is_mvp == 1 || camp1Bp.hero_detail.is_lose_mvp == 1)) {
            // $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-img  > img.mvp_left').show()
        }else{
            $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-img  > img.mvp_left').hide()
        }


        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-rbox .zb-text .zs.zs1').text(camp2Bp.hero_detail.player_name);
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-rbox .zb-text .zs.zs2').text(camp2Bp.hero_detail.kill_num + '/' + camp2Bp.hero_detail.death_num + '/' + camp2Bp.hero_detail.assist_num);
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-rbox .zb-text .zs.zs3').text(camp2Bp.hero_detail.gold);
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-img > img').eq(0).attr('src', camp2Bp.hero_detail.hero_icon);
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-img .c-icon > img').attr('src', camp2Bp.hero_detail.SummonerAbilityInfo.summoner_ability_icon);

        if (false && (camp2Bp.hero_detail.is_mvp == 1 || camp2Bp.hero_detail.is_lose_mvp == 1)) {
            // $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-img > img.mvp_right').show()
        }else{
            $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-img > img.mvp_right').hide()
        }


        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-rbox .zb-img').text("");
        $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-rbox .zb-img').text("");
        if (!Public.isEmpty(camp1Bp.hero_detail.BriefEquipList)) {
            var briefEquipList = camp1Bp.hero_detail.BriefEquipList;
            for (var bekey in briefEquipList) {
                $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-rbox .zb-img').append('<img src="' + briefEquipList[bekey].equip_icon + '" alt="战队头像">');
            }
            var count = briefEquipList.length;
            for (var bei = count; bei < 6; bei++) {
                $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-rbox .zb-img').append('<img src="https://game.gtimg.cn/images/yxzj/matchdata/zbwt.png" alt="战队头像">');
            }
        } else {
            for (var _bei = 0; _bei < 6; _bei++) {
                $('.types-show-box li').eq(_i4).find('.tsboxl').eq(0).find('.c-rbox .zb-img').append('<img src="https://game.gtimg.cn/images/yxzj/matchdata/zbwt.png" alt="战队头像">');
            }
        }
        if (!Public.isEmpty(camp2Bp.hero_detail.BriefEquipList)) {
            var _briefEquipList = camp2Bp.hero_detail.BriefEquipList;
            for (var _bekey in _briefEquipList) {
                $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-rbox .zb-img').append('<img src="' + _briefEquipList[_bekey].equip_icon + '" alt="战队头像">');
            }
            var _count = _briefEquipList.length;
            for (var _bei2 = _count; _bei2 < 6; _bei2++) {
                $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-rbox .zb-img').append('<img src="https://game.gtimg.cn/images/yxzj/matchdata/zbwt.png" alt="战队头像">');
            }
        } else {
            for (var _bei3 = 0; _bei3 < 6; _bei3++) {
                $('.types-show-box li').eq(_i4).find('.tsboxl').eq(1).find('.c-rbox .zb-img').append('<img src="https://game.gtimg.cn/images/yxzj/matchdata/zbwt.png" alt="战队头像">');
            }
        }
    }
    if (Public.isEmpty(firstMatchId)) {
        firstMatchId = matchId;
    }
    if (Public.isEmpty(firstBattleId)) {
        firstBattleId = battleId;
    }

    // User.choose.heroId = firstInscription;
    showParaPositionData(firstMatchId, firstBattleId, firstPositionId);
    $('#tb-box1 .dw-wrap .dw-wrap-item').each(function (positionId) {
        if (positionId == firstPositionId) {
            $(this).addClass("active").siblings().removeClass("active")
            $('.show-dw-hero .playlogo img').attr('src','https://game.gtimg.cn/images/yxzj/matchdata/dw-'+positionId+'.png')
        }
        if (positionId === 0) {
            $("#tb-box1 .playlogo").removeClass("playlogoRes");
        }else{
            $("#tb-box1 .playlogo").addClass("playlogoRes");
        }
        $(this).click(function () {
            if (!$(this).hasClass("active")) {
                $(this).addClass("active").siblings().removeClass("active")
            }
            $('.show-dw-hero .playlogo img').attr('src','https://game.gtimg.cn/images/yxzj/matchdata/dw-'+positionId+'.png')
            if (positionId === 0) {
                $("#tb-box1 .playlogo").removeClass("playlogoRes");
            }else{
                $("#tb-box1 .playlogo").addClass("playlogoRes");
            }
            firstPositionId = positionId;
            showParaPositionData(firstMatchId, firstBattleId, firstPositionId);
        });
    });

    $('.inscriptions-box .insc-left').eq(0).find('.hero-imgbox .himg').eq(showHeroId1).addClass('active');
    $('.inscriptions-box .insc-left').eq(1).find('.hero-imgbox .himg').eq(showHeroId2).addClass('active');

    $('.inscriptions-box .insc-left').eq(0).find('.hero-imgbox .himg').each(function (index) {
        $(this).click(function () {
            if (showHeroId1 == index) {
                return false;
            }
            $('.camp-hreo-inscription').eq(index).addClass('active').siblings().removeClass('active');
            showHeroId1 = index;
            firstInscription1 = $(this).attr('hreo-id');
            $('.inscriptions-box .insc-left.pr20 span.tb-btn').attr('hero-id',firstInscription1)
            // User.choose.heroId = parseInt(firstInscription1);
            firstMatchId = $(this).attr('match-id');
            firstBattleId = $(this).attr('battle-id');
            // getUserHeroSuit(true);
            showInscription(firstMatchId, firstBattleId, 1, firstInscription1);
        });
    });
    $('.inscriptions-box .insc-left').eq(1).find('.hero-imgbox .himg').each(function (index) {
        $(this).click(function () {
            if (showHeroId2 == index) {
                return false;
            }
            $('.camp-hreo-inscription').eq(index).addClass('active').siblings().removeClass('active');
            showHeroId2 = index;
            firstInscription2 = $(this).attr('hreo-id');
            $('.inscriptions-box .insc-right.pl20 span.tb-btn').attr('hero-id',firstInscription2)
            // User.choose.heroId = parseInt(firstInscription1);
            firstMatchId = $(this).attr('match-id');
            firstBattleId = $(this).attr('battle-id');
            // getUserHeroSuit(true);
            showInscription(firstMatchId, firstBattleId, 2, firstInscription2);
        });
    });
    showInscription(firstMatchId, firstBattleId, 1, firstInscription1);
    showInscription(firstMatchId, firstBattleId, 2, firstInscription2);

    $('.middle-center .null-data.null-dom').hide();
    $('.middle-center .main-context').show();

}

//显示铭文信息
function showInscription(matchId, battleId, camp, hreoId) {
    var battleDetail = League.matchList[matchId].battleDetail[battleId];
    var hreoInfo = {};
    var teamAbbreviation = null;
    if (camp == 1) {
        hreoInfo = battleDetail.camp1.bp_list[hreoId];
        teamAbbreviation = battleDetail.camp1.team_abbreviation;
    } else {
        hreoInfo = battleDetail.camp2.bp_list[hreoId];
        teamAbbreviation = battleDetail.camp2.team_abbreviation;
    }

    $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail .hds span').text(hreoInfo.hero_detail.hero_name + ' ' + teamAbbreviation + '.' + hreoInfo.hero_detail.player_name + ' 套装');
    $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail>div.clearfix').eq(0).text("");
    $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail>div.clearfix').eq(1).text("");

    hreoInfo.hero_detail.BriefEquipList.forEach(function (briefEquip, key) {
        var html = '<div class="cz-img"><img src="' + briefEquip.equip_icon + '" alt="' + briefEquip.equip_name + '"><p>' + briefEquip.equip_name + '</p></div>';
        if(key < 4){
            $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail>div.clearfix').eq(0).append(html);
        }else{
            $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail>div.clearfix').eq(1).append(html);
        }
    });

    var symbols = hreoInfo.hero_detail.symbols;
    $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail .symbol-list').text("");

    var firstSymbolKey = null;
    var symbolCate = [];

    var symbolNum = 0
    var mwBox = null
    symbols.forEach(function (symbol, key) {
        if (Public.isEmpty(firstSymbolKey)) {
            firstSymbolKey = key;
        }
        if(symbolNum%3 == 0){
            if(!Public.isEmpty(mwBox)){
                $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail .symbol-list').append(mwBox)
                mwBox = null
            }
            mwBox = $('<div class="mw-box"></div>');
        }

        // var html = '<div class="inscription-list" symbol-id="' + key + '">\n' + '<div class="inscription-list-img"> <img src="' + symbol.detail.src + '" alt="无双" onerror="' + symbol.detail.spare_src + '"></div>\n' + '<div class="inscription-list-text"> <p>' + symbol.detail.ming_name + '</p>\n' + '<p>x' + symbol.count + '</p></div>\n' + '</div>';
        var html = '<div class="mw-img" symbol-id="' + key + '"><img src="' + symbol.detail.src + '" alt="' + symbol.detail.ming_name + '"  onerror="javascript:this.src=\'' + symbol.detail.spare_src + '\'"><div class="mw-txt"><span class="span1">' + symbol.detail.ming_name + '</span> <span class="span1">x' + symbol.count + '</span></div></div>';
        mwBox.append(html);
        // if(symbolNum < 3){
        //     $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail .symbol-list>div.mw-box').eq(0).append(html);
        // }else{
        //     $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail .symbol-list>div.mw-box').eq(1).append(html);
        // }
        symbolNum++
        var count = symbol.count;
        var mingDes = symbol.detail.ming_des;
        mingDes = mingDes.split('</p>');
        mingDes.forEach(function (des) {
            if (Public.isEmpty(des)) {
                return null;
            }
            des = des.replace(/<p>/, "");
            des = des.split('+');
            des[0] = $.trim(des[0]);
            if (Public.isEmpty(symbolCate[des[0]])) {
                symbolCate[des[0]] = [];
            }
            if (des[1].indexOf("%") != -1) {
                des[1] = des[1].replace(/%/, "");
                des[1] = parseInt(count) * Number(des[1]);
                if (Public.isEmpty(symbolCate[des[0]][0])) {
                    symbolCate[des[0]][0] = des[1].toFixed(1);
                    symbolCate[des[0]][1] = "%";
                } else {
                    symbolCate[des[0]][0] = (Number(symbolCate[des[0]][0]) + Number(des[1])).toFixed(1);
                }
            } else {
                des[1] = parseInt(count) * Number(des[1]);
                if (Public.isEmpty(symbolCate[des[0]][0])) {
                    symbolCate[des[0]][0] = des[1].toFixed(1);
                    symbolCate[des[0]][1] = "";
                } else {
                    symbolCate[des[0]][0] = (Number(symbolCate[des[0]][0]) + Number(des[1])).toFixed(1);
                }
            }
        });
    });
    if(!Public.isEmpty(mwBox)){
        $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail .symbol-list').append(mwBox)
        mwBox = null
    }

    $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail>div.tysx-box').text("");
    $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail>div.tysx-box').append('<p class="tysx-name">通用属性</p>');
    for (var symbolName in symbolCate) {
        // var html = '<div class="bottom-content"><div class="bottom-content-text">' + symbolName + '</div><div class="bottom-content-property">+' + (symbolCate[symbolName][0] + symbolCate[symbolName][1]) + '</div></div>';
        var html = '<div class="tysx-p"><span>' + symbolName + '</span> <span class="ts-num">+' + (symbolCate[symbolName][0] + symbolCate[symbolName][1]) + '</span></div>';
        $('#tb-box2 .insc-left').eq(camp-1).find('.hero-detail>div.tysx-box').append(html);
    }
}


//显示对位数据
function showParaPositionData(matchId, battleId, position) {
    var battleDetail = League.matchList[matchId].battleDetail[battleId];
    var camp1PlayerPosition = battleDetail.camp1.player_position;
    var camp2PlayerPosition = battleDetail.camp2.player_position;
    if (Public.isEmpty(camp1PlayerPosition[parseInt(position)]) || Public.isEmpty(camp2PlayerPosition[parseInt(position)])) {
        Public.consoleLog("对位数据不存在");
        Public.consoleLog("position", position);
        Public.consoleLog("League", League);
        return false;
    }
    var camp1PlayerData = battleDetail.camp1.bp_list[camp1PlayerPosition[parseInt(position)].hero_id];
    var camp2PlayerData = battleDetail.camp2.bp_list[camp2PlayerPosition[parseInt(position)].hero_id];

    $('.show-dw-hero  .left-dh .dtype').attr('src', camp1PlayerData.hero_detail.team_icon);
    // $('.show-dw-hero  .left-dh .dhero').hide()
    if (Public.isEmpty(camp1PlayerData.hero_detail.player_icon)) {
        camp1PlayerData.hero_detail.player_icon = '//game.gtimg.cn/images/yxzj/m/matchdata/img/detail/user-icon.png';
    }
    $('.show-dw-hero .left-dh .duser').attr('src', camp1PlayerData.hero_detail.player_icon);
    $('.dw-hero-info .dhil .dhlname').text(camp1PlayerData.hero_detail.team_name+'.'+camp1PlayerData.hero_detail.player_name);
    $('.dw-hero-info .dhil .dhlhero').text(camp1PlayerData.hero_name);

    // $('.bottom-row #camp1-scores').text(camp1PlayerData.hero_detail.kill_num + '/' + camp1PlayerData.hero_detail.death_num + '/' + camp1PlayerData.hero_detail.assist_num);
    // $('.bottom-row #camp1-kda').text(camp1PlayerData.hero_detail.kda);

    if (battleDetail.status == 2 && camp1PlayerData.hero_detail.kda > camp2PlayerData.hero_detail.kda) {
        $('.dw-hero-info .dhil img').show();
        $('.dw-hero-info .dhir img').hide();
    } else if (battleDetail.status == 2 && camp1PlayerData.hero_detail.kda < camp2PlayerData.hero_detail.kda) {
        $('.dw-hero-info .dhir img').show();
        $('.dw-hero-info .dhil img').hide();
    } else {
        $('.dw-hero-info .dhil img').hide();
        $('.dw-hero-info .dhir img').hide();
    }

    $('.show-dw-hero .right-dh .dtype').attr('src', camp2PlayerData.hero_detail.team_icon);
    // $('#camp2-player.battle-content .battle-team img').attr('src',camp2PlayerData.hero_detail.hero_icon)
    if (Public.isEmpty(camp2PlayerData.hero_detail.player_icon)) {
        camp2PlayerData.hero_detail.player_icon = '//game.gtimg.cn/images/yxzj/m/matchdata/img/detail/user-icon.png';
    }
    // $('.show-dw-hero .right-dh .dhero').hide()
    $('.show-dw-hero .right-dh .duser').attr('src', camp2PlayerData.hero_detail.player_icon);

    $('.dw-hero-info .dhir .dhlname').text(camp2PlayerData.hero_detail.team_name+'.'+camp2PlayerData.hero_detail.player_name);
    $('.dw-hero-info .dhir .dhlhero').text(camp2PlayerData.hero_name);
    // $('.bottom-row #camp2-scores').text(camp2PlayerData.hero_detail.kill_num + '/' + camp2PlayerData.hero_detail.death_num + '/' + camp2PlayerData.hero_detail.assist_num);
    // $('.bottom-row #camp2-kda').text(camp2PlayerData.hero_detail.kda);

    var totalGold = camp1PlayerData.hero_detail.gold + camp2PlayerData.hero_detail.gold;
    var camp1GoldScale = camp1PlayerData.hero_detail.gold / totalGold;
    var camp2GoldScale = camp2PlayerData.hero_detail.gold / totalGold;
    camp1GoldScale = camp1GoldScale.toFixed(2) * 100;
    camp2GoldScale = camp2GoldScale.toFixed(2) * 100;
    $('.registration-data li.re-data-li').eq(0).find('.rdl .rdl1-count').text(camp1PlayerData.hero_detail.gold);
    $('.registration-data li.re-data-li').eq(0).find('.rdl .rdl1-name').text('全队NO.' + camp1PlayerData.sort.goldSort);
    $('.registration-data li.re-data-li').eq(0).find('.solid .solid_left').css('width', camp1GoldScale + '%');
    if (camp1PlayerData.sort.goldSort == 1) {
        $('.registration-data li.re-data-li').eq(0).find('.rdl .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(0).find('.rdl .rdl1-img img').hide();
    }
    $('.registration-data li.re-data-li').eq(0).find('.rdr .rdl1-count').text(camp2PlayerData.hero_detail.gold);
    $('.registration-data li.re-data-li').eq(0).find('.rdr .rdl1-name').text('全队NO.' + camp2PlayerData.sort.goldSort);
    $('.registration-data li.re-data-li').eq(0).find('.solid .solid_right').css('width', camp2GoldScale + '%');
    if (camp2PlayerData.sort.goldSort == 1) {
        $('.registration-data li.re-data-li').eq(0).find('.rdr .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(0).find('.rdr .rdl1-img img').hide();
    }


    var totalHurt = camp1PlayerData.hero_detail.hurt_to_hero_total + camp2PlayerData.hero_detail.hurt_to_hero_total;
    var camp1HurtScale = camp1PlayerData.hero_detail.hurt_to_hero_total / totalHurt;
    var camp2HurtScale = camp2PlayerData.hero_detail.hurt_to_hero_total / totalHurt;
    camp1HurtScale = camp1HurtScale.toFixed(2) * 100;
    camp2HurtScale = camp2HurtScale.toFixed(2) * 100;
    $('.registration-data li.re-data-li').eq(1).find('.rdl .rdl1-count').text(camp1PlayerData.hero_detail.hurt_to_hero_total >= 1000 ? (camp1PlayerData.hero_detail.hurt_to_hero_total / 1000).toFixed(1) + 'k' : camp1PlayerData.hero_detail.hurt_to_hero_total);
    $('.registration-data li.re-data-li').eq(1).find('.rdl .rdl1-name').text('全队NO.' + camp1PlayerData.sort.hurtTotalSort);
    $('.registration-data li.re-data-li').eq(1).find('.solid .solid_left').css('width', camp1HurtScale + '%');
    if (camp1PlayerData.sort.hurtTotalSort == 1) {
        $('.registration-data li.re-data-li').eq(1).find('.rdl .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(1).find('.rdl .rdl1-img img').hide();
    }
    $('.registration-data li.re-data-li').eq(1).find('.rdr .rdl1-count').text(camp2PlayerData.hero_detail.hurt_to_hero_total >= 1000 ? (camp2PlayerData.hero_detail.hurt_to_hero_total / 1000).toFixed(1) + 'k' : camp2PlayerData.hero_detail.hurt_to_hero_total);
    $('.registration-data li.re-data-li').eq(1).find('.rdr .rdl1-name').text('全队NO.' + camp2PlayerData.sort.hurtTotalSort);
    $('.registration-data li.re-data-li').eq(1).find('.solid .solid_right').css('width', camp2HurtScale + '%');
    if (camp2PlayerData.sort.hurtTotalSort == 1) {
        $('.registration-data li.re-data-li').eq(1).find('.rdr .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(1).find('.rdr .rdl1-img img').hide();
    }

    var totalHurtRate = camp1PlayerData.hero_detail.hurt_to_hero_total_rate + camp2PlayerData.hero_detail.hurt_to_hero_total_rate;
    var camp1HurtRateScale = camp1PlayerData.hero_detail.hurt_to_hero_total_rate / totalHurtRate;
    var camp2HurtRateScale = camp2PlayerData.hero_detail.hurt_to_hero_total_rate / totalHurtRate;
    camp1HurtRateScale = camp1HurtRateScale.toFixed(2) * 100;
    camp2HurtRateScale = camp2HurtRateScale.toFixed(2) * 100;
    $('.registration-data li.re-data-li').eq(2).find('.rdl .rdl1-count').text(parseInt(camp1PlayerData.hero_detail.hurt_to_hero_total_rate * 10000) / 100 + '%');
    $('.registration-data li.re-data-li').eq(2).find('.rdl .rdl1-name').text('全队NO.' + camp1PlayerData.sort.hurtTotalRateSort);
    $('.registration-data li.re-data-li').eq(2).find('.solid .solid_left').css('width', camp1HurtRateScale + '%');
    if (camp1PlayerData.sort.hurtTotalRateSort == 1) {
        $('.registration-data li.re-data-li').eq(2).find('.rdl .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(2).find('.rdl .rdl1-img img').hide();
    }
    $('.registration-data li.re-data-li').eq(2).find('.rdr .rdl1-count').text(parseInt(camp2PlayerData.hero_detail.hurt_to_hero_total_rate * 10000) / 100 + '%');
    $('.registration-data li.re-data-li').eq(2).find('.rdr .rdl1-name').text('全队NO.' + camp2PlayerData.sort.hurtTotalRateSort);
    $('.registration-data li.re-data-li').eq(2).find('.solid .solid_right').css('width', camp2HurtRateScale + '%');
    if (camp2PlayerData.sort.hurtTotalRateSort == 1) {
        $('.registration-data li.re-data-li').eq(2).find('.rdr .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(2).find('.rdr .rdl1-img img').hide();
    }

    var totalBeHurt = camp1PlayerData.hero_detail.be_hurt_by_hero_total + camp2PlayerData.hero_detail.be_hurt_by_hero_total;
    var camp1BeHurtScale = camp1PlayerData.hero_detail.be_hurt_by_hero_total / totalBeHurt;
    var camp2BeHurtScale = camp2PlayerData.hero_detail.be_hurt_by_hero_total / totalBeHurt;
    camp1BeHurtScale = camp1BeHurtScale.toFixed(2) * 100;
    camp2BeHurtScale = camp2BeHurtScale.toFixed(2) * 100;
    $('.registration-data li.re-data-li').eq(3).find('.rdl .rdl1-count').text(camp1PlayerData.hero_detail.be_hurt_by_hero_total >= 1000 ? (camp1PlayerData.hero_detail.be_hurt_by_hero_total / 1000).toFixed(1) + 'k' : camp1PlayerData.hero_detail.be_hurt_by_hero_total);
    $('.registration-data li.re-data-li').eq(3).find('.rdl .rdl1-name').text('全队NO.' + camp1PlayerData.sort.beHurtTotalSort);
    $('.registration-data li.re-data-li').eq(3).find('.solid .solid_left').css('width', camp1BeHurtScale + '%');
    if (camp1PlayerData.sort.beHurtTotalSort == 1) {
        $('.registration-data li.re-data-li').eq(3).find('.rdl .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(3).find('.rdl .rdl1-img img').hide();
    }
    $('.registration-data li.re-data-li').eq(3).find('.rdr .rdl1-count').text(camp2PlayerData.hero_detail.be_hurt_by_hero_total >= 1000 ? (camp2PlayerData.hero_detail.be_hurt_by_hero_total / 1000).toFixed(1) + 'k' : camp2PlayerData.hero_detail.be_hurt_by_hero_total);
    $('.registration-data li.re-data-li').eq(3).find('.rdr .rdl1-name').text('全队NO.' + camp2PlayerData.sort.beHurtTotalSort);
    $('.registration-data li.re-data-li').eq(3).find('.solid .solid_right').css('width', camp2BeHurtScale + '%');
    if (camp2PlayerData.sort.beHurtTotalSort == 1) {
        $('.registration-data li.re-data-li').eq(3).find('.rdr .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(3).find('.rdr .rdl1-img img').hide();
    }

    var totalBeHurtRate = camp1PlayerData.hero_detail.be_hurt_by_hero_total_rate + camp2PlayerData.hero_detail.be_hurt_by_hero_total_rate;
    var camp1BeHurtRateScale = camp1PlayerData.hero_detail.be_hurt_by_hero_total_rate / totalBeHurtRate;
    var camp2BeHurtRateScale = camp2PlayerData.hero_detail.be_hurt_by_hero_total_rate / totalBeHurtRate;
    camp1BeHurtRateScale = camp1BeHurtRateScale.toFixed(2) * 100;
    camp2BeHurtRateScale = camp2BeHurtRateScale.toFixed(2) * 100;
    $('.registration-data li.re-data-li').eq(4).find('.rdl .rdl1-count').text(parseInt(camp1PlayerData.hero_detail.be_hurt_by_hero_total_rate * 10000) / 100 + '%');
    $('.registration-data li.re-data-li').eq(4).find('.rdl .rdl1-name').text('全队NO.' + camp1PlayerData.sort.beHurtTotalRateSort);
    $('.registration-data li.re-data-li').eq(4).find('.solid .solid_left').css('width', camp1BeHurtRateScale + '%');
    if (camp1PlayerData.sort.beHurtTotalRateSort == 1) {
        $('.registration-data li.re-data-li').eq(4).find('.rdl .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(4).find('.rdl .rdl1-img img').hide();
    }
    $('.registration-data li.re-data-li').eq(4).find('.rdr .rdl1-count').text(parseInt(camp2PlayerData.hero_detail.be_hurt_by_hero_total_rate * 10000) / 100 + '%');
    $('.registration-data li.re-data-li').eq(4).find('.rdr .rdl1-name').text('全队NO.' + camp2PlayerData.sort.beHurtTotalRateSort);
    $('.registration-data li.re-data-li').eq(4).find('.solid .solid_right').css('width', camp2BeHurtRateScale + '%');
    if (camp2PlayerData.sort.beHurtTotalRateSort == 1) {
        $('.registration-data li.re-data-li').eq(4).find('.rdr .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(4).find('.rdr .rdl1-img img').hide();
    }

    var totalParRate = camp1PlayerData.hero_detail.participation_rate + camp2PlayerData.hero_detail.participation_rate;
    var camp1ParRateScale = camp1PlayerData.hero_detail.participation_rate / totalParRate;
    var camp2ParRateScale = camp2PlayerData.hero_detail.participation_rate / totalParRate;
    camp1ParRateScale = camp1ParRateScale.toFixed(2) * 100 - 0.5;
    camp2ParRateScale = camp2ParRateScale.toFixed(2) * 100 - 0.5;
    $('.registration-data li.re-data-li').eq(5).find('.rdl .rdl1-count').text(parseInt(camp1PlayerData.hero_detail.participation_rate * 100) / 100 + '%');
    $('.registration-data li.re-data-li').eq(5).find('.rdl .rdl1-name').text('全队NO.' + camp1PlayerData.sort.participationRateSort);
    $('.registration-data li.re-data-li').eq(5).find('.solid .solid_left').css('width', camp1ParRateScale + '%');
    if (camp1PlayerData.sort.participationRateSort == 1) {
        $('.registration-data li.re-data-li').eq(5).find('.rdl .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(5).find('.rdl .rdl1-img img').hide();
    }
    $('.registration-data li.re-data-li').eq(5).find('.rdr .rdl1-count').text(parseInt(camp2PlayerData.hero_detail.participation_rate * 100) / 100 + '%');
    $('.registration-data li.re-data-li').eq(5).find('.rdr .rdl1-name').text('全队NO.' + camp2PlayerData.sort.participationRateSort);
    $('.registration-data li.re-data-li').eq(5).find('.solid .solid_right').css('width', camp2ParRateScale + '%');
    if (camp2PlayerData.sort.participationRateSort == 1) {
        $('.registration-data li.re-data-li').eq(5).find('.rdr .rdl1-img img').show();
    } else {
        $('.registration-data li.re-data-li').eq(5).find('.rdr .rdl1-img img').hide();
    }
}

//或者对局信息
function getBattleInfo(matchId, battleId) {
    League.getMatchBattle(matchId, battleId, Public.getQueryParams('os') !== '', function () {
        battleDataShow(matchId, battleId);
    }, function () {
        for (var i in League.matchList[matchId].battleSimple) {

            if (League.matchList[matchId].battleSimple[i].battle_id == battleId) {
                if (League.matchList[matchId].battleSimple[i].status == 0 || League.matchList[matchId].battleSimple[i].status == 3) {
                    $('.middle-center .null-data.null-dom').show();
                    $('.middle-center .main-context').hide();
                    return;
                } else if (League.matchList[matchId].battleSimple[i].status == 1 || League.matchList[matchId].battleSimple[i].status == 2) {
                    $('.middle-center .data-update.null-dom').show();
                    $('.middle-center .main-context').hide();
                }
                break;
            }
        }
        Public.consoleLog('getMatchBattle fail');
    });
}


//启动定时器
function startUpdateData(matchId, battleId) {
    for (var i in League.matchList[matchId].battleSimple) {
        if (League.matchList[matchId].battleSimple[i].battle_id == battleId && League.matchList[matchId].battleSimple[i].status == 1) {
            intervalUpdateData = setInterval(function () {
                if (League.matchList[matchId].battleDetail[battleId].status == 2) {
                    endUpdateData();
                    return;
                }
                getBattleInfo(matchId, battleId);
            }, 10000);
            break;
        }
    }
}

//结束定时器
function endUpdateData() {
    if (!Public.isEmpty(intervalUpdateData)) {
        window.clearInterval(intervalUpdateData);
    }
}


function showOrhideMainDiv(flag) {
    if (flag) {
        $('.container > .gradual').show();
        $('.container > .hero-ban-list').show();
        $('.container > .hero-resource').show();
        $('.container > .mone').show();
        $('.container > .solid').show();
        $('.container > .button').show();
        $('.container > .menu-tabs').show();
    } else {
        $('.container > .gradual').hide();
        $('.container > .hero-ban-list').hide();
        $('.container > .hero-resource').hide();
        $('.container > .mone').hide();
        $('.container > .solid').hide();
        $('.container > .button').hide();
        $('.container > .menu-tabs').hide();
    }
    $('#mod_player').hide();
}

function getUserHeroSuit() {
    var isFirst = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    if (!User.isLogin) {
        Public.consoleLog("user is not login");
        return false;
    }
    if (!isFirst && User.choose.roleIndex == User.choose.pickerRoleIndex && User.choose.roleRawPartition == User.choose.pickerRoleRawPartition) {
        return;
    }
    $('#equipment-list').text("");
    $('#inscriptions-list').text("");

    User.choose.pickerEquipSuitIndex = null;
    User.choose.pickerSymbolSuitIndex = null;
    User.choose.equipSuitIndex = null;
    User.choose.symbolSuitIndex = null;

    User.choose.roleIndex = User.choose.pickerRoleIndex;
    User.choose.roleRawPartition = User.choose.pickerRoleRawPartition;

    if (Public.isEmpty(User.choose.heroId)) {
        return false;
    }
    if(!Public.checkLoginSource() && Public.isEmpty(User.choose.roleRawPartition)){
        return false;
    }
    var params = {};
    params.hero_id = User.choose.heroId;
    params.role_raw_partition = User.choose.roleRawPartition;
    League.GetPlayerHeroSuit(params, function () {
        if (Public.isEmpty(User.suits)) {
            return false;
        }
        $('#alternative').text("");
        $('#currentNative').text("");
        Public.consoleLog('User.suits:', User.suits);
        // let currentNative = User.suits.splice(0, 1)
        
        // console.log(currentNative,'currentSuits=====>>>>>>>>>')
        // for (var suitIndex in currentNative){
        //     if(currentNative[suitIndex].equip_list && currentNative[suitIndex].equip_list.length > 0){
        //         $('.currentTitle').show()
        //         $('#currentNative').append(setEquipmentDom(suitIndex,currentNative))
        //     }
        // }
        // console.log(User.suits,'User.suits=====>>>>>>>>>')
        // User.suits.splice(0, 1)
        for (var suitsKey in User.suits) {
            if (suitsKey == 0) {
                if(User.suits[suitsKey].equip_list.length > 0){
                    $('.currentTitle').show()
                    $('#currentNative').append(setEquipmentDom(suitsKey,User))
                }

            } else {
                $('#alternative').append(setEquipmentDom(suitsKey,User))
            }
        }
        tzmwopopScroll();
    }, function (res) {
        Public.consoleLog("res：",res);
        if(!Public.isEmpty(res)){
            if(res.iRet == 101){
                League.logout(function (){
                    checkLogin()
                    logins()
                })
            }
        }
    });
}
function setEquipmentDom(suitsKey,User){
    var battleId = $(".tzmw-right").attr('battle-id')
    var campId = User.choose.campId
    // console.log(campId,'campId=====>>>>>>>>>')
    // console.log(battleId,'battleId=====>>>>>>>>>')
    // console.log(User.choose,'User.choose=====>>>>>>>>>')
    // console.log(Choose,"Choose=====>>>>>>>>>")
    // console.log(League,"League=====>>>>>>>>>")
    var heroInfo = League.matchList[Choose.params.match_id].battleDetail[battleId][`camp${campId}`].bp_list[User.choose.heroId]
    // console.log(heroInfo,'heroInfo=====>>>>>>>>>')
    var suit = User.suits[suitsKey];
    var equipList = suit.equip_list;
    var symbols_cate = suit.symbols_cate;
    var symbols_info = suit.symbols_info;
    var equipHtml = '<li class="tzmw-box"' + ('onclick="alternative(this,\''+suitsKey+'\')"') + '>\n' +
        '                <div class="tzmw-box-scwrapper">\n' +
        '                  <div class="zm-wrap tzmw-box-scroller">\n' +
        '                    <p class="pt-name"> ' + (suitsKey == 0 ? '<span class="currentTip">当前套装</span>' : '') + '<span><img src="https://game.gtimg.cn/images/yxzj/matchdata/fs.png" alt=""></span> '+heroInfo.hero_detail.hero_name+suit.suit_name+'</p>\n' +
        '                    <div class="zb-box clearfix">\n<div class="cimg cimg1"> ';
    if(!Public.isEmpty(equipList)){
        equipHtml += '<img src="'+equipList[0].equip_icon+'" alt="'+equipList[0].equip_name+'" srcset="">';
    }
    equipHtml += ' </div>\n<div class="line-border-r"></div>\n';
    if(equipList.length > 1){
        for (var i in equipList){
            if(i == 0){
                continue;
            }
            equipHtml += '<div class="cimg"> <img src="'+equipList[i].equip_icon+'" alt="'+equipList[i].equip_name+'" srcset=""></div>\n';
        }
    }
    equipHtml += '</div>\n<div class="mw-b clearfix">\n';
    var symbols_level = 0
    if(!Public.isEmpty(symbols_info)){
        for (var i in symbols_info){
            var symbol = symbols_info[i]
            equipHtml += '             <div class="mw-img"> <img src="'+symbol.src+'" alt="'+symbol.ming_name+'">\n' +
                '                        <div class="mw-txt"> <span class="span1">'+symbol.ming_name+'</span> <span class="span1">x'+symbol.count+'</span> </div>\n' +
                '                      </div>\n';
            symbols_level += (parseInt(symbol.ming_level) * symbol.count)
        }
    }
    equipHtml += '           </div>\n' +
        '                    <p class="grayfont"> <span>当前铭文等级：'+symbols_level+'</span></p>\n' +//<span>同步后变为：0</span>
        '                  </div>\n' +
        '                  <div class="border-10px"></div>\n' +
        '                </div>\n' +
        '                <div class="border-1px"> </div>\n' +
        '                <div class="tzmw-right" suits-id="'+suitsKey+'" onclick="userSuitShow(\''+suitsKey+'\')"> </div>\n' +//onclick="checkPop()"
        '                <div class="checked-icon"></div>'
        '              </li>';
    
    return equipHtml;
}

function getUserRoles() {
    if (!User.isLogin) {
        Public.consoleLog("user is not login");
        return false;
    }
    $('.row-list ul#row-ul').text("");
    var params = {};
    if (User.info.acctype === 'qc') {
        params.plat = 'qq';
    } else if (User.info.acctype === 'wx') {
        params.plat = 'wx';
    }else{
        return
    }

    League.getLoginUserRoles(params, function (obj) {
        //TODO
        if (User.roles.length === 0) {
            return;
        }

        for (var key in User.roles) {
            var role = User.roles[key];
            var userHtml = '<li  role-index="' + key + '" onclick="selectInfor('+key+')"> <span>' + role.role_name + '  ' + role.role_area_desc + role.role_partition_desc + ' ' + role.role_rank_desc + '</span> </li>\n';
            if (Public.isEmpty(User.choose.roleIndex) && key == 0) {
                $('#row-list .row-item.line1 span').eq(0).text(role.role_name + '  ' + role.role_area_desc + role.role_partition_desc + ' ' + role.role_rank_desc)
                User.choose.roleIndex = key;
                User.choose.pickerRoleIndex = key;
                User.choose.roleRawPartition = role.role_raw_partition;
                User.choose.pickerRoleRawPartition = role.role_raw_partition;
            }
            $('.row-list ul#row-ul').append(userHtml);
        }

        $('.row-list ul#row-ul li').each(function (index) {
            var roleIndex = $(this).attr('role-index');
            $(this).click(function () {
                User.choose.pickerRoleIndex = roleIndex;
                var role = User.roles[User.choose.pickerRoleIndex];
                User.choose.pickerRoleRawPartition = role.role_raw_partition;
                $('#row-list .row-item.line1 span').eq(0).text(role.role_name + '  ' + role.role_area_desc + role.role_partition_desc + ' ' + role.role_rank_desc)
                $("#row-ul").hide()
                getUserHeroSuit();
            });
        });
    }, function (res) {
        Public.consoleLog('res', res)
        if(!Public.isEmpty(res)){
            if(res.iRet == 101){
                League.logout(function (){
                    checkLogin()
                    logins()
                })
            }
        }
    });
}

function listenWidth() {
    var width = window.outerWidth
    if(width <= 750){
        window.location.href = URL_MOBILE + '?league_id='+Choose.params.league_id+'&match_id='+Choose.params.match_id
    }
}


function showSuitDetail(equipList,summonerAbilityInfo,symbols){
    $('#showEquipmentDetails').text("")
    $('#popUp .pcontent>.t-c-wrap').text("")
    $('#popUp .pcontent>.pf-list').text('')
    $('#popUp .pcontent>.jn-box img').attr('src', summonerAbilityInfo.summoner_ability_icon)
    $('#popUp .pcontent>.jn-tips').text(summonerAbilityInfo.summoner_ability_desc)
    if(!Public.isEmpty(equipList)){
        var equipListInfo = []
        for (var equipKey in equipList){
            if(Public.isEmpty(equipList[equipKey].equip_id)){
                continue
            }
            var html = '<div class="img" onclick="showTips(this)"><img src="'+equipList[equipKey].equip_icon+'" alt="'+equipList[equipKey].equip_name+'" srcset=""> '
            var equipDescFunction = equipList[equipKey].equip_desc_function.replace(/<p>/g,'').replace(/<\/p>/g,'')
            var equipDescGainList = equipList[equipKey].equip_desc_gain.replace(/<p>/g,'').replace(/<\/p>/g,'')
            var equipDescList = []
            if(equipDescGainList.indexOf('<br>') >= 0){
                equipDescGainList = equipDescGainList.split('<br>')
                for (var desKey in equipDescGainList){
                    var equipDescInfo = []
                    if(Public.isEmpty(equipDescGainList[desKey].match(/\+[0-9|%]+/g))){
                        equipDescFunction = equipDescGainList[desKey] + '<br/>' + equipDescFunction
                        continue
                    }
                    equipDescGainList[desKey] = equipDescGainList[desKey].replace(/^(\++)?/g,'+')
                    equipDescInfo[1] = equipDescGainList[desKey].match(/\+[0-9|%]+/g).join("");
                    equipDescInfo[0] = equipDescGainList[desKey].substr(equipDescInfo[1].length,equipDescGainList[desKey].length).replace(/\s*/g,"");
                    equipDescInfo[0] = equipDescInfo[0].replace(/攻速/g,'攻击速度')
                    equipDescInfo[0] = equipDescInfo[0].replace(/移速/g,'移动速度')
                    equipDescList.push(equipDescInfo)
                }
            }else{
                var equipDescInfo = []
                if(Public.isEmpty(equipDescGainList.match(/\+[0-9|%]+/g))){
                    equipDescFunction = equipDescGainList + '<br/>' + equipDescFunction
                }else{
                    equipDescGainList = equipDescGainList.replace(/^(\++)?/g,'+')
                    equipDescInfo[1] = equipDescGainList.match(/\+[0-9|%]+/g).join("");
                    equipDescInfo[0] = equipDescGainList.substr(equipDescInfo[1].length,equipDescGainList.length).replace(/\s*/g,"");
                    equipDescInfo[0] = equipDescInfo[0].replace(/攻速/g,'攻击速度')
                    equipDescInfo[0] = equipDescInfo[0].replace(/移速/g,'移动速度')
                    equipDescList.push(equipDescInfo)
                }
            }
            html += '<div class="bubble" style="display: none;"><p class="bu-title">'+equipList[equipKey].equip_name+'</p>';
            if(!Public.isEmpty(equipDescList)){
                for (var equipDescKey in equipDescList){
                    html += '<p class="bu-i"><span class="s1">'+equipDescList[equipDescKey][1]+'</span> <span>'+equipDescList[equipDescKey][0]+'</span></p>';

                    if(equipListInfo[equipDescList[equipDescKey][0]]){
                        if(equipListInfo[equipDescList[equipDescKey][0]].indexOf('%') >= 0){
                            var equipVal = Number(equipDescList[equipDescKey][1].replace(/%/g,'').replace(/\+/g,''))
                            equipVal += Number(equipListInfo[equipDescList[equipDescKey][0]].replace(/%/g,'').replace(/\+/g,''))
                            equipListInfo[equipDescList[equipDescKey][0]] = '+'+equipVal+'%'
                        }else{
                            var equipVal = Number(equipDescList[equipDescKey][1].replace(/\+/g,''))
                            equipVal += Number(equipListInfo[equipDescList[equipDescKey][0]].replace(/\+/g,''))
                            equipListInfo[equipDescList[equipDescKey][0]] = '+'+equipVal
                        }
                    }else{
                        equipListInfo[equipDescList[equipDescKey][0]] = equipDescList[equipDescKey][1]
                    }
                }
            }
            html += '<p class="bu-detail">'+equipDescFunction+'</p></div>';
            html += '</div>'
            $('#showEquipmentDetails').append(html)
            Public.consoleLog('equipListInfo', equipListInfo)
        }
        for (var equipName in equipListInfo){
            if(Public.isEmpty(equipListInfo[equipName])){
                continue
            }
            $('#popUp .pcontent>.t-c-wrap').eq(0).append('<p class="tc-item"> <span class="text">'+equipName+'</span> <span class="num">'+equipListInfo[equipName]+'</span> </p>')
        }
        var timer = "";
        $("#showEquipmentDetails").find(".img").hover(function () {
            var obj = $(this);
            timer = setTimeout(function (event) {
                creatbubble(obj)
            }, 1000);
        }, function () {
            clearTimeout(timer);
            $("#showEquipmentDetails").find(".bubble").hide()
            $("#showEquipmentDetails1").find(".bubble").hide()
        })
    }


    var symbolCate = [];
    var symbolNum = 0
    var mwBox = null
    var symbolAllLevel = 0
    symbols.forEach(function (symbol, key) {
        if(Public.isEmpty(symbol)){
            return
        }
        symbolNum++
        var count = parseInt(symbol.count);
        if(Public.isEmpty(symbol.detail)){
            symbol.detail = $.extend(true, [], symbol);
        }
        var mingDes = symbol.detail.ming_des;
        var symbolLevel = parseInt(symbol.detail.ming_level)
        symbolAllLevel += (symbolLevel * count)
        var symbolName = symbol.detail.ming_name
        var html = '<li class="pf-item">\n' +
            '                <p class="pi1"> <img src="' + symbol.detail.src + '"  onerror="javascript:this.src=\'' + symbol.detail.spare_src + '\'"  alt=""> '+symbolLevel+'级:'+symbolName+' <span>x'+count+'</span> </p>\n' +
            '                <div class="pi2">\n';
        mingDes = mingDes.split('</p>');
        mingDes.forEach(function (des) {
            if (Public.isEmpty(des)) {
                return null;
            }

            des = des.replace(/<p>/, "");
            des = des.split('+');
            des[0] = $.trim(des[0]);
            if (Public.isEmpty(symbolCate[des[0]])) {
                symbolCate[des[0]] = [];
            }
            if (des[1].indexOf("%") != -1) {
                des[1] = des[1].replace(/%/, "");
                des[1] = parseInt(count) * Number(des[1]);
                if (Public.isEmpty(symbolCate[des[0]][0])) {
                    symbolCate[des[0]][0] = des[1].toFixed(1);
                    symbolCate[des[0]][1] = "%";
                } else {
                    symbolCate[des[0]][0] = (Number(symbolCate[des[0]][0]) + Number(des[1])).toFixed(1);
                }
                html += '<p class="o-s">'+des[0]+' <span class="n">+'+Number(des[1]).toFixed(1)+'%</span></p>';
            } else {
                des[1] = parseInt(count) * Number(des[1]);
                if (Public.isEmpty(symbolCate[des[0]][0])) {
                    symbolCate[des[0]][0] = des[1].toFixed(1);
                    symbolCate[des[0]][1] = "";
                } else {
                    symbolCate[des[0]][0] = (Number(symbolCate[des[0]][0]) + Number(des[1])).toFixed(1);
                }
                html += '<p class="o-s">'+des[0]+' <span class="n">+'+Number(des[1]).toFixed(1)+'</span></p>';
            }
        });
        html += '</div>\n</li>';
        $('#popUp .pcontent>.pf-list').append(html);
    });
    Public.consoleLog('symbolCate', symbolCate)

    $('#popUp .pcontent>.btn-dj span').text(symbolAllLevel)
    //var html = '<div class="tysx-p"><span>' + symbolName + '</span> <span class="ts-num">+' + (symbolCate[symbolName][0] + symbolCate[symbolName][1]) + '</span></div>';
    for (var symbolName in symbolCate){
        if(Public.isEmpty(symbolCate[symbolName])){
            continue
        }
        $('#popUp .pcontent>.t-c-wrap').eq(1).append('<p class="tc-item"> <span class="text">'+symbolName+'</span> <span class="num">+' + (symbolCate[symbolName][0] + symbolCate[symbolName][1]) + '</span> </p>')
    }
}


function playerSuitShow(self){
    var battleId = $(self).attr('battle-id')
    var campId = $(self).attr('camp-id')
    $('.pcontent>.tzmw-box .tzmw-right').attr('battle-id',battleId)
    $('.pcontent>.tzmw-box .tzmw-right').attr('camp-id',campId)
    var heroInfo = {}
    if(campId == 1){
        heroInfo = League.matchList[Choose.params.match_id].battleDetail[battleId].camp1.bp_list[User.choose.heroId]
    }else{
        heroInfo = League.matchList[Choose.params.match_id].battleDetail[battleId].camp2.bp_list[User.choose.heroId]
    }
    Public.consoleLog('heroInfo', heroInfo)
    $('.sync-hreo-info-detail').text(heroInfo.hero_detail.hero_name +' '+ heroInfo.hero_detail.actual_player_name)
    var equipList = heroInfo.hero_detail.BriefEquipList
    var symbols = heroInfo.hero_detail.symbols

    showSuitDetail(equipList,heroInfo.hero_detail.SummonerAbilityInfo,symbols)

    $("#popContent1").addClass("hides").removeClass("hides2");
    $("#popContent2").addClass("toRight").removeClass("toRight2")
}

function userSuitShow(key){
    var equipList = User.suits[key].equip_list

    showSuitDetail(equipList,User.suits[key].summoner_ability_info,User.suits[key].symbols_info)
    $('.sync-hreo-info-detail').text(User.suits[key].suit_name)
    $("#popContent1").addClass("hides").removeClass("hides2");
    $("#popContent2").addClass("toRight").removeClass("toRight2")
}


window.onload = function () {

    //获取赛事信息
    getLeagues();
    //同步按钮

    $('.inscriptions-box .insc-left span.tb-btn').click(function (){
        if(!User.isLogin){
            logins()
            return
        }
        var heroId = $(this).attr('hero-id')
        if(Public.isEmpty(heroId)){
            return;
        }
        $("#popUp").show()
        if(User.choose.heroId == heroId){
            return
        }
        User.choose.heroId = heroId
        var battleId = $(this).attr('battle-id')
        var campId = $(this).attr('camp-id')
        User.choose.campId = campId
        $('.pcontent>.tzmw-box .tzmw-right').attr('battle-id',battleId)
        $('.pcontent>.tzmw-box .tzmw-right').attr('camp-id',campId)
        var heroInfo = {}
        if(campId == 1){
            heroInfo = League.matchList[Choose.params.match_id].battleDetail[battleId].camp1.bp_list[heroId]
        }else{
            heroInfo = League.matchList[Choose.params.match_id].battleDetail[battleId].camp2.bp_list[heroId]
        }
        Public.consoleLog('heroInfo', heroInfo)
        $('.sync-hreo-info').text(heroInfo.hero_detail.hero_name +' '+ heroInfo.hero_detail.actual_player_name)
        $('.pcontent>.tzmw-box .tzmw-box-scwrapper .zb-box').text('');
        $('.pcontent>.tzmw-box .tzmw-box-scwrapper .mw-b').text('');
        User.choose.equipList = []
        User.choose.equipList.push(parseInt(heroInfo.hero_detail.BriefEquipList[0].equip_id))
        var html = '<div class="cimg cimg1"> ';
            html += '<img src="'+heroInfo.hero_detail.BriefEquipList[0].equip_icon+'" alt="" srcset="">';
            html += '</div>\n <div class="line-border-r"></div>\n';
        User.choose.summonerAbilityId = heroInfo.hero_detail.SummonerAbilityInfo.summoner_ability_id
        for (var i in heroInfo.hero_detail.BriefEquipList){
            if(i == 0){
                continue
            }
            User.choose.equipList.push(parseInt(heroInfo.hero_detail.BriefEquipList[i].equip_id))
            html += '<div class="cimg"> <img src="'+heroInfo.hero_detail.BriefEquipList[i].equip_icon+'" alt="" srcset=""></div>'
        }
        $('.pcontent>.tzmw-box .tzmw-box-scwrapper .zb-box').html(html)
        User.choose.symbolList = [];
        for (var i in heroInfo.hero_detail.symbols){
            var symbol = heroInfo.hero_detail.symbols[i]
            for (var i = 0; i < parseInt(symbol.count); i++) {
                User.choose.symbolList.push(parseInt(symbol.detail.ming_id));
            }
            $('.pcontent>.tzmw-box .tzmw-box-scwrapper .mw-b').append('<div class="mw-img"> <img onerror="javascript:this.src=\'' + symbol.detail.spare_src + '\'" src="'+symbol.detail.src+'" alt="">\n' +
                '<div class="mw-txt"> <span class="span1">' + symbol.detail.ming_name + '</span> <span class="span1">x' + symbol.count + '</span> </div></div>')
        }
        Public.consoleLog('User.choose', User.choose)
        getUserHeroSuit(true);

    })

    $('#tbpop-btn').click(function () {
        if (Public.isEmpty(User.choose.pickerEquipSuitIndex)) {
            Public.sendNotice('alert', { content: '请选择要覆盖的原方案！' });
            return false;
        }
        if (User.choose.pickerEquipSuitIndex == User.choose.equipSuitIndex) {
            Public.sendNotice('alert', { content: '你刚刚同步过该方案！' });
            return false;
        }

        var suit = User.suits[User.choose.pickerEquipSuitIndex];
        Public.consoleLog('suit:', suit);
        if (User.choose.symbolList.length < 30) {
            for (var i = User.choose.symbolList.length; i < 30; i++) {
                User.choose.symbolList.push(0);
            }
        }
        if (User.choose.equipList.length < 6) {
            Public.sendNotice('alert', { content: '同步的装备数量不能小于6个哦！' });
            return false;
        }
        var data = {
            hero_id: User.choose.heroId,
            role_raw_partition: User.choose.roleRawPartition,
            suit_index: suit.suit_index,
            equip_ids: User.choose.equipList.join(','),
            symbol_ids: User.choose.symbolList.join(','),
            summoner_ability_id: User.choose.summonerAbilityId
        };
        Public.consoleLog('loginUserSyncSuit data:', data);
        League.loginUserSyncSuit(data, function (obj) {
            // User.choose.pickerEquipSuitIndex = null
            if (obj.data.JData == true) {
                User.choose.equipSuitIndex = User.choose.pickerEquipSuitIndex;
                $('#toast-wrap').text(" 同步成功，请登录游戏查看结果 ");
                tbsuit()
                // setTimeout(function () {
                //     getUserHeroSuit(true);
                // }, 2000);
            } else {
                $('#toast-wrap').text(obj.sMsg);
                tbsuit()
            }
        }, function (res) {
            if(!Public.isEmpty(res)){
                if(res.iRet == 101){
                    League.logout(function (){
                        checkLogin()
                        logins()
                    })
                }
            }
        });
    });
};