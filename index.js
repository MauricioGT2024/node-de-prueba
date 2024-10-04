import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data // Guarda los datos del usuario
  } catch (error) {
    console.log('Token no válido o expirado:', error.message) // Manejo de errores
  }

  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', { name: user ? user.usuario : null }) // Cambia a 'name' en vez de 'username'
})

app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body
  try {
    const user = await UserRepository.login({ usuario, contraseña })
    const token = jwt.sign({ id: user._id, usuario: user.usuario }, SECRET_JWT_KEY, {
      expiresIn: '1h'
    })

    console.log('Usuario autenticado:', user) // Verifica que el usuario se autentique correctamente.

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      .send({ user, token })
  } catch (error) {
    res.status(401).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { usuario, contraseña } = req.body
  console.log(req.body)

  try {
    const id = await UserRepository.create({ usuario, contraseña })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'Deslogueo Exitoso' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session // Asegúrate de que 'user' contenga la información correcta
  if (!user) return res.status(403).send('Acceso no autorizado')

  res.render('protected', { name: user.usuario }) // Aquí pasas 'name' correctamente
})

app.listen(PORT, () => {
  console.log(`servidor corriendo en http://localhost:${PORT}`)
})
