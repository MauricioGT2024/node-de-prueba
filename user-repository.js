import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

import crypto from 'node:crypto'

import { SALT_ROUNDS } from './config.js'
const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  usuario: { type: String, required: true },
  contraseña: { type: String, required: true }
})

export class UserRepository {
  static async create ({ usuario, contraseña }) {
    validacion.usuario(usuario)
    validacion.contraseña(contraseña)
    const user = User.findOne({ usuario })
    if (user) throw new Error('El usuario ya existe cambieselo')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(contraseña, SALT_ROUNDS)
    User.create({
      _id: id,
      usuario,
      contraseña: hashedPassword
    }).save()

    return id
  }

  static async login ({ usuario, contraseña }) {
    validacion.usuario(usuario)
    validacion.contraseña(contraseña)

    const user = User.findOne({ usuario })
    if (!user) throw new Error('Ese usuario no exite')

    const valido = await bcrypt.compare(contraseña, user.contraseña)
    if (!valido) throw new Error('la contraseña es incorrecta')

    const { contraseña: _, ...publicUser } = user

    return publicUser
  }
}

class validacion {
  static usuario (usuario) {
    if (typeof usuario !== 'string') throw new Error('El usuario tiene que ser un string')
    if (usuario.length < 3) throw new Error('El usuario tiene que tener minimo 3 caracteres')
  }

  static contraseña (contraseña) {
    if (typeof contraseña !== 'string') throw new Error('La contraseña tiene que ser un string')
    if (contraseña.length < 6) throw new Error('La contraseña tiene que tener minimo 6 caracteres')
  }
}
