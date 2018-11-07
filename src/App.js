import React, {Component} from 'react';
import fetch from 'node-fetch';
import './App.css';
// import add from './add.wasm';
// import createInstance from "./add.wasm";
import wasmC from './add.c';

class App extends Component {
  constructor() {
    super();
    this.state = {
      jsFibonacci: null,
      cFibonacci: null
    }
  }

  componentDidMount() {
    wasmC({
      'global': {},
      'env': {
        'memoryBase': 0,
        'tableBase': 0,
        'memory': new WebAssembly.Memory({initial: 256}),
        'table': new WebAssembly.Table({initial: 0, element: 'anyfunc'})
      }
    }).then(result => {
      const exports = result.instance.exports;
      const add = exports._add;
      const fibonacci = exports._fibonacci;
      console.log('C return value was', add(2, 3));
      console.log('Fibonacci', fibonacci(2));
    });
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
    if (n <= 1) {
      return n;
    } else {
      return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
  }

  doSomething = async () => {
    // console.log(createInstance.toString());
    // const res = await createInstance();
    // console.log(res);
    const fibonacciUrl = './fibonacci.wasm';
    const {_fibonacci} = await this.getExportFunction(fibonacciUrl);

    this.setState({
      cFibonacci: this.getDuring(_fibonacci),
      jsFibonacci: this.getDuring(this.fibonacci)
    })
  };

  getDuring(func) {
    const start = Date.now();
    func(40);
    return Date.now() - start;
  }

  render() {
    console.log(this.state);
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
