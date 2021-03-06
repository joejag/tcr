import React from 'react'
import { render } from 'ink'

import { exec } from './tech/shell'
import { watch } from './tech/watch'
import { sleep } from './tech/sleep'
import { gitStatus, gitCommit, gitReset, gitStats } from './tech/git'
import { NoGitRepoError, RunningSummary, PassSummary, FailSummary, TestFailingBeforeWeStartError, UncommitedFilesGitError } from './components'

const preflightTCRLoop = (buildAndTestCommand) => {
  exec(buildAndTestCommand, {
    onPass: (output) => {
      render(<PassSummary path={'.'} outputText={output} stats={gitStats()} />)
    },
    onFail: (output) => {
      render(<TestFailingBeforeWeStartError outputText={output} />)
      process.exit(1)
    },
    onProgress: (output) => {
      render(<RunningSummary path={'.'} outputText={output} />)
    }
  })
}

const TIME_TO_WAIT_BEFORE_RESETTING = 100 // Required if git reset is too quick and editors ignore the file changes
let gitResetRun = false

const repeatableTCRLoop = (buildAndTestCommand, path) => {
  if (gitResetRun === true) { // ignore the run immediately after a reset, so the user can read the failure message
    gitResetRun = false
    return
  }

  exec(buildAndTestCommand, {
    onPass: (output) => {
      gitCommit('working', () => {
        render(<PassSummary path={path} outputText={output} stats={gitStats()} />)
      })
    },
    onFail: (output) => {
      sleep(TIME_TO_WAIT_BEFORE_RESETTING).then(() => {
        gitResetRun = true
        gitReset()
        render(<FailSummary path={path} outputText={output} stats={gitStats()} />)
      })
    },
    onProgress: (output) => {
      render(<RunningSummary path={path} outputText={output} />)
    }
  })
}

const TIME_TO_WAIT_BEFORE_RUNNING = 50 // In case multiple files have been saved
const repeatableTCRLoopWithWait = (path) => {
  sleep(TIME_TO_WAIT_BEFORE_RUNNING).then(() => repeatableTCRLoop(path))
}

export const runTcr = (buildAndTestCommand) => {
  gitStatus((err, changedFiles) => {
    if (err) {
      render(<NoGitRepoError err={err} />)
      process.exit(1)
    }
    if (changedFiles.length !== 0) {
      render(<UncommitedFilesGitError changedFiles={changedFiles} />)
      process.exit(1)
    }

    watch('.', {
      onReady: (_) => preflightTCRLoop(buildAndTestCommand),
      onUpdate: (path) => repeatableTCRLoopWithWait(buildAndTestCommand, path)
    })
  })
}
