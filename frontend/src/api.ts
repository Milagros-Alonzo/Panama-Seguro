import { keycloak } from './auth'

export type Rol = 'REPORTERO_CAMPO' | 'VERIFICADOR' | 'COORDINADOR' | 'ADMINISTRADOR'

export interface Asignacion {
  id: string
  rol: Rol
  territorioId: number
  territorio: string
  emergenciaId: string
  emergencia: string
  otorgadaEn: string
}

export interface Perfil {
  id: string
  nombre: string
  administradorGlobal: boolean
  asignaciones: Asignacion[]
}

export interface Emergencia {
  id: string
  codigo: string
  nombre: string
  tipo: string
  fechaInicio: string
}

async function pedir<T>(ruta: string): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' })
  if (keycloak.authenticated) {
    await keycloak.updateToken(30)
    headers.set('Authorization', `Bearer ${keycloak.token}`)
  }
  const respuesta = await fetch(ruta, { headers })
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al consultar ${ruta}`)
  }
  return respuesta.json() as Promise<T>
}

export const obtenerPerfil = () => pedir<Perfil>('/api/usuarios/yo')
export const obtenerEmergencias = () => pedir<Emergencia[]>('/api/emergencias')
