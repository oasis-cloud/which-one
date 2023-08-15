#!/usr/bin/env node

const prompts = require('prompts')
const path = require('path')
const { exec, spawn } = require('child_process');

function readPackageJson() {
  const dir = require(path.join(process.cwd(), 'package.json'))
  return dir.scripts
}

(async () => {
  const scripts = readPackageJson()
  const scriptsShortCut = Object.keys(scripts).map(i => ({
    title: i,
    value: i
  }))
  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'which one',
    choices: scriptsShortCut
  })
  if(response.value) {
    exec('npm run ' + response.value, (err, stdout, stderr) => {
      console.log(stdout)
      console.log(stderr)
    })
  }
})();