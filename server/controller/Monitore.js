
import {aiMonitor} from './config_AI/MAIN_USE_AI_API/monitoring/monitoring.js'

const api_monitor=async()=>{
  try {
     const data = await redisClient.lrange(
    "ai:monitoring",
    0,
    99
  );

  let len=await redisClient.llen("ai:monitoring")
  console.log(len)

  let jso=data.map(item => JSON.parse(item))

  res.json([len , jso]);
  } catch (error) {
    
    console.log(error)
  }
}


