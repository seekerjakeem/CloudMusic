export function sliderEvent(e: Event) {
    e.stopPropagation();
    e.preventDefault();
}

export function getElementOffset(element: HTMLElement):{top: number; left: number}  {
    // 检测当前的DOM是否有问题
    if (!element.getClientRects().length) {
        return {
            top: 0,
            left: 0
        }
    }
    const rect = element.getBoundingClientRect();
    // 获取到当前element所在DOM的节点,所在的window
    const win = element.ownerDocument.defaultView;
    return {
        top: rect.top + win!.pageYOffset, 
        left: rect.left + win!.pageXOffset
    };

    // 判断非空！选项
} 