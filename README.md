# FiveM Lua Language Server Addon

This repository branch is the genrator that generates Lua defination files from
FiveM natives API.

The addon is distributed in `dist` branch.

## Generating

1. Install [Deno](https://deno.land/manual/getting_started/installation).

2. Clone this repository.

3. Run command:

```bash
deno task generate
```

The native definition files are located at
[`addon/library/natives`](/addon/library/natives)

The distribution of the addon is located at [`addon`](/addon)

## Credits

- Cfx and FiveM natives API: [CitizenFX](https://github.com/citizenfx)
- Addon plugin and some `cfx-runtime` defination files:
  [cfxlua-vscode](https://github.com/overextended/cfxlua-vscode)
