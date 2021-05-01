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