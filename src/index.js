addEventListener('fetch', event => {  
  event.respondWith(handleRequest(event.request));  
});  

// ========== CONFIGURAÇÕES DO USUÁRIO ==========  
const CONFIG = {  
  // URL base do site (para redirecionamentos)  
  BASE_URL: 'https://betteryourlife.online/',  
  
  // Caminhos protegidos (apenas estas URLs exigirão validação)  
  PROTECTED_PATHS: [  
    '/area-restrita/',  
    '/membros/',  
    '/conteudo-premium/',  
    '/classic-html/'  
    // Adicione mais caminhos conforme necessário  
  ],  
  
  // Países permitidos (códigos de 2 letras)  
  ALLOWED_COUNTRIES: ['CL', 'BR', 'US', 'AR'],  
  
  // Chaves de acesso válidas  
  VALID_KEYS: [  
    { param: 'key', value: '1' },  
    { param: 'key', value: '2023' },  
    { param: 'access', value: 'premium' },  
    { param: 'token', value: 'special' }  
  ],  
  
  // Permitir acesso ao wp-admin automaticamente?  
  ALLOW_WP_ADMIN: true,  
  
  // Permitir IPs do Google/Facebook?  
  ALLOW_GOOGLE_FB: true  
};  
// ==============================================  

async function handleRequest(request) {  
  // Obter informações da requisição  
  const country = request.headers.get('CF-IPCountry') || 'XX';  
  const url = new URL(request.url);  
  const path = url.pathname;  
  const queryParams = new URLSearchParams(url.search);  
  
  // Verificar se o caminho atual está na lista de caminhos protegidos  
  const isProtectedPath = CONFIG.PROTECTED_PATHS.some(protectedPath =>   
    path === protectedPath || path.startsWith(protectedPath)  
  );  
  
  // Se não for um caminho protegido, permitir acesso sem restrições  
  if (!isProtectedPath) {  
    return fetch(request);  
  }  
  
  // A partir daqui, aplicamos as regras apenas para caminhos protegidos  
  const isInGoogleFbList = CONFIG.ALLOW_GOOGLE_FB &&   
                          request.headers.get('cf-ipcountry-google_fb_ips') === 'T';  
  
  const isFromAllowedCountry = CONFIG.ALLOWED_COUNTRIES.includes(country);  
  
  const hasValidKey = CONFIG.VALID_KEYS.some(keyObj =>   
    queryParams.get(keyObj.param) === keyObj.value  
  );  
  
  const isWpAdmin = CONFIG.ALLOW_WP_ADMIN && path.startsWith('/wp-admin');  
  
  // Lógica de permissão para caminhos protegidos  
  const isAllowed = isFromAllowedCountry || hasValidKey || isWpAdmin || isInGoogleFbList;  
  
  // Se não está permitido, redirecione para a página inicial  
  if (!isAllowed) {  
    return Response.redirect(CONFIG.BASE_URL, 302);  
  }  
  
  // Caso contrário, continuar com a requisição  
  return fetch(request);  
}  