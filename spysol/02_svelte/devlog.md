# SpysolJS 2 development log

A Spider card game in Javascript with Svelte and Snowpack 3.

## 2021-01-26

Create application by:

    # Create 'package.json'.
    npm init

    # Install 'showpack' add it to 'package.json', allow minor version upgrades.
    npm install snowpack@^3.0.11

    # Create Snowpack application stub in examples directory.
    # Npm commands available in Snowpack application: start, run build, test.
    npx create-snowpack-app examples/default-app --template @snowpack/app-template-svelte

    # Delete its repository. (We want only its initial version for reference.)
    rm -r examples/default-app/.git*
