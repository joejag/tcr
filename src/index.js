import React from 'react'
import { render, Box, Color } from 'ink'
import chokidar from 'chokidar'
import debounce from 'debounce'
import shell from 'shelljs'
import git from 'simple-git'

const Logo = () => (
  <Box> TCR </Box>
)

const LastChange = ({ path }) => (
  <Box>
    <Color dim> last change:  </Color> {path}
  </Box>
)

const RunningSummary = ({ path }) => (
  <Box flexDirection='column' marginTop={1}>
    <Box>
      <Logo />
      <Box width={10}><Color bgYellow black width={10}> RUNNING </Color></Box>
      <LastChange path={path} />
    </Box>
  </Box>
)

const PassSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column' marginTop={1}>
    <Box marginTop={1}>{outputText + failureText}</Box>
    <Box marginTop={1}>
      <Logo />
      <Box width={10}><Color bgGreen black> PASSED </Color></Box>
      <LastChange path={path} />
    </Box>
  </Box>
)

const FailSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column' marginTop={1}>
    <FailureReason outputText={outputText} failureText={failureText} />
    <Box marginTop={1}>
      <Logo />
      <Box width={10}><Color bgRed black width={10}> FAILED </Color></Box>
      <LastChange path={path} />
    </Box>
  </Box>
)

const FailureReason = ({ outputText, failureText }) => (
  <Box>{outputText + failureText}</Box>
)

// TODO: maybe: process all the args to save the user putting thier test command in quotes?
const buildAndTestCommand = process.argv.slice(2)[0]
let ignoreNextRun = false

const runTCRLoop = debounce((path) => {
  if (ignoreNextRun === true) {
    ignoreNextRun = false
    return
  }

  render(<RunningSummary path={path} />)
  const runCommand = shell.exec(buildAndTestCommand, { silent: true })

  if (runCommand.code === 0) {
    git('.').add('./*').commit('working')
    render(<PassSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
  } else {
    ignoreNextRun = true
    git('.').reset(['HEAD', '--hard'])
    render(<FailSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
  }
}, 50) // wait 50ms in case multiple files have been saved

// TODO: if git changes present, fail out and warn the user, else we'd revert them
// git('.').status((_, a) => console.log('status!', a))

const watcher = chokidar.watch('.', { ignored: /(^|[\\])\../ })
watcher.on('ready', () => {
  runTCRLoop('.')
  // TODO: maybe: if it fails here we need to quit the program as the origanal test run is failing?

  watcher.on('all', (_, path) => {
    runTCRLoop(path)
  })
})
