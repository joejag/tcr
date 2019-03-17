import chokidar from 'chokidar'
import ignore from 'ignore'
import { gitIgnoring } from './git'

export const watch = (directory, { onReady, onUpdate }) => {
  const watcher = chokidar.watch(directory, { ignored: ['node_modules', /(^|[\\])\../] })
  watcher.on('ready', () => {
    onReady()

    watcher.on('all', (_, path) => {
      const ig = ignore().add(gitIgnoring())
      if (!ig.ignores(path)) {
        onUpdate(path)
      }
    })
  })
}
