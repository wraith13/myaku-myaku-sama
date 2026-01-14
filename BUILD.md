# How to build

## Prerequisites

- Node.js (version 16 or higher recommended)
- npm (Node Package Manager)

## Steps

1. Install dependencies:
   ```sh
   npm install
   ```
2. Build the project:
   ```sh
   npm run-script "build all"
   ```

# Build Workflow Diagram

```mermaid
graph TB;
    subgraph ./image
        direction TB;
        ./image/*.svg
    end
    subgraph ./resource
        direction TB;
        ./resource/*.json;
    end
    subgraph ./script
        direction TB;
        st[[./script/*.ts]];
        sj[[./script/index.js]];
        bs([build script]);
    end
    subgraph category
        direction TB;
        bc([build commands]);
        sf[source files];
        gf[[generated files]];
    end
    ./resource/*.json-->bs([build script]);
    st[[./script/*.ts]]-->bs([build script])-->sj[[./script/index.js]];
    wmj[[./web.manifest.json]];
    bwm([build web.manifest]);
    ./resource/*.json-->bwm([build web.manifest]);
    ./web.manifest.template.json-->bwm([build web.manifest]);
    bwm([build web.manifest])-->wmj[[./web.manifest.json]];
    ./resource/*.json-->bh([build html]);
    ./index.css-->bh([build html]);
    sj[[./script/index.js]]-->bh([build html]);
    ./image/*.svg-->bh([build html]);
    ./index.html.template-->bh([build html]);
    bh([build html])-->ih[[./index.html]];
    ./resource/*.json-->bsw([build service-worker]);
    ./sw.js.template-->bsw([build service-worker]);
    bsw([build service-worker])-->sw[[./sw.js]];
```
( You can see this diagram in VS code with [Markdown Preview Mermaid Support extension](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid). )

# Build Commands

- `npm run-script "build all"` — Runs all build processes.
- `npm run-script "build web.manifest"`
- `npm run-script "build service-worker"`
- `npm run-script "build script"`
- `npm run-script "build html"`
