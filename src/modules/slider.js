function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
    // Sliders
    const sliders = document.querySelectorAll(slide),
        next = document.querySelector(nextArrow),
        prev = document.querySelector(prevArrow),
        total = document.querySelector(totalCounter),
        current = document.querySelector(currentCounter),
        slidersWrapper = document.querySelector(wrapper),
        sliderField = document.querySelector(field),
        width = window.getComputedStyle(slidersWrapper).width,
        slider = document.querySelector(container)

        let slideIndex = 1
        let offset = 0

    // -------------*****  Carousel slider  *****-------------  //
    if(sliders.length < 10) {
        total.textContent = `0${sliders.length}`
        current.textContent = `0${slideIndex}`
    } else {
        total.textContent = sliders.length
        current.textContent = slideIndex
    }

    sliderField.style.width = 100 * sliders.length + '%'
    sliderField.style.display = 'flex'
    sliderField.style.transition = '.5s ease all'
    slidersWrapper.style.overflow = 'hidden'

    sliders.forEach(slider => {
        slider.style.width = width
    })

    const indicators = document.createElement('ol')
    const dots = []
    indicators.classList.add('carousel-indicators')
    slider.append(indicators)

    for( let i = 0; i < sliders.length; i++) {
        const dot = document.createElement('li')
        dot.setAttribute('data-slide-to', i + 1)
        dot.classList.add('carousel-dot')
        if(i == 0) {dot.style.opacity = 1}
        indicators.append(dot)
        dots.push(dot)
    }

    function mainStyleCode() {
        if(sliders.length < 10) {
            current.textContent = `0${slideIndex}`
        } else {
            current.textContent = slideIndex
        }

        dots.forEach(dot => dot.style.opacity = '.5')
        dots[slideIndex - 1].style.opacity = '1'
    }

    next.addEventListener('click', ()=> {
        if(offset == parseFloat(width) * (sliders.length - 1)) {
            offset = 0
        } else {
            offset += parseFloat(width)
        }
        sliderField.style.transform = `translateX(-${offset}px)`

        if(slideIndex == sliders.length) {
            slideIndex = 1
        } else {
            slideIndex++
        }

        mainStyleCode()
    })
    prev.addEventListener('click', ()=> {
        if(offset == 0) {
            offset = parseFloat(width) * (sliders.length - 1)
        } else {
            offset -= parseFloat(width)
        }
        sliderField.style.transform = `translateX(-${offset}px)`

        if(slideIndex == 1) {
            slideIndex = sliders.length
        } else {
            slideIndex--
        }

        mainStyleCode()
    })

    dots.forEach(dot => {
        dot.addEventListener('click', (e)=> {
            const slideTo = e.target.getAttribute('data-slide-to')
            slideIndex = slideTo

            offset = parseFloat(width) * (slideTo - 1)
            sliderField.style.transform = `translateX(-${offset}px)`

            mainStyleCode()
        })
    })
}

export default slider