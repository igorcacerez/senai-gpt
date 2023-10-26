const AtivarVoz = () => {

    // Crie uma instância de SpeechRecognition
    const recognition = new webkitSpeechRecognition();

    // Defina configurações para a instância
    recognition.lang = 'pt-BR';
    recognition.continuous = true; // Permite que ele continue escutando
    recognition.interimResults = false; // Define para true se quiser resultados parciais

    // Inicie o reconhecimento de voz
    recognition.start();

    // Adicione um evento de escuta para lidar com os resultados
    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]; // Último resultado

        // Verifique o texto reconhecido
        const recognizedText = result[0].transcript;

        console.log('Texto reconhecido:', recognizedText);

        if (recognizedText.toLowerCase().includes("alterar tema")) {
            alterarModoDarkLight()
        }

        // Verifique se a palavra "Jarvis" está no texto
        if (recognizedText.toLowerCase().includes('ativar')) {

            // Comece a salvar a pergunta quando "Jarvis" é detectado
            let array_pergunta = recognizedText.toLowerCase().split('ativar');
            array_pergunta = array_pergunta[array_pergunta.length - 1];

            input.value = array_pergunta;

            exibirMensagem(array_pergunta, "user")
            buscaRespostaOpenAI(array_pergunta)

            // Pare o reconhecimento de voz para economizar recursos
            recognition.stop();
        }
    };

    // Adicione um evento para reiniciar o reconhecimento após um tempo
    recognition.onend = () => {
        setTimeout(() => {
            recognition.start();
        }, 1000); // Espere 1 segundo antes de reiniciar
    };
}

AtivarVoz()

// http://127.0.0.1:5500/