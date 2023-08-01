window.addEventListener('DOMContentLoaded', (event) => {
    //Tomamos informacion del textarea editor
    const textarea = document.getElementById('editor');
    //Donde editamos el contador de lineas en el HTML
    const lineCount = document.getElementById('lineas');
    //Leemos la entrada de datos
    textarea.addEventListener('input', updateLineCount);
    //Agregamos o quitamos segun sea necesario
    function updateLineCount() {
        //Suma al salto de linea
        const lines = textarea.value.split('\n').length;
        //Inyectamos el HTML
        lineCount.textContent = 'Líneas: ' + lines;
    }
});