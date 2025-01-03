const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.querySelector(".sidebar-toggler");
const menuToggle = document.querySelector(".menu-toggler");

const collapsedSidebarHeight = "56px";
const fullSidebarHeight = "calc(100vh - 32px)";

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});

const toggleMenu = (isMenuActive) => {
    sidebar.style.height = isMenuActive
        ? `${sidebar.scrollHeight}px`
        : collapsedSidebarHeight;

    const icon = menuToggle.querySelector("i");
    icon.classList.toggle("fa-bars", !isMenuActive);
    icon.classList.toggle("fa-xmark", isMenuActive);
};

menuToggle.addEventListener("click", () => {
    toggleMenu(sidebar.classList.toggle("menu-active"));
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
        sidebar.style.height = fullSidebarHeight;
    } else {
        sidebar.classList.remove("collapsed");
        sidebar.style.height = "auto";
        toggleMenu(sidebar.classList.contains("menu-active"));
    }
});
