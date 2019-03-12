import React from 'react'
import { render, Box, Color } from 'ink'
import chokidar from 'chokidar'
import debounce from 'debounce'
import shell from 'shelljs'
import git from 'simple-git'

const Logo = () => (
  <Box><Color black bgWhite> TCR </Color></Box>
)

const LastChange = ({ path }) => (
  <Box>
    <Color dim>last change:</Color> {path}
  </Box>
)

const RunningSummary = ({ path }) => (
  <Box flexDirection='column'>
    <Box>
      <Logo />
      <Box width={10}><Color bgYellow black width={10}> RUNNING </Color></Box><LastChange path={path} />
    </Box>
  </Box>
)

const PassSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column'>
    <Logo marginTop={1} />
    <Box marginTop={1}>{outputText + failureText}</Box>
    <Box marginTop={1}>
      <Logo />
      <Box width={10}><Color bgGreen black> PASSED </Color></Box><LastChange path={path} />
    </Box>
  </Box>
)

const FailSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column'>
    <Logo marginTop={1} />
    <FailureReason outputText={outputText} failureText={failureText} />
    <Box marginTop={1}>
      <Logo />
      <Box width={10}><Color bgRed black width={10}> FAILED </Color></Box><LastChange path={path} />
    </Box>
  </Box>
)

const FailureReason = ({ outputText, failureText }) => (
  <Box>{outputText + failureText}</Box>
)

if (process.argv.length !== 3) {
  render(<Box flexDirection='column'>
    <Box>
      <Logo />
      <Box width={10}><Color bgRed black width={10}> PROBLEM </Color></Box>
    </Box>
    <Box marginTop={1}>Please specify one argument to use to test your program!</Box>
    <Box>For example: `tcr "./gradlew test"`</Box>
  </Box>)
  process.exit(1)
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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
    render(<FailSummary path={path} outputText={runCommand.stdout} failureText={runCommand.stderr} />)
    sleep(200).then(() => {
      // sleep required as reset too quickly and editors ignore it
      ignoreNextRun = true
      git('.').reset(['HEAD', '--hard'])
    })
  }
}, 50) // wait 50ms in case multiple files have been saved

git('.').silent(true).status((err, statusSummary) => {
  if (err) {
    render(
      <Box flexDirection='column'>
        <Box>
          <Logo />
          <Box width={10}><Color bgRed black width={10}> PROBLEM </Color></Box>
        </Box>
        <Box marginTop={1}>Is this a valid Git repo? TCR needs one to start. Try `git init`</Box>
        <Box marginTop={1}>{err}</Box>
      </Box>)
    process.exit(1)
  }
  if (statusSummary.files.length !== 0) {
    const problemFiles = statusSummary.files.map((file) =>
      <Box key={file.path}> * <Color red>{file.path}</Color></Box>
    )
    render(
      <Box flexDirection='column'>
        <Box>
          <Logo />
          <Box width={10}><Color bgRed black width={10}> PROBLEM </Color></Box>
        </Box>
        <Box marginTop={1}>There are files already changed in this repo, please commit them before starting a TCR session</Box>
        {<Box flexDirection='column' marginTop={1} marginBottom={1}>{problemFiles}</Box>}
      </Box>
    )
    process.exit(1)
  }

  const watcher = chokidar.watch('.', { ignored: /(^|[\\])\../ })
  watcher.on('ready', () => {
    runTCRLoop('.')
    // TODO: maybe: if it fails here we need to quit the program as the origanal test run is failing?

    watcher.on('all', (_, path) => {
      runTCRLoop(path)
    })
  })
})
