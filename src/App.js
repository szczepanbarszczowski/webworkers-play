import logo from './logo.svg';
import DedicatedWorkerClass from './DedicatedWorkerClass';
import './App.css';
import {ACTIONS, noOp} from './utility/constants';
import {useEffect, useState} from "react";

function App() {
  const [isWebSocketActiveInWorker, setIsWebSocketActiveInWorker] = useState(false);
  const [orderTableWorker, setOrderTableWorker] = useState(null)
  const [tableData, setTableData] = useState();

  const setWebSocketStatus = (status) => {
    setIsWebSocketActiveInWorker(status)
  }

  const closeWorker = () => {
    orderTableWorker?.postMessage({
      action: ACTIONS.WEB_SOCKET_CLOSE
    })
    setWebSocketStatus(false)
  }

  const createWorker = () => {
    const worker = new DedicatedWorkerClass({
      func: workerOnMessageHandler,
      ctx: this
    })
    worker.postMessage({
      action: ACTIONS.ORDER_TABLE_INIT
    })
    setOrderTableWorker(worker);
  }

  const workerOnMessageHandler = (workerData) => {
    switch(workerData.action) {
      case ACTIONS.WEB_SOCKET_ONOPEN:
        setWebSocketStatus(true)
        console.log('Web socket successfully opened')
        break
      case ACTIONS.ORDER_TABLE_DATA_RECEIVED:
        // console.log('New order table data received', workerData.data)
        setTableData(workerData.data)
        break
      default:
        noOp()
        break
    }
  }

  useEffect(() => {
    createWorker();
    window.addEventListener('unload', () => closeWorker());
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div style={{color: 'red'}}>
          {String(isWebSocketActiveInWorker)}
        </div>

        <div>
          {String(tableData)}
        </div>

        <button disabled={isWebSocketActiveInWorker} onClick={() => createWorker()}>Start</button>
        <button disabled={!isWebSocketActiveInWorker} onClick={() => closeWorker()}>Stop</button>
      </header>
    </div>
  );
}

export default App;
