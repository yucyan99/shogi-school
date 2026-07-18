const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("active");
});

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});

// スクロールアニメーション
const targets = document.querySelectorAll(
    ".recommend-card, .lesson-card, .feature-item, .price-row, .profile-wrapper, .flow-item, .faq-list details, .contact-box"
);

targets.forEach(el => {
    el.classList.add("fade-up");
});

const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }
    });
},{
    threshold:0.15
});

targets.forEach(el=>observer.observe(el));