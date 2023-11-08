import { App } from '@app/app'
import { queueService } from '@app/services/queue/queueService'

const app = new App()

app.init()

setTimeout(()=>{
  //queueService.connect_inbound()
}, 1000)
