// Root ESLint flat config. The shared rules live in the workspace config package
// so every package can consume the same rules; this file re-exports them for the
// repository root. See tools/eslint-config and Engineering Rule 1.
import baseConfig from './tools/eslint-config/index.js';

export default baseConfig;
