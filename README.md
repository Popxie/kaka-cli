# 介绍

## 第三方库

- [execa 中文说明](http://abloz.com/tech/2018/08/21/nodejs-execa/)

  > execa 是可以调用 shell 和本地外部程序的 javascript 封装。会启动子进程执行。支持多操作系统，包括 windows。如果父进程退出，则生成的全部子进程都被杀死。

- [inquirer](https://www.npmjs.com/package/inquirer)

  > 询问插件，根据设置的问题来做出回答，具体使用可以参考`inquirer-demo/*.js`的例子

- [commander](https://www.npmjs.com/package/commander)

  > 命令行工具

- [minimist](https://www.npmjs.com/package/minimist)

  > 格式化 arg 参数

- [semver](https://www.npmjs.com/package/semver)

  > 获取版本号，可以直接`npm link`，执行 `semver v1.2.3` => `1.2.3`

## 文档

[Node.js 中文网](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options)

## 知识点

1. \_\_dirname

   ```text
   __dirname: 获得当前执行文件所在目录的完整目录名（当前工作的目录）
   __filename: 获得当前执行文件的带有完整绝对路径的文件名
   process.cwd(): 获得当前执行node命令时候的文件夹目录名 ./：
   ```

2. npm run test

```json
"scripts": {
  "test": "cross-env-shell VUE_CLI_TEST=true kaka create",
},
```

当执行 `npm run test hello` 或者 `npm run test -- hello`时会执行成`cross-env-shell VUE_CLI_TEST=true kaka create hello`
