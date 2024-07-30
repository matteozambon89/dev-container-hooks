When you work with dev containers, you may find yourself needing to interact with your local resources from within the dev container. This is cumbersome as you need to open a local terminal to do so.

This package aims to solve this problem by exposing a small server that listens for requests from the dev container and executes the corresponding command on the host machine.

## Usage

### Installing

First you need to pull this repository to your local machine

```sh
git clone https://github.com/mzambon/dev-container-hooks.git
```

Then install the dependencies using the following command

```sh
npm install
```

Finally install the hooks to the repository where the DevContainer is used (usually where a `.devcontainer` folder is present)

```sh
npm run install:hooks
```

Ensure add the hooks loaded `. ./.devcontainer/hooks` script in the zsh or bash config file.

> For example, in your `postCreateCommand` hook you can do the following
>
> ```sh
> sh -c 'echo ". ./.devcontainer/hooks" >> /home/vscode/.zshrc'
> ```

If you want to install the server binary in the system you can use the following commands

```sh
npm run global:install
```

> This command will expose the `dch-server` and `dev-container-hooks-server` binaries in the system

If you want to update the server binary in the system you can use the following commands

```sh
npm run global:update
```

If you want the server to be available independently of the node version loaded via NVM you can use the following command

```sh
npm run install:bins
```

### Running

To run the server you can use the following command

```sh
dch-server
```

In case you want to run the server from the repository, you can use the following command

```sh
npm run start
```

## Resources

### Scripts

You can run npm scripts using the following command

```sh
npm run [command]
```

Available npm scripts are:

- `start` - starts the server
- `install:hooks` - installs the hooks in the `.devcontainer` folder of the chosen repo
  > This executes the `install-hooks` script and will overwrite any existing hooks
- `install:bins` - installs the `dev-container-hooks-server` and `dch-server` binaries in the system
  > This executes the `install-bins` script
- `global:install` - installs the `dev-container-hooks-server` and `dch-server` binaries in the system
- `global:update` - updates the `dev-container-hooks-server` and `dch-server` binaries in the system

### Binaries

- `dev-container-hooks-server` - the server that listens for hooks requests
- `dch-server` - alias for `dev-container-hooks-server`

## Contributing

### Environment Variables Explained

There are 3 layers of environment variables:

- `.env` - server environment variables (see [.env.sample](hooks.env.sample) for an example)
  > These variables must be prefixed with `DCH_SERVER_` and must be defined as `option` in [cli.js](cli.js)
- `hooks.env` - hooks script common environment variables (see [hooks.env.sample](hooks.env.sample) for an example)
  > These variables will only be used in the hooks script installed in the `.devcontainer` folder of the chosen repository
- `lib/{hook_name}/env` - hook specific environment variables (see [lib/git_gui/env.sample](lib/git_gui/env.sample) for an example)
  > These variables will be appended to the `hooks.env` during the hook installation

All files should have an example file suffixed with `.sample`.

### How to Add a New Hook

Create a folder with the name of the hook you want to add (e.g. `my_hook`)

```sh
mkdir my_hook
```

Then in that folder create 3 files (`env.sample`, `route.js` and `hook`)

```sh
touch my_hook/route.js
touch my_hook/hook
touch my_hook/env.sample
```

#### Route

The `route.js` file should export the following properties

- `type` - should always be `hook`
- `route` - the route that will be used to trigger the hook (e.g. `/my_hook`)
- `middleware` - a list of middlewares that will be applied to the hook (e.g. `[logging]`), don't specify if there's none
- `handler` - the function that will be executed when the route is triggered

##### Handler

The `handler` function receives the parameters and the server context. The handler must always call `spawn` with the command you want to execute while the function should return a promise or void.

> **Note**
>
> `cwd` and `workspace` are always provided in the params
>
> - `cwd` - the current working directory
> - `workspace` - the current workspace

```js
const { spawn } = require('child_process')

exports.handler = ({ cwd, workspace, ...params }, ctx) => {
  // ...

  spawn('my_hook', [], { cwd })
}
```

In case the handler should fail, you can throw a JavaScript error `throw new Error('Your error message')`.

#### Hook Script

The `hook` script is the actual hook that you want to execute in the DevContainer. This script is composed as follows.

> The hook script should no be executable nor containing any shebang

The script should contain a function prefixed with `hook`

```sh
# * Your hook name/description
hook_my_hook() {
}
```

The function can handle the various arguments, which should be prefixed by `arg_`

```sh
# * Your hook name/description
hook_my_hook() {
  arg_1=$1
  arg_2=$2
}
```

Then the function should call the `exec_hook` function with the following arguments

```sh
exec_hook [hook_name] <...[arg_name]="args_value">
```

Resulting in something like

```sh
# * Your hook name/description
hook_my_hook() {
  arg_1=$1
  arg_2=$2

  exec_hook my_hook arg_1="$arg_1" arg2="$arg_2"
}
```

And finally the hook should be exported as an alias

```sh
alias my_hook="hook_my_hook"
```

The final script should look like

```sh
# * Your hook name/description
hook_my_hook() {
  arg_1=$1
  arg_2=$2

  exec_hook my_hook arg1="$arg_1" arg2="$arg_2"
}
alias my_hook="hook_my_hook"
```

#### Environment Variables

If the hook requires environment variables, they should be described in the `env.sample` file (see [hooks.env.sample](hooks.env.sample) for an example).
