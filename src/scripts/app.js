$(document).ready( function () {
    
    var mySwiper = new Swiper('.swiper-container', {
        speed: 400,
        spaceBetween: 30,
        slidesPerView: 3,
        centeredSlides: true,
        loop: true,
        slidesPerView: 'auto',
        nextButton: $('.slider-controls .swiper-button-next'),
		prevButton: $('.slider-controls .swiper-button-prev')
    });

});