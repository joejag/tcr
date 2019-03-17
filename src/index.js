import React from 'react'
import { render } from 'ink'
import { createSample } from './tech/samples'
import { runTcr } from './tcr'
import { NotEnoughArgumentsError } from './components'

if (process.argv.length === 3 && process.argv.slice(2)[0].startsWith('--')) {
  const language = process.argv.slice(2)[0].replace('--', '')
  createSample(language, () => {
    runTcr('./runTests.sh')
  })
} else if (process.argv.length === 3) {
  runTcr(process.argv.slice(2)[0])
} else {
  render(<NotEnoughArgumentsError />)
  process.exit(1)
}
