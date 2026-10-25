document.addEventListener("DOMContentLoaded", () => {
    // 1. Check whether the visitor prefers reduced motion.
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // 2. Select the elements that should appear as visitors scroll.
    const revealElements = document.querySelectorAll(
        ".gallery-item, " +
        ".section-heading, " +
        ".about .eyebrow, " +
        ".about h2, " +
        ".about-text, " +
        ".about-note, " +
        ".contact .eyebrow, " +
        ".contact h2, " +
        ".contact > p:not(.eyebrow), " +
        ".contact-link, " +
        ".reimagined"
    );

    // 3. Make elements visible immediately if reduced motion is enabled.
    if (reduceMotion) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    } else {
        revealElements.forEach((element, index) => {
            element.classList.add("scroll-reveal");

            // Stagger gallery animations slightly.
            if (element.classList.contains("gallery-item")) {
                element.style.setProperty(
                    "--reveal-delay",
                    `${(index % 3) * 120}ms`
                );
            }
        });

        // Observe elements as they enter the screen.
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries, currentObserver) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-visible");
                            currentObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

            revealElements.forEach((element) => {
                observer.observe(element);
            });
        } else {
            // Fallback for older browsers.
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });
        }
    }

    // 4. Add smooth scrolling to internal navigation links.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    // 5. Warn us if any portfolio image fails to load.
    document.querySelectorAll(".gallery-item img").forEach((img) => {
        img.addEventListener("error", () => {
            console.warn("Could not load portfolio image:", img.src);
        });
    });

    // 6. Update the copyright year automatically.
    const footerYear = document.querySelector("[data-year]");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    console.log("Patience's portfolio is ready.");
});