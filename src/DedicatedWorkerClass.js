//Main thread

class DedicatedWorkerClass {
    constructor (onMessageCtxNFunc = null, onErrorCtxNFunc = null) {
        if(!!window.Worker) {
            this.worker = new Worker(new URL('./worker.js', import.meta.url))
            this.worker.onerror = (e) => this.onError(e)
            this.worker.onmessage = (e) => this.onMessage(e)
            this.userCallbacks = {
                onMessageCtxNFunc,
                onErrorCtxNFunc
            }
        } else {
            throw new Error('WebWorker not supported by browser. Please use an updated browser.')
        }
    }


    loadWebWorker(worker) {
        console.log('worker',worker)

        return ;
    }

    postMessage (data = {}, transferData = []) {
        this.worker.postMessage(data, transferData)
    }

    onError (e) {
        console.log('There is an error with the dedicated worker thread of Order Table', e)
        this.userCallbacks.onErrorCtxNFunc &&
        this.userCallbacks.onErrorCtxNFunc.func.apply(this.userCallbacks.onErrorCtxNFunc.ctx, [e])
    }

    onMessage (e) {
        // console.log('Message from worker thread', e)
        this.userCallbacks.onMessageCtxNFunc &&
        this.userCallbacks.onMessageCtxNFunc.func.apply(this.userCallbacks.onMessageCtxNFunc.ctx, [e.data])
    }
}

export default DedicatedWorkerClass
