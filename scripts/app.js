/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

/* Menu show */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/* Menu hidden */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== CHANGE BACKGROUND HEADER ===============*/
const shadowHeader = () => {
  const header = document.getElementById("header");
  // Add a class if the bottom offset is greater than 50 of the viewport
  this.scrollY >= 50
    ? header.classList.add("shadow-header")
    : header.classList.remove("shadow-header");
};
window.addEventListener("scroll", shadowHeader);

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
  const scrollUp = document.getElementById("scroll-up");
  // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
  this.scrollY >= 350
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id"),
      sectionsClass = document.querySelector(
        ".nav__menu a[href*=" + sectionId + "]"
      );

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add("active-link");
    } else {
      sectionsClass.classList.remove("active-link");
    }
  });
};
window.addEventListener("scroll", scrollActive);

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "ri-sun-line";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "ri-moon-line" : "ri-sun-line";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "ri-moon-line" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 400,
  // reset: true,
});

sr.reveal(`.home__data , .join__container , .footer`);
sr.reveal(`.home__img`, { origin: "bottom" });
sr.reveal(`.enjoy__card , .popular__card`, { interval: 100 });
sr.reveal(`.about__data`, { origin: "right" });
sr.reveal(`.about__img`, { origin: "left" });

/*=============== Add to cart ===============*/
/*=============== KHỞI TẠO ===============*/
let cart = JSON.parse(localStorage.getItem("kyVietCart")) || [];

// 1. Hàm bật/tắt Modal (Sửa lỗi not defined)
window.toggleCart = function () {
  const modal = document.getElementById("cart-modal");
  if (modal) {
    modal.style.display = modal.style.display === "block" ? "none" : "block";
    if (modal.style.display === "block") renderCartItems();
  }
};

// 2. Lắng nghe sự kiện click thêm sản phẩm
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".popular__button");
  if (!btn) return;

  const card = btn.closest(".popular__card");
  const productInfo = {
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: parseInt(card.querySelector(".popular__price").dataset.price),
    img: card.querySelector(".popular__img").src,
    quantity: 1,
  };

  addToCart(productInfo);

  // Hiệu ứng bay
  const cartIconNav = document.querySelector("#cart-icon-nav");
  if (cartIconNav) {
    flyToCart(card.querySelector(".popular__img"), cartIconNav);
  }
});

function addToCart(item) {
  const existing = cart.find((i) => i.id === item.id);
  existing ? existing.quantity++ : cart.push(item);
  saveAndRefresh();
}

// 3. Hiệu ứng Fly to Cart
function flyToCart(imgToClone, cartTarget) {
  const clone = imgToClone.cloneNode();
  const start = imgToClone.getBoundingClientRect();
  const end = cartTarget.getBoundingClientRect();

  Object.assign(clone.style, {
    position: "fixed",
    left: `${start.left}px`,
    top: `${start.top}px`,
    width: `${start.width}px`,
    height: `${start.height}px`,
  });
  clone.classList.add("flying-img");
  document.body.appendChild(clone);

  setTimeout(() => {
    Object.assign(clone.style, {
      left: `${end.left}px`,
      top: `${end.top}px`,
      width: "20px",
      height: "20px",
      opacity: "0",
    });
  }, 50);

  clone.addEventListener("transitionend", () => clone.remove());
}

function saveAndRefresh() {
  localStorage.setItem("kyVietCart", JSON.stringify(cart));
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countBadge = document.getElementById("cart-count");
  if (countBadge) countBadge.innerText = total;
}

function renderCartItems() {
  const container = document.getElementById("cart-items-container");
  container.innerHTML = cart
    .map(
      (item, index) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee;">
            <span>${item.name} x ${item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString()} VND</span>
            <button onclick="removeItem(${index})" style="color:red; border:none; background:none; cursor:pointer;">Xóa</button>
        </div>
    `
    )
    .join("");

  const totalMoney = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  document.getElementById("total-price").innerText =
    totalMoney.toLocaleString();
}

window.removeItem = (index) => {
  cart.splice(index, 1);
  saveAndRefresh();
  renderCartItems();
};

/*=============== SỬA LỖI CLASSLIST OF NULL ===============*/
const navSections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;
  navSections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id"),
      sectionsClass = document.querySelector(
        '.nav__menu a[href*="' + sectionId + '"]'
      );

    if (sectionsClass) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        sectionsClass.classList.add("active-link");
      } else {
        sectionsClass.classList.remove("active-link");
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", saveAndRefresh);
