function modal() {

    //modal
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function closeModal() {
        /*modal.classList.remove('show', 'fade');  modal.classList.add('hide'); */
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        /*modal.classList.remove('hide');    modal.classList.add('show', 'fade'); */
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        //console.log(modal.style.display = 'block');  // clearInterval(modalTimerId);
    }

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal)
    });

    //close modal window then click outside the modal window
    modal.addEventListener('click', (e) => {
        if (e.target == modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    //close modal window then down "Esc" key
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape' && modal.classList.contains('show')) { closeModal(); }
    });

    //show modal window then past 3000ms from open the site if before it was not open
    //const modalTimerId = setTimeout(openModal, 50000);

    //show the modal window if a user has scrolled to the bottom of the page
    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        };
    }

    window.addEventListener('scroll', showModalByScroll);
    //modal end

}

module.exports = modal;