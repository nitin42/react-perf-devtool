# React Performance Devtool

> A chrome devtool extension for inspecting the performance of React Components

<p align="center">
  <img src="./RPLogo.png">
</p>

## Table of contents

* [Introduction](#introduction)

* [Demo](#demo)

* [Uses](#uses)

* [Install](#install)

* [Usage](#usage)

* [Phases](#phases)

* [Contributing](#contributing)

* [License](#license)


### Introduction

**React Performance Devtool** is a Chrome extension for inspecting the performance of React Components. It statistically examines the performance of React components based on the measures which are collected by React using `window.performance` API.

This project started with a purpose of extending the work done by [Will Chen](https://github.com/wwwillchen) on a proposal for React performance table. You can read more about it [here](https://github.com/facebook/react-devtools/issues/801#issuecomment-350919145).

## Demo

A demo of the extension being used to examine the performance of React components on my website.

<p align="center">
  <img src="./Demo.gif">
</p>

### Uses

* Remove or unmount the component instances which are not being used.

* Inspect what is blocking or taking more time after an operation has been started.

* Examine the table and see for which components, you need to write [shouldComponentUpdate]() lifecycle hook.

* Examine which components are taking more time to load.

### Install

**YET TO BE RELEASED!**

### Usage

To use this tool in development mode, you'll need to comment one line in `react-dom` package so that the performance measures can be apprehended by this tool. To do this, go to `node_modules/react-dom/cjs/react-dom.development.js` inside your project folder and comment this line `performance.clearMeasures(measurementName);`.

Start your local development server and go to http://127.0.0.1:3000/?react_perf. Query parameter `react_perf` is required so that React can measure the performance timings.

Now open this extension and it should display the measures for your components.

> Note - This extension works only for React 16 or above versions of it.  

### Phases
