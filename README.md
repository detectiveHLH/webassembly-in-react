<h1 align="center">WebAssembly-In-React</h1>
In this project, you can use WebAssembly module in React project.

## Usage
```bash
git clone https://github.com/detectiveHLH/webassembly-in-react
cd webassembly-in-react
yarn install
yarn start
```
Then this application will listen on you localhost.Check the console in web site.You will see the result of the function call.

## Core Function
```javascript
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
```
This function will get the C/C++ function that compiled in wasm file.If you want to use the function inside.Just do this.
```javascript
const wasmUrl = 'http://localhost:3000/add.wasm';
const { add } = await this.getExportFunction(wasmUrl);
```

## Performance
Once you start this project, you will see two different fibonacci function running result in the home page.One is implemented by Javascript, another is C，Javascript takes twice as long as C.