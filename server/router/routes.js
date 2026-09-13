import express from 'express'
import { cachesemantic} from '../controller/System_Cache.js'
export const rout=express.Router()

rout.post('/ai' , cachesemantic)