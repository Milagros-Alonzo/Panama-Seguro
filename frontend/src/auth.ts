import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8180',
  realm: 'panama-seguro',
  clientId: 'panama-seguro-web',
})

// Sin onLoad: el público usa la app sin redirigir a Keycloak; solo se procesa el
// regreso del inicio de sesión. Se inicializa una sola vez, fuera de React.
export const autenticacionLista: Promise<boolean> = keycloak
  .init({ pkceMethod: 'S256', checkLoginIframe: false })
  .catch(() => false)
