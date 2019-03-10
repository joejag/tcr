import React from 'react'
import { render, Box, Color } from 'ink'
import chokidar from 'chokidar'
import debounce from 'debounce'
import shell from 'shelljs'

const RunningSummary = ({ path }) => (
  <Box flexDirection='column' marginTop={1}>
    <Box>
      <Box width={10}><Color bgYellow black width={10}> RUNNING </Color></Box>
      <Color dim> from change in </Color> {path}
    </Box>
  </Box>
)

const PassSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column' marginTop={1}>
    <Box>
      <Box width={10}><Color bgGreen black> PASSED </Color></Box>
      <Color dim> from change in </Color> {path}
    </Box>

    <Box marginTop={1}>{outputText + failureText}</Box>
  </Box>
)

const FailSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column' marginTop={1}>
    <Box>
      <Box width={10}><Color bgRed black width={10}> FAILED </Color></Box>
      <Color dim> from change in </Color> {path}
    </Box>

    <Box marginTop={1}>{outputText + failureText}</Box>
  </Box>
)

var buildAndTestCommand = process.argv.slice(2)[0]

const doSomethingBob = debounce((path) => {
  render(<RunningSummary path={path} />)

  var runCommand = shell.exec(buildAndTestCommand, { silent: true })

  if (runCommand.code !== 0) {
    render(<FailSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
  } else {
    render(<PassSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
  }
}, 100)

var watcher = chokidar.watch('.', { ignored: /(^|[\\])\../ })
watcher.on('ready', () => {
  doSomethingBob('.')
  watcher.on('all', (_, path) => {
    doSomethingBob(path)
  })
})
