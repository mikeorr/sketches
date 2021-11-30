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

Merge stub code into top-level application directory:

    Copy additional content into:
        package.json
        .gitignore
    Run 'npm install', which will add entries to 'package-lock.json'.
    Copy files:
        public/
            favicon.ico
            index.html
            logo.svg
            robots.txt
        src/
            App.svelte
            App.test.js
            index.js

Run `npm start` or `npx snowpack dev` to start the development server, launch
the default web browser, and load the page into a new browser tab. Or run `npm
run build` or `npx snowpack build` to compile it to a static directory "build"
for production. See `npx snowpack --help` for additional commands and options.
