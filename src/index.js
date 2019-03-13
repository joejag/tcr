import React from 'react'
import { render } from 'ink'

import { exec } from './tech/shell'
import { watch } from './tech/watch'
import { sleep } from './tech/sleep'
import { gitStatus, gitCommit, gitReset, gitStats } from './tech/git'
import { NoGitRepoError, NotEnoughArgumentsError, RunningSummary, PassSummary, FailSummary, TestFailingBeforeWeStartError, UncommitedFilesGitError } from './components'

if (process.argv.length !== 3) {
  render(<NotEnoughArgumentsError />)
  process.exit(1)
}

const buildAndTestCommand = process.argv.slice(2)[0]

const preflightTCRLoop = () => {
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

const repeatableTCRLoop = (path) => {
  if (gitResetRun === true) {
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
    onReady: preflightTCRLoop,
    onUpdate: repeatableTCRLoopWithWait
  })
})
