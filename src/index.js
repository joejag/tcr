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

const quitWithMessage = (message) => {
  render(message)
  process.exit(1)
}

if (process.argv.length !== 3) {
  quitWithMessage(<NotEnoughArgumentsError />)
}

// Wait for this long. Required as git reset too quickly and editors ignore the file changes
const TIME_TO_WAIT_BEFORE_RESETTING = 200
// Wait for this long. In case multiple files have been saved
const TIME_TO_WAIT_BEFORE_RUNNING = 50

const buildAndTestCommand = process.argv.slice(2)[0]
const gitRepo = git('.').silent(true)
let gitResetRun = false
let commitCount = 0
let revertCount = 0

const runTCRLoop = debounce((path) => {
  if (gitResetRun === true) {
    gitResetRun = false
    return
  }

  render(<RunningSummary path={path} />)
  const runCommand = shell.exec(buildAndTestCommand, { silent: true })

  if (runCommand.code === 0) {
    gitRepo.status((_, statusSummary) => {
      if (statusSummary.files.length !== 0) {
        gitRepo.add('./*').commit('working')
        commitCount++
      }
      render(<PassSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} commitCount={commitCount} revertCount={revertCount} />)
    })
  } else {
    sleep(TIME_TO_WAIT_BEFORE_RESETTING).then(() => {
      gitResetRun = true
      revertCount++
      render(<FailSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} commitCount={commitCount} revertCount={revertCount} />)
      gitRepo.reset(['HEAD', '--hard'])
    })
  }
}, TIME_TO_WAIT_BEFORE_RUNNING)

gitRepo.status((err, statusSummary) => {
  if (err) {
    quitWithMessage(<NoGitRepoError err={err} />)
  }
  if (statusSummary.files.length !== 0) {
    quitWithMessage(<UncommitedFilesGitError statusSummary={statusSummary} />)
  }

  const watcher = chokidar.watch('.', { ignored: /(^|[\\])\../ })
  watcher.on('ready', () => {
    // Checking things are ok before we start looping
    render(<RunningSummary path='.' />)
    const runCommand = shell.exec(buildAndTestCommand, { silent: true })
    if (runCommand.code === 0) {
      render(<PassSummary path='.' outputText={runCommand.stdout} failureText={runCommand.stderr} commitCount={commitCount} revertCount={revertCount} />)
    } else {
      quitWithMessage(<TestFailingBeforeWeStartError outputText={runCommand.stdout} failureText={runCommand.stderr} />)
    }

    watcher.on('all', (_, path) => {
      runTCRLoop(path)
    })
  })
})
