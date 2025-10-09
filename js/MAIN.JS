// ===========================================
// ESTADO GLOBAL (Necesario para alternar imágenes)
// ===========================================
// Objeto para llevar la cuenta de qué imagen está activa en cada banner
const bannerState = {};


// ===========================================
// FUNCIONES GLOBALES DE MANEJO DE IMAGEN Y MODAL
// (Llamadas directamente desde el HTML con 'onclick')
// ===========================================

/**
 * Muestra la imagen activa del banner en un modal expandido.
 * Maneja tanto el 'main-banner' (fondo CSS) como los 'banner-item' (clases 'active').
 * @param {string} bannerId - El ID del banner ('banner1', 'main-banner', etc.)
 * @param {string} expandedContainerId - El ID del contenedor expandido ('img-expandida-1', 'img-expandida-main')
 */
function toggleImage(bannerId, expandedContainerId) {
    const banner = document.getElementById(bannerId);
    const expandedContainer = document.getElementById(expandedContainerId);
    const expandedImage = document.getElementById(`expanded-content-${bannerId}`);
    
    if (!banner || !expandedContainer || !expandedImage) return;

    // Inicializa el estado si no existe
    if (bannerState[bannerId] === undefined) {
        bannerState[bannerId] = 'A'; // 'A' para imagen inicial, 'B' para alternativa
    }
    
    let newImageSrc;

    // --- ESCENARIO 1: Banner Central (main-banner) que cambia fondo CSS ---
    if (bannerId === 'main-banner') {
        const dataContainer = banner.querySelector('#image-data');
        if (!dataContainer) return;

        const imgA_src = dataContainer.getAttribute('data-img-a');
        const imgB_src = dataContainer.getAttribute('data-img-b');

        if (bannerState[bannerId] === 'A') {
            // Cambia a imagen B (alternativa)
            banner.style.backgroundImage = `url('${imgB_src}')`;
            bannerState[bannerId] = 'B';
            newImageSrc = imgB_src;
        } else {
            // Cambia de vuelta a imagen A (inicial)
            banner.style.backgroundImage = `url('${imgA_src}')`;
            bannerState[bannerId] = 'A';
            newImageSrc = imgA_src;
        }

    // --- ESCENARIO 2: Banners Verticales con Diagonal (usa clases 'active') ---
    } else {
        if (bannerState[bannerId] === 'A') {
            banner.classList.add('active'); // CSS hace visible la imagen B
            bannerState[bannerId] = 'B';
            newImageSrc = banner.querySelector('.split-image-b').src;
        } else {
            banner.classList.remove('active'); // CSS hace visible la imagen A
            bannerState[bannerId] = 'A';
            newImageSrc = banner.querySelector('.split-image-a').src;
        }
    }

    // Mostrar la imagen expandida para AMBOS escenarios
    expandedImage.src = newImageSrc;
    expandedContainer.classList.remove('hidden');
}

/**
 * Oculta el contenedor de la imagen expandida.
 * @param {string} expandedContainerId - El ID del contenedor expandido
 */
function hideExpandedImage(expandedContainerId) {
    const expandedContainer = document.getElementById(expandedContainerId);
    if (expandedContainer) {
        expandedContainer.classList.add('hidden');
    }
}

// Opcional: Cerrar al hacer clic fuera del modal
document.addEventListener('click', function(event) {
    const expandedContainers = document.querySelectorAll('.expanded-image-container:not(.hidden)');
    expandedContainers.forEach(container => {
        const isClickInside = container.contains(event.target);
        
        // Cierra si el clic fue *fuera* del contenedor y *no* fue en el botón/área que lo abre
        const isClickOnActivator = event.target.closest('.brutalist-button, .banner-item');
        
        if (!isClickInside && !isClickOnActivator) {
            container.classList.add('hidden');
        }
    });
});


// ===========================================
// FUNCIONALIDAD QUE REQUIERE EL DOM/JQUERY
// (Menú, Acordeón, Carrusel)
// ===========================================
$(document).ready(function() {

    // 1. FUNCIONALIDAD DEL MENÚ NAV BAR RESPONSIVE
    // -------------------------------------------
    const menuIcon = $('#menu-icon');
    const navLinks = $('#nav-links');

    if (menuIcon.length && navLinks.length) {
        menuIcon.on('click', function() {
            navLinks.toggleClass('active');
        });
    }

    // 2. FUNCIONALIDAD DEL ACORDEÓN
    // ----------------------------
    $('.accordion-header').on('click', function() {
        const item = $(this).closest('.accordion-item');
        const isCurrentlyActive = item.hasClass('active');

        // Cierra todos los demás elementos
        $('.accordion-item').removeClass('active');

        // Si el elemento NO estaba activo, lo abre
        if (!isCurrentlyActive) {
            item.addClass('active');
        }
    });

    // 3. CÓDIGO DEL CARRUSEL (Optimizado con bloqueo de clics)
    // --------------------------------------------------------
    if ($(".container_carru").length) { 
        var objects = $(".container_carru #items .item");
        var items = objects.length - 1;
        var i = 0;
        var isAnimating = false; 
        var animationDuration = 1000; 

        // Asignación inicial de clases
        objects.each(function(index) {
            if (index === 0) {
                $(this).addClass('img_left');
            } else if (index === 1) {
                $(this).addClass('img_center');
            } else if (index === 2) {
                $(this).addClass('img_rigth');
            }
        });

        var dataimg_Cen = 1;

        function move(direction) {
            if (isAnimating) return;
            isAnimating = true;

            objects.attr('class', 'item');

            var next_Cen, next_Left, next_Right;

            if (direction === 'right') {
                // Mover a la DERECHA
                next_Cen = (dataimg_Cen + 1) % objects.length;
                next_Right = (dataimg_Cen + 2) % objects.length;
                next_Left = dataimg_Cen;

                $(objects[next_Left]).addClass('animateleftL').addClass("img_left"); 
                $(objects[dataimg_Cen]).addClass('animateleftL').addClass("img_left");
                $(objects[next_Right]).addClass("animateleftR").addClass("img_rigth"); 
                $(objects[next_Cen]).addClass("animateleftC").addClass("img_center"); 

                dataimg_Cen = next_Cen;
            } else if (direction === 'left') {
                // Mover a la IZQUIERDA
                next_Cen = (dataimg_Cen - 1 + objects.length) % objects.length;
                next_Left = dataimg_Cen;
                next_Right = (dataimg_Cen - 2 + objects.length) % objects.length;

                $(objects[next_Left]).addClass('animaterigthR').addClass("img_rigth");
                $(objects[next_Right]).addClass("animaterigthL").addClass("img_left");
                $(objects[next_Cen]).addClass("animaterigthC").addClass("img_center");

                dataimg_Cen = next_Cen;
            }

            setTimeout(function() {
                isAnimating = false;
            }, animationDuration);
        }

        // Eventos de clic para las flechas
        $("#arrowleft").on("click", function() { move('left'); });
        $("#arrowrigth").on("click", function() { move('right'); });

        // Swipe gestures (Requiere Hammer.js)
        var myElement = document.querySelector('.container_carru');
        if (myElement) {
            var mc = new Hammer(myElement);
            mc.on("swipeleft", function() { move('right'); }); 
            mc.on("swiperight", function() { move('left'); });
        }
    }
});