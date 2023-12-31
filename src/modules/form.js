import { openModal, closeModal } from "./modal"
import { postData } from "../server/server"

function form(formSelector, modalTimerId) {
    // Form
    const forms = document.querySelectorAll(formSelector)

    forms.forEach((form)=> {
        bindPostData(form)
    })

    const msg = {
        loading: 'Loading...',
        success: 'Thanks for submitting our form',
        failure: 'Something went wrong'
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
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog')

        prevModalDialog.classList.add('hide')
        prevModalDialog.classList.remove('show')
        openModal('.modal', modalTimerId)

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
            closeModal('.modal')
        }, 3000)
    }
}

export default form