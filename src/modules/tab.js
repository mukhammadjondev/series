function tab(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    // Tabs
    const tabsParent = document.querySelector(tabsParentSelector),
    tabs = document.querySelectorAll(tabsSelector),
    tabsContent = document.querySelectorAll(tabsContentSelector)

    function hideTabContent() {
        tabsContent.forEach(i => {
            i.classList.add('hide')
            i.classList.remove('show', 'fade')
        })

        tabs.forEach(i => {
            i.classList.remove(activeClass)
        })
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade')
        tabsContent[i].classList.remove('hide')
        tabs[i].classList.add(activeClass)
    }

    hideTabContent()
    showTabContent()

    tabsParent.addEventListener('click', (e) => {
        if(e.target && e.target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((item, index) => {
                if(e.target == item) {
                    hideTabContent()
                    showTabContent(index)
                    console.log(e.target)
                }
            })
        }
    })
}

export default tab