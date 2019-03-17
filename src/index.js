import React from 'react'
import { render } from 'ink'
import { createSample } from './tech/samples'
import { runTcr } from './tcr'
import { NotEnoughArgumentsError } from './components'

const availableLanguages = ['csharp', 'java', 'node', 'python', 'ruby']

if (process.argv.length === 3 && process.argv.slice(2)[0].startsWith('--')) {
  const language = process.argv.slice(2)[0].replace('--', '')
  if (availableLanguages.indexOf(language) > -1) {
    createSample(language, () => {
      runTcr('./runTests.sh')
    })
  } else {
    console.log('Sorry, only these languages are supported for samples', availableLanguages)
    process.exit(1)
  }
} else if (process.argv.length === 3) {
  runTcr(process.argv.slice(2)[0])
} else {
  render(<NotEnoughArgumentsError />)
  process.exit(1)
}
