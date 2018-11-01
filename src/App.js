import React, {Component} from 'react';
import fetch from 'node-fetch';
import './App.css';

class App extends Component {
  constructor () {
    super();
    this.state = {
      jsFibonacci: null,
      cFibonacci: null
    }
  }

  componentDidMount() {
    this.doSomething();
  }

  getExportFunction = async (url) => {
    const env = {
      memoryBase: 0,
      tableBase: 0,
      memory: new WebAssembly.Memory({
        initial: 256
      }),
      table: new WebAssembly.Table({
        initial: 2,
        element: 'anyfunc'
      })
    };
    const instance = await fetch(url).then((response) => {
      return response.arrayBuffer();
    }).then((bytes) => {
      return WebAssembly.instantiate(bytes, {env: env})
    }).then((instance) => {
      return instance.instance.exports;
    });
    return instance;
  };

  fibonacci = (n) => {
    if (n <=1 ) {
      return n;
    } else {
      return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
  }

  doSomething = async () => {
    const fibonacciUrl = 'http://localhost:3000/fibonacci.wasm';
    const { _fibonacci } = await this.getExportFunction(fibonacciUrl);

    this.setState({
      cFibonacci: this.getDuring(_fibonacci),
      jsFibonacci: this.getDuring(this.fibonacci)
    })
  };

  getDuring (func) {
    const start = Date.now();
    func(41);
    return Date.now() - start;
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <header className="App-header">
          <h2>测试计算递归无优化的斐波那契数列性能</h2>
          <h3>当值为 41 时</h3>
          <span>Javascript实现的斐波那契函数耗费： {this.state.jsFibonacci} ms</span>
          <span>C实现的斐波那契函数耗费： {this.state.cFibonacci} ms</span>
        </header>
      </div>
    );
  }
}

export default App;
