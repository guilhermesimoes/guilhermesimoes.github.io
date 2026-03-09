console.log('[Worker] Starting to be evaluated')

import { doWork } from './work.js'

self.addEventListener('message', (event) => {
  const result = doWork(event.data.workDuration, 'Worker')
  self.postMessage({ message: `Work result is ${result}` });
})

console.log('[Worker] Now listening to main thread')
console.log('[Worker] Sending ready message')
self.postMessage({ message: 'I am ready' });
