import { doWork } from './work.js'

let uiWorkButton = document.querySelector('.js-ui-work-button')
let workerWorkButton = document.querySelector('.js-worker-work-button')
let workDurationInput = document.querySelector('.js-work-duration-input')

uiWorkButton.addEventListener('click', () => {
  const result = doWork(Number(workDurationInput.value), 'UI')
  console.log(`[UI] Work result is ${result}`);
});
workerWorkButton.addEventListener('click', () => {
  worker.postMessage({ workDuration: Number(workDurationInput.value)})
});

console.log('[UI] Creating Worker')
let worker = new Worker('./worker.js', { type: 'module' })
worker.addEventListener('message', (event) => {
  console.log(`[UI] Worker says: "${event.data.message}"`)
})
console.log('[UI] Now listening to Worker')
