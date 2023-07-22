window.addEventListener('DOMContentLoaded', () => {
    const tabsParent = document.querySelector('.tabheader__items'),
    tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    loader = document.querySelector('.loader')

    // Loader
    setTimeout(()=> {
        loader.style.opacity = '0'
        setTimeout(() => {
            loader.style.display = 'none'
        }, 1500)
    }, 2000)

    // Tabs
    function hideTabContent() {
        tabsContent.forEach(i => {
            i.classList.add('hide')
            i.classList.remove('show', 'fade')
        })

        tabs.forEach(i => {
            i.classList.remove('tabheader__item_active')
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade')
        tabsContent[i].classList.remove('hide')
        tabs[i].classList.add('tabheader__item_active')
    }

    hideTabContent()
    showTabContent()

    tabsParent.addEventListener('click', (e) => {
        if(e.target && e.target.classList.contains('tabheader__item')) {
            tabs.forEach((item, index) => {
                if(e.target == item) {
                    hideTabContent()
                    showTabContent(index)
                    console.log(e.target)
                }
            })
        }
    })

    // Timer
    const deadline = '2023-07-28'

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds
        const timer = Date.parse(endtime) - Date.parse(new Date())

        if(timer <= 0) {
            days = 0
            hours = 0
            minutes = 0
            seconds = 0
        } else {
            days = Math.floor(timer / (1000 * 60 * 60 * 24))
            hours = Math.floor((timer / (1000 * 60 * 60)) % 24)
            minutes = Math.floor((timer / 1000 / 60) % 60)
            seconds = Math.floor((timer / 1000) % 60)
        }

        return {timer, days, hours, minutes, seconds}
    }

    function getZero(num) {
        if(num >= 0 && num < 10) {
            return `0${num}`
        } else {
            return num
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timerInterval = setInterval(updateClock, 1000)
            updateClock()

        function updateClock() {
            const t = getTimeRemaining(endtime)

            days.innerHTML = getZero(t.days)
            hours.innerHTML = getZero(t.hours)
            minutes.innerHTML = getZero(t.minutes)
            seconds.innerHTML = getZero(t.seconds)

            if(t.timer <= 0) {
                clearInterval(timerInterval)
            }
        }
    }

    setClock('.timer', deadline)

    // Modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal')

    function closeModal() {
        modal.classList.add('hide')
        modal.classList.remove('show')
        document.body.style.overflow = ''
    }

    function openModal() {
        modal.classList.add('show')
        modal.classList.remove('hide')
        document.body.style.overflow = 'hidden'
        clearInterval(modalTimer)
    }
    modalTrigger.forEach(i => i.addEventListener('click', openModal))

    modal.addEventListener('click', (e)=> {
        if(e.target == modal || e.target.getAttribute('data-close') == '') {
            closeModal()
        }
    })

    document.addEventListener('keydown', (e)=> {
        if(e.code == 'Escape' && modal.classList.contains('show')) {
            closeModal()
        }
    })

    const modalTimer = setTimeout(openModal, 500000)

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal()
            window.removeEventListener('scroll', showModalByScroll)
        }
    }
    window.addEventListener('scroll', showModalByScroll)

    // Class
    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src
            this.alt = alt
            this.title = title
            this.descr = descr
            this.price = price
            this.classes = classes
            this.parent = document.querySelector(parentSelector)
            this.transfer = 11483
            this.changeToUZS()
        }

        changeToUZS() {
            Math.floor(this.price = this.price * this.transfer)
        }

        render() {
            const element = document.createElement('div')
            if(this.classes.length === 0) {
                this.element = 'menu__item'
                element.classList.add(this.element)
            }else{
                this.classes.forEach(classname => element.classList.add(classname))
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt} />
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Price:</div>
                    <div class="menu__item-total"><span>${this.price}</span> uzs/month</div>
                </div>
            `

            this.parent.append(element)
        }
    }

    axios.get('http://localhost:3000/menu').then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
            })
        })

    // async function getRecource(url) {
    //     const res = await fetch(url)

    //     return await res.json()
    // }

    // getRecource('http://localhost:3000/menu').then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render()
    //     })
    // })

    // Form
    const forms = document.querySelectorAll('form')

    forms.forEach((form)=> {
        bindPostData(form)
    })

    const msg = {
        loading: 'Loading...',
        success: 'Thanks for submitting our form',
        failure: 'Something went wrong'
    }

    async function postData(url, data) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data,
        })

        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e)=> {
            e.preventDefault()

            const statusMessage = document.createElement('div')
            statusMessage.textContent = msg.loading
            form.append(statusMessage)

            const formData = new FormData(form)
            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            postData("http://localhost:3000/request", json)
            .then(data => {
                console.log(data)
                showThanksModal(msg.success)
                form.reset()
                statusMessage.remove()
            })
            .catch(()=>  showThanksModal(msg.failure))
            .finally(()=> form.reset())

            // const request = new XMLHttpRequest()
            // request.open('POST', 'server/server.php')

            // request.setRequestHeader('Content-Type', 'application/json')
            // const obj = {}
            // const formData = new FormData(form)
            // formData.forEach((val, key)=> {
            //     obj[key] = val
            // })

            // const json = JSON.stringify(obj)

            // request.send(json)

            // request.addEventListener('load', ()=> {
            //     if(request.status === 200) {
            //         console.log(request.response)
            //         showThanksModal(msg.success)

            //         form.reset()
            //         setTimeout(()=> {
            //             statusMessage.remove()
            //         }, 2000)
            //     } else {
            //         showThanksModal(msg.failure)
            //     }
            // })
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog')

        prevModalDialog.classList.add('hide')
        prevModalDialog.classList.remove('show')
        openModal()

        const thanksModal = document.createElement('div')
        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div data-close class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `
        document.querySelector('.modal').append(thanksModal)

        setTimeout(()=> {
            thanksModal.remove()
            prevModalDialog.classList.add('show')
            prevModalDialog.classList.remove('hide')
            closeModal()
        }, 3000)
    }

    // Sliders
    const sliders = document.querySelectorAll('.offer__slide'),
        next = document.querySelector('.offer__slider-next'),
        prev = document.querySelector('.offer__slider-prev'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidersWrapper = document.querySelector('.offer__slider-wrapper'),
        sliderField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidersWrapper).width,
        slider = document.querySelector('.offer__slider')

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

        for(i = 0; i < sliders.length; i++) {
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



    // -------------*****  Easy slider  *****-------------  //
    // if(sliders.length < 10) {
    //     total.textContent = `0${sliders.length}`
    // } else {
    //     total.textContent = sliders.length
    // }

    // showSlides(slideIndex)

    // function showSlides(idx) {
    //     if(idx > sliders.length) {
    //         slideIndex = 1
    //     }
    //     if(idx < 1) {
    //         slideIndex = sliders.length
    //     }
    //     sliders.forEach(item => item.style.display = 'none')
    //     sliders[slideIndex - 1].style.display = 'block'

    //     if(sliders.length < 10) {
    //         current.textContent = `0${slideIndex}`
    //     } else {
    //         current.textContent = slideIndex
    //     }
    // }

    // function plusSlides(idx) {
    //     showSlides(slideIndex += idx)
    // }
    // next.addEventListener('click', ()=> plusSlides(1))
    // prev.addEventListener('click', ()=> plusSlides(-1))
})