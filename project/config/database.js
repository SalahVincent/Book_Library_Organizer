import pkg from 'pg'
import config from './env.js'

const { Pool } = pkg
const pool = new Pool (config)

export const query = (text, params) => pool.query(text, params)
export const close = () => pool.end()