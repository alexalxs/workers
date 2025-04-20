// src/index.js  
addEventListener('fetch', event => {  
  event.respondWith(handleRequest(event.request));  
});  

async function handleRequest(request) {  
  // Versão simplificada para teste  
  const originalResponse = await fetch(request);  
  
  if (originalResponse.status === 403) {  
    return new Response('<html><body><h1>Página de erro personalizada</h1></body></html>', {  
      headers: { 'Content-Type': 'text/html' },  
      status: 403  
    });  
  }  
  
  return originalResponse;  
}  