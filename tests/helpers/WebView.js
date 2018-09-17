export const CONTEXT_REF = {
    NATIVE: 'native',
    WEBVIEW: 'webview',
};
const DOCUMENT_READY_STATE = {
    COMPLETE: 'complete',
    INTERACTIVE: 'interactive',
    LOADING: 'loading',
};

class WebView{
    /**
     * Wait for the webview context to be loaded
     *
     * By default you have `NATIVE_APP` as the current context. If a webview is loaded it will be
     * added to the current contexts and will looks something like this
     * `["NATIVE_APP","WEBVIEW_28158.2"]`
     * The number behind `WEBVIEW` can be any string
     */
    waitForWebViewContextLoaded(){
        browser.waitUntil(
            () => {
                const currentContexts = browser.contexts().value;

                return currentContexts.length > 1
                    && currentContexts.find(context => context.toLowerCase().includes(CONTEXT_REF.WEBVIEW));
            },
            10000,
            'Webview context not loaded',
            100
        );
    }

    /**
     * Switch to native or webview context
     *
     * @param {string} context should be native of webview
     */
    switchToContext(context) {
        const currentContexts = browser.contexts().value;
        const index = currentContexts.findIndex(currentContext => currentContext.toLowerCase().includes(context));

        browser.context(currentContexts[index]);
    }

    /**
     * Wait for the document to be full loaded
     */
    waitForDocumentFullyLoaded() {
        browser.waitUntil(
            () => browser.execute(() => document.readyState).value === DOCUMENT_READY_STATE.COMPLETE,
            15000,
            'Website not loaded',
            100
        );
    }

    /**
     * Wait for the website in the webview to be loaded
     */
    waitForWebsiteLoaded() {
        this.waitForWebViewContextLoaded();
        this.switchToContext(CONTEXT_REF.WEBVIEW);
        this.waitForDocumentFullyLoaded();
        this.switchToContext(CONTEXT_REF.NATIVE);
    }
}

export default WebView;
