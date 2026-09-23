const roles = ["Web Developer", "UGC Content Creator", "Data Analyst"];
const el = document.getElementById("roleLoop");

const interactiveTargets = document.querySelectorAll(
  "a, button, .btn, .nav-link, .project-tab, .project-link, .contact-open, .hero-meta-link"
);

interactiveTargets.forEach((target) => {
  target.addEventListener("pointerdown", () => {
    target.classList.add("is-pressed");
  });

  target.addEventListener("pointerup", () => {
    target.classList.remove("is-pressed");
  });

  target.addEventListener("pointerleave", () => {
    target.classList.remove("is-pressed");
  });
});

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function tick() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    el.textContent = current.slice(0, charIndex);

    if (charIndex === current.length) {
      deleting = true;
      setTimeout(tick, 1400);
      return;
    }
  } else {
    charIndex--;
    el.textContent = current.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(tick, deleting ? 40 : 70);
}

tick();

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveLink(link.dataset.section));
});

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === id);
  });

}

let navUpdateQueued = false;
function updateActiveNav() {
  navUpdateQueued = false;
  if (!sections.length) return;

  const activationLine = window.scrollY + window.innerHeight * 0.48;
  let activeSection = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top + window.scrollY <= activationLine) {
      activeSection = section;
    }
  });

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    activeSection = sections[sections.length - 1];
  }
  setActiveLink(activeSection.id);
}

window.addEventListener("scroll", () => {
  if (navUpdateQueued) return;
  navUpdateQueued = true;
  window.requestAnimationFrame(updateActiveNav);
}, { passive: true });
window.addEventListener("resize", updateActiveNav);
setActiveLink((location.hash || "#home").slice(1));
updateActiveNav();

const projectTabs = document.querySelectorAll("[data-project-tab]");
const projectPanels = document.querySelectorAll(".project-panel");

projectTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const panelId = tab.dataset.projectTab;

    projectTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    projectPanels.forEach((panel) => {
      const isActive = panel.id === panelId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

const inquiryForm = document.getElementById("projectInquiryForm");
const formStatus = document.getElementById("formStatus");

if (inquiryForm && formStatus) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    formStatus.textContent = "Thanks! Your inquiry is ready to send from your email app.";
    form.reset();
  });
}

const journeyItems = document.querySelectorAll(".journey-item");
const journeyTrack = document.querySelector(".journey-track");

const journeyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

journeyItems.forEach((item) => journeyObserver.observe(item));

function updateJourneyProgress() {
  if (!journeyTrack) return;
  const rect = journeyTrack.getBoundingClientRect();
  const viewLine = window.innerHeight * 0.58;
  const progress = Math.max(0, Math.min(100, ((viewLine - rect.top) / rect.height) * 100));
  journeyTrack.style.setProperty("--journey-progress", `${progress}%`);
  let closest = null;
  let distance = Infinity;
  journeyItems.forEach((item) => {
    const itemDistance = Math.abs(item.getBoundingClientRect().top + item.offsetHeight / 2 - viewLine);
    if (itemDistance < distance) { distance = itemDistance; closest = item; }
  });
  if (closest && distance < window.innerHeight * 0.42) {
    journeyItems.forEach((item) => {
      const isActive = item === closest;
      item.classList.toggle("is-current", isActive);
      item.querySelector(".journey-marker").setAttribute("aria-pressed", String(isActive));
    });
  }
}

window.addEventListener("scroll", updateJourneyProgress, { passive: true });
window.addEventListener("resize", updateJourneyProgress);
updateJourneyProgress();

journeyItems.forEach((item) => {
  const marker = item.querySelector(".journey-marker");

  marker.addEventListener("click", () => {
    journeyItems.forEach((journeyItem) => {
      const isActive = journeyItem === item;
      journeyItem.classList.toggle("is-current", isActive);
      journeyItem.querySelector(".journey-marker").setAttribute("aria-pressed", String(isActive));
    });
  });
});
