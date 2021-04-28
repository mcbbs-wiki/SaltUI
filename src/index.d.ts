interface Window {
    /**
     * 显示一个确认框, 返回一个Promise<boolean>, 用 .then((result)=>{ }) 进行后续处理
     * @param argu 要显示的内容, 一串字符串, 如果是HTML代码请使用对象传参
     * @returns 一个Promise<boolean>, 用户点了确定还是取消
     */
    SaltConfirm(argu: string): Promise<boolean>,
    /**
     * 显示一个确认框, 返回一个Promise<boolean>, 用 .then((result)=>{ }) 进行后续处理
     * @param argu 要显示的内容, 用一个对象传参, 其中 text 属性必填
     * @returns 一个Promise<boolean>, 用户点了确定还是取消
     */
    SaltConfirm(argu: { text: string, confirm?: string, cancel?: string, isHTML?: boolean }): Promise<boolean>,
    /**
     * 显示一个提示框
     * @param bindElement 这个tooltip绑定到哪个元素
     * @param text 输入一串字符, 可以是纯文字也可以是HTML代码
     * @param isHTML 指示这段文字是不是HTML代码, 默认false
     */
    SaltToolTip(bindElement: Element, text: string, isHTML?: boolean): Promise<void>,
    /**
     * 显示一个提示框
     * @param bindElement 这个tooltip绑定到哪个元素
     * @param element 输入一个元素, 可以选择直接复制一个还是单纯取用其文本
     * @param deepClone 如果为true, 则直接复制元素内容, 否则仅取用其文本, 默认false
     */
    SaltToolTip(bindElement: Element, element: Element, deepClone?: boolean): Promise<void>,
    /**
     * 为某个元素绑定一个鼠标移入出现的提示框
     * @param bindElement 这个提示框绑定到哪个元素
     * @param text 输入一串字符, 可以是纯文字也可以是HTML代码
     * @param isHTML 指示这段文字是不是HTML代码
     * @returns .stop() 和 .disable() 暂停, restart() 和 enable() 重启, edit(string, ?boolean) 修改显示内容
     */
    SaltHoverToolTip(bindElement: HTMLElement, text: string, isHTML?: boolean)
        : { restart(): void, enable(): void, stop(): void, disable(): void, edit(argu: string | Element, argu2?: boolean): void },
    /**
     * 为某个元素绑定一个鼠标移入出现的提示框
     * @param bindElement 这个提示框绑定到哪个元素
     * @param element 输入一个元素, 可以选择直接复制一个还是单纯取用其文本
     * @param deepClone 如果为true, 则直接复制元素内容, 否则仅取用其文本
     * @returns .stop() 和 .disable() 暂停, restart() 和 enable() 重启, edit(Element, ?boolean) 修改显示内容
     */
    SaltHoverToolTip(bindElement: HTMLElement, element: Element, deepClone?: boolean)
        : { restart(): void, enable(): void, stop(): void, disable(): void, edit(argu: string | Element, argu2?: boolean): void },
    /**在页面下载完毕后, 立即调用这些函数
     * 
     * 如果函数运行时间太长可能会堵塞页面加载
     * 
     * 届时请考虑async关键字
     */
    Salt$(...func: (() => void)[]): void,
    /**
     * 返回符合选择器的HTML元素数组
     * @param selector 选择器, 写法类似于CSS选择器
     * @param limit 限制数量, 默认32767
     */
    Salt$(selector: string, limit?: number): HTMLElement[],
    /**
    * 根据key存入本地存储
    * @param key 键值
    * @param value 要存放的值
    */
    SaltWrite(key: string, value: any),
    /**
     * 根据key读取本地数据，若没有则写入默认数据
     * @param key 键值
     */
    SaltRead<T>(key: string, defaultValue: T): T,
    /**
     * 根据key读取本地数据，若没有则写入默认数据
     * @param key 键值
     */
    SaltReadWithDefault<T>(key: string, defaultValue: T): T,
}
interface HTMLElement {
    /**
     * 批量添加class到元素
     * @param classes 要添加的class用空格隔开
     */
    addClass(classes: string): HTMLElement,
    /**
     * 切换元素的class，没有switch开关
     * @param classes 
     */
    toggleClass(classes: string): HTMLElement,
    /**
     * 检查是否包含某个元素
     * @param classes 
     */
    hasClass(OneClass: string): boolean,
    /**
     * 批量移除元素的class
     * @param classes 
     */
    removeClass(classes: string): HTMLElement,
    /**
     * 返回元素到页面顶部和左边的距离
     * @returns top: 顶部距离; left: 左边距离
     */
    offset(): { top: number, left: number },
    /**将元素的某个属性以数值形式返回 */
    numAttribute(key: string): numAttrReturn,
    /**元素是否部分在可视区域中 */
    inViewport(): boolean,
    /**元素是否全部出现在可视区域中 */
    allInViewport(): boolean,
}
interface numAttrReturn {
    /**值, 整数 */
    value: number,
    /**
     * 将这个属性值设置为
     * @param num 数值
     */
    set: (num: number) => numAttrReturn,
    /**
     * 加减这个属性值
     * @param num 数值
     */
    add: (num: number) => numAttrReturn
}