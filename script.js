document.addEventListener('DOMContentLoaded', () => {
    // --- Canvas Background (Network Effect) ---
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return; // Exit if canvas is not found
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(112, 0, 255, ${1 - dist / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(animate);
    }
    animate();

    // --- Typewriter Effect (Typing & Deleting) ---
    const typeWrap = document.querySelector(".type-wrap");
    if (typeWrap) {
        const texts = ["Papierologię", "Błędne Dane", "Rutynę", "Gaszenie Pożarów"];
        let count = 0;
        let index = 0;
        let currentText = "";
        let letter = "";
        let isDeleting = false;

        (function type() {
            if (count === texts.length) { count = 0; }
            currentText = texts[count];

            if (isDeleting) {
                letter = currentText.slice(0, --index);
            } else {
                letter = currentText.slice(0, ++index);
            }

            typeWrap.textContent = letter;

            let typeSpeed = 100;
            if (isDeleting) { typeSpeed = 50; }

            if (!isDeleting && letter.length === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && letter.length === 0) {
                isDeleting = false;
                count++;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }());
    }

    // --- ROI Calculator ---
    const emplRange = document.getElementById('emplRange');
    const hoursRange = document.getElementById('hoursRange');
    const emplVal = document.getElementById('emplVal');
    const hoursVal = document.getElementById('hoursVal');
    const totalSaved = document.getElementById('totalSaved');

    if (emplRange && hoursRange && emplVal && hoursVal && totalSaved) {
        function calculate() {
            const employees = parseInt(emplRange.value);
            const hours = parseFloat(hoursRange.value);
            const hourlyRate = 60;
            const workDays = 251;

            emplVal.textContent = employees;
            hoursVal.textContent = hours + " h";

            const savings = employees * hours * hourlyRate * workDays;

            totalSaved.textContent = new Intl.NumberFormat('pl-PL', {
                style: 'currency',
                currency: 'PLN',
                maximumFractionDigits: 0
            }).format(savings);
        }

        emplRange.addEventListener('input', calculate);
        hoursRange.addEventListener('input', calculate);
        calculate();
    }

    // --- Audit Form Handler (AJAX) ---
    const form = document.getElementById('auditForm');
    if (form) {
        const status = document.getElementById('form-status');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            status.textContent = "Wysyłanie...";
            status.className = "success";
            status.style.display = "block";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";

            fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        status.className = "success";
                        status.textContent = "Dziękujemy! Twoje zgłoszenie zostało wysłane.";
                        form.reset();
                    } else {
                        console.log(response);
                        status.className = "error";
                        status.textContent = "Błąd: " + json.message;
                    }
                })
                .catch(error => {
                    console.log(error);
                    status.className = "error";
                    status.textContent = "Coś poszło nie tak. Spróbuj później.";
                })
                .then(function () {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                    setTimeout(() => {
                        status.style.display = "none";
                    }, 5000);
                });
        });
    }

    // --- Chat Duel Animation (Randomized Scenarios) ---
    const duelSection = document.querySelector('.section-duel');
    if (duelSection) {
        const scenarios = [
            { // 1. Finanse
                prompt: "Przeanalizuj faktury z tego folderu i podaj sumę VAT.",
                dumb: "Jako model językowy nie mam oczu, ale... Czekaj. Faktura to dokument historyczny wywodzący się z Mezopotamii. Czy wiesz, że Sumerowie używali glinianych tabliczek? Niestety nie mogę otworzyć pliku PDF...",
                smart: "[ANALIZA ZAKOŃCZONA]\n> Przetworzono plików: 14\n> Wykryto duplikaty: 2\n--------------------------\nSUMA NETTO: 45,230.00 PLN\nSUMA VAT:   10,402.90 PLN\n--------------------------\n[Pobierz Excel] [Wyślij do Księgowej]",
                dumbStats: "Przetwarzanie: 61.4s | Dokładność: 2%",
                smartStats: "Przetwarzanie: 0.4s | Dokładność: 100%"
            },
            { // 2. Obsługa Klienta
                prompt: "Klient jest wściekły o opóźnienie. Napisz przeprosiny i daj rabat.",
                dumb: "Siema byczku! Sorki że paczka nie doszła, kurier pewnie zgłodniał i zjadł. Masz tu emotkę na pocieszenie: 🐢. Nie gniewaj się, to tylko biznes.",
                smart: "Szanowny Kliencie,\n\nNajmocniej przepraszamy za opóźnienie zamówienia #9021. Wynika ono z błędu sortowni.\n\nJako rekompensatę przesyłamy kod rabatowy -15% na kolejne zakupy: PRZEPRASZAMY15.\n\nZ poważaniem,\nZespół Obsługi",
                dumbStats: "Empatia: 0% | Ryzyko utraty klienta: 100%",
                smartStats: "Analiza sentymentu: Pozytywna | Czas: 0.3s"
            },
            { // 3. Strategia Sprzedaży
                prompt: "Mamy spadek sprzedaży czapek. Co robić w Q3?",
                dumb: "Czapki są okrągłe. Ziemia też jest okrągła. Może spróbujmy sprzedawać czapki pingwinom na Madagaskarze? Tam jest zimno... a nie, czekaj, tam są lemury.",
                smart: "[ANALIZA DANYCH Q3]\nTrend: Spadek popytu na nakrycia głowy (-12% r/r).\nREKOMENDACJA:\n1. Pivot na akcesoria sportowe (opaski, bandany) -> Wzrost w branży o 22%.\n2. Kampania wyprzedażowa 'Last Minute' dla obecnych stanów magazynowych.",
                dumbStats: "Logika: Brak danych | IQ: Wątpliwe",
                smartStats: "Analiza rynku: 4TB danych | Trafność: 98%"
            }
        ];

        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        document.querySelectorAll('.msg.user').forEach(el => el.textContent = randomScenario.prompt);

        const dumbText = randomScenario.dumb;
        const smartText = randomScenario.smart;
        const dumbEl = document.getElementById('dumbBotType');
        const smartEl = document.getElementById('smartBotType');
        const dumbStatus = document.getElementById('dumbStatus');
        const smartStatus = document.getElementById('smartStatus');
        let duelStarted = false;

        function typeWriter(element, text, speed, isSmart, onComplete) {
            let i = 0;
            function type() {
                if (i < text.length) {
                    if (text.charAt(i) === '\n') {
                        element.innerHTML += '<br>';
                    } else {
                        element.innerHTML += text.charAt(i);
                    }
                    i++;
                    let delay = speed;
                    if (!isSmart) { delay += Math.random() * 150; }
                    setTimeout(type, delay);
                } else if (onComplete) {
                    onComplete();
                }
            }
            type();
        }

        const duelObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !duelStarted) {
                    duelStarted = true;
                    dumbStatus.textContent = "Pisze... (bardzo powoli)";
                    typeWriter(dumbEl, dumbText, 50, false, () => {
                        dumbStatus.textContent = randomScenario.dumbStats;
                    });
                    setTimeout(() => {
                        smartStatus.textContent = "Analizowanie danych...";
                        typeWriter(smartEl, smartText, 5, true, () => {
                            smartStatus.textContent = randomScenario.smartStats;
                        });
                    }, 500);
                }
            });
        }, { threshold: 0.7 });

        duelObserver.observe(duelSection);
    }

    // --- Scroll Reveal Logic ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('section h2, .pain-item, .chat-window, .case-card, .calc-container, .service-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});