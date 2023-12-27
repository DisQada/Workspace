# TypeDoc

## Badges

[![github](https://img.shields.io/badge/DisQada/TypeDoc-000000?logo=github&logoColor=white)](https://www.github.com/DisQada/TypeDoc)
[![npm](https://img.shields.io/badge/@disqada/typedoc-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/@disqada/typedoc)

![version](https://img.shields.io/npm/v/@disqada/typedoc.svg?label=latest&logo=npm)
![monthly downloads](https://img.shields.io/npm/dm/@disqada/typedoc.svg?logo=npm)

![test](https://github.com/DisQada/TypeDoc/actions/workflows/test.yml/badge.svg)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Table of Contents

- [TypeDoc](#typedoc)
  - [Badges](#badges)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Learn](#learn)
  - [License](#license)
- [Getting started](#getting-started)
  - [Configurations](#configurations)
  - [Usage](#usage)
    - [npm scripts](#npm-scripts)

## About

This tool is used to generate both declarations and documentations with couple of clicks.

## Learn

Check the [Getting started](#getting-started) guide for first time usage.

## License

Copyright © 2022 [DisQada](https://github.com/DisQada)

This framework is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).  
See the [LICENSE](LICENSE.txt) file for more information.

# Getting started

## Configurations

Add the file `docconfig.json` to your project, below a table of all possible configurations that can be used.

| Property | Type   | Default value | Description                            |
| -------- | ------ | ------------- | -------------------------------------- |
| root     | string | src           | Source code folder                     |
| types    | string | types         | Generate declarations into this folder |
| out      | string | docs          | Generate documentation this folder     |
| npm      | string | name          | Project name in npm                    |
| github   | string | Name          | Project name in GitHub                 |

## Usage

### npm scripts

The tool is used via npm scripts that are already defined in it's package.json file, and can be called from your project npm scripts directly.

Below are the available npm scripts:

- `setup`: Install the required packages as dev dependencies
- `config`: Read and cache the configuration file
- `types`: Generate declarations using cached configurations then `clean`
- `clean`: Clean the declaration files
- `doc/docs`: Generate documentations using cached configurations

First thing to do is to run the following command to install all the necessary dependencies

```bash
npm explore @disqada/typedoc -- npm run setup
```

You'll most likely have the following scripts, use the `setup` script on initialisation and every time you update the configuration file, then use the `types` and `doc/docs` scripts for generating declarations and documentation

```json
"scripts": {
    "config": "npm explore @disqada/typedoc -- npm run config",
    "types": "npm explore @disqada/typedoc -- npm run types",
    "docs": "npm explore @disqada/typedoc -- npm run docs"
}
```

If you're constantly changing the configurations, you can make one script that reads the configurations and generates the declarations/documentation like the following example:

```json
"scripts": {
    "types": "npm explore @disqada/typedoc -- npm run config && npm explore @disqada/typedoc -- npm run types",
    "docs": "npm explore @disqada/typedoc -- npm run config && npm explore @disqada/typedoc -- npm run docs"
}
```
