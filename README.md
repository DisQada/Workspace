# Workspace

## Badges

[![github](https://img.shields.io/badge/DisQada/Workspace-000000?logo=github&logoColor=white)](https://www.github.com/DisQada/Workspace)
[![npm](https://img.shields.io/badge/@disqada/workspace-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/@disqada/workspace)

![version](https://img.shields.io/npm/v/@disqada/workspace.svg?label=latest&logo=npm)
![monthly downloads](https://img.shields.io/npm/dm/@disqada/workspace.svg?logo=npm)

[![Test](https://github.com/DisQada/Workspace/actions/workflows/test.yml/badge.svg)](https://github.com/DisQada/Workspace/actions/workflows/test.yml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Table of Contents

- [Workspace](#workspace)
  - [Badges](#badges)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [License](#license)
- [Getting Started](#getting-started)
  - [Configurations](#configurations)
  - [Usage](#usage)
    - [Shell Command](#shell-command)
    - [npm Scripts](#npm-scripts)

## About

This tool is used to generate both declarations and documentations with couple of clicks.

## License

Copyright &copy; 2022 [DisQada](https://github.com/DisQada)

This framework is licensed under the [Apache License, Version 2.0](https://apache.org/licenses/LICENSE-2.0).  
See the [LICENSE](LICENSE) file for more information.

# Getting Started

## Configurations

Add the file `workspace.json` to your project, below a table of all possible configurations that can be used.

| Property | Type   | Default value | Description                            |
| -------- | ------ | ------------- | -------------------------------------- |
| root     | string | src           | Source code folder                     |
| types    | string | types         | Generate declarations into this folder |
| out      | string | docs          | Generate documentation this folder     |
| npm      | string | name          | Project name in npm                    |
| github   | string | Name          | Project name in GitHub                 |

## Usage

### Shell Command

To call the package's functionality, use the `workspace` shell command, which accepts the following properties:

| Name          | Type     | required | description                                          |
| ------------- | -------- | -------- | ---------------------------------------------------- |
| path          | Argument | NO       | configuration file path, default: "./workspace.json" |
| --no-config   | Option   | NO       | Use it to not re-setup the configurations            |
| --types OR -t | Option   | NO       | Emit declarations files                              |
| --docs OR -d  | Option   | NO       | Emit documentations files                            |

### npm Scripts

Below are the recommended npm scripts:

> We recommend regenerating the types every time the docs are created to be sure that we're documenting the latest types

- `types`: Generates declarations after re-setting up configurations
- `docs`: runes `types` then generates documentations

```json
"scripts": {
  "types": "workspace ./workspace.json -t",
  "docs": "workspace ./workspace.json -t -d",
}
```

If you rarely change the configurations, you can make two script for each script to reduce the run time

```json
"scripts": {
  "types": "workspace ./workspace.json -t --no-config",
  "types:conf": "workspace ./workspace.json -t",
  "docs": "workspace ./workspace.json -t -d  --no-config",
  "docs:conf": "workspace ./workspace.json -t -d",
}
```
