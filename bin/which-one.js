#!/usr/bin/env node

const prompts = require('prompts')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const path = require('path')
const { spawn } = require('child_process');

const argv = yargs(hideBin(process.argv))
      .usage('Usage: $0 [options]')
      .example('$0 -f @demo', 'filter out @demo related commands')
      .alias('f', 'filter')
      .describe('f', 'filter packages by regular expression')
      .help('h')
      .alias('h', 'help')
      .epilog('copyright 2023')
      .argv

function loadScripts() {
  const dir = require(path.join(process.cwd(), 'package.json'))
  return dir.scripts
}

function filterScripts() {
  const scripts = loadScripts()
  const reg = `(${argv._.join('|')})`

  return Object.keys(scripts).filter(hotkey => (
    new RegExp(reg || '.', 'ig').test(hotkey)
  )).map(hotkey => ({
    title: hotkey,
    value: hotkey
  }))
}

(async () => {
  const hotkeys = filterScripts()
  if(!hotkeys.length) {
    return
  }

  const response = await prompts({
    type: 'select',
    name: 'script',
    message: 'which one',
    choices: hotkeys
  })

  if(response.script) {
    const childProcess = spawn('npm', ['run', response.script])
    childProcess.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    childProcess.stderr.on('data', (data) => {
      console.error(data.toString())
    })
  }
})();