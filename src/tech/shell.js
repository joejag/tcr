import shell from 'shelljs'

let alreadyRunning = false

export const exec = (command, { onPass, onFail, onProgress }) => {
  if (alreadyRunning === true) {
    return
  }

  alreadyRunning = true
  let sharedOut = ''

  var child = shell.exec(command, { async: true, silent: true }, (code) => {
    alreadyRunning = false
    if (code === 0) {
      onPass(sharedOut)
    } else {
      onFail(sharedOut)
    }
  })

  child.stdout.on('data', function (data) {
    sharedOut = sharedOut + data
    onProgress(sharedOut)
  })
  child.stderr.on('data', function (data) {
    sharedOut = sharedOut + data
    onProgress(sharedOut)
  })
}
