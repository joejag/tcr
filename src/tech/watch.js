import chokidar from 'chokidar'

export const watch = (directory, { onReady, onUpdate }) => {
  const watcher = chokidar.watch(directory, { ignored: /(^|[\\])\../ })
  watcher.on('ready', () => {
    onReady()

    watcher.on('all', (_, path) => {
      onUpdate(path)
    })
  })
}
