/* eslint-disable react/prop-types */

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

export const Stats = ({ stats }) => (
  <Box> <Color dim>{stats.commitCount} commits, {stats.resetCount} resets </Color></Box>
)

export const RunningSummary = ({ path, outputText }) => (
  <Box flexDirection='column'>
    <Box marginTop={1}>
      <Logo /> <LastChange path={path} />
    </Box>
    <Box marginTop={1}>{outputText}</Box>
    <Box marginTop={1}>
      <Logo />
      <Color bgYellow black> RUNNING </Color>
    </Box>
  </Box>
)

export const PassSummary = ({ path, outputText, stats }) => (
  <Box flexDirection='column'>
    <Box marginTop={1}>
      <Logo /> <LastChange path={path} />
    </Box>
    <Box marginTop={1}>{outputText}</Box>
    <Box marginTop={1}>
      <Logo />
      <Color bgGreen black> PASSED </Color>
      <Stats stats={stats} />
    </Box>
  </Box>
)

export const FailSummary = ({ path, outputText, stats }) => (
  <Box flexDirection='column'>
    <Box marginTop={1}>
      <Logo /> <LastChange path={path} />
    </Box>
    <Box marginTop={1}>{outputText}</Box>
    <Box marginTop={1}>
      <Logo />
      <Color bgRed black> FAILED </Color>
      <Stats stats={stats} />
    </Box>
  </Box>
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

export const UncommitedFilesGitError = ({ changedFiles }) => {
  const problemFiles = changedFiles.map((file) =>
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

export const TestFailingBeforeWeStartError = ({ outputText }) => (
  <Box flexDirection='column' marginBottom={1}>
    <Box>
      <Logo />
      <Color bgRed black> PROBLEM </Color>
    </Box>
    <Box marginTop={1}>{outputText}</Box>
    <Box marginTop={1}> * <Color red>Quitting TCR as tests are already failing! Fix the tests then restart TCR</Color></Box>
  </Box>
)
