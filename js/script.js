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
})