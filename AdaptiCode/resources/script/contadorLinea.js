//Inicia a correr cuando se carga la pagina
window.addEventListener('DOMContentLoaded', (event) => {
    //Leeremos el textarea editor
    const textarea = document.getElementById('editor');
    //Contenedor donde se colocara los numeros
    const lineNumbersContainer = document.querySelector('.line-numbers');
    //Sigcronizamos ambas barras y datos para ver el contenido
    textarea.addEventListener('input', updateLineCount);
    textarea.addEventListener('scroll', syncScroll);
    //Al detectar un salto de linea cuenta
    function updateLineCount() {
        const lines = textarea.value.split('\n');
        //Lo vamos agregando y creando en el HTMl
        const lineNumbersHTML = lines.map((line, index) => {
            return (index + 1);
        }).join('<br>');
        //Pasamos el contenido
        lineNumbersContainer.innerHTML = lineNumbersHTML;
    }
    //Movera ambos contenidos con un solo "Scroll"
    function syncScroll() {
        lineNumbersContainer.scrollTop = textarea.scrollTop;
        textarea.scrollLeft = lineNumbersContainer.scrollLeft;
    }

    updateLineCount();
});  