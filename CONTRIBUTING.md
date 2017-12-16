# Contributing guide

I'm excited to have you helping out. Thank you so much for your time 😄

## Contributing


**Understanding the codebase**

The source code for the table and results lives in [`src`](./src) folder. There are two sub folders inside `src`, [`components`](./src/components) and [`utils`](./src/utils). The `components` folder contains the devtool UI components
and `utils` contains the code which is responsible for parsing the React performance data and generating an output which is easier to work with.

[`extension`](./extension) folder contains the dependencies used by `react-perf-devtool` and a [`load.js`](./extension/load.js) script to load the devtool.

**Setting up the environment**

Considering you've forked and cloned the repo on your system, switch to the directory and install the dependencies.

```
cd react-perf-devtool
yarn install
```

**Submitting pull requests**

* Create a new branch for the new feature: git checkout -b new-feature
* Make your changes.
* Test everything with yarn test.
* Commit your changes: git commit -m 'Added some new feature'
* Push to the branch: git push origin new-feature
* Submit a pull request with full remarks documenting your changes.
* Test the changes locally
* You can test your changes locally by first running `yarn build` and then loading the extension in Chrome by navigating to `chrome://extensions/`. Browse the extension folder in the root directory and load it.

That's it! I am excited to see your pull request.
