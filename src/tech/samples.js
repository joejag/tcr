import git from 'simple-git'
import fs from 'fs'
import fsExtra from 'fs-extra'
import { gitCommit } from './git'

export const createSample = (language, callback) => {
  const tempDir = fs.mkdtempSync('tcr')
  git().clone('https://github.com/joejag/tcr-starters.git', tempDir, ['--depth=1'], () => {
    fsExtra.copySync(tempDir + '/' + language, '.')
    fsExtra.removeSync(tempDir)
    git('.').init(() => {
      gitCommit('Initial commit', () => {
        callback()
      })
    })
  })
}
