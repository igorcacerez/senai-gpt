let btn = document.querySelector("#btn")
let resposta = document.querySelector("#resposta")
let input = document.querySelector("#texto")
let micro = document.querySelector("#micro")

// Array de mensagens
let messages = [
    {
        "role": "system",
        "content": "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas."
    }
]

// Carrega o reconhecimento de voz
// var recognite = new webkitSpeechRecognition()

// Define o idioma
// recognite.lang = "pt-BR"

// Define se o reconhecimento de voz vai 
// parar de ouvir quando o usuário parar de falar
// recognite.interimResults = true

// Caputura o evento de clique no botão e inicia 
// o reconhecimento de voz
btn.addEventListener("click", function(){
    try{
        input.value = "Estou te ouvindo..."
        micro.src = "assets/img/ouvindo.png"
        recognite.start()
    }catch(e){
        console.log(e)
    }
})

// Caputura o resultado do reconhecimento de voz
// recognite.onresult = function(event){

//     // Captura as palavras que foram ditas
//     var result = event.results[event.resultIndex]

//     // Exibe as palavras na tela
//     input.value = result[0].transcript

//     // Verifica se o reconhecimento de voz terminou
//     if(result.isFinal){
//         // Limpa a resposta anterior
//         micro.src = "assets/img/microphone.png"
//         exibirMensagem(result[0].transcript, "user")
//         buscaRespostaOpenAI(result[0].transcript)
//     }
// }   


// Recupera a ação de apertar a tecla enter
input.addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        // Limpa a resposta anterior
        exibirMensagem(input.value, "user")
        buscaRespostaOpenAI(input.value)
    }
})


const buscaRespostaOpenAI = async (texto) => {
    // Key da API
    let key = "sk-KC@oyKUZJtrc98NMubjZL@T3Blbk@FJGXJ4EmYqNt0B7Qu@628I2"
    key = key.replaceAll("@", "")

    // Adiciona a mensagem do usuário
    messages.push({
        "role": "user",
        "content": texto
    })

    // Busca via Fetch
    fetch("https://api.openai.com/v1/chat/completions", {
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

        // Exibe a resposta do bot
        exibirMensagem(exibeResposta, "bot")
        falarResposta(exibeResposta)
    })
}

// Função para falar a resposta
const falarResposta = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 3;
    speech.pitch = 1.5;

    window.speechSynthesis.speak(speech);
}


/**
 * Responsavel por exibir a mensagem na tela
 * @param {string} texto 
 * @param {string} tipo 
 */
const exibirMensagem = (texto, tipo) => {

    // Substitui \n por <br>
    texto = texto.replaceAll("\n", "<br>")

    // Cria o elemento p
    const div = document.createElement("div")
    const p = document.createElement("p")
    const span = document.createElement("span")

    // Adiciona a classe de acordo com o tipo
    if (tipo == "user") {
        div.classList.add("user")
    } else {
        div.classList.add("bot")
    }

    // Recupera o horario no padrão br
    const horario = formatarData()

    // Adiciona o horario no span 
    span.innerHTML = horario

    // Adiciona o texto no elemento p
    p.innerHTML = texto

    // Adiciona o p e o span na div
    div.appendChild(p)
    div.appendChild(span)

    // Adiciona a div na resposta
    resposta.appendChild(div)

    // Pega a altura da página
    let alturaDaPagina = resposta.scrollHeight;

    // Move o scroll para o final da página
    resposta.scrollTo(0, alturaDaPagina);
}


/**
 * Responsável por formatar a data e hora atual
 * @returns Retorna a data e hora atual formatada
 */
const formatarData = () => {
    const agora = new Date();
  
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const ano = agora.getFullYear();
    
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
  
    const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`;
    return dataFormatada;
}

// HISTÓRICO DE MENSAGENS

// Criar função para salvar histórico
const salvarHistorico = () => {
    localStorage.setItem('historico', JSON.stringify(messages));
}

// Criar função para carregar histórico
const carregarHistorico = () => {
    const historico = localStorage.getItem('historico');
    if (historico) {
        console.log(historico)
        messages = JSON.parse(historico);
        messages.forEach(mensagem => {
            if (mensagem.role !== "system") {
                exibirMensagem(mensagem.content, mensagem.role);
            }
        });
    }
}

const alterarModoDarkLight = () => {
    const body = document.querySelector("body")
   
    if (body.classList.contains("dark")) {
        body.classList.remove("dark")
        messages[0].content = "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas."
    } else {
        body.classList.add("dark")
        messages[0].content = "Jarvis é um chatbot rude, sarcastico que vive em universo onde palavrões são obrigatórios."
    }
}

// Chamar a função carregarHistorico quando a página carregar
document.addEventListener('DOMContentLoaded', carregarHistorico);

// Chamar a função salvarHistorico quando a página for fechada
window.addEventListener('beforeunload', salvarHistorico);

document.querySelector(".button-dark").addEventListener("click", function(){
    alterarModoDarkLight()
})

document.querySelector(".lixo").addEventListener("click", function(){
    // Limpa a resposta anterior
    resposta.innerHTML = ""

    // Array de mensagens
    messages = [
        {
            "role": "system",
            "content": "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas."
        }
    ]

    // Limpa o historico do localStorage
    localStorage.removeItem('historico');
})
