import React from 'react'
import { Box, Color } from 'ink'

export const Logo = () => (
  <Box><Color black bgWhite> TCR </Color></Box>
)

export const LastChange = ({ path }) => (
  <Box>
    <Color dim>last change:</Color> {path}
  </Box>
)

export const RunningSummary = ({ path }) => (
  <Box flexDirection='column'>
    <Box>
      <Logo />
      <Box width={10}><Color bgYellow black width={10}> RUNNING </Color></Box><LastChange path={path} />
    </Box>
  </Box>
)

export const PassSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column'>
    <Logo marginTop={1} />
    <Box marginTop={1}>{outputText + failureText}</Box>
    <Box marginTop={1}>
      <Logo />
      <Box width={10}><Color bgGreen black> PASSED </Color></Box><LastChange path={path} />
    </Box>
  </Box>
)

export const FailSummary = ({ path, outputText, failureText }) => (
  <Box flexDirection='column'>
    <Logo marginTop={1} />
    <FailureReason outputText={outputText} failureText={failureText} />
    <Box marginTop={1}>
      <Logo />
      <Box width={10}><Color bgRed black width={10}> FAILED </Color></Box><LastChange path={path} />
    </Box>
  </Box>
)

export const FailureReason = ({ outputText, failureText }) => (
  <Box>{outputText + failureText}</Box>
)

export const NotEnoughArgumentsError = () => (
  <Box flexDirection='column'>
    <Box>
      <Logo />
      <Box width={10}><Color bgRed black width={10}> PROBLEM </Color></Box>
    </Box>
    <Box marginTop={1}>Please specify one argument to use to test your program!</Box>
    <Box>For example: `tcr "./gradlew test"`</Box>
  </Box>
)

export const NoGitRepoError = ({ err }) => (
  <Box flexDirection='column'>
    <Box>
      <Logo />
      <Box width={10}><Color bgRed black width={10}> PROBLEM </Color></Box>
    </Box>
    <Box marginTop={1}>Is this a valid Git repo? TCR needs one to start. Try `git init`</Box>
    <Box marginTop={1}>{err}</Box>
  </Box>
)

export const UncommitedFilesGitError = ({ statusSummary }) => {
  const problemFiles = statusSummary.files.map((file) =>
    <Box key={file.path}> * <Color red>{file.path}</Color></Box>)

  return (<Box flexDirection='column'>
    <Box>
      <Logo />
      <Box width={10}><Color bgRed black width={10}> PROBLEM </Color></Box>
    </Box>
    <Box marginTop={1}>There are files already changed in this repo, please commit them before starting a TCR session</Box>
    {<Box flexDirection='column' marginTop={1} marginBottom={1}>{problemFiles}</Box>}
  </Box>)
}

export const TestFailingBeforeWeStartError = ({ runCommand }) => (
  <Box flexDirection='column'>
    <Box>
      <Logo />
      <Box width={10}><Color bgRed black width={10}> PROBLEM </Color></Box>
    </Box>
    <FailureReason outputText={runCommand.stdout} failureText={runCommand.stderr} />
    <Box marginTop={1} marginBottom={1}> * <Color red>Quitting TCR as tests are already failing! Fix the tests then restart TCR!</Color></Box>
  </Box>
)
