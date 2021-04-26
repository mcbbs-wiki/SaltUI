// ==UserScript==
// @name         ReferenceToolTip-test
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  miaomiaomiao?
// @author       S
// @match        https://mcbbs-wiki.cn/*
// @grant        none
// ==/UserScript==
// 给HTMLElement原型添加奇怪的方法
(function () {
    if (!HTMLElement.prototype.addClass) {
        HTMLElement.prototype.addClass = function (classes: string): HTMLElement {
            let cls = String(classes).replace(/\s+/gm, ',').split(',');
            for (let c of cls) {
                this.classList.add(c)
            }
            return this
        }
    }
    if (!HTMLElement.prototype.toggleClass) {
        HTMLElement.prototype.toggleClass = function (classes: string): HTMLElement {
            var cls = String(classes).replace(/\s+/gm, ',').split(',');
            for (var c of cls) {
                if (this.classList.contains(c))
                    this.classList.remove(c);
                else
                    this.classList.add(c);
            }
            return this
        }
    }
    if (!HTMLElement.prototype.hasClass) {
        HTMLElement.prototype.hasClass = function (OneClass: string): boolean {
            return this.classList.contains(OneClass);
        }
    }
    if (!HTMLElement.prototype.removeClass) {
        HTMLElement.prototype.removeClass = function (classes: string): HTMLElement {
            var cls = String(classes).replace(/\s+/gm, ',').split(',');
            for (var c of cls) {
                this.classList.remove(c);
            }
            return this
        }
    }
    if (!HTMLElement.prototype.offset) {
        HTMLElement.prototype.offset = function () {
            if (!this.getClientRects().length)
                return { top: 0, left: 0 };
            var rect = this.getBoundingClientRect();
            var win = this.ownerDocument.defaultView ?? { pageYOffset: 0, pageXOffset: 0 };
            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset
            }
        }
    }
    if (!HTMLElement.prototype.numAttribute) {
        HTMLElement.prototype.numAttribute = function (key: string) {
            let value: number
            if (this.hasAttribute(key)) {
                value = parseInt(this.getAttribute(key) ?? '')
            } else {
                value = 0
                this.setAttribute(key, value + '')
            }
            if (isNaN(value)) {
                value = 0
                this.setAttribute(key, value + '')
            }
            return {
                value: value,
                set: (num: number) => {
                    this.setAttribute(key, num + '')
                    return this.numAttribute(key)
                },
                add: (num: number) => {
                    this.setAttribute(key, (value + num) + '')
                    return this.numAttribute(key)
                }
            }
        }
    }
    if (!HTMLElement.prototype.inViewport) {
        HTMLElement.prototype.inViewport = function () {
            let r = this.getBoundingClientRect(), h = window.innerHeight ?? document.documentElement.clientHeight, w = window.innerWidth ?? document.documentElement.clientWidth
            return (
                ((r.top >= 0 && r.top < h) || (r.bottom > 0 && r.bottom <= h)) &&
                ((r.left >= 0 && r.left < w) || (r.right > 0 && r.right <= w))
            )
        }
    }
    if (!HTMLElement.prototype.allInViewport) {
        HTMLElement.prototype.allInViewport = function () {
            let r = this.getBoundingClientRect();
            return (
                r.top >= 0 && r.bottom <= (window.innerHeight ?? document.documentElement.clientHeight) &&
                r.left >= 0 && r.right <= (window.innerWidth ?? document.documentElement.clientWidth)
            )
        }
    }
})();
(function () {
    const i18n = {
        yes: '是的', no: '不是',
        confirm: '确定', cancel: '取消',
        warn: '警告', notice: '提示',
        succeed: '成功', fail: '失败',
        done: '完成',
    }
    const log = console.log, time = console.time, timeEnd = console.timeEnd
    let prefix = '[SaltUI]'
    let ver = '0.1.0'
    // 开始计时
    log(prefix + ver + '正在加载'); time(prefix + ver + '加载完毕')
    // 主过程
    function main() {
        window.SaltConfirm = saltConfirm
        window.SaltToolTip = saltToolTip
        window.SaltHoverToolTip = saltHoverToolTip
    }
    /** 
     * assert: 断言
     * @param condition 为假时报错
     * @param msg 报错语句，默认为“发生错误”
     * */
    function assert(condition: any, msg?: string): asserts condition {
        if (!condition) throw new Error(prefix + ': ' + (msg ?? '发生错误'))
    }
    /**
     * sleep 返回一个延迟一定ms的promise
     * @param time 单位毫秒
    */
    function sleep(time: number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    /**
     * 返回一个div, 定位为按钮
     * @param text 显示的文字
     * @param className 可选, 类名, 因为直接 setAttribute , 因此可以用空格隔开
     * @param listener 可选, 输入一个回调, 监听点击事件
     * @returns 一个div元素
     */
    function newBtn(text: string, className: string = 'btn', listener?: (this: HTMLDivElement, ev: MouseEvent) => any) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        div.textContent = text
        if (typeof listener == 'function')
            div.addEventListener('click', listener)
        return div
    }
    /**
     * 显示一个确认框, 返回一个Promise<boolean>, 用 .then((result)=>{ }) 进行后续处理
     * @param argu 要显示的内容
     * @returns 一个Promise<boolean>, 用户点了确定还是取消
     */
    function saltConfirm(argu: string | { text: string, confirm?: string, cancel?: string, isHTML?: boolean }): Promise<boolean> {
        return new Promise(function (r) {
            let text: string, confirm: string, cancel: string, isHTML = false
            if (typeof argu == 'object') {
                text = argu.text ?? ''
                confirm = argu.confirm ?? i18n.confirm
                cancel = argu.cancel ?? i18n.cancel
                isHTML = argu.isHTML ?? false
            } else {
                text = argu + ''
                confirm = i18n.confirm
                cancel = i18n.cancel
            }
            // 安全锁，防止用户多次点击
            let safe = true
            // 容器
            let container = document.createElement('div')
            container.className = 'saltConfirmContainer'
            let center = document.createElement('center')
            if (isHTML) // 如果是HTML
                center.innerHTML = text
            else
                center.textContent = text
            container.appendChild(center)
            // 确定按钮
            let yesBtn = newBtn(confirm, 'btn confirm', () => {
                if (safe) {
                    safe = false // 安全锁
                    selfRemove() // 移除确认框
                    r(true)
                }
            })
            container.appendChild(yesBtn)
            // 取消按钮
            let noBtn = newBtn(cancel, 'btn confirm', () => {
                if (safe) {
                    safe = false
                    selfRemove()
                    r(false)
                }
            })
            container.appendChild(noBtn)
            // 关闭按钮
            let closeBtn = newBtn('×', 'btn close', () => {
                if (safe) {
                    safe = false
                    selfRemove()
                    r(false)
                }
            })
            container.appendChild(closeBtn)
            // 显示UI
            // container.style.opacity = '0'
            // container.style.top = '20%'
            // container.style.transitionTimingFunction = 'ease-out'
            document.body.appendChild(container)
            container.addClass('fade-in top')
            // 调整位置
            // container.style.marginLeft = (container.offsetWidth * -0.5) + 'px'
            // container.style.marginTop = (container.offsetHeight * -0.5) + 'px'
            // container.style.transitionDuration = '.3s'
            // container.style.opacity = '1'
            // container.style.top = '50%'
            setTimeout(() => { container.removeClass('fade-in top') }, 400)
            /**移除这个确认框 */
            function selfRemove() {
                // container.style.width = container.offsetWidth + 'px' // 触发动画
                // void container.offsetWidth // 触发动画
                container.style.animation = 'saltfadeTop 0.35s' // 触发动画 终 极 解 决 方 案
                container.addClass('fade top')
                setTimeout(() => { container.remove() }, 400)
            }
        })
    }
    /**
     * 显示一个提示框
     * @param bindElement 这个提示框绑定到哪个元素
     * @param text 输入一串字符, 可以是纯文字也可以是HTML代码
     * @param isHTML 指示这段文字是不是HTML代码
     */
    function saltToolTip(bindElement: HTMLElement, text: string, isHTML?: boolean): Promise<void>;
    /**
     * 显示一个提示框
     * @param bindElement 这个提示框绑定到哪个元素
     * @param element 输入一个元素, 可以选择直接复制一个还是单纯取用其文本
     * @param deepClone 如果为true, 则直接复制元素内容, 否则仅取用其文本
     */
    function saltToolTip(bindElement: HTMLElement, element: Element, deepClone?: boolean): Promise<void>;
    function saltToolTip(bindElement: HTMLElement, argu: string | Element, argu2 = false): Promise<void> {
        return new Promise<void>(function (r) {
            let t = ''
            if (argu instanceof Element) {
                t = argu2 ? argu.innerHTML : argu.textContent ?? ''
            } else {
                t = argu + ''
            }
            // 构建提示框
            let stt = document.createElement('div')
            let timer = 0
            stt.className = 'saltToolTip'
            if (argu2)
                stt.innerHTML = t
            else
                stt.textContent = t
            /**开始关闭计时、解绑事件 */
            let tc = () => {
                timer = setTimeout(() => {
                    stt.removeClass('fade-in in')
                    stt.addClass('fade out')
                    setTimeout(() => {
                        stt.remove() // 清理自身
                        // stt = null // 等待清理内存
                    }, 400)
                    // 绑定元素的事件解绑
                    bindElement.removeEventListener('mouseenter', ct)
                    bindElement.removeEventListener('mouseleave', tc)
                    window.removeEventListener('resize', posFix)
                    r()
                }, 400);
            }
            /**清除关闭计时 */
            let ct = () => {
                // stt.removeClass('fade out')
                if (timer > 0) {
                    clearTimeout(timer)
                    timer = 0
                }
            }
            /**位置修正 */
            let posFix = () => {
                let w = stt.offsetWidth, h = stt.offsetHeight, _be = bindElement.offset(), left: number, top: number
                /**绑定元素的长宽、左上边距 */
                let be = { top: _be.top, left: _be.left, width: bindElement.offsetWidth, height: bindElement.offsetHeight }
                /**页面的滚动状况 */
                var win = stt.ownerDocument.defaultView ?? { pageYOffset: 0, pageXOffset: 0 }
                /**可视区域高度 */
                let wh = window.innerHeight ?? document.documentElement.clientHeight
                /**可视区域宽度 */
                let ww = window.innerWidth ?? document.documentElement.clientWidth
                left = be.left + be.width / 2 - w / 2 // 横向居中对齐绑定元素的横轴
                if (left < win.pageXOffset) // 如果左端超出屏幕
                    left = win.pageXOffset // 贴着屏幕左侧
                else if (left + w /*右端*/ > ww + win.pageXOffset) // 如果右端超出屏幕
                    left = ww + win.pageXOffset - w // 贴着屏幕右侧
                top = be.top - h
                if (top < win.pageYOffset) {// 如果上端超出屏幕
                    top = be.top + be.height // 显示在元素下方
                    if (top + h /*下端*/ > win.pageYOffset + wh) // 如果下端超出屏幕
                        top = win.pageYOffset + wh - h // 贴着屏幕下方
                }
                stt.style.setProperty('--top', Math.round(top) + 'px')
                stt.style.setProperty('--left', Math.round(left) + 'px')
            }
            // 绑定事件
            stt.addEventListener('mouseenter', ct)
            stt.addEventListener('mouseleave', tc)
            bindElement.addEventListener('mouseenter', ct)
            bindElement.addEventListener('mouseleave', tc)
            window.addEventListener('resize', posFix)
            // 插入元素
            stt.addClass('fade-in in')
            document.body.appendChild(stt)
            posFix()
        })
    }
    /**
     * 为某个元素绑定一个鼠标移入出现的提示框
     * @param bindElement 这个提示框绑定到哪个元素
     * @param text 输入一串字符, 可以是纯文字也可以是HTML代码
     * @param isHTML 指示这段文字是不是HTML代码
     * @returns .stop() 和 .disable() 暂停, restart() 和 enable() 重启, edit(string, ?boolean) 修改显示内容
     */
    function saltHoverToolTip(bindElement: HTMLElement, text: string, isHTML?: boolean)
        : { restart(): void, enable(): void, stop(): void, disable(): void, edit(argu: string | Element, argu2?: boolean): void };
    /**
     * 为某个元素绑定一个鼠标移入出现的提示框
     * @param bindElement 这个提示框绑定到哪个元素
     * @param element 输入一个元素, 可以选择直接复制一个还是单纯取用其文本
     * @param deepClone 如果为true, 则直接复制元素内容, 否则仅取用其文本
     * @returns .stop() 和 .disable() 暂停, restart() 和 enable() 重启, edit(Element, ?boolean) 修改显示内容
     */
    function saltHoverToolTip(bindElement: HTMLElement, element: Element, deepClone?: boolean)
        : { restart(): void, enable(): void, stop(): void, disable(): void, edit(argu: string | Element, argu2?: boolean): void };
    function saltHoverToolTip(bindElement: HTMLElement, argu: string | Element, argu2 = false)
        : { restart(): void, enable(): void, stop(): void, disable(): void, edit(argu: string | Element, argu2?: boolean): void } {
        let enable = true, _a1 = argu, _a2 = argu2
        let isShow = false
        let handler = () => {
            if (isShow || !enable)
                return
            // 如果尚未显示提示框
            isShow = true
            // @ts-ignore
            saltToolTip(bindElement, _a1, _a2).then(() => { isShow = false })
        }
        bindElement.addEventListener('mouseenter', handler)
        return {
            restart: function () {
                enable = true
            },
            enable: function () {
                enable = false
            },
            stop: function () {
                enable = false
            },
            disable: function () {
                enable = true
            },
            edit: function (argu: string | Element, argu2?: boolean) {
                _a1 = argu
                _a2 = argu2 ?? _a2
            }
        }
    }
    // 调用主函数
    main()
    // 计时结束
    timeEnd(prefix + ver + '加载完毕')
})();