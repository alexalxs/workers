addEventListener('fetch', event => {  
  event.respondWith(handleRequest(event.request))  
})  

async function handleRequest(request) {  
  // Obtém resposta original  
  let response = await fetch(request)  
  
  // Verifica se é uma resposta de erro do WAF (403)  
  if (response.status === 403) {  
    // URL da sua página original ou para onde deseja redirecionar  
    const url = new URL(request.url)  
    
    // Opção 1: Redirecionar para página personalizada  
    return Response.redirect("https://betteryourlife.online/acesso-negado", 302)  
    
    // Opção 2: Retornar HTML personalizado  
    /*  
    return new Response(`<!DOCTYPE html>  
      <html>  
        <head><title>Acesso Restrito</title></head>  
        <body>  
          <h1>Acesso Restrito</h1>  
          <p>Este conteúdo não está disponível na sua região.</p>  
          <a href="/">Voltar para a página inicial</a>  
        </body>  
      </html>`,   
      {   
        status: 403,  
        headers: { "Content-Type": "text/html" }  
      }  
    )  
    */  
  }  
  
  return response  
}  