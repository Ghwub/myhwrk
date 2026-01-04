// script.js

const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const sections = document.querySelectorAll("section, header.hero, footer, .project-card, .skill");
const navLinks = document.querySelectorAll("nav ul li a");

// Toggle menu for mobile
toggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("showing");
  document.body.classList.toggle("no-scroll", isOpen); // prevent background scroll
});

// Active link highlighting + animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Highlight nav link
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href").substring(1) === entry.target.id) {
            link.classList.add("active");
          }
        });

        // Trigger fade-in animation
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach(section => observer.observe(section));

// Theme toggle with local storage
const themeToggle = document.getElementById('theme-toggle');

// Load saved theme on page load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Contact form submission with EmailJS
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function(event) {
  event.preventDefault();

  emailjs.sendForm("service_hy62ihg", "template_gyyjhpx", this).then(() => {
    formMessage.textContent = "Message sent successfully!";
    formMessage.className = "success";
    contactForm.reset();
  }, (error) => {
    formMessage.textContent = "Failed to send message. Please try again later.";
    formMessage.className = "error";
    console.error("EmailJS error:", error);
  });
});

// Scroll spy for active nav link
window.addEventListener("scroll", () => {
    let current = "";
  
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100; // adjust for navbar height
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });
  
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });
  
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const cards = document.querySelectorAll('.project-card');

let currentIndex = 0;

function updateCarousel() {
  const width = cards[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${currentIndex * width}px)`;
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % cards.length;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCarousel();
});

// Smooth scroll for logo button
const logo = document.querySelector(".logo");
const hero = document.getElementById("hero");

if (logo && hero) {
  logo.addEventListener("click", (e) => {
    e.preventDefault(); // stop default jump
    hero.scrollIntoView({ behavior: "smooth", block: "start" });

    // Optional: close mobile menu if open
    menu.classList.remove("showing");
    document.body.classList.remove("no-scroll");
  });
}

document.addEventListener('click', (e) => {
  const navMenu = document.getElementById('menu');
  const menuToggle = document.getElementById('menu-toggle');

  // Helper to close menu
  const closeMenu = () => {
    navMenu.classList.remove('showing');
    menuToggle.classList.remove('open');
    document.body.classList.remove('no-scroll');
  };

  // If menu is open…
  if (navMenu.classList.contains('showing')) {
    const clickedLink = e.target.closest('#menu li a');
    const clickedSwitch = e.target.closest('#menu .switch');
    const clickedInsideNav = e.target.closest('nav');
    const clickedToggle = e.target.closest('#menu-toggle');

    // ✅ Close if:
    // - a nav link was clicked
    // - the theme switch was clicked
    // - or the click was outside nav entirely
    if (clickedLink || clickedSwitch || (!clickedInsideNav && !clickedToggle)) {
      closeMenu();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const showMoreBtn = document.getElementById("show-more-btn");
  const hiddenCards = document.querySelectorAll(
    ".services-grid > article.service-card:nth-of-type(n+7)"
  );

  let expanded = false;

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      if (!expanded) {
        // Show hidden cards
        hiddenCards.forEach(card => card.style.display = "block");
        showMoreBtn.textContent = "Show Less";
        expanded = true;
      } else {
        // Hide them again
        hiddenCards.forEach(card => card.style.display = "none");
        showMoreBtn.textContent = "Show More";
        expanded = false;
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("article-overlay");
  const closeX = overlay.querySelector(".close-x");
  const expandedTitle = document.getElementById("expanded-title");
  const expandedBody = document.getElementById("expanded-body");

  // Attach click handlers to each service card
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", () => {
      // Grab text from the card
      const title = card.querySelector("h3")?.textContent || "Untitled";
      const body = card.querySelector("p")?.textContent || "No content available.";

      // Fill overlay placeholders
      expandedTitle.textContent = title;
      expandedBody.innerHTML = `<p>${body}</p>`;

      // Show overlay
      overlay.style.display = "flex";
      document.body.style.overflow = "hidden"; // lock background scroll
    });
  });

  // Close overlay when clicking the X
  closeX.addEventListener("click", () => {
    overlay.style.display = "none";
    document.body.style.overflow = ""; // restore scroll
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("article-overlay");
  const closeX = overlay.querySelector(".close-x");
  const expandedTitle = document.getElementById("expanded-title");
  const expandedBody = document.getElementById("expanded-body");

  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.article; // e.g. "webdev", "uiux"

      fetch(`service-cards/${key}.html`)
        .then(response => response.text())
        .then(html => {
          expandedTitle.textContent = card.querySelector("h3").textContent;
          expandedBody.innerHTML = html;
          overlay.style.display = "flex";
          document.body.style.overflow = "hidden";
        })
        .catch(err => {
          expandedBody.innerHTML = "<p>Sorry, article not found.</p>";
          overlay.style.display = "flex";
        });
    });
  });

  closeX.addEventListener("click", () => {
    overlay.style.display = "none";
    document.body.style.overflow = "";
  });
});

