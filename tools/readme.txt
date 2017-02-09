npm install -g typescript
tsc -v

tsc *.ts --out app.js --watch


# Install NPM module.
npm install -g samchon-framework

# Install Definition (*.d.ts) files.
npm install --save @types/samchon-framework
Installs Samchon-Framework from NPM module and imports the definition.

/// <reference types="samchon-framework" />
import samchon = require("samchon-framework");
