"use strict";
(function () {
    const read = window.SaltRead, write = window.SaltRead, $ = window.Salt$, bindtooltip = window.SaltHoverToolTip;
    const userIntroducion = [
        { name: 'salt_lovely', nick: '盐酱', state: 'MCBBSWiki行政员, 负责前端和巡查', color: '#0040ff' },
        { name: 'eicy', nick: '幻沙', state: 'MCBBSWiki站长, 负责掏钱(划掉)后端' },
        { name: 'sheep-realms‎', nick: '绵羊', state: 'MCBBSWiki副站长, 负责后端', color: 'green' },
        { name: 'mashKJo', nick: '穹妹', state: 'MCBBSWiki行政员, 负责整活和处理烂摊子' },
        { name: 'white_i', nick: '白艾', state: 'MCBBSWiki吉祥物行政员' },
        { name: '我是人1012', nick: '文章生成器', state: 'MCBBSWiki吉祥物管理员' },
        { name: '自由李代数', nick: '李代数', state: 'MCBBSWiki管理员, 负责巡查, 编辑量巨大' },
        { name: 'QWERTY_52_38', state: 'MCBBSWiki巡查员, 负责巡查页面' },
        { name: 'jaanai', state: 'MCBBSWiki巡查员, 负责巡查和卖萌(以及被捏)' },
        { name: '凛夜丶雨月', state: 'MCBBSWiki吉祥物巡查员' },
    ];
    function userIntroduce() {
    }
    function reconfirmRollback() {
        let main = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            let anchor = $('.mw-rollback-link a');
            for (let a of anchor) {
                let href = (_a = a.getAttribute('href')) !== null && _a !== void 0 ? _a : '';
                let times = (_d = ((_c = ((_b = a.textContent) !== null && _b !== void 0 ? _b : '').match(/回退(.+)次/i)) !== null && _c !== void 0 ? _c : [null, null])[1]) !== null && _d !== void 0 ? _d : '未知数量';
                let user = decodeURI((_f = ((_e = href.match(/from=([^\&]+)\&/i)) !== null && _e !== void 0 ? _e : [null, null])[1]) !== null && _f !== void 0 ? _f : '未知用户名')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\+/g, '_');
                let page = decodeURI((_h = ((_g = href.match(/title=([^\&]+)\&/i)) !== null && _g !== void 0 ? _g : [null, null])[1]) !== null && _h !== void 0 ? _h : '未知页面名')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\%26/g, '&amp;');
                let str = '回退由 <b>' + user + '</b> 对 <b>' + page + '</b> 作出的<b>' + times + '</b>次编辑';
                bindtooltip(a, str, true);
                let handler = (ev) => {
                    ev.preventDefault();
                    window.SaltConfirm({
                        text: '确定要' + str + '吗？',
                        confirm: '确认回退',
                        cancel: '手滑点错',
                        isHTML: true
                    }).then((res) => {
                        if (res)
                            window.location.href = href;
                    });
                };
                a.addEventListener('click', handler);
                a.addEventListener('touchend', handler);
            }
        };
        main();
    }
    $(reconfirmRollback, userIntroduce);
})();
