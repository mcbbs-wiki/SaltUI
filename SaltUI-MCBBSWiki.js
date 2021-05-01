"use strict";
(function () {
    if (!HTMLElement.prototype.addClass) {
        HTMLElement.prototype.addClass = function (classes) {
            let cls = String(classes).replace(/\s+/gm, ',').split(',');
            for (let c of cls) {
                this.classList.add(c);
            }
            return this;
        };
    }
    if (!HTMLElement.prototype.toggleClass) {
        HTMLElement.prototype.toggleClass = function (classes) {
            var cls = String(classes).replace(/\s+/gm, ',').split(',');
            for (var c of cls) {
                if (this.classList.contains(c))
                    this.classList.remove(c);
                else
                    this.classList.add(c);
            }
            return this;
        };
    }
    if (!HTMLElement.prototype.hasClass) {
        HTMLElement.prototype.hasClass = function (OneClass) {
            return this.classList.contains(OneClass);
        };
    }
    if (!HTMLElement.prototype.removeClass) {
        HTMLElement.prototype.removeClass = function (classes) {
            var cls = String(classes).replace(/\s+/gm, ',').split(',');
            for (var c of cls) {
                this.classList.remove(c);
            }
            return this;
        };
    }
    if (!HTMLElement.prototype.offset) {
        HTMLElement.prototype.offset = function () {
            var _a;
            if (!this.getClientRects().length)
                return { top: 0, left: 0 };
            var rect = this.getBoundingClientRect();
            var win = (_a = this.ownerDocument.defaultView) !== null && _a !== void 0 ? _a : { pageYOffset: 0, pageXOffset: 0 };
            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            };
        };
    }
    if (!HTMLElement.prototype.numAttribute) {
        HTMLElement.prototype.numAttribute = function (key) {
            var _a;
            let value;
            if (this.hasAttribute(key)) {
                value = parseInt((_a = this.getAttribute(key)) !== null && _a !== void 0 ? _a : '');
            }
            else {
                value = 0;
                this.setAttribute(key, value + '');
            }
            if (isNaN(value)) {
                value = 0;
                this.setAttribute(key, value + '');
            }
            return {
                value: value,
                set: (num) => {
                    this.setAttribute(key, num + '');
                    return this.numAttribute(key);
                },
                add: (num) => {
                    this.setAttribute(key, (value + num) + '');
                    return this.numAttribute(key);
                }
            };
        };
    }
    if (!HTMLElement.prototype.inViewport) {
        HTMLElement.prototype.inViewport = function () {
            var _a, _b;
            let r = this.getBoundingClientRect(), h = (_a = window.innerHeight) !== null && _a !== void 0 ? _a : document.documentElement.clientHeight, w = (_b = window.innerWidth) !== null && _b !== void 0 ? _b : document.documentElement.clientWidth;
            return (((r.top >= 0 && r.top < h) || (r.bottom > 0 && r.bottom <= h)) &&
                ((r.left >= 0 && r.left < w) || (r.right > 0 && r.right <= w)));
        };
    }
    if (!HTMLElement.prototype.allInViewport) {
        HTMLElement.prototype.allInViewport = function () {
            var _a, _b;
            let r = this.getBoundingClientRect();
            return (r.top >= 0 && r.bottom <= ((_a = window.innerHeight) !== null && _a !== void 0 ? _a : document.documentElement.clientHeight) &&
                r.left >= 0 && r.right <= ((_b = window.innerWidth) !== null && _b !== void 0 ? _b : document.documentElement.clientWidth));
        };
    }
})();
"use strict";
(function () {
    const i18n = {
        yes: '是的', no: '不是',
        confirm: '确定', cancel: '取消',
        warn: '警告', notice: '提示',
        succeed: '成功', fail: '失败',
        done: '完成',
    };
    const log = console.log, time = console.time, timeEnd = console.timeEnd;
    let prefix = '[SaltUI]';
    let ver = '0.1.0';
    log(prefix + ver + '正在加载');
    time(prefix + ver + '加载完毕');
    function main() {
        window.SaltConfirm = saltConfirm;
        window.SaltToolTip = saltToolTip;
        window.SaltHoverToolTip = saltHoverToolTip;
        window.Salt$ = salt$;
        window.SaltRead = readWithDefault;
        window.SaltWrite = write;
        window.SaltReadWithDefault = readWithDefault;
        window.SaltAssert = assert;
    }
    function assert(condition, msg) {
        if (!condition)
            throw new Error(prefix + ': ' + (msg !== null && msg !== void 0 ? msg : '发生错误'));
    }
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function newBtn(text, className = 'btn', listener) {
        let div = document.createElement('div');
        div.setAttribute('class', className);
        div.textContent = text;
        if (typeof listener == 'function')
            div.addEventListener('click', listener);
        return div;
    }
    function saltConfirm(argu) {
        return new Promise(function (r) {
            var _a, _b, _c, _d;
            let text, confirm, cancel, isHTML = false;
            if (typeof argu == 'object') {
                text = (_a = argu.text) !== null && _a !== void 0 ? _a : '';
                confirm = (_b = argu.confirm) !== null && _b !== void 0 ? _b : i18n.confirm;
                cancel = (_c = argu.cancel) !== null && _c !== void 0 ? _c : i18n.cancel;
                isHTML = (_d = argu.isHTML) !== null && _d !== void 0 ? _d : false;
            }
            else {
                text = argu + '';
                confirm = i18n.confirm;
                cancel = i18n.cancel;
            }
            let safe = true;
            let container = document.createElement('div');
            container.className = 'saltConfirmContainer';
            let center = document.createElement('center');
            if (isHTML)
                center.innerHTML = text;
            else
                center.textContent = text;
            container.appendChild(center);
            let yesBtn = newBtn(confirm, 'btn confirm', () => {
                if (safe) {
                    safe = false;
                    selfRemove();
                    r(true);
                }
            });
            container.appendChild(yesBtn);
            let noBtn = newBtn(cancel, 'btn confirm', () => {
                if (safe) {
                    safe = false;
                    selfRemove();
                    r(false);
                }
            });
            container.appendChild(noBtn);
            let closeBtn = newBtn('×', 'btn close', () => {
                if (safe) {
                    safe = false;
                    selfRemove();
                    r(false);
                }
            });
            container.appendChild(closeBtn);
            document.body.appendChild(container);
            container.addClass('fade-in top');
            setTimeout(() => { container.removeClass('fade-in top'); }, 300);
            function selfRemove() {
                container.style.animation = 'saltfadeTop 0.35s';
                container.addClass('fade top');
                setTimeout(() => { container.remove(); }, 300);
            }
        });
    }
    function saltToolTip(bindElement, argu, argu2 = false) {
        return new Promise(function (r) {
            var _a;
            let t = '';
            if (argu instanceof Element) {
                t = argu2 ? argu.innerHTML : (_a = argu.textContent) !== null && _a !== void 0 ? _a : '';
            }
            else {
                t = argu + '';
            }
            let stt = document.createElement('div');
            let timer = 0;
            stt.className = 'saltToolTip';
            if (argu2)
                stt.innerHTML = t;
            else
                stt.textContent = t;
            let tc = () => {
                timer = setTimeout(() => {
                    stt.removeClass('fade-in in');
                    stt.addClass('fade out');
                    setTimeout(() => {
                        stt.remove();
                    }, 300);
                    bindElement.removeEventListener('mouseenter', ct);
                    bindElement.removeEventListener('mouseleave', tc);
                    window.removeEventListener('resize', posFix);
                    r();
                }, 250);
            };
            let ct = () => {
                if (timer > 0) {
                    clearTimeout(timer);
                    timer = 0;
                }
            };
            let posFix = () => {
                var _a, _b, _c;
                let w = stt.offsetWidth, h = stt.offsetHeight, _be = bindElement.offset(), left, top;
                let be = { top: _be.top, left: _be.left, width: bindElement.offsetWidth, height: bindElement.offsetHeight };
                var win = (_a = stt.ownerDocument.defaultView) !== null && _a !== void 0 ? _a : { pageYOffset: 0, pageXOffset: 0 };
                let wh = (_b = window.innerHeight) !== null && _b !== void 0 ? _b : document.documentElement.clientHeight;
                let ww = (_c = window.innerWidth) !== null && _c !== void 0 ? _c : document.documentElement.clientWidth;
                left = be.left + be.width / 2 - w / 2;
                if (left < win.pageXOffset)
                    left = win.pageXOffset;
                else if (left + w > ww + win.pageXOffset)
                    left = ww + win.pageXOffset - w;
                top = be.top - h;
                if (top < win.pageYOffset) {
                    top = be.top + be.height;
                    if (top + h > win.pageYOffset + wh)
                        top = win.pageYOffset + wh - h;
                }
                stt.style.setProperty('--top', Math.round(top) + 'px');
                stt.style.setProperty('--left', Math.round(left) + 'px');
            };
            stt.addEventListener('mouseenter', ct);
            stt.addEventListener('mouseleave', tc);
            bindElement.addEventListener('mouseenter', ct);
            bindElement.addEventListener('mouseleave', tc);
            window.addEventListener('resize', posFix);
            stt.addClass('fade-in in');
            document.body.appendChild(stt);
            posFix();
        });
    }
    function saltHoverToolTip(bindElement, argu, argu2 = false) {
        let enable = true, _a1 = argu, _a2 = argu2;
        let isShow = false;
        let handler = () => {
            if (isShow || !enable)
                return;
            isShow = true;
            saltToolTip(bindElement, _a1, _a2).then(() => { isShow = false; });
        };
        bindElement.addEventListener('mouseenter', handler);
        return {
            restart: function () {
                enable = true;
            },
            enable: function () {
                enable = true;
            },
            stop: function () {
                enable = false;
            },
            disable: function () {
                enable = false;
            },
            edit: function (argu, argu2) {
                _a1 = argu;
                _a2 = argu2 !== null && argu2 !== void 0 ? argu2 : _a2;
            }
        };
    }
    function salt$() {
        let _argu = arguments;
        let type = typeof _argu[0];
        switch (type) {
            case 'string': return selector();
            case 'function': return runFunc();
        }
        function runFunc() {
            let fun = () => {
                for (let i = 0; i < _argu.length; i++) {
                    let f = _argu[i];
                    if (typeof f == 'function')
                        f.call(null);
                }
            };
            if (document.readyState == 'loading')
                document.addEventListener('DOMContentLoaded', fun);
            else
                fun();
        }
        function selector() {
            var _a;
            let limit = (_a = _argu[1]) !== null && _a !== void 0 ? _a : 32767, res = [];
            let result = document.querySelectorAll(_argu[0]), len = result.length;
            for (let i = 0; i < len; i++)
                if (result[i] instanceof HTMLElement)
                    if (res.length < limit)
                        res.push(result[i]);
                    else
                        break;
            return res;
        }
    }
    function write(key, value) {
        assert(key.length > 0);
        if (value) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }
    function readWithDefault(key, defaultValue) {
        assert(key.length > 0);
        let value = localStorage.getItem(key);
        if (value && value != "undefined" && value != "null") {
            let temp = JSON.parse(value);
            if (typeof defaultValue == 'boolean' && typeof temp == 'string') {
                if (temp == 'true') {
                    temp = true;
                }
                else {
                    temp = false;
                }
            }
            return temp;
        }
        write(key, defaultValue);
        return defaultValue;
    }
    main();
    timeEnd(prefix + ver + '加载完毕');
})();
"use strict";
(function () {
    let s = document.createElement('style');
    s.textContent = `@keyframes saltfromTop{from{opacity:0;top:0;transition-timing-function:ease-out}to{opacity:1;top:50%;transition-timing-function:ease-out}}@keyframes saltfadeTop{from{opacity:1;top:50%;transition-timing-function:ease-in}to{opacity:0;top:0;transition-timing-function:ease-in}}@keyframes saltfade-in{from{opacity:0}to{opacity:1}}@keyframes saltfade-out{from{opacity:1}to{opacity:0}}.fade,.fade-out{opacity:0;pointer-events:none}.fade.out,.fade-out.out{animation:saltfade-out 0.3s}.fade.top,.fade-out.top{animation:saltfadeTop 0.3s}.fade-in{opacity:1}.fade-in.in{animation:saltfade-in 0.3s}.fade-in.top{animation:saltfromTop 0.3s}.btn{cursor:pointer;user-select:none;text-align:center}.btn.disable{cursor:not-allowed;pointer-events:none}.saltConfirmContainer{position:fixed;left:50%;top:50%;transform:translate(-50%, -50%);width:25rem;max-width:80vw;min-width:16rem;max-height:80vh;z-index:10000;background-color:#f9f9f9;background-clip:content-box;border:8px solid rgba(102,102,102,0.5);border-radius:8px;box-shadow:2px 2px 5px 1px #222;overflow:hidden;font-size:1rem;user-select:none}.saltConfirmContainer>center{padding:0.5rem 1rem 1rem;border-bottom:1px solid #666}.saltConfirmContainer .btn{box-sizing:border-box;float:left;width:calc(50% - 2rem);padding:1rem;margin:0 1rem 0 1rem;font-size:1.15rem;line-height:1.15rem;background-color:transparent}.saltConfirmContainer .close{position:absolute;width:2rem;height:2rem;top:0;right:0;padding:0;margin:0;border-radius:1rem;font-size:2rem;line-height:2rem;text-align:center}.saltToolTip{position:absolute;left:var(--left, 50%);top:var(--top, 50%);min-width:2rem;max-width:50vw;min-height:1rem;max-height:50vh;padding:0.25rem 0.5rem;z-index:10010;background-color:#f9f9f9;box-shadow:2px 2px 5px 1px #666;transition:box-shadow 0.3s ease;font-size:1rem;white-space:normal}.saltToolTip:hover{box-shadow:1px 1px 3px 0px #666}#saltUI-setting{padding-top:0 !important}#saltUI-setting .icon{width:20px;height:20px;fill:#000;border-radius:2px;opacity:0.5}#saltUI-setting:active .icon{box-shadow:0 0 0 1px #fff, 0 0 0 3px #36c}#settingPanel{position:fixed;padding:0.5rem 0;min-height:1rem;max-height:70vh;background-color:#f9f9f9;box-shadow:1px 1px 3px 0px #666;border-radius:2px;z-index:9990}#settingPanel .setting{background-color:transparent;transition:background-color 0.1s ease}#settingPanel .setting:hover{background-color:rgba(153,153,153,0.2)}#settingPanel .setting:active{background-color:rgba(153,153,153,0.5)}#settingPanel .setting span{display:inline-block;box-sizing:border-box}
`;
    document.head.appendChild(s);
})();
"use strict";
(function () {
    if (typeof window.SaltUIMarkMCBBSWiki == 'boolean' && window.SaltUIMarkMCBBSWiki == true) {
        console.warn('检测到重复启用SaltUI-MCBBSWiki模块');
        return;
    }
    else {
        window.SaltUIMarkMCBBSWiki = true;
    }
    const read = window.SaltRead, write = window.SaltWrite, $ = window.Salt$, bindtooltip = window.SaltHoverToolTip;
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
        let b = read('saltUI-userIntroduceSetting', true);
        if (!b)
            return;
    }
    function reconfirmRollback() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let b = read('saltUI-reconfirmRollbackSetting', true);
        if (!b)
            return;
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
    }
    function refToolTip() {
        var _a;
        let b = read('saltUI-refToolTip', true);
        if (!b)
            return;
        let refs = $('sup.reference');
        for (let ref of refs) {
            let a = ref.querySelector('a');
            if (!a || !a.href)
                continue;
            let href = (_a = a.getAttribute('href')) !== null && _a !== void 0 ? _a : '';
            let li = $(href)[0];
            console.log(li);
            if (!li)
                continue;
            let text = li.querySelector('.reference-text');
            console.log(text);
            if (!text)
                continue;
            bindtooltip(ref, text, true);
        }
    }
    function setting() {
        var _a;
        let _svg = `<svg class="icon" style="vertical-align: middle;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M650.368 192.64L362.88 480.064l-30.144 90.496-44.416 44.416 120.704 120.704 44.352-44.416 90.56-30.144 287.424-287.488-180.992-180.992z m271.552 150.848c16.64 16.64 16.64 43.648 0 60.288l-331.904 331.904-90.496 30.208-60.352 60.288a42.688 42.688 0 0 1-60.352 0l-180.992-180.992a42.688 42.688 0 0 1 0-60.352l60.288-60.352 30.208-90.496L620.16 102.08c16.64-16.64 43.648-16.64 60.288 0l241.408 241.408z m-271.552-30.208l60.352 60.352-211.2 211.2-60.352-60.352 211.2-211.2zM182.72 720.64l120.704 120.704-60.352 60.352-181.056-60.352 120.704-120.704z"></path></svg>`;
        let insertPlace = (_a = $('.vector-menu-content-list')[0]) !== null && _a !== void 0 ? _a : $('#p-personal')[0], container = document.createElement('li');
        let frag = document.createDocumentFragment(), a = document.createElement('a');
        window.SaltAssert((insertPlace instanceof HTMLElement), '未找到顶部栏, 无法添加设置按钮');
        a.innerHTML = _svg + 'SaltUI设置';
        a.href = 'javascript:;';
        container.id = 'saltUI-setting';
        let settingPanel = document.createElement('div');
        settingPanel.id = 'settingPanel';
        settingPanel.style.display = 'none';
        settingPanel.innerHTML = '<div style="text-align:center"><span style="font-size:1rem">SaltUI设置</span><span style="font-size:.5rem">(需刷新页面生效)</span></div>';
        let posFix = () => {
            var _a;
            if (settingPanel.style.display == 'none')
                return;
            let l = settingPanel.offsetLeft, t = settingPanel.offsetTop, r = l + settingPanel.offsetWidth, b = t + settingPanel.offsetHeight;
            let ww = (_a = window.innerWidth) !== null && _a !== void 0 ? _a : document.documentElement.clientWidth;
            settingPanel.style.left = (l = container.offset().left + container.offsetWidth / 2 - settingPanel.offsetWidth / 2) + 'px';
            settingPanel.style.top = (r = container.getBoundingClientRect().top + container.offsetHeight) + 'px';
            if (l < 0)
                settingPanel.style.left = '0px';
            else if (r > ww)
                settingPanel.style.left = (ww - settingPanel.offsetWidth) + 'px';
        };
        a.onclick = () => {
            settingPanel.style.display = 'block';
            posFix();
        };
        window.addEventListener('resize', posFix);
        let checkMouse = (e) => {
            let l = settingPanel.offsetLeft, t = settingPanel.offsetTop, r = l + settingPanel.offsetWidth, b = t + settingPanel.offsetHeight;
            let x = e.clientX, y = e.clientY;
            return x >= l && x <= r && y >= t && y <= b;
        };
        window.addEventListener('mousedown', (e) => {
            if (settingPanel.style.display == 'block' && !checkMouse(e))
                settingPanel.style.display = 'none';
        });
        let reconfirmRollbackSetting = bindBooleanSetting('回退页面前再确认', 'reconfirmRollbackSetting');
        let refToolTipSetting = bindBooleanSetting('用提示框显示注释', 'refToolTip');
        let userIntroduceSetting = bindBooleanSetting('显示活跃用户介绍（未实装）', 'userIntroduceSetting');
        function bindBooleanSetting(setting, key) {
            let b = read('saltUI-' + key, true), isEnable = b, text = ['启用', '禁用'];
            let div = document.createElement('div'), disp = document.createElement('span'), showEnable = document.createElement('span');
            div.setAttribute('class', 'btn setting');
            div.setAttribute('style', 'width:20rem;padding:.25rem .5rem;');
            disp.textContent = setting;
            disp.setAttribute('style', 'width:60%;padding-left:1rem;text-align:left;');
            showEnable.textContent = isEnable ? text[0] : text[1];
            showEnable.setAttribute('style', 'width:40%;text-align:center;');
            div.appendChild(disp);
            div.appendChild(showEnable);
            div.onclick = () => {
                isEnable = !isEnable;
                write('saltUI-' + key, isEnable);
                showEnable.textContent = isEnable ? text[0] : text[1];
            };
            settingPanel.appendChild(div);
            return div;
        }
        document.body.appendChild(settingPanel);
        frag.appendChild(container);
        container.appendChild(a);
        insertPlace.insertBefore(frag, insertPlace.children[1]);
    }
    $(setting, reconfirmRollback, refToolTip, userIntroduce);
})();
