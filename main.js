'use strict';

/*scroll이 됨에 따라 navbar의 배경색을 짙게 만듦*/
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    navbarMenu.classList.remove('open');
    if (window.scrollY > navbarHeight) {
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark');
    }
});

/* navbar menu 누르면 원하는 id로 이동 */
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.dataset.link;
    if (link == null) {
        return;
    }
    scrollIntoView(link);
    selectNavItem(target);
});

/*navbar toggle button 누르면 navbar menu 보이게*/
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener('click', () => {
    navbarMenu.classList.toggle('open');
});

/* home contact 버튼 설정 */
const contactBtn = document.querySelector(".home__contact");
contactBtn.addEventListener('click', () => {
    scrollIntoView("#contact")
});

/* scroll 내려가면 home 내용이 fade out되게 */
const home = document.querySelector("#home");
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
});

/* 위로 가는 top버튼 만들기 */
const upArrow = document.querySelector('.up__arrow');
document.addEventListener('scroll', () => {
    if (window.scrollY > homeHeight / 2) {
        upArrow.classList.add('visible');
    } else {
        upArrow.classList.remove('visible');
    }
})
upArrow.addEventListener('click', () => {
    scrollIntoView("#home");
})

/* work 분류 작업*/
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project')
workBtnContainer.addEventListener('click', (e) => {
    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
    if (filter == null) {
        return;
    }
    //selected 이동시키기
    const active = document.querySelector('.category__btn.selected');
    active.classList.remove('selected');
    const target = e.target.nodeName == 'BUTTON' ? e.target : e.target.parentNode;
    target.classList.add('selected');

    projectContainer.classList.add('anim-out');
    setTimeout(() => {
        projects.forEach(project => {
        if (filter==="*" || project.dataset.type === filter) {
            project.classList.remove('invisible');
        } else {
            project.classList.add('invisible');
        }
    });
        projectContainer.classList.remove('anim-out');
    },300);    
});

const sectionIds = ['#home', '#about', '#skills', '#works', '#contact'];
const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));

let selectedNavItem = navItems[0];
let selectedNavIndex = 0;

function selectNavItem(selected) {
    console.log(selectedNavItem);
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}
function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: "smooth" });
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
}
const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.intersectionRatio>0) {
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            if (entry.boundingClientRect.y < 0) {
                selectedNavIndex = index + 1;
            } else {
                selectedNavIndex = index - 1;
            }
            
        }
    });
};
const observer = new IntersectionObserver(observerCallback,observerOptions);
sections.forEach(section => observer.observe(section));

window.addEventListener('wheel', () => {
    if (window.scrollY === 0) {
        selectedNavIndex = 0;
    } else if (Math.round(window.scrollY + window.innerHeight) >= document.body.clientHeight) {
        selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]);
})