const { spawn } = require('child_process');

function initiateShutdownNow() {
  const shutdownProcess = spawn('shutdown', ['now']);
  shutdownProcess.stdout.pipe(process.stdout);
  shutdownProcess.stderr.pipe(process.stderr);
  shutdownProcess.on('close', (code) => {
    if (code) {
      console.error(`shutdown command had an error (exit code ${code})`);
      return;
    }
    console.log(`shutdown initiated`);
  });
}

let queuedShutdown = null;
function queueShutdown() {
  console.log('queuing a shutdown in 8s');
  queuedShutdown = setTimeout(initiateShutdownNow, 8e3);
}

function cancelShutdown() {
  if (queuedShutdown === null) {
    return;
  }
  clearTimeout(queuedShutdown);
}

module.exports = {
  queueShutdown,
  cancelShutdown,
};
