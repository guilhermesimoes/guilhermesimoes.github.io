import { doWork } from './work.js'

let alertButton = document.querySelector('.js-alert-button')
let uiWorkButton = document.querySelector('.js-ui-work-button')
let workerWorkButton = document.querySelector('.js-worker-work-button')
let workDurationInput = document.querySelector('.js-work-duration-input')

uiWorkButton.addEventListener('click', () => doWork(Number(workDurationInput.value), 'UI'))
workerWorkButton.addEventListener('click', () => worker.postMessage(Number(workDurationInput.value)))

console.log('[UI] Creating Worker')
let worker = new Worker('./worker.js', { type: 'module' })
worker.addEventListener('message', (event) => {
  console.log('[UI] Worker says: ' + event.data)
})
console.log('[UI] Now listening to Worker')
