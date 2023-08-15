#!/usr/bin/env node

const prompts = require('prompts')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const path = require('path')
const { exec } = require('child_process');

const argv = yargs(hideBin(process.argv))
      .usage('Usage: $0 [options]')
      .example('$0 -f build', 'filter out build-related commands')
      .alias('f', 'filter')
      .describe('f', 'filter scripts by regular expression')
      .help('h')
      .alias('h', 'help')
      .epilog('copyright 2023')
      .argv

function loadScripts() {
  const dir = require(path.join(process.cwd(), 'package.json'))
  return dir.scripts
}

(async () => {
  const scripts = loadScripts()
  const hotkeys = Object.keys(scripts).map(hotkey => ({
    title: hotkey,
    value: hotkey
  })).filter(hotkey => (
    new RegExp(argv.filter || '.', 'ig').test(hotkey.title)
  ))
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
    exec('npm run ' + response.script, (err, stdout, stderr) => {
      if(err) {
        console.log(err)
        return
      }
      console.log(stdout)
      console.log(stderr)
    })
  }
})();