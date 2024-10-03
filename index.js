import express from 'express'
import { PORT } from './config.js'

const app = express()

app.get('/', (req, res) => {
  res.send('<h1>hola mundo!<h1/>')
})

app.post('/login', (req, res) => {
  res.json({ usuario: 'mauri' })
})

app.post('/register', (req, res) => {
  res.json({ usuario: 'mauri' })
})

app.post('/logout', (req, res) => {
  res.json({ usuario: 'mauri' })
})

app.post('/protected', (req, res) => {
  res.json({ usuario: 'mauri' })
})

app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localohost:${PORT}`)
})
