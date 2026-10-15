import { useEffect, useState } from 'react'
import { autenticacionLista, keycloak } from './auth'
import { obtenerEmergencias, obtenerPerfil, type Emergencia, type Perfil, type Rol } from './api'
import { useEnLinea } from './useEnLinea'

const NOMBRES_ROL: Record<Rol, string> = {
  REPORTERO_CAMPO: 'Reportero de campo',
  VERIFICADOR: 'Verificador',
  COORDINADOR: 'Coordinador',
  ADMINISTRADOR: 'Administrador',
}

export default function App() {
  const enLinea = useEnLinea()
  const [autenticado, setAutenticado] = useState<boolean | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [emergencias, setEmergencias] = useState<Emergencia[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    autenticacionLista.then(setAutenticado)
  }, [])

  useEffect(() => {
    if (!enLinea) return
    obtenerEmergencias().then(setEmergencias).catch((e: Error) => setError(e.message))
  }, [enLinea])

  useEffect(() => {
    if (!autenticado || !enLinea) return
    obtenerPerfil().then(setPerfil).catch((e: Error) => setError(e.message))
  }, [autenticado, enLinea])

  return (
    <>
      <header className="cabecera">
        <h1>Panamá Seguro</h1>
        {autenticado === false && (
          <button onClick={() => keycloak.login()} disabled={!enLinea}>
            Iniciar sesión
          </button>
        )}
        {autenticado && (
          <button className="secundario" onClick={() => keycloak.logout({ redirectUri: window.location.origin })}>
            Cerrar sesión
          </button>
        )}
      </header>

      <main>
        {!enLinea && <p className="aviso">Sin conexión. Podrás seguir usando la aplicación.</p>}
        {error && <p className="aviso error">{error}</p>}

        <section>
          <h2>Emergencias activas</h2>
          {emergencias.length === 0 ? (
            <p className="tenue">No hay emergencias activas.</p>
          ) : (
            <ul className="lista">
              {emergencias.map((e) => (
                <li key={e.id}>
                  <strong>{e.nombre}</strong>
                  <span className="tenue"> · desde {new Date(`${e.fechaInicio}T12:00:00`).toLocaleDateString('es-PA')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {perfil && (
          <section>
            <h2>Mi perfil</h2>
            <p>
              {perfil.nombre}
              {perfil.administradorGlobal && <span className="insignia">Administrador global</span>}
            </p>
            {perfil.asignaciones.length === 0 ? (
              <p className="tenue">
                {perfil.administradorGlobal
                  ? 'Tienes acceso a todos los territorios.'
                  : 'Ciudadano registrado. Aún no tienes roles asignados.'}
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Rol</th>
                    <th>Territorio</th>
                    <th>Emergencia</th>
                  </tr>
                </thead>
                <tbody>
                  {perfil.asignaciones.map((a) => (
                    <tr key={a.id}>
                      <td>{NOMBRES_ROL[a.rol]}</td>
                      <td>{a.territorio}</td>
                      <td>{a.emergencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </main>
    </>
  )
}
