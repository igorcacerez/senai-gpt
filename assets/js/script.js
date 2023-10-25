var btn = document.querySelector("#btn")
var resposta = document.querySelector("#resposta")
var input = document.querySelector("#texto")

// Adicione esta linha no topo do arquivo
require('dotenv').config();

// Array de mensagens
const messages = [
    {
        "role": "system",
        "content": "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas."
    }
]

// Carrega o reconhecimento de voz
var recognite = new webkitSpeechRecognition()

// Define o idioma
recognite.lang = "pt-BR"

// Define se o reconhecimento de voz vai 
// parar de ouvir quando o usuário parar de falar
recognite.interimResults = true

// Caputura o evento de clique no botão e inicia 
// o reconhecimento de voz
btn.addEventListener("click", function(){
    try{
        input.value = "Estou te ouvindo..."
        recognite.start()
    }catch(e){
        console.log(e)
    }
})

// Caputura o resultado do reconhecimento de voz
recognite.onresult = function(event){

    // Captura as palavras que foram ditas
    var result = event.results[event.resultIndex]

    // Exibe as palavras na tela
    input.value = result[0].transcript

    // Verifica se o reconhecimento de voz terminou
    if(result.isFinal){
        // Limpa a resposta anterior
        resposta.innerHTML = ""
        buscaRespostaOpenAI(result[0].transcript)
    }
}   


// Recupera a ação de apertar a tecla enter
input.addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        // Limpa a resposta anterior
        resposta.innerHTML = ""
        buscaRespostaOpenAI(input.value)
    }
})


const buscaRespostaOpenAI = async (texto) => {
    // Key da API
    const key = ""

    // Adiciona a mensagem do usuário
    messages.push({
        "role": "user",
        "content": texto
    })

    // Busca via Fetch
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
            "model": "ft:gpt-3.5-turbo-0613:duug::8DEKB59q",
            "messages": messages
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)

        // Adiciona a resposta do bot
        messages.push({
            "role": "assistant",
            "content": data.choices[0].message.content
        })

        // Resposta a ser exibida 
        let exibeResposta = data.choices[0].message.content

        // Substitui \n por <br>
        exibeResposta = exibeResposta.replaceAll("\n", "<br>")

        // Exibe a resposta do bot
        resposta.innerHTML = exibeResposta
    })
}