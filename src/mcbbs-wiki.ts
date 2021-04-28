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
    const read = window.SaltRead, write = window.SaltRead, $ = window.Salt$, bindtooltip = window.SaltHoverToolTip
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
    function userIntroduce() {

    }
    /**回退页面前再确认 */
    function reconfirmRollback() {
        let main = () => {
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
        main()
    }
    $(reconfirmRollback, userIntroduce)
})()