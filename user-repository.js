import DBLocal from 'db-local'
const { Schema } = new DBLocal({ path: './db' })

const Usuario = Schema('Usuario', {
  _id: { type: String, required: true },
  usuario: { type: String, required: true },
  contraseña: { type: String, required: true }
})

export class RepositorioUsuario {
  static create ({})


  static login ({ usuario, contraseña }) {}
}
