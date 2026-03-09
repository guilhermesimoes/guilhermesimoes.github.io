self.count = 0

export function doWork(workDuration, source) {
  console.log(`[${source}] Work started`)

  let endTimestamp = Date.now() + workDuration * 1000
  while(Date.now() < endTimestamp) {
    // work
  }

  console.log(`[${source}] Work finished, took ${workDuration}s`)

  return ++count
}
