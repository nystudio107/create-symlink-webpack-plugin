## How it works

webpack 4 plugin to generate symlinks

## Usage

```js
const CreateSymlinkPlugin = require('create-symlink-webpack-plugin');
module.exports = {
    plugins: [
        new CreateSymlinkPlugin([
            {
                origin: 'index.html',
                symlink: '200.html',
            },
        ])
    ]
}
```

All paths are relative to your webpack `output.path`

You can pass in either an object, or an array of objects. there is also an optional `force` parameter, that will caused it to create the symlink even if the destination file doesn't exist:

```js
const CreateSymlinkPlugin = require('create-symlink-webpack-plugin');
module.exports = {
    plugins: [
        new CreateSymlinkPlugin([
            {
                origin: 'index.html',
                symlink: '200.html',
            },
            true
        ])
    ]
}
```

## Options

* **origin** path to the original file or directory
* **symlink** path for the symlink

These are both relative to your webpack `output.path`
