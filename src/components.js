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

export const Stats = ({ commitCount, revertCount }) => (
  <Box> <Color dim>{commitCount} commits, {revertCount} reverts </Color></Box>
)

export const RunningSummary = ({ path, data = '' }) => (
  <Box flexDirection='column'>
    <Box marginTop={1}>
      <Logo /> <LastChange path={path} />
    </Box>
    <Box marginTop={1}>{data}</Box>
    <Box marginTop={1}>
      <Logo />
      <Color bgYellow black> RUNNING </Color>
    </Box>
  </Box>
)

export const PassSummary = ({ path, outputText, failureText, commitCount, revertCount }) => (
  <Box flexDirection='column'>
    <Box marginTop={1}>
      <Logo /> <LastChange path={path} />
    </Box>
    <Box marginTop={1}>{outputText + failureText}</Box>
    <Box marginTop={1}>
      <Logo />
      <Color bgGreen black> PASSED </Color>
      <Stats commitCount={commitCount} revertCount={revertCount} />
    </Box>
  </Box>
)

export const FailSummary = ({ path, outputText, failureText, commitCount, revertCount }) => (
  <Box flexDirection='column'>
    <Box marginTop={1}>
      <Logo /> <LastChange path={path} />
    </Box>
    <FailureReason outputText={outputText} failureText={failureText} />
    <Box marginTop={1}>
      <Logo />
      <Color bgRed black> FAILED </Color>
      <Stats commitCount={commitCount} revertCount={revertCount} />
    </Box>
  </Box>
)

export const FailureReason = ({ outputText, failureText }) => (
  <Box>{outputText + failureText}</Box>
)

export const NotEnoughArgumentsError = () => (
  <Box flexDirection='column' marginBottom={1}>
    <Box>
      <Logo />
      <Color bgRed black> PROBLEM </Color>
    </Box>
    <Box marginTop={1}>Please specify one argument to use to test your program!</Box>
    <Box>For example: `tcr "./gradlew test"`</Box>
  </Box>
)

export const NoGitRepoError = ({ err }) => (
  <Box flexDirection='column'>
    <Box>
      <Logo />
      <Color bgRed black> PROBLEM </Color>
    </Box>
    <Box marginTop={1}>Is this a valid Git repo? TCR needs one to start. Try `git init`</Box>
    <Box marginTop={1}>{err}</Box>
  </Box>
)

export const UncommitedFilesGitError = ({ statusSummary }) => {
  const problemFiles = statusSummary.files.map((file) =>
    <Box key={file.path}> * <Color red>{file.path}</Color></Box>)

  return (<Box flexDirection='column' marginBottom={1}>
    <Box>
      <Logo />
      <Color bgRed black> PROBLEM </Color>
    </Box>
    <Box marginTop={1}>There are files already changed in this repo, please commit them before starting a TCR session</Box>
    {<Box flexDirection='column' marginTop={1}>{problemFiles}</Box>}
  </Box>)
}

export const TestFailingBeforeWeStartError = ({ outputText, failureText }) => (
  <Box flexDirection='column' marginBottom={1}>
    <Box>
      <Logo />
      <Color bgRed black> PROBLEM </Color>
    </Box>
    <FailureReason outputText={outputText} failureText={failureText} />
    <Box marginTop={1}> * <Color red>Quitting TCR as tests are already failing! Fix the tests then restart TCR</Color></Box>
  </Box>
)
