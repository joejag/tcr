import React from 'react'
import { render } from 'ink'
import git from 'simple-git'

import { exec, sleep, watch } from './util'
import { NoGitRepoError, NotEnoughArgumentsError, RunningSummary, PassSummary, FailSummary, TestFailingBeforeWeStartError, UncommitedFilesGitError } from './components'

if (process.argv.length !== 3) {
  render(<NotEnoughArgumentsError />)
  process.exit(1)
}

const buildAndTestCommand = process.argv.slice(2)[0]

const preflightTCRLoop = () => {
  exec(buildAndTestCommand, {
    onPass: (output) => {
      render(<PassSummary path={'.'} outputText={output} commitCount={0} revertCount={0} />)
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
const gitRepo = git('.').silent(true)
let commitCount = 0
let revertCount = 0
let gitResetRun = false

const repeatableTCRLoop = (path) => {
  if (gitResetRun === true) {
    gitResetRun = false
    return
  }

  exec(buildAndTestCommand, {
    onPass: (output) => {
      gitRepo.status((_, statusSummary) => {
        if (statusSummary.files.length !== 0) {
          gitRepo.add('./*').commit('working')
          commitCount++
        }
        render(<PassSummary path={path} outputText={output} commitCount={commitCount} revertCount={revertCount} />)
      })
    },
    onFail: (output) => {
      sleep(TIME_TO_WAIT_BEFORE_RESETTING).then(() => {
        gitResetRun = true
        gitRepo.reset(['HEAD', '--hard'])
        revertCount++
        render(<FailSummary path={path} outputText={output} commitCount={commitCount} revertCount={revertCount} />)
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

gitRepo.status((err, statusSummary) => {
  if (err) {
    render(<NoGitRepoError err={err} />)
    process.exit(1)
  }
  if (statusSummary.files.length !== 0) {
    render(<UncommitedFilesGitError statusSummary={statusSummary} />)
    process.exit(1)
  }

  watch('.', {
    onReady: preflightTCRLoop,
    onUpdate: repeatableTCRLoopWithWait
  })
})
