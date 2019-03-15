import git from 'simple-git'
import fs from 'fs'
import parse from 'parse-gitignore'

const gitRepo = git('.').silent(true)
let commitCount = 0
let resetCount = 0

export const gitIgnoring = () => {
  if (fs.existsSync('.gitignore')) {
    return parse(fs.readFileSync('.gitignore'))
  }
  return []
}

export const gitStatus = (callback) => {
  gitRepo.status((err, statusSummary) => {
    callback(err, statusSummary.files)
  })
}

export const gitCommit = (message, callback) => {
  gitStatus((_, files) => {
    if (files.length !== 0) {
      gitRepo.add('./*').commit(message)
      commitCount++
    }
    callback()
  })
}

export const gitReset = () => {
  gitRepo.reset(['HEAD', '--hard'])
  resetCount++
}

export const gitStats = () => {
  return {
    commitCount: commitCount,
    resetCount: resetCount
  }
}
