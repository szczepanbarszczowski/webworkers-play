import SocketClass from './SocketClass'
import {ACTION_STATUS, ACTIONS, noOp} from "./utility/constants"

// https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self
// eslint-disable-next-line no-restricted-globals
self.onmessage = (e) => {
    console.log('Message from main thread', e.data)
    const data = e.data
    if (validateEventData(data)) {
        actionSwitcher(data.action, data.payload)
    } else {
        console.log('Invalid message data passed from main thread so taking no action')
    }
}

const validateEventData = (data) => {
    //Validate all the request from main thread if you want to follow strict communication protocols
    //between main thread and the worker thread
    return true
}

let webSocket = null

const orderTableDataCallback = (data, action, status) => {
    postMessage({
        action,
        data,
        status
    })
}

const actionSwitcher = (action = '', payload = {}) => {
    let result = {}
    try {
        switch (action) {
            case ACTIONS.ORDER_TABLE_INIT:
                webSocket = new SocketClass(orderTableDataCallback)
                webSocket.init()
                result = {
                    action: `${ACTIONS.ORDER_TABLE_INIT}`,
                    data: 'Order Table WebSocket initialized',
                    status: ACTION_STATUS.SUCCESS
                }
                break;
            case ACTIONS.WEB_SOCKET_CLOSE:
                webSocket.close()
                // eslint-disable-next-line no-restricted-globals
                self.close()
                break;
            default:
                noOp()
        }
    } catch (e) {
        result.action = action
        result.error = e
        result.status = ACTION_STATUS.FAILURE
    }
    postMessage(result)
}