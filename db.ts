import Knex from 'knex'
import { env } from './env';
import dotenv from 'dotenv'

dotenv.config()

let knexConfigs = require('./knexfile')
let mode = env.NODE_ENV


export const knex = Knex(knexConfigs[mode])
