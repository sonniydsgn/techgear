// Lazy Load
@@include("yall.min.js");

document.addEventListener("DOMContentLoaded", yall);

// Fixed Header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header')
  header.classList.toggle('sticky', window.scrollY > 0)
})

// Burger Menu
function toggleMenu () {
  const menu = document.querySelector('.menuToggle')
  const nav = document.querySelector('.nav')
  const body = document.querySelector('body')

  menu.classList.toggle('active')
  nav.classList.toggle('active')
  body.classList.toggle('lock')
}

// Glider
@@include("glider.min.js");

new Glider(document.querySelector('.glider'), {
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: true,
  arrows: {
    prev: '.glider-prev',
    next: '.glider-next'
  },
  responsive: [
    {
      breakpoint: 746,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        itemWidth: 150
      }
    }, {
      breakpoint: 430,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        itemWidth: 150
      }
    }
  ]
})

