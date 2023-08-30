#!/usr/bin/env node

const os = require('os')
const fs = require('fs')
const path = require('path')
const prompts = require('prompts')
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const {spawn} = require('child_process')

const homedir = os.homedir();
const cacheDir = path.join(homedir, '.wo')
const cache = path.join(cacheDir, 'script.json')

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir)
}
try {
  fs.accessSync(cache)
} catch (e) {
  fs.writeFileSync(cache, '{}')
}

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .example('$0 -f @demo', 'filter out @demo related commands.')
  .alias('f', 'filter')
  .describe('f', 'filter packages by regular expression.')
  .alias('r', 'run').describe('r', 'execute the last script, and when there are no scripts available, list all available scripts.')
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

function cache2Json() {
  try {
    return JSON.parse(fs.readFileSync(cache))
  } catch (e) {
    return {}
  }
}

function setScriptCache(script) {
  const content = cache2Json()
  content[process.cwd()] = script
  fs.writeFileSync(cache, JSON.stringify(content))
}

function getScriptCache() {
  const content = cache2Json()
  return content[process.cwd()]
}

function executeScript(script) {
  const childProcess = spawn('npm', ['run', script])
  childProcess.stdout.on('data', (data) => {
    console.log(data.toString())
  })
  childProcess.stderr.on('data', (data) => {
    console.error(data.toString())
  })

  setScriptCache(script)
}

(async () => {
  if (argv.run) {
    const script = getScriptCache()
    if (!script) return;
    return executeScript(script)
  }

  const hotkeys = filterScripts()
  if (!hotkeys.length) {
    return
  } else if (hotkeys.length === 1) {
    const [script] = hotkeys
    return executeScript(script.value)
  } else {
    const response = await prompts({
      type: 'select',
      name: 'script',
      message: 'which one',
      choices: hotkeys
    })
    if (response.script) {
      executeScript(response.script)
    }
  }
})();
