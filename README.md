# Using Gulp to Create a Front-End Build Pipeline
This is a sample Gulp setup for processing JS, CSS, and images, from my talk for DNN Summit 2018

## Requirements
This projects requires [Node.js](https://nodejs.org/en/download/) to be installed.  You can also optionally install [Yarn](https://yarnpkg.com/en/docs/install), or just use npm (which comes with Node.js).

You will then want to make sure that you've installed the Gulp CLI using your chosen package manager, using `yarn global add gulp-cli` or `npm install -g gulp-cli`

## Running this sample
1. Clone this repository `git clone https://github.com/bdukes/using-gulp-to-create-a-front-end-build-pipeline.git`
2. Move into the folder that Git just created `cd using-gulp-to-create-a-front-end-build-pipeline`
3. Install the project's Node.js modules `yarn install` or `npm install`
4. Run Gulp `gulp`

You can also run `gulp --tasks` to see a tree of the tasks that Gulp can run.

## Usage
To use this on a website, you'll want to copy everything into an existing website, and then update the path to the website in `gulpfile.js`.  The sample expects that it exists in a folder like `C:\inetpub\wwwroot\mydnnnsite`, and that a DNN website is in `C:\inetpub\wwwroot\mydnnsite\Website`.
