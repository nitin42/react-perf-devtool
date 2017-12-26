# Contributing guide

I'm excited to have you helping out. Thank you so much for your time 😄

## Contributing

### Understanding the codebase

The source code for the table and results lives in [`src`](./src) folder.
There are three folders inside `src`, [extension](./src/extension), [npm](./src/npm), and [shared](./src/shared). The `extension` folder contains the devtool UI components, `npm` folder contains the code for registering the observer and `shared` contains the code that which is shared by both `extension` and `npm`, and is responsible for parsing the React performance data and generating an output which is easier to work with.

In the root directory, [`extension`](./extension) folder contains the dependencies used by `react-perf-devtool` and a [`load.js`](./extension/load.js) script to load the devtool.

### Setting up the development environment

**Installation**

Considering you've forked and cloned the repo on your system, switch to the directory and install the dependencies.

```
cd react-perf-devtool
yarn install
```

**Build**

After you've made changes to the project, you'll need to load the unpacked extension in Chrome to test whether its working or not. For this, you'll first need to generate a build.

```
yarn build
```

Running this command will create a build directory in `./extension` folder.

**Test**

To test your changes, simply run `jest --watch` if you've installed Jest globally on your system or run `yarn test`.

> [Read the documentation about Jest](https://facebook.github.io/jest/)

**Format**

To format all the files in `./src` directory, run `yarn format`. This will format all the files using [Prettier](https://prettier.io/).

**Generate**

To generate a `.zip` extension (required when uploading the extension), run `yarn generate`. This will create a `.zip` for the extension and will also generate a build directory.

**Uploading the extension on Chrome and Firefox**

This extension is cross-browser compatible because it uses the [Web Extension API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API) but with few changes to `manifest.json` file.

To upload the extension on Google Chrome:

* Generate a build using `yarn build`.
* Go to `chrome://extensions`.
* Load the unpacked extension by loading the `./extension` directory.
* Start your development server (eg - localhost:3000?react_perf) and open the extension using Chrome devtools.
* Reload the inspected window if necessary and you should see the performance measures of your React components.

To upload the extension on Firefox:

* Follow the same procedure for generating the build.
* Go to `about:debugging` and check the box for *Enable add-on debugging*.
* Then click the button **Load Temporary Add-on** and select any file from the extension directory.
* Open the devtools and you should see the extension loaded.

**Inspecting the measures**

After uploading the extension in the browser, you will see that it will collect the measures using `window.performance` API and will display the performance stats in a table. Below the table, you'll see some more results which includes commit host effects time, commit changes time, lifecycle methods and total time.

To learn more about these stats and different phases, see [this](https://github.com/nitin42/react-perf-devtool#description) guide.

### Submitting pull requests

* Create a new branch for the new feature: git checkout -b new-feature
* Make your changes.
* Test everything with yarn test.
* Commit your changes: git commit -m 'Added some new feature'
* Push to the branch: git push origin new-feature
* Submit a pull request with full remarks documenting your changes.
* Test the changes locally
* You can test your changes locally by first running `yarn build` and then loading the extension in Chrome by navigating to `chrome://extensions/`. Browse the extension folder in the root directory and load it.

That's it! I am excited to see your pull request.
