/**
 * SPA 路由监听
 */
export const spaRouterListener = function (type) {
    const historyEvent = history[type];
    return function () {
        const newEvent = historyEvent.apply(this, arguments);
        const e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return newEvent;
    };
};
