// Importaciones principales
import { router } from './utils/router.js'
import { authStore } from './stores/authStore.js'
import { uiStore } from './stores/uiStore.js'
import { initWebSocket } from './services/websocket.js'
import { initNotifications } from './utils/notifications.js'

// Importar componentes base
import './components/AppNavigation.js'
import './components/AppFooter.js'
import './components/LoadingSpinner.js'
import './components/NotificationToast.js'

// Importar páginas
import './pages/HomePage.js'
import './pages/LoginPage.js'
import './pages/RegisterPage.js'
import './pages/ProfilePage.js'
import './pages/FeedPage.js'

/**
 * Clase principal de la aplicación
 */
class RedSocialApp {
  constructor() {
    this.router = router
    this.authStore = authStore
    this.uiStore = uiStore
    this.isInitialized = false
  }

  /**
   * Inicializa la aplicación
   */
  async init() {
    try {
      console.log('🚀 Iniciando Red Social...')
      
      // Mostrar pantalla de carga
      this.showLoading()
      
      // Inicializar stores
      await this.initializeStores()
      
      // Configurar router
      this.setupRouter()
      
      // Inicializar WebSocket si el usuario está autenticado
      if (this.authStore.isAuthenticated) {
        await this.initializeWebSocket()
      }
      
      // Inicializar notificaciones
      initNotifications()
      
      // Configurar listeners globales
      this.setupGlobalListeners()
      
      // Ocultar pantalla de carga
      this.hideLoading()
      
      // Marcar como inicializada
      this.isInitialized = true
      
      console.log('✅ Red Social iniciada correctamente')
      
    } catch (error) {
      console.error('❌ Error al inicializar la aplicación:', error)
      this.handleInitializationError(error)
    }
  }

  /**
   * Inicializa los stores de la aplicación
   */
  async initializeStores() {
    // Inicializar store de autenticación
    await this.authStore.init()
    
    // Inicializar store de UI
    this.uiStore.init()
    
    console.log('📦 Stores inicializados')
  }

  /**
   * Configura el router de la aplicación
   */
  setupRouter() {
    // Definir rutas
    this.router
      .on('/', () => {
        this.renderPage('home-page')
      })
      .on('/login', () => {
        this.renderPage('login-page')
      })
      .on('/register', () => {
        this.renderPage('register-page')
      })
      .on('/profile/:id', (match) => {
        this.renderPage('profile-page', { userId: match.data.id })
      })
      .on('/feed', () => {
        this.renderPage('feed-page')
      })
      .notFound(() => {
        this.renderPage('not-found')
      })
      .resolve()

    console.log('🛣️ Router configurado')
  }

  /**
   * Inicializa la conexión WebSocket
   */
  async initializeWebSocket() {
    try {
      await initWebSocket()
      console.log('🔌 WebSocket conectado')
    } catch (error) {
      console.warn('⚠️ Error al conectar WebSocket:', error)
    }
  }

  /**
   * Configura listeners globales
   */
  setupGlobalListeners() {
    // Listener para cambios de autenticación
    this.authStore.subscribe((state) => {
      if (state.isAuthenticated && !this.isInitialized) {
        this.initializeWebSocket()
      }
    })

    // Listener para errores globales
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
      this.uiStore.showNotification('Error inesperado', 'error')
    })

    // Listener para cambios de tema
    this.setupThemeListener()

    console.log('👂 Listeners globales configurados')
  }

  /**
   * Configura el listener para cambios de tema
   */
  setupThemeListener() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleThemeChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
        this.uiStore.setTheme('dark')
      } else {
        document.documentElement.classList.remove('dark')
        this.uiStore.setTheme('light')
      }
    }

    darkModeQuery.addListener(handleThemeChange)
    handleThemeChange(darkModeQuery)
  }

  /**
   * Renderiza una página específica
   */
  renderPage(pageName, data = {}) {
    const mainContent = document.getElementById('main-content')
    
    if (!mainContent) {
      console.error('No se encontró el contenedor principal')
      return
    }

    // Limpiar contenido actual
    mainContent.innerHTML = ''

    // Crear elemento de página
    const pageElement = document.createElement(pageName)
    
    // Pasar datos a la página
    if (data && Object.keys(data).length > 0) {
      Object.assign(pageElement, data)
    }

    // Agregar página al contenedor
    mainContent.appendChild(pageElement)

    // Disparar evento de cambio de página
    window.dispatchEvent(new CustomEvent('pageChanged', {
      detail: { pageName, data }
    }))

    console.log(`📄 Página renderizada: ${pageName}`)
  }

  /**
   * Muestra la pantalla de carga
   */
  showLoading() {
    const loadingScreen = document.getElementById('loading-screen')
    if (loadingScreen) {
      loadingScreen.style.display = 'flex'
    }
  }

  /**
   * Oculta la pantalla de carga
   */
  hideLoading() {
    const loadingScreen = document.getElementById('loading-screen')
    if (loadingScreen) {
      loadingScreen.style.display = 'none'
    }
  }

  /**
   * Maneja errores de inicialización
   */
  handleInitializationError(error) {
    this.hideLoading()
    
    // Mostrar mensaje de error al usuario
    this.uiStore.showNotification(
      'Error al cargar la aplicación. Por favor, recarga la página.',
      'error'
    )

    // Log del error para debugging
    console.error('Error de inicialización:', error)
  }

  /**
   * Obtiene información de la aplicación
   */
  getAppInfo() {
    return {
      version: '1.0.0',
      name: 'Red Social',
      isInitialized: this.isInitialized,
      isAuthenticated: this.authStore.isAuthenticated,
      currentUser: this.authStore.user
    }
  }
}

// Crear instancia global de la aplicación
window.app = new RedSocialApp()

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app.init()
})

// Exportar para uso en módulos
export default window.app 