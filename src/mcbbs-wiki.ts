type userIntroduce = {
    /**用户名, 会自动转换下划线与空格, 请统一填写下划线, 大小写不敏感 */
    name: string,
    /**用户昵称 */
    nick?: string,
    /**一句话说明 */
    state: string,
    /**颜色, 可以是任何CSS认得出来的颜色 */
    color?: string,
};
(function () {
    // 防止重复启用
    if (typeof window.SaltUIMarkMCBBSWiki == 'boolean' && window.SaltUIMarkMCBBSWiki == true) {
        console.warn('检测到重复启用SaltUI-MCBBSWiki模块')
        return
    }
    else {
        window.SaltUIMarkMCBBSWiki = true
    }
    const read = window.SaltRead, write = window.SaltWrite, $ = window.Salt$, bindtooltip = window.SaltHoverToolTip//, assert = window.SaltAssert
    /**用户介绍 */
    const userIntroducion: userIntroduce[] = [
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
    ]
    /**活跃用户介绍 */
    function userIntroduce() {
        let b = read('saltUI-userIntroduceSetting', true)
        if (!b) return

    }
    /**回退页面前再确认 */
    function reconfirmRollback() {
        let b = read('saltUI-reconfirmRollbackSetting', true)
        if (!b) return
        let anchor = $('.mw-rollback-link a')
        for (let a of anchor) {
            let href = a.getAttribute('href') ?? ''
            /**回退的版本数 */
            let times = ((a.textContent ?? '').match(/回退(.+)次/i) ?? [null, null])[1] ?? '未知数量'
            /**回退谁的编辑 */
            let user = decodeURI((href.match(/from=([^\&]+)\&/i) ?? [null, null])[1] ?? '未知用户名')
                .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\+/g, '_')
            /**被回退的页面 */
            let page = decodeURI((href.match(/title=([^\&]+)\&/i) ?? [null, null])[1] ?? '未知页面名')
                .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\%26/g, '&amp;')
            /**综合说明 */
            let str = '回退由 <b>' + user + '</b> 对 <b>' + page + '</b> 作出的<b>' + times + '</b>次编辑'
            // 添加鼠标悬停说明
            bindtooltip(a, str, true)
            // 添加回退再确认
            let handler = (ev: MouseEvent | TouchEvent) => {
                ev.preventDefault()
                window.SaltConfirm({
                    text: '确定要' + str + '吗？',
                    confirm: '确认回退',
                    cancel: '手滑点错',
                    isHTML: true
                }).then((res) => {
                    if (res)
                        window.location.href = href
                })
            }
            a.addEventListener('click', handler)
            a.addEventListener('touchend', handler)
        }
    }
    /**用提示框显示注释 */
    function refToolTip() {
        let b = read('saltUI-refToolTip', true)
        if (!b) return
        let refs = $('sup.reference')
        // console.log(refs)
        for (let ref of refs) {
            let a = ref.querySelector('a')
            if (!a || !a.href) continue
            let href = a.getAttribute('href') ?? ''
            let li = $(href)[0]
            console.log(li)
            if (!li) continue
            /**获取注释内容 */
            let text = li.querySelector('.reference-text')
            console.log(text)
            if (!text) continue
            bindtooltip(ref, text, true)
        }
    }
    /**配置工具 */
    function setting() {
        let _svg = `<svg class="icon" style="vertical-align: middle;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M650.368 192.64L362.88 480.064l-30.144 90.496-44.416 44.416 120.704 120.704 44.352-44.416 90.56-30.144 287.424-287.488-180.992-180.992z m271.552 150.848c16.64 16.64 16.64 43.648 0 60.288l-331.904 331.904-90.496 30.208-60.352 60.288a42.688 42.688 0 0 1-60.352 0l-180.992-180.992a42.688 42.688 0 0 1 0-60.352l60.288-60.352 30.208-90.496L620.16 102.08c16.64-16.64 43.648-16.64 60.288 0l241.408 241.408z m-271.552-30.208l60.352 60.352-211.2 211.2-60.352-60.352 211.2-211.2zM182.72 720.64l120.704 120.704-60.352 60.352-181.056-60.352 120.704-120.704z"></path></svg>`
        let insertPlace = $('.vector-menu-content-list')[0] ?? $('#p-personal')[0], container = document.createElement('li')
        let frag = document.createDocumentFragment(), a = document.createElement('a')
        // 生成
        window.SaltAssert((insertPlace instanceof HTMLElement), '未找到顶部栏, 无法添加设置按钮')
        a.innerHTML = _svg + 'SaltUI设置'; a.href = 'javascript:;'; container.id = 'saltUI-setting'
        // let svg = a.querySelector('svg')
        // 配置面板
        let settingPanel = document.createElement('div')
        settingPanel.id = 'settingPanel'
        settingPanel.style.display = 'none'
        settingPanel.innerHTML = '<div style="text-align:center"><span style="font-size:1rem">SaltUI设置</span><span style="font-size:.5rem">(需刷新页面生效)</span></div>'
        // 配置面板事件监听
        let posFix = () => {
            if (settingPanel.style.display == 'none') return
            let l = settingPanel.offsetLeft, t = settingPanel.offsetTop, r = l + settingPanel.offsetWidth, b = t + settingPanel.offsetHeight
            /**可视区域高度 */
            // let wh = window.innerHeight ?? document.documentElement.clientHeight
            /**可视区域宽度 */
            let ww = window.innerWidth ?? document.documentElement.clientWidth
            settingPanel.style.left = (l = container.offset().left + container.offsetWidth / 2 - settingPanel.offsetWidth / 2) + 'px'
            settingPanel.style.top = (r = container.getBoundingClientRect().top + container.offsetHeight) + 'px'
            if (l < 0)
                settingPanel.style.left = '0px'
            else if (r > ww)
                settingPanel.style.left = (ww - settingPanel.offsetWidth) + 'px'
        }
        a.onclick = () => {
            settingPanel.style.display = 'block'
            posFix()
        }
        window.addEventListener('resize', posFix)
        let checkMouse = (e: MouseEvent) => {
            let l = settingPanel.offsetLeft, t = settingPanel.offsetTop, r = l + settingPanel.offsetWidth, b = t + settingPanel.offsetHeight
            let x = e.clientX, y = e.clientY
            return x >= l && x <= r && y >= t && y <= b
        }
        window.addEventListener('mousedown', (e) => {
            // 如果鼠标点击点面板在外则关闭面板
            if (settingPanel.style.display == 'block' && !checkMouse(e))
                settingPanel.style.display = 'none'
        })
        // 配置项
        let reconfirmRollbackSetting = bindBooleanSetting('回退页面前再确认', 'reconfirmRollbackSetting')
        let refToolTipSetting = bindBooleanSetting('用提示框显示注释', 'refToolTip')
        let userIntroduceSetting = bindBooleanSetting('显示活跃用户介绍（未实装）', 'userIntroduceSetting')
        function bindBooleanSetting(setting: string, key: string) {
            let b = read('saltUI-' + key, true), isEnable = b, text = ['启用', '禁用']
            let div = document.createElement('div'), disp = document.createElement('span'), showEnable = document.createElement('span')
            div.setAttribute('class', 'btn setting')
            div.setAttribute('style', 'width:20rem;padding:.25rem .5rem;')
            disp.textContent = setting
            disp.setAttribute('style', 'width:60%;padding-left:1rem;text-align:left;')
            showEnable.textContent = isEnable ? text[0] : text[1]
            showEnable.setAttribute('style', 'width:40%;text-align:center;')
            div.appendChild(disp); div.appendChild(showEnable)
            div.onclick = () => {
                isEnable = !isEnable
                write('saltUI-' + key, isEnable)
                showEnable.textContent = isEnable ? text[0] : text[1]
            }
            settingPanel.appendChild(div)
            return div
        }
        // settingPanel.appendChild
        // 添加到DOM
        document.body.appendChild(settingPanel)
        frag.appendChild(container); container.appendChild(a)
        insertPlace.insertBefore(frag, insertPlace.children[1])
    }
    $(setting, reconfirmRollback, refToolTip, userIntroduce)
})()