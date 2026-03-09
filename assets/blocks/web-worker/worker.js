console.log('[Worker] Starting to be evaluated')

import { doWork } from './work.js'

self.addEventListener('message', (event) => {
  let workDuration = event.data
  doWork(workDuration, 'Worker')
})

console.log('[Worker] Now listening to main thread')
console.log('[Worker] Sending ready message')
self.postMessage('I am ready')
