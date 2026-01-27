import { createDbService } from './dbService'

const createWorkers = () => {
  const workers = {
    dbService: createDbService(),
  }
  
  return workers
}

export default createWorkers
