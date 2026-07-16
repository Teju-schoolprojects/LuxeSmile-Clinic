/* ==========================================================================
   LuxeSmile Clinic Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Navigation Header & Scroll Effects
    // ==========================================
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active nav link highlight on scroll
        let currentSectionId = 'home';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on startup
    
    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }
    
    // ==========================================
    // 3. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // ==========================================
    // 4. Before/After Image Slider Drag Logic
    // ==========================================
    const sliderWrapper = document.getElementById('smile-slider-wrapper');
    const beforeAfterSlider = document.getElementById('before-after-slider');
    const afterImageContainer = document.getElementById('after-image-container');
    const sliderHandle = document.getElementById('slider-handle');
    const afterImage = afterImageContainer ? afterImageContainer.querySelector('.after-img') : null;
    
    if (beforeAfterSlider && afterImageContainer && sliderHandle && afterImage) {
        let isDragging = false;
        
        // Function to adjust image width on window resizing
        const adjustImageWidths = () => {
            const sliderWidth = beforeAfterSlider.offsetWidth;
            afterImage.style.width = `${sliderWidth}px`;
        };
        
        window.addEventListener('resize', adjustImageWidths);
        adjustImageWidths(); // Call immediately
        
        const moveSlider = (clientX) => {
            const sliderRect = beforeAfterSlider.getBoundingClientRect();
            const posX = clientX - sliderRect.left;
            let percentage = (posX / sliderRect.width) * 100;
            
            // Boundary constraints
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            
            // Apply coordinates
            afterImageContainer.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        };
        
        // Mouse Events
        sliderHandle.addEventListener('mousedown', () => {
            isDragging = true;
            beforeAfterSlider.classList.add('dragging');
        });
        
        window.addEventListener('mouseup', () => {
            isDragging = false;
            beforeAfterSlider.classList.remove('dragging');
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });
        
        // Touch Events (Mobile)
        sliderHandle.addEventListener('touchstart', () => {
            isDragging = true;
        }, { passive: true });
        
        window.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlider(e.touches[0].clientX);
        }, { passive: true });
        
        // Click to move anywhere on slider
        beforeAfterSlider.addEventListener('click', (e) => {
            if (e.target === sliderHandle || sliderHandle.contains(e.target)) return;
            moveSlider(e.clientX);
        });
    }
    
    // ==========================================
    // 5. Service Details Modal Dynamic Popups
    // ==========================================
    const serviceModal = document.getElementById('service-detail-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const serviceTriggers = document.querySelectorAll('.service-modal-trigger');
    
    // Services Database (pointing to the versioned Indian realistic image assets)
    const servicesData = {
        cosmetic: {
            name: "Cosmetic Smile Design",
            tag: "Aesthetic Restoration",
            desc: "Our cosmetic smile makeover is a completely customized, high-precision aesthetic journey. By combining digital facial scanning, architectural software, and handcrafted porcelain materials, we create a bespoke smile that enhances your natural facial symmetry and structure.",
            image: "assets/cosmetic.jpg?v=indian",
            duration: "2 Sessions (10-14 days apart)",
            downtime: "None (Mild tooth sensitivity briefly)",
            benefits: [
                "Individually hand-crafted, ultra-thin porcelain veneers",
                "Advanced digital mapping to match eye line and skin tones",
                "Minimally-invasive composite bonding for minor chips",
                "Custom diagnostic mock-ups before final placement"
            ]
        },
        implants: {
            name: "Guided Dental Implants",
            tag: "Implantology & Surgery",
            desc: "Restore your dental structure permanently and comfortably. LuxeSmile specializes in computer-guided keyhole surgery. Using 3D cone-beam computed tomography (CBCT) scans, we pre-plan implant coordinates to the exact millimeter, minimizing treatment time and acceleration recovery.",
            image: "assets/implants.jpg?v=indian",
            duration: "1 Surgery Session + Restoration Visits",
            downtime: "1-3 days mild recovery",
            benefits: [
                "Titanium or biological zirconium posts for maximum integration",
                "Computer-guided surgical placement for minimal trauma",
                "Bespoke porcelain dental crowns designed in-house",
                "Long-term structural and cosmetic success"
            ]
        },
        invisalign: {
            name: "Invisalign® Aligners",
            tag: "Bespoke Orthodontics",
            desc: "Straighten your teeth with complete comfort, hygiene, and discretion. The Invisalign system uses SmartTrack material to apply gentle, continuous pressure. Highly recommended for executives and busy professionals who require orthodontic corrections without metallic aesthetics.",
            image: "assets/invisalign.jpg?v=indian",
            duration: "6 - 18 Months treatment cycle",
            downtime: "Zero downtime",
            benefits: [
                "Virtually invisible aligner trays",
                "Completely removable for simple dining and hygiene",
                "Custom 3D scan simulator showing end results beforehand",
                "Bi-weekly progress checks or remote monitoring options"
            ]
        },
        whitening: {
            name: "Enamel-Safe Whitening",
            tag: "Laser Teeth Whitening",
            desc: "Reveal a brighter, dazzling smile in just one session. Our in-office laser whitening system uses advanced blue light light-emitting diode (LED) acceleration coupled with medical-grade desensitizing whitening gels. Safely breaks down deep intrinsic stains without damaging enamel.",
            image: "assets/whitening.jpg?v=indian",
            duration: "60 - 90 Minutes",
            downtime: "24-hour hot/cold sensitivity, no white diet restriction",
            benefits: [
                "Up to eight shades brighter in a single appointment",
                "Integrated enamel-strengthening fluoride treatment",
                "Includes custom take-home custom trays for maintenance",
                "Relaxing spa setting with warm neck pillows during treatment"
            ]
        }
    };
    
    const openServiceModal = (serviceId) => {
        const data = servicesData[serviceId];
        if (!data) return;
        
        document.getElementById('modal-service-name').textContent = data.name;
        document.getElementById('modal-service-tag').textContent = data.tag;
        document.getElementById('modal-service-desc').textContent = data.desc;
        document.getElementById('modal-service-duration').textContent = data.duration;
        document.getElementById('modal-service-downtime').textContent = data.downtime;
        
        // Image background setting
        const imageElement = document.getElementById('modal-service-image');
        imageElement.style.backgroundImage = `url('${data.image}')`;
        
        // Render benefits list
        const benefitsList = document.getElementById('modal-service-benefits');
        benefitsList.innerHTML = '';
        data.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.textContent = benefit;
            benefitsList.appendChild(li);
        });
        
        // Save targeted service inside the modal CTA button for the Booking click
        document.getElementById('modal-cta-book-btn').setAttribute('data-target-service', data.name);
        
        serviceModal.classList.add('open');
    };
    
    const closeServiceModal = () => {
        serviceModal.classList.remove('open');
    };
    
    serviceTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceId = btn.getAttribute('data-service-id');
            openServiceModal(serviceId);
        });
    });
    
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeServiceModal);
    
    // Close modal if clicking outside card
    window.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            closeServiceModal();
        }
    });
    
    // ==========================================
    // 6. Interactive Multi-Step Appointment Booking Form Wizard
    // ==========================================
    const bookingCard = document.getElementById('inline-booking-card');
    const dateInput = document.getElementById('booking-date');
    
    // Set minimum date to today
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();
        
        if (mm < 10) mm = `0${mm}`;
        if (dd < 10) dd = `0${dd}`;
        
        dateInput.min = `${yyyy}-${mm}-${dd}`;
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    
    let activeWizardStep = 1;
    
    const updateWizardUI = (wizardContainer) => {
        const steps = wizardContainer.querySelectorAll('.booking-step');
        const progressFill = wizardContainer.querySelector('.progress-fill');
        const indicators = wizardContainer.querySelectorAll('.step-num');
        
        // Hide all steps
        steps.forEach(step => step.classList.remove('active'));
        
        // Show active step
        const targetStepEl = wizardContainer.querySelector(`#booking-step-${activeWizardStep}`);
        if (targetStepEl) targetStepEl.classList.add('active');
        
        // Update progress bar
        if (progressFill) {
            const percent = ((activeWizardStep - 1) / 2) * 100;
            progressFill.style.width = `${percent}%`;
        }
        
        // Update Indicators
        indicators.forEach((ind, index) => {
            ind.classList.remove('active', 'completed');
            const stepNum = index + 1;
            if (stepNum === activeWizardStep) {
                ind.classList.add('active');
            } else if (stepNum < activeWizardStep) {
                ind.classList.add('completed');
            }
        });
    };
    
    const validateStep = (wizardContainer, stepNum) => {
        if (stepNum === 1) {
            // Radio selected check
            const checkedService = wizardContainer.querySelector('input[name="booking-service"]:checked');
            return checkedService !== null;
        } else if (stepNum === 2) {
            // Date chosen check
            const dateVal = wizardContainer.querySelector('#booking-date').value;
            const checkedTime = wizardContainer.querySelector('input[name="booking-time"]:checked');
            return dateVal !== "" && checkedTime !== null;
        } else if (stepNum === 3) {
            // Personal info validation
            const nameEl = wizardContainer.querySelector('#booking-name');
            const emailEl = wizardContainer.querySelector('#booking-email');
            const phoneEl = wizardContainer.querySelector('#booking-phone');
            
            return nameEl.checkValidity() && emailEl.checkValidity() && phoneEl.checkValidity();
        }
        return true;
    };
    
    // Attach listener to wizard container elements
    const setupWizardEvents = (wizardContainer) => {
        const nextBtns = wizardContainer.querySelectorAll('.btn-next-step');
        const prevBtns = wizardContainer.querySelectorAll('.btn-prev-step');
        const bookingForm = wizardContainer.querySelector('#booking-form-element');
        const resetBtn = wizardContainer.querySelector('.btn-reset-booking');
        
        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = parseInt(btn.getAttribute('data-current-step'));
                if (validateStep(wizardContainer, currentStep)) {
                    activeWizardStep = currentStep + 1;
                    updateWizardUI(wizardContainer);
                } else {
                    // Trigger form inputs alert if in step 3
                    if (currentStep === 3) {
                        wizardContainer.querySelector('#booking-form-element').reportValidity();
                    } else if (currentStep === 2) {
                        alert("Please select a valid date and preferred time slot.");
                    }
                }
            });
        });
        
        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const currentStep = parseInt(btn.getAttribute('data-current-step'));
                activeWizardStep = currentStep - 1;
                updateWizardUI(wizardContainer);
            });
        });
        
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateStep(wizardContainer, 3)) {
                    // Extract fields
                    const service = wizardContainer.querySelector('input[name="booking-service"]:checked').value;
                    const date = wizardContainer.querySelector('#booking-date').value;
                    const time = wizardContainer.querySelector('input[name="booking-time"]:checked').value;
                    const name = wizardContainer.querySelector('#booking-name').value;
                    const phone = wizardContainer.querySelector('#booking-phone').value;
                    
                    // Show simulated loading states
                    const submitBtn = wizardContainer.querySelector('#btn-submit-booking');
                    const originalBtnHtml = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
                    
                    setTimeout(() => {
                        // Restore submit button
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnHtml;
                        
                        // Populate success page variables
                        wizardContainer.querySelector('#summary-name').textContent = name;
                        wizardContainer.querySelector('#summary-service').textContent = service;
                        wizardContainer.querySelector('#summary-date').textContent = date;
                        wizardContainer.querySelector('#summary-time').textContent = time;
                        wizardContainer.querySelector('#summary-phone').textContent = phone;
                        
                        // Trigger final success layout step
                        activeWizardStep = 'success';
                        
                        // Hide headers of wizard card, adjust indicator state
                        wizardContainer.querySelector('.booking-card-header').style.display = 'none';
                        
                        const steps = wizardContainer.querySelectorAll('.booking-step');
                        steps.forEach(step => step.classList.remove('active'));
                        wizardContainer.querySelector('#booking-step-success').classList.add('active');
                        
                    }, 1200);
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // Reset fields
                if (bookingForm) bookingForm.reset();
                activeWizardStep = 1;
                
                wizardContainer.querySelector('.booking-card-header').style.display = 'flex';
                updateWizardUI(wizardContainer);
            });
        }
    };
    
    // Set up inline card
    if (bookingCard) {
        setupWizardEvents(bookingCard);
    }
    
    // ==========================================
    // 7. General Booking Modal & Card Relocation
    // ==========================================
    const generalBookingModal = document.getElementById('general-booking-modal');
    const bookingModalCloseBtn = document.getElementById('booking-modal-close-btn');
    const generalBookTriggers = document.querySelectorAll('.btn-book-trigger');
    const bookingModalPlaceholder = document.getElementById('booking-modal-placeholder');
    const contactSection = document.getElementById('contact');
    const bookingColumnWrapper = contactSection ? contactSection.querySelector('.booking-card-wrapper') : null;
    
    const openBookingModal = (preselectedService = null) => {
        if (!generalBookingModal || !bookingCard || !bookingModalPlaceholder) return;
        
        // Relocate the booking card elements inside the modal placeholder!
        bookingModalPlaceholder.appendChild(bookingCard);
        
        // Adjust the header display in case it was hidden from previous success
        const bookingHeader = bookingCard.querySelector('.booking-card-header');
        if (bookingHeader && activeWizardStep !== 'success') {
            bookingHeader.style.display = 'flex';
        }
        
        // If a service was pre-selected (e.g. from service modal), update radio button choice
        if (preselectedService) {
            const serviceRadio = bookingCard.querySelector(`input[name="booking-service"][value="${preselectedService}"]`);
            if (serviceRadio) {
                serviceRadio.checked = true;
            } else {
                // Fallback search for partial string matching
                const radios = bookingCard.querySelectorAll('input[name="booking-service"]');
                radios.forEach(rad => {
                    if (preselectedService.toLowerCase().includes(rad.value.toLowerCase().replace('®', '').split(' ')[0])) {
                        rad.checked = true;
                    }
                });
            }
        }
        
        // Update wizard graphics
        if (activeWizardStep === 'success') {
            // Keep success panel visible
            bookingCard.querySelector('.booking-card-header').style.display = 'none';
        } else {
            updateWizardUI(bookingCard);
        }
        
        generalBookingModal.classList.add('open');
    };
    
    const closeBookingModal = () => {
        if (!generalBookingModal || !bookingCard || !bookingColumnWrapper) return;
        
        // Put the booking card back in the main page contact section layout
        bookingColumnWrapper.appendChild(bookingCard);
        
        generalBookingModal.classList.remove('open');
    };
    
    generalBookTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Close service modal if open
            closeServiceModal();
            
            // Extract targeted service if any
            let targetService = null;
            if (btn.id === 'modal-cta-book-btn') {
                targetService = btn.getAttribute('data-target-service');
            }
            
            openBookingModal(targetService);
        });
    });
    
    if (bookingModalCloseBtn) {
        bookingModalCloseBtn.addEventListener('click', closeBookingModal);
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === generalBookingModal) {
            closeBookingModal();
        }
    });
    
    // ==========================================
    // 8. FAQ Accordion Expansion
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    otherAnswer.style.maxHeight = null;
                    otherBtn.setAttribute('aria-expanded', 'false');
                });
                
                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = `${answer.scrollHeight}px`;
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
    
    // ==========================================
    // 9. Newsletter Simulated Feedback
    // ==========================================
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterMsg = document.getElementById('newsletter-message');
    
    if (newsletterForm && newsletterEmail && newsletterMsg) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();
            
            if (email) {
                newsletterMsg.textContent = "";
                newsletterMsg.classList.remove('success', 'error');
                
                // Simulated submission
                setTimeout(() => {
                    newsletterMsg.classList.add('success');
                    newsletterMsg.textContent = "Thank you. Welcome to LuxeInsights.";
                    newsletterEmail.value = "";
                    
                    // Clear message after 4s
                    setTimeout(() => {
                        newsletterMsg.textContent = "";
                        newsletterMsg.classList.remove('success');
                    }, 4000);
                }, 600);
            }
        });
    }
    
    // ==========================================
    // 10. 3D Rotate/Tilt Cards on Hover
    // ==========================================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse pointer coordinates relative to card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate center of the card
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            // Calculate angles based on mouse offsets from card center
            const angleX = (yc - y) / 15; // Max 10-15 degrees tilt
            const angleY = (x - xc) / 15;
            
            // Apply 3D rotation transform
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset to normal with a smooth transition
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // ==========================================
    // 11. Auto-Rotating Testimonials Slider
    // ==========================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('testimonial-prev-btn');
    const nextBtn = document.getElementById('testimonial-next-btn');
    
    let currentSlideIndex = 0;
    let autoRotateInterval = null;
    
    const showSlide = (index) => {
        if (slides.length === 0) return;
        
        // boundary wrap around
        if (index >= slides.length) currentSlideIndex = 0;
        else if (index < 0) currentSlideIndex = slides.length - 1;
        else currentSlideIndex = index;
        
        // Toggle active slide
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlideIndex].classList.add('active');
        
        // Toggle active dot
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active');
        }
    };
    
    const nextSlide = () => {
        showSlide(currentSlideIndex + 1);
    };
    
    const prevSlide = () => {
        showSlide(currentSlideIndex - 1);
    };
    
    // Auto rotation setup
    const startAutoRotate = () => {
        stopAutoRotate();
        autoRotateInterval = setInterval(nextSlide, 5000); // cycle every 5 seconds
    };
    
    const stopAutoRotate = () => {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
    };
    
    // Manual triggers
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoRotate(); // reset timer
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoRotate(); // reset timer
        });
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-slide-to'));
            showSlide(index);
            startAutoRotate(); // reset timer
        });
    });
    
    // Pause auto-rotation on mouse hover over testimonials
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopAutoRotate);
        testimonialsSection.addEventListener('mouseleave', startAutoRotate);
    }
    
    // Start auto rotation loops
    startAutoRotate();

    // ==========================================
    // 12. Swiper.js Draggable Clinic Gallery Setup
    // ==========================================
    const setupClinicSwiper = () => {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.clinic-swiper', {
                loop: true,
                grabCursor: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                lazy: {
                    loadPrevNext: true,
                    loadOnTransitionStart: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true
                },
                effect: 'slide',
                speed: 800
            });
        }
    };
    setupClinicSwiper();
    
});
