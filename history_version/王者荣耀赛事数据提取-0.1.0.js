// ==UserScript==
// @name         王者荣耀赛事数据提取
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  King of Glory Match Extractor
// @author       Rain Yang
// @match        https://pvp.qq.com/matchdata/scheduleDetails.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pvp.qq.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var leagueId;
    var matchId;
    var battleId;
    var battleDetail;
    var nowMatch;

    // 注入函数
    var originalSwitchBoard = switchBoard;
    switchBoard = () => {
        originalSwitchBoard();
        setTimeout(() => {
            start();
        },1000); // 延迟 1000 毫秒，确保能成功获取到信息
    };

    // 前往下一个
    function next() {
        var isLastActive = false;

        // 前往下一局
        var games = document.querySelectorAll('#every-game-list li');
        for (var i = 0; i < games.length; i++) {
            if (isLastActive) {
                games[i].click();
                return;
            } else {
                if (games[i].classList.contains('active')) {
                    isLastActive = true;
                }
            }
        }
        
        // 已是最后一局，前往下一时间
        isLastActive = false;
        var times = document.querySelectorAll('div.li-item');
        for (var i = 0; i < times.length; i++) {
            if (isLastActive) {
                times[i].click();
                return;
            } else {
                if (times[i].classList.contains('active')) {
                    isLastActive = true;
                }
            }
        }
        
        alert('本赛事已遍历完毕！');
    }

    // 主功能
    function start() {
        var data = { // 初始化数据
            league: '',
            time: '',
            game: '',
            win: '',
            camp1: {
                kill: -1,
                gold: -1,
            },
            camp2: {
                kill: -1,
                gold: -1,
            },
            hero: ['','','','','','','','','','','','','','','','','','','','']
        };

        // 获取信息
        leagueId = Public.getQueryParams("league_id");
        matchId = Public.getQueryParams("match_id");
        battleId = document.querySelector('.inscriptions-box .insc-left span.tb-btn').getAttribute("battle-id");
        battleDetail = League.matchList[matchId].battleDetail[battleId];
        nowMatch = League.leagueList[leagueId].match_list[matchId];

        // 赛事
        console.log('[赛事]',League.leagueList[leagueId].info.league_name);
        data.league = League.leagueList[leagueId].info.league_name;

        // 时间
        console.log('[时间]',nowMatch.start_time.substring(5, 16));
        data.time = nowMatch.start_time.substring(5, 16);

        // 局数
        console.log('[局数]',document.querySelector('#every-game-list li.active').innerText);
        data.game = document.querySelector('#every-game-list li.active').innerText;

        // 分析数据
        console.log('[胜利方]',(battleDetail.win_camp == 1)?'蓝方':'红方');
        data.win = (battleDetail.win_camp == 1)?'蓝方':'红方';

        console.log('[蓝方人头]',battleDetail.camp1.kill_num);
        data.camp1.kill = battleDetail.camp1.kill_num;

        console.log('[红方人头]',battleDetail.camp2.kill_num);
        data.camp2.kill = battleDetail.camp2.kill_num;

        console.log('[蓝方经济]',battleDetail.camp1.gold);
        data.camp1.gold = battleDetail.camp1.gold;

        console.log('[红方经济]',battleDetail.camp2.gold);
        data.camp2.gold = battleDetail.camp2.gold;

        try {
            console.group('[蓝方禁用角色]');
                console.log('[20]',battleDetail.camp1.banbp_list[0].hero_name);
                data.hero[19] = battleDetail.camp1.banbp_list[0].hero_name;

                console.log('[14]',battleDetail.camp1.banbp_list[1].hero_name);
                data.hero[13] = battleDetail.camp1.banbp_list[1].hero_name;

                console.log('[12]',battleDetail.camp1.banbp_list[2].hero_name);
                data.hero[11] = battleDetail.camp1.banbp_list[2].hero_name;

                console.log('[3]',battleDetail.camp1.banbp_list[3].hero_name);
                data.hero[2] = battleDetail.camp1.banbp_list[3].hero_name;

                console.log('[1]',battleDetail.camp1.banbp_list[4].hero_name);
                data.hero[0] = battleDetail.camp1.banbp_list[4].hero_name;

            console.groupEnd();

            console.group('[蓝方选择角色]');
            for (var i in battleDetail.camp1.bp_list) {
                var pos = battleDetail.camp1.bp_list[i].position;
                switch (pos) {
                    case 0:
                        console.log('[17]',battleDetail.camp1.bp_list[i].hero_detail.hero_name);
                        data.hero[16] = battleDetail.camp1.bp_list[i].hero_detail.hero_name;
                        break;
                    case 1:
                        console.log('[16]',battleDetail.camp1.bp_list[i].hero_detail.hero_name);
                        data.hero[15] = battleDetail.camp1.bp_list[i].hero_detail.hero_name;
                        break;
                    case 2:
                        console.log('[9]',battleDetail.camp1.bp_list[i].hero_detail.hero_name);
                        data.hero[8] = battleDetail.camp1.bp_list[i].hero_detail.hero_name;
                        break;
                    case 3:
                        console.log('[8]',battleDetail.camp1.bp_list[i].hero_detail.hero_name);
                        data.hero[7] = battleDetail.camp1.bp_list[i].hero_detail.hero_name;
                        break;
                    case 4:
                        console.log('[5]',battleDetail.camp1.bp_list[i].hero_detail.hero_name);
                        data.hero[4] = battleDetail.camp1.bp_list[i].hero_detail.hero_name;
                        break;
                }
            }
            console.groupEnd();

            console.group('[红方禁用角色]');
                console.log('[2]',battleDetail.camp2.banbp_list[3].hero_name);
                data.hero[1] = battleDetail.camp2.banbp_list[3].hero_name;

                console.log('[4]',battleDetail.camp2.banbp_list[2].hero_name);
                data.hero[3] = battleDetail.camp2.banbp_list[2].hero_name;

                console.log('[11]',battleDetail.camp2.banbp_list[1].hero_name);
                data.hero[10] = battleDetail.camp2.banbp_list[1].hero_name;

                console.log('[13]',battleDetail.camp2.banbp_list[0].hero_name);
                data.hero[12] = battleDetail.camp2.banbp_list[0].hero_name;

                console.log('[19]',battleDetail.camp2.banbp_list[4].hero_name);
                data.hero[18] = battleDetail.camp2.banbp_list[4].hero_name;

            console.groupEnd();

            console.group('[红方选择角色]');
            for (var i in battleDetail.camp2.bp_list) {
                var pos = battleDetail.camp2.bp_list[i].position;
                switch (pos) {
                    case 0:
                        console.log('[6]',battleDetail.camp2.bp_list[i].hero_detail.hero_name);
                        data.hero[5] = battleDetail.camp2.bp_list[i].hero_detail.hero_name;
                        break;
                    case 1:
                        console.log('[7]',battleDetail.camp2.bp_list[i].hero_detail.hero_name);
                        data.hero[6] = battleDetail.camp2.bp_list[i].hero_detail.hero_name;
                        break;
                    case 2:
                        console.log('[10]',battleDetail.camp2.bp_list[i].hero_detail.hero_name);
                        data.hero[9] = battleDetail.camp2.bp_list[i].hero_detail.hero_name;
                        break;
                    case 3:
                        console.log('[15]',battleDetail.camp2.bp_list[i].hero_detail.hero_name);
                        data.hero[14] = battleDetail.camp2.bp_list[i].hero_detail.hero_name;
                        break;
                    case 4:
                        console.log('[18]',battleDetail.camp2.bp_list[i].hero_detail.hero_name);
                        data.hero[17] = battleDetail.camp2.bp_list[i].hero_detail.hero_name;
                        break;
                }
            }
            console.groupEnd();
        } catch(error) {
            console.error('获取数据时遇到错误！')
        }

        // 向后端发送数据
        fetch('http://127.0.0.1:5000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        // 自动前往下一个
        setTimeout(() => {
            next();
        },1000);
    }

    // 自动点击第一局
    setTimeout(() => {
        document.querySelector('#every-game-list li.active').click();
    },1000);
})();