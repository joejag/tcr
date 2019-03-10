import React from 'react'
import { render, Box, Color } from 'ink'
import chokidar from 'chokidar'
import debounce from 'debounce'
import shell from 'shelljs'
import git from 'simple-git'

const RunningSummary = ({ path }) => (
  <Box flexDirection='column' marginTop={1}>
    <Box>
      <Box bold> TCR  </Box>
      <Box width={10}><Color bgYellow black width={10}> RUNNING </Color></Box>
      <Color dim> last change:  </Color> {path}
    </Box>
  </Box>
)

const PassSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column' marginTop={1}>
    <Box>
      <Box bold> TCR  </Box>
      <Box width={10}><Color bgGreen black> PASSED </Color></Box>
      <Color dim> last change:  </Color> {path}
    </Box>

    <Box marginTop={1}>{outputText + failureText}</Box>
  </Box>
)

const FailSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column' marginTop={1}>
    <Box>
      <Box bold> TCR  </Box>
      <Box width={10}><Color bgRed black width={10}> FAILED </Color></Box>
      <Color dim> last change:  </Color> {path}
    </Box>

    <Box marginTop={1}>{outputText + failureText}</Box>
  </Box>
)

// idealy proces the whole command, rather than hoping the user surrounds it with quotes
var buildAndTestCommand = process.argv.slice(2)[0]

// git('.').status((_, a) => console.log('status!', a))

const doSomethingBob = debounce((path) => {
  render(<RunningSummary path={path} />)

  var runCommand = shell.exec(buildAndTestCommand, { silent: true })

  if (runCommand.code === 0) {
    git('.').add('./*').commit('first commit!')
    render(<PassSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
  } else {
    git('.').reset(['HEAD', '--hard'])
    render(<FailSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
  }
}, 50)

// if git changes already there, fail out, else we'd revert them

var watcher = chokidar.watch('.', { ignored: /(^|[\\])\../ })
watcher.on('ready', () => {
  doSomethingBob('.')
  // if it fails here we need to quit out as it's unstable
  watcher.on('all', (_, path) => {
    doSomethingBob(path)
  })
})
