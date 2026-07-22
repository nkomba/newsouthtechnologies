// Mobile Menu Toggle Module
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.mobile-toggle');
    var menu = document.getElementById('main-nav');

    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
        menu.classList.toggle('active');
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
    });

    // Close menu when clicking a link
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            menu.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });
    }
});