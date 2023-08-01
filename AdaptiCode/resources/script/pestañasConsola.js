//Función para cambiar entre pestañas
function changeTab(tabIndex) {
    //Donde esta los elementos
    //Botones
    var tabs = document.getElementsByClassName('tab');
    //Pestañas
    var tabPanes = document.getElementsByClassName('tab-pane');
    
    //Ocultar todas las pestañas y tab panes
    for (var i = 0; i < tabs.length; i++) {
        //Edita el CSS para ocultar los elementos o mostrar
        tabs[i].classList.remove('active');
        tabPanes[i].style.display = 'none';
    }
    
    //Mostrar la pestaña y tab pane seleccionados
    tabs[tabIndex].classList.add('active');
    tabPanes[tabIndex].style.display = 'block';
}

//Establecer la pestaña activa por defecto
changeTab(0);  