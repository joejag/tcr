import React from 'react'
import { render } from 'ink'
import chokidar from 'chokidar'
import debounce from 'debounce'
import shell from 'shelljs'
import git from 'simple-git'

import { NoGitRepoError, NotEnoughArgumentsError, RunningSummary, PassSummary, FailSummary, TestFailingBeforeWeStartError, UncommitedFilesGitError } from './components'

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

if (process.argv.length !== 3) {
  render(<NotEnoughArgumentsError />)
  process.exit(1)
}

const buildAndTestCommand = process.argv.slice(2)[0]
const gitRepo = git('.').silent(true)
let ignoreNextRun = false

const runTCRLoop = debounce((path) => {
  if (ignoreNextRun === true) {
    ignoreNextRun = false
    return
  }

  render(<RunningSummary path={path} />)
  const runCommand = shell.exec(buildAndTestCommand, { silent: true })

  if (runCommand.code === 0) {
    gitRepo.add('./*').commit('working')
    render(<PassSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
  } else {
    render(<FailSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
    sleep(200).then(() => {
      // sleep required as reset too quickly and editors ignore it
      ignoreNextRun = true
      gitRepo.reset(['HEAD', '--hard'])
    })
  }
}, 50) // wait 50ms in case multiple files have been saved

gitRepo.silent(true).status((err, statusSummary) => {
  if (err) {
    render(<NoGitRepoError err={err} />)
    process.exit(1)
  }
  if (statusSummary.files.length !== 0) {
    render(<UncommitedFilesGitError statusSummary={statusSummary} />)
    process.exit(1)
  }

  const watcher = chokidar.watch('.', { ignored: /(^|[\\])\../ })
  watcher.on('ready', () => {
    runTCRLoop('.')
    const runCommand = shell.exec(buildAndTestCommand, { silent: true })
    if (runCommand.code !== 0) {
      render(<TestFailingBeforeWeStartError runCommand={runCommand} />)
      process.exit(1)
    }

    watcher.on('all', (_, path) => {
      runTCRLoop(path)
    })
  })
})
