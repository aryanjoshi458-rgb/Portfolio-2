        // Custom Confirm Dialog Logic
        let activeConfirmCallback = null;
        window.showConfirm = function(message, onConfirm) {
            document.getElementById('confirm-modal-message').textContent = message;
            activeConfirmCallback = onConfirm;
            document.getElementById('confirm-modal-container').style.display = 'flex';
        };

        document.getElementById('btn-confirm-cancel').addEventListener('click', () => {
            document.getElementById('confirm-modal-container').style.display = 'none';
            activeConfirmCallback = null;
        });

        document.getElementById('btn-confirm-ok').addEventListener('click', () => {
            document.getElementById('confirm-modal-container').style.display = 'none';
            if (activeConfirmCallback) activeConfirmCallback();
            activeConfirmCallback = null;
        });

        // Security Gate Password Login
        const btnLogin = document.getElementById('btn-login');
        const passwordInput = document.getElementById('lock-password');
        const lockScreen = document.getElementById('lock-screen');
        const lockError = document.getElementById('lock-error');

        // ── 24-Hour Persistent Auth ──
        const AUTH_KEY = 'admin-auth-token';
        const AUTH_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in ms

        function isAuthValid() {
            const stored = localStorage.getItem(AUTH_KEY);
            if (!stored) return false;
            try {
                const { timestamp } = JSON.parse(stored);
                return (Date.now() - timestamp) < AUTH_EXPIRY;
            } catch {
                return false;
            }
        }

        function setAuth() {
            localStorage.setItem(AUTH_KEY, JSON.stringify({ timestamp: Date.now() }));
        }

        function clearAuth() {
            localStorage.removeItem(AUTH_KEY);
        }

        // Check on page load — unlock if valid session exists
        if (isAuthValid()) {
            lockScreen.style.opacity = '0';
            lockScreen.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        } else {
            clearAuth(); // clear any expired token
            document.body.style.overflow = 'hidden';
        }

        const performLogin = () => {
            if (passwordInput.value === 'admin123') {
                setAuth();
                lockScreen.style.opacity = '0';
                lockScreen.style.visibility = 'hidden';
                document.body.style.overflow = 'auto';
                lockError.textContent = '';
            } else {
                lockError.textContent = 'Incorrect password! Try again.';
            }
        };

        btnLogin.addEventListener('click', performLogin);

        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                performLogin();
            }
        });

        // Logout Button — clears stored auth token and shows lock screen
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                clearAuth();
                lockScreen.style.opacity = '1';
                lockScreen.style.visibility = 'visible';
                document.body.style.overflow = 'hidden';
                passwordInput.value = '';
                lockError.textContent = '';
            });
        }

        // Tab Switching Logic
        const tabs = document.querySelectorAll('.sidebar-btn');
        const sections = document.querySelectorAll('.admin-section');

        window.switchTab = function(tabId) {
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            const matchingTab = Array.from(tabs).find(t => t.dataset.tab === tabId);
            if (matchingTab) {
                matchingTab.classList.add('active');
            }

            const targetSection = document.getElementById(`sec-${tabId}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            sessionStorage.setItem('admin-active-tab', tabId);

            if (tabId === 'messages') {
                loadMessages();
            }
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.dataset.tab);
            });
        });

        // Global State Structure
        let portfolioData = {
            profile: {
                name: "Aryan Joshi",
                title: "Full Stack & Intelligent Agents Architect",
                description: "Designing and building high-performance web solutions, advanced intelligent applications, and scalable backend infrastructures for forward-thinking clients.",
                about: "I started programming over five years ago, driven by curiosity to build solutions that resolve real-world problems. Today, my focus lies at the intersection of modern front-end design systems, scalable backend architectures, and intelligent API implementations.",
                avatar: "assets/images/avatar.png?v=original",
                resume: "#"
            },
            education: [],
            experience: [],
            stats: {
                username: "aryanjoshi458-rgb",
                repos: 34,
                followers: 120,
                following: 84
            },
            contact: {
                email: "Aryan.Joshi.dev@gmail.com",
                phone: "+1 (555) 019-2834",
                location: "San Francisco, CA"
            },
            projects: [],
            certs: [],
            testimonials: [],
            pricing: {
                ui:        { base: 1, minDays: 1, maxDays: 2 },
                frontend:  { base: 2, minDays: 2, maxDays: 3 },
                fullstack: { base: 3, minDays: 3, maxDays: 5 },
                ai:        { base: 5, minDays: 5, maxDays: 7 },
                perPage:    1,
                perFeature: 1
            }
        };

        // ── Pricing Manager: sync admin fields ← portfolioData.pricing ──
        function syncPricingFields() {
            const p = portfolioData.pricing;
            if (!p) return;
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            set('price-ui-base',        p.ui?.base          ?? 1);
            set('price-ui-min',         p.ui?.minDays       ?? 1);
            set('price-ui-max',         p.ui?.maxDays       ?? 2);
            set('price-frontend-base',  p.frontend?.base    ?? 2);
            set('price-frontend-min',   p.frontend?.minDays ?? 2);
            set('price-frontend-max',   p.frontend?.maxDays ?? 3);
            set('price-fullstack-base', p.fullstack?.base   ?? 3);
            set('price-fullstack-min',  p.fullstack?.minDays ?? 3);
            set('price-fullstack-max',  p.fullstack?.maxDays ?? 5);
            set('price-ai-base',        p.ai?.base          ?? 5);
            set('price-ai-min',         p.ai?.minDays       ?? 5);
            set('price-ai-max',         p.ai?.maxDays       ?? 7);
            set('price-per-page',       p.perPage           ?? 1);
            set('price-per-feature',    p.perFeature        ?? 1);
        }

        function applyFormValues() {
            // Ensure all properties exist to prevent JS errors
            if (!portfolioData) portfolioData = {};
            if (!portfolioData.profile) portfolioData.profile = {};
            if (!portfolioData.profile.name) portfolioData.profile.name = "Aryan Joshi";
            if (!portfolioData.profile.title) portfolioData.profile.title = "Full Stack & Intelligent Agents Architect";
            if (!portfolioData.profile.description) portfolioData.profile.description = "";
            if (!portfolioData.profile.about) portfolioData.profile.about = "";
            if (!portfolioData.profile.avatar) portfolioData.profile.avatar = "assets/images/avatar.png?v=original";
            if (!portfolioData.profile.resume) portfolioData.profile.resume = "#";

            if (!portfolioData.stats) portfolioData.stats = { username: "", repos: 0, followers: 0, following: 0 };
            if (!portfolioData.contact) portfolioData.contact = { email: "", phone: "", location: "" };
            if (!portfolioData.projects) portfolioData.projects = [];
            if (!portfolioData.certs) portfolioData.certs = [];

            // Pricing defaults
            if (!portfolioData.pricing) portfolioData.pricing = {};
            if (!portfolioData.pricing.ui)        portfolioData.pricing.ui        = { base: 1, minDays: 1, maxDays: 2 };
            if (!portfolioData.pricing.frontend)  portfolioData.pricing.frontend  = { base: 2, minDays: 2, maxDays: 3 };
            if (!portfolioData.pricing.fullstack) portfolioData.pricing.fullstack = { base: 3, minDays: 3, maxDays: 5 };
            if (!portfolioData.pricing.ai)        portfolioData.pricing.ai        = { base: 5, minDays: 5, maxDays: 7 };
            if (!portfolioData.pricing.perPage)    portfolioData.pricing.perPage    = 1;
            if (!portfolioData.pricing.perFeature) portfolioData.pricing.perFeature = 1;

            if (!portfolioData.education || portfolioData.education.length === 0) {
                portfolioData.education = [
                    {
                        id: "1",
                        title: "M.S. in Computer Science",
                        date: "2020 - 2022",
                        org: "State Tech University",
                        desc: "Specialized in Intelligent Systems and Distributed Backend Architecture. Graduated with Honors."
                    },
                    {
                        id: "2",
                        title: "B.S. in Software Engineering",
                        date: "2016 - 2020",
                        org: "Tech Institute of Science",
                        desc: "Acquired foundational training in Data Structures, Database Systems design, and Object-Oriented methodologies."
                    }
                ];
            }
            if (!portfolioData.experience || portfolioData.experience.length === 0) {
                portfolioData.experience = [
                    {
                        id: "1",
                        title: "Senior Full Stack Engineer",
                        date: "2024 - Present",
                        org: "Vortex Digital Lab",
                        desc: "Designing high-throughput API services, optimizing database latency, and guiding the transition from monoliths to next-gen edge architectures."
                    },
                    {
                        id: "2",
                        title: "Software Developer",
                        date: "2022 - 2024",
                        org: "WebSolutions Inc.",
                        desc: "Successfully built and scaled 15+ clients dashboards, increasing application load speed and UI metrics."
                    }
                ];
            }

            if (!portfolioData.testimonials || portfolioData.testimonials.length === 0) {
                portfolioData.testimonials = [
                    {
                        id: "1",
                        name: "Sarah Jenkins",
                        role: "Product Manager",
                        company: "Vortex Labs",
                        link: "https://linkedin.com",
                        review: "Aryan is an exceptional developer. He built our automated agent workflow ahead of schedule and reduced API costs by 35%. Highly recommended!"
                    },
                    {
                        id: "2",
                        name: "David Chen",
                        role: "Founder",
                        company: "SaaSify",
                        link: "https://github.com",
                        review: "Working with Aryan was seamless. His architecture is extremely clean and he explained complex system designs very clearly. A top-tier architect."
                    }
                ];
            }

            // Sync values to Form Controls
            document.getElementById('profile-name').value = portfolioData.profile.name;
            document.getElementById('profile-title').value = portfolioData.profile.title;
            document.getElementById('profile-desc').value = portfolioData.profile.description;
            document.getElementById('profile-about').value = portfolioData.profile.about;
            const previewImg = document.getElementById('avatar-preview');
            if (previewImg) {
                previewImg.src = portfolioData.profile.avatar;
                previewImg.style.opacity = '1';
            }
            document.getElementById('profile-resume-link').value = portfolioData.profile.resume || '';

            // Update resume status label
            const statusSpan = document.getElementById('resume-upload-status');
            if (portfolioData.profile.resume && portfolioData.profile.resume !== '#') {
                if (portfolioData.profile.resume.startsWith('/uploads/')) {
                    statusSpan.textContent = 'Using uploaded PDF';
                    statusSpan.style.color = '#10b981';
                } else {
                    statusSpan.textContent = 'Using external link';
                    statusSpan.style.color = '#10b981';
                }
            } else {
                statusSpan.textContent = 'No file uploaded';
                statusSpan.style.color = 'var(--text-muted)';
            }

            document.getElementById('github-username').value = portfolioData.stats.username;
            document.getElementById('stat-repos').value = portfolioData.stats.repos;
            document.getElementById('stat-followers').value = portfolioData.stats.followers;
            document.getElementById('stat-following').value = portfolioData.stats.following;

            document.getElementById('contact-email').value = portfolioData.contact.email;
            document.getElementById('contact-phone').value = portfolioData.contact.phone;
            document.getElementById('contact-loc').value = portfolioData.contact.location;

            renderProjectsList();
            renderCertsList();
            renderEduList();
            renderExpList();
            renderTestimonialsList();
            syncPricingFields();

            if (window.updateAllFloatingLabels) {
                setTimeout(window.updateAllFloatingLabels, 100);
            }
        }

        // Load current data from localStorage or fallback defaults
        function loadSettings() {
            const storedFallback = () => {
                const stored = localStorage.getItem('AryanJoshiPortfolioData');
                if (stored) {
                    portfolioData = JSON.parse(stored);
                    if (!portfolioData.certs) {
                        portfolioData.certs = [
                            {
                                id: "1",
                                logo: "AWS",
                                title: "AWS Certified Solutions Architect",
                                provider: "Amazon Web Services",
                                date: "Issued Jan 2025 • Expires Jan 2028",
                                link: "#"
                            },
                            {
                                id: "2",
                                logo: "TFS",
                                title: "TensorFlow Developer Certificate",
                                provider: "TensorFlow / Google",
                                date: "Issued Aug 2024 • No Expiration",
                                link: "#"
                            },
                            {
                                id: "3",
                                logo: "MDB",
                                title: "MongoDB Certified Developer",
                                provider: "MongoDB University",
                                date: "Issued May 2023 • No Expiration",
                                link: "#"
                            }
                        ];
                    }
                } else {
                    // Initialize default project array
                    portfolioData.projects = [
                        {
                            id: "1",
                            title: "Neural Analytics Hub",
                            category: "ai",
                            desc: "Real-time business data processing platform powered by the Gemini API for natural language reports.",
                            tech: "Next.js, FastAPI, Gemini API, ChartJS",
                            features: "Natural language query interface, Automated reports builder, Real-time telemetry integration",
                            image: "assets/images/project1.png?v=original",
                            demo: "#",
                            github: "#"
                        },
                        {
                            id: "2",
                            title: "Stripe-integrated SaaS Portal",
                            category: "web",
                            desc: "A premium customer management tool with dynamic billing subscription plans, and invoice exports.",
                            tech: "React, Node.js, MongoDB, Stripe",
                            features: "Stripe Billing API integration, Responsive admin panel, Secure user authentication",
                            image: "assets/images/project1.png?v=original",
                            demo: "#",
                            github: "#"
                        },
                        {
                            id: "3",
                            title: "Git-Automate CLI",
                            category: "tools",
                            desc: "A lightweight command-line tool to automate git status auditing, auto-commit creation, and pull requests.",
                            tech: "Node.js, Inquirer, OpenAI API",
                            features: "Automated local git repository scan, AI-generated commit descriptions, Interactive shell menu",
                            image: "assets/images/project1.png?v=original",
                            demo: "#",
                            github: "#"
                        }
                    ];
                    portfolioData.certs = [
                        {
                            id: "1",
                            logo: "AWS",
                            title: "AWS Certified Solutions Architect",
                            provider: "Amazon Web Services",
                            date: "Issued Jan 2025 • Expires Jan 2028",
                            link: "#"
                        },
                        {
                            id: "2",
                            logo: "TFS",
                            title: "TensorFlow Developer Certificate",
                            provider: "TensorFlow / Google",
                            date: "Issued Aug 2024 • No Expiration",
                            link: "#"
                        },
                        {
                            id: "3",
                            logo: "MDB",
                            title: "MongoDB Certified Developer",
                            provider: "MongoDB University",
                            date: "Issued May 2023 • No Expiration",
                            link: "#"
                        }
                    ];
                }
                applyFormValues();
            };

            fetch('http://127.0.0.1:5000/api/portfolio')
                .then(res => {
                    if (!res.ok) throw new Error('API server load error');
                    return res.json();
                })
                .then(data => {
                    portfolioData = data;
                    
                    // Auto-migrate from localStorage if local storage has custom projects and backend is fresh
                    const stored = localStorage.getItem('AryanJoshiPortfolioData');
                    if (stored) {
                        try {
                            const localObj = JSON.parse(stored);
                            if (localObj.projects && localObj.projects.length > 0 && (!portfolioData.projects || portfolioData.projects.length === 0 || (portfolioData.projects.length === 3 && portfolioData.projects[0].title === "Neural Analytics Hub"))) {
                                console.log("Migrating local data to Flask database...");
                                portfolioData = localObj;
                                // Save back to backend immediately
                                fetch('http://127.0.0.1:5000/api/portfolio', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(portfolioData)
                                }).catch(err => console.error("Auto-migration save failed:", err));
                            }
                        } catch(e) {
                            console.error("Migration error:", e);
                        }
                    }
                    applyFormValues();
                })
                .catch(err => {
                    console.warn('API server load failed, falling back to localStorage:', err);
                    storedFallback();
                });
        }

        // Image Cropper Integration
        let cropper = null;
        let activeCropTarget = null; // 'avatar' or 'project'
        let uploadQueue = []; // Holds items for batch upload
        let currentQueueIndex = 0;

        const cropperModal = document.getElementById('cropper-modal');
        const cropperImg = document.getElementById('cropper-image');
        const btnCropCancel = document.getElementById('btn-cropper-cancel');
        const btnCropSave = document.getElementById('btn-cropper-save');
        const cropperRatioSelect = document.getElementById('cropper-ratio');

        function startCropper(imageSrc, targetType) {
            activeCropTarget = targetType;
            cropperImg.src = imageSrc;
            cropperModal.style.display = 'flex';

            if (cropper) {
                cropper.destroy();
            }

            // Sync dropdown selection state
            if (targetType === 'avatar') {
                cropperRatioSelect.value = "1";
                cropperRatioSelect.disabled = true; // Avatar must be 1:1
            } else {
                cropperRatioSelect.value = "1.6";
                cropperRatioSelect.disabled = false;
            }

            const initialAspectRatio = parseFloat(cropperRatioSelect.value);

            cropper = new Cropper(cropperImg, {
                aspectRatio: isNaN(initialAspectRatio) ? NaN : initialAspectRatio,
                viewMode: 1,
                background: false,
                autoCropArea: 0.9,
                responsive: true
            });
        }

        // Listen for crop aspect ratio dropdown selection changes
        cropperRatioSelect.addEventListener('change', (e) => {
            if (cropper) {
                const ratio = parseFloat(e.target.value);
                cropper.setAspectRatio(isNaN(ratio) ? NaN : ratio);
            }
        });

        btnCropCancel.addEventListener('click', () => {
            closeCropper();
            processNextInQueue();
        });

        btnCropSave.addEventListener('click', () => {
            if (cropper) {
                const ratioVal = parseFloat(cropperRatioSelect.value);
                const ratio = isNaN(ratioVal) ? (cropper.getData().width / cropper.getData().height) : ratioVal;
                const maxWidth = activeCropTarget === 'avatar' ? 400 : 800;
                
                const canvas = cropper.getCroppedCanvas({
                    width: maxWidth,
                    height: maxWidth / ratio,
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: 'high'
                });

                btnCropSave.textContent = 'Uploading...';
                btnCropSave.disabled = true;

                canvas.toBlob(blob => {
                    const formData = new FormData();
                    formData.append('file', blob, activeCropTarget === 'avatar' ? 'avatar.jpg' : 'project.jpg');
                    fetch('http://127.0.0.1:5000/api/upload', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => {
                        if (!res.ok) throw new Error('Upload server error');
                        return res.json();
                    })
                    .then(data => {
                        if (data.url) {
                            handleCropSuccess(data.url);
                        } else {
                            alert('Upload failed: ' + (data.error || 'unknown error'));
                        }
                        finalizeCropStep();
                    })
                    .catch(err => {
                        console.error('Upload error:', err);
                        // Fallback to local Base64 if API server is not running
                        const fallbackBase64 = canvas.toDataURL('image/jpeg', 0.85);
                        handleCropSuccess(fallbackBase64);
                        finalizeCropStep();
                    });
                }, 'image/jpeg', 0.85);
            }
        });

        function handleCropSuccess(url) {
            if (activeCropTarget === 'avatar') {
                document.getElementById('avatar-preview').src = url;
                portfolioData.profile.avatar = url;
            } else if (activeCropTarget === 'project') {
                projectImagesList.push(url);
                renderProjectImagesPreviews();
            }
        }

        function finalizeCropStep() {
            btnCropSave.textContent = 'Crop & Use';
            btnCropSave.disabled = false;
            closeCropper();
            currentQueueIndex++;
            processNextInQueue();
        }

        function processNextInQueue() {
            if (currentQueueIndex < uploadQueue.length) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    startCropper(evt.target.result, 'project');
                };
                reader.readAsDataURL(uploadQueue[currentQueueIndex]);
            } else {
                uploadQueue = [];
                currentQueueIndex = 0;
            }
        }

        function closeCropper() {
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            cropperModal.style.display = 'none';
        }

        // Avatar Image File Upload handler
        document.getElementById('profile-avatar-file').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    startCropper(evt.target.result, 'avatar');
                };
                reader.readAsDataURL(file);
            }
        });

        // Project Images upload handler supporting multiple selection queue
        let projectImagesList = []; // Holds list of cropped image strings
        document.getElementById('proj-img-file').addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                uploadQueue = files;
                currentQueueIndex = 0;
                processNextInQueue();
            }
        });

        function renderProjectImagesPreviews() {
            const container = document.getElementById('project-images-preview-list');
            if (!container) return;
            container.innerHTML = '';
            
            projectImagesList.forEach((imgSrc, idx) => {
                const wrap = document.createElement('div');
                wrap.style.position = 'relative';
                wrap.style.display = 'inline-block';
                
                const img = document.createElement('img');
                img.src = imgSrc;
                img.className = 'image-preview project-preview';
                img.style.width = '120px';
                img.style.height = '75px';
                img.style.borderRadius = '8px';
                img.style.objectFit = 'cover';
                img.style.border = '1px solid var(--glass-border)';
                
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '✕';
                removeBtn.style.position = 'absolute';
                removeBtn.style.top = '-5px';
                removeBtn.style.right = '-5px';
                removeBtn.style.background = '#ef4444';
                removeBtn.style.color = 'white';
                removeBtn.style.border = 'none';
                removeBtn.style.borderRadius = '50%';
                removeBtn.style.width = '20px';
                removeBtn.style.height = '20px';
                removeBtn.style.fontSize = '0.75rem';
                removeBtn.style.display = 'flex';
                removeBtn.style.alignItems = 'center';
                removeBtn.style.justifyContent = 'center';
                removeBtn.style.cursor = 'pointer';
                removeBtn.onclick = (e) => {
                    e.preventDefault();
                    projectImagesList.splice(idx, 1);
                    renderProjectImagesPreviews();
                };
                
                wrap.appendChild(img);
                wrap.appendChild(removeBtn);
                container.appendChild(wrap);
            });
        }

        // Resume PDF File Upload handler
        document.getElementById('profile-resume-file').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const statusSpan = document.getElementById('resume-upload-status');
                statusSpan.textContent = 'Uploading...';
                statusSpan.style.color = 'var(--accent-primary)';
                
                fetch('http://127.0.0.1:5000/api/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(res => {
                    if (!res.ok) throw new Error('Upload server error');
                    return res.json();
                })
                .then(data => {
                    if (data.url) {
                        portfolioData.profile.resume = data.url;
                        document.getElementById('profile-resume-link').value = data.url;
                        statusSpan.textContent = 'Uploaded successfully!';
                        statusSpan.style.color = '#10b981'; // Green color for success
                        updateAllFloatingLabels();
                    } else {
                        statusSpan.textContent = 'Upload failed!';
                        statusSpan.style.color = '#ef4444'; // Red color for error
                    }
                })
                .catch(err => {
                    console.error('Resume upload error:', err);
                    statusSpan.textContent = 'Upload failed!';
                    statusSpan.style.color = '#ef4444';
                });
            }
        });

        // Sync resume link text changes
        document.getElementById('profile-resume-link').addEventListener('input', function(e) {
            portfolioData.profile.resume = e.target.value;
        });

        // Render certifications list inside admin panel
        function renderCertsList() {
            const container = document.getElementById('certs-list');
            if (!container) return;
            container.innerHTML = '';
            
            if (portfolioData.certs) {
                portfolioData.certs.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'project-item';
                    div.innerHTML = `
                        <div class="project-item-info">
                            <div style="width: 50px; height: 35px; border-radius: 4px; background: var(--accent-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem;">${c.logo}</div>
                            <div>
                                <strong>${c.title}</strong>
                                <span style="font-size: 0.8rem; background: var(--glass-border); padding: 2px 6px; border-radius: 4px; margin-left: 10px; text-transform: uppercase;">${c.provider}</span>
                            </div>
                        </div>
                        <div class="project-item-actions">
                            <button class="btn btn-secondary" onclick="editCert('${c.id}')" style="padding: 6px 12px; font-size: 0.85rem;">Edit</button>
                            <button class="btn btn-secondary" onclick="deleteCert('${c.id}')" style="padding: 6px 12px; font-size: 0.85rem; background: #ef4444; border-color: #ef4444; color: white;">Delete</button>
                        </div>
                    `;
                    container.appendChild(div);
                });
            }
        }

        // Add certification hooks
        const addCertBtn = document.getElementById('btn-add-cert');
        const certFormContainer = document.getElementById('cert-form-container');
        const certFormTitle = document.getElementById('cert-form-title');

        if (addCertBtn) {
            addCertBtn.addEventListener('click', () => {
                document.getElementById('cert-id').value = '';
                document.getElementById('cert-logo-val').value = '';
                document.getElementById('cert-title-val').value = '';
                document.getElementById('cert-provider-val').value = '';
                document.getElementById('cert-date-val').value = '';
                document.getElementById('cert-link-val').value = '#';
                
                certFormTitle.textContent = 'Add New Certification';
                certFormContainer.style.display = 'flex';
                setTimeout(updateAllFloatingLabels, 50);
            });
        }

        document.getElementById('btn-cancel-cert').addEventListener('click', () => {
            certFormContainer.style.display = 'none';
        });

        // Edit Certification
        window.editCert = function(id) {
            const c = portfolioData.certs.find(x => x.id === id);
            if (c) {
                document.getElementById('cert-id').value = c.id;
                document.getElementById('cert-logo-val').value = c.logo;
                document.getElementById('cert-title-val').value = c.title;
                document.getElementById('cert-provider-val').value = c.provider;
                document.getElementById('cert-date-val').value = c.date;
                document.getElementById('cert-link-val').value = c.link;

                certFormTitle.textContent = 'Edit Certification details';
                certFormContainer.style.display = 'flex';
                setTimeout(updateAllFloatingLabels, 50);
            }
        };

        // Delete Certification
        window.deleteCert = function(id) {
            showConfirm('Are you sure you want to delete this certification?', () => {
                portfolioData.certs = portfolioData.certs.filter(x => x.id !== id);
                renderCertsList();
                // Save state instantly to database & localStorage
                localStorage.setItem('AryanJoshiPortfolioData', JSON.stringify(portfolioData));
                fetch('http://127.0.0.1:5000/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(portfolioData)
                }).catch(err => console.error("Error saving certification deletion:", err));
            });
        };

        // Apply Certification Changes
        document.getElementById('btn-save-cert').addEventListener('click', () => {
            const id = document.getElementById('cert-id').value;
            const logo = document.getElementById('cert-logo-val').value;
            const title = document.getElementById('cert-title-val').value;
            const provider = document.getElementById('cert-provider-val').value;
            const date = document.getElementById('cert-date-val').value;
            const link = document.getElementById('cert-link-val').value;

            if (!title || !logo) {
                alert('Please enter a certification name and logo initials.');
                return;
            }

            if (id) {
                const idx = portfolioData.certs.findIndex(x => x.id === id);
                if (idx !== -1) {
                    portfolioData.certs[idx] = { id, logo, title, provider, date, link };
                }
            } else {
                const newId = String(Date.now());
                portfolioData.certs.push({ id: newId, logo, title, provider, date, link });
            }

            certFormContainer.style.display = 'none';
            renderCertsList();
        });

        // Render Education list inside admin panel
        function renderEduList() {
            const container = document.getElementById('edu-list');
            if (!container) return;
            container.innerHTML = '';
            
            if (portfolioData.education) {
                portfolioData.education.forEach(e => {
                    const div = document.createElement('div');
                    div.className = 'project-item';
                    div.innerHTML = `
                        <div class="project-item-info">
                            <div style="width: 50px; height: 35px; border-radius: 4px; background: var(--accent-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; text-align: center; padding: 2px;">EDU</div>
                            <div>
                                <strong>${e.title}</strong>
                                <span style="font-size: 0.8rem; background: var(--glass-border); padding: 2px 6px; border-radius: 4px; margin-left: 10px;">${e.org}</span>
                            </div>
                        </div>
                        <div class="project-item-actions">
                            <button class="btn btn-secondary" onclick="editResumeItem('education', '${e.id}')" style="padding: 6px 12px; font-size: 0.85rem;">Edit</button>
                            <button class="btn btn-secondary" onclick="deleteResumeItem('education', '${e.id}')" style="padding: 6px 12px; font-size: 0.85rem; background: #ef4444; border-color: #ef4444; color: white;">Delete</button>
                        </div>
                    `;
                    container.appendChild(div);
                });
            }
        }

        // Render Experience list inside admin panel
        function renderExpList() {
            const container = document.getElementById('exp-list');
            if (!container) return;
            container.innerHTML = '';
            
            if (portfolioData.experience) {
                portfolioData.experience.forEach(e => {
                    const div = document.createElement('div');
                    div.className = 'project-item';
                    div.innerHTML = `
                        <div class="project-item-info">
                            <div style="width: 50px; height: 35px; border-radius: 4px; background: var(--accent-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; text-align: center; padding: 2px;">EXP</div>
                            <div>
                                <strong>${e.title}</strong>
                                <span style="font-size: 0.8rem; background: var(--glass-border); padding: 2px 6px; border-radius: 4px; margin-left: 10px;">${e.org}</span>
                            </div>
                        </div>
                        <div class="project-item-actions">
                            <button class="btn btn-secondary" onclick="editResumeItem('experience', '${e.id}')" style="padding: 6px 12px; font-size: 0.85rem;">Edit</button>
                            <button class="btn btn-secondary" onclick="deleteResumeItem('experience', '${e.id}')" style="padding: 6px 12px; font-size: 0.85rem; background: #ef4444; border-color: #ef4444; color: white;">Delete</button>
                        </div>
                    `;
                    container.appendChild(div);
                });
            }
        }

        // Add Resume Item Modal hook helpers
        const resumeFormContainer = document.getElementById('resume-form-container');
        const resumeFormTitle = document.getElementById('resume-form-title');

        if (document.getElementById('btn-add-edu')) {
            document.getElementById('btn-add-edu').addEventListener('click', () => {
                openResumeItemForm('education');
            });
        }

        if (document.getElementById('btn-add-exp')) {
            document.getElementById('btn-add-exp').addEventListener('click', () => {
                openResumeItemForm('experience');
            });
        }

        document.getElementById('btn-cancel-resume-item').addEventListener('click', () => {
            resumeFormContainer.style.display = 'none';
        });

        function openResumeItemForm(type, item = null) {
            document.getElementById('resume-item-type').value = type;
            document.getElementById('resume-item-id').value = item ? item.id : '';
            document.getElementById('resume-item-title').value = item ? item.title : '';
            document.getElementById('resume-item-org').value = item ? item.org : '';
            document.getElementById('resume-item-date').value = item ? item.date : '';
            document.getElementById('resume-item-desc').value = item ? item.desc : '';

            resumeFormTitle.textContent = item ? `Edit ${type === 'education' ? 'Education' : 'Experience'}` : `Add New ${type === 'education' ? 'Education' : 'Experience'}`;
            resumeFormContainer.style.display = 'flex';
            setTimeout(updateAllFloatingLabels, 50);
        }

        window.editResumeItem = function(type, id) {
            const list = type === 'education' ? portfolioData.education : portfolioData.experience;
            const item = list.find(x => x.id === id);
            if (item) {
                openResumeItemForm(type, item);
            }
        };

        window.deleteResumeItem = function(type, id) {
            showConfirm(`Are you sure you want to delete this ${type === 'education' ? 'education' : 'experience'} item?`, () => {
                if (type === 'education') {
                    portfolioData.education = portfolioData.education.filter(x => x.id !== id);
                    renderEduList();
                } else {
                    portfolioData.experience = portfolioData.experience.filter(x => x.id !== id);
                    renderExpList();
                }
                // Save state instantly to database & localStorage
                localStorage.setItem('AryanJoshiPortfolioData', JSON.stringify(portfolioData));
                fetch('http://127.0.0.1:5000/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(portfolioData)
                }).catch(err => console.error("Error saving resume item deletion:", err));
            });
        };

        document.getElementById('btn-save-resume-item').addEventListener('click', () => {
            const type = document.getElementById('resume-item-type').value;
            const id = document.getElementById('resume-item-id').value;
            const title = document.getElementById('resume-item-title').value;
            const org = document.getElementById('resume-item-org').value;
            const date = document.getElementById('resume-item-date').value;
            const desc = document.getElementById('resume-item-desc').value;

            if (!title || !org) {
                alert('Please fill in both the Title and Organization fields.');
                return;
            }

            const targetArray = type === 'education' ? portfolioData.education : portfolioData.experience;

            if (id) {
                // Update
                const idx = targetArray.findIndex(x => x.id === id);
                if (idx !== -1) {
                    targetArray[idx] = { id, title, org, date, desc };
                }
            } else {
                // Create
                const newId = String(Date.now());
                targetArray.push({ id: newId, title, org, date, desc });
            }

            resumeFormContainer.style.display = 'none';
            if (type === 'education') {
                renderEduList();
            } else {
                renderExpList();
            }
        });

        // Render Testimonials list inside admin panel
        function renderTestimonialsList() {
            const container = document.getElementById('testimonials-list');
            if (!container) return;
            container.innerHTML = '';
            
            if (portfolioData.testimonials) {
                portfolioData.testimonials.forEach(t => {
                    const div = document.createElement('div');
                    div.className = 'project-item';
                    div.innerHTML = `
                        <div class="project-item-info">
                            <div style="width: 50px; height: 35px; border-radius: 4px; background: var(--accent-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem; text-align: center;">TSTM</div>
                            <div>
                                <strong>${t.name}</strong>
                                <span style="font-size: 0.8rem; background: var(--glass-border); padding: 2px 6px; border-radius: 4px; margin-left: 10px;">${t.company}</span>
                            </div>
                        </div>
                        <div class="project-item-actions">
                            <button class="btn btn-secondary" onclick="editTestimonial('${t.id}')" style="padding: 6px 12px; font-size: 0.85rem;">Edit</button>
                            <button class="btn btn-secondary" onclick="deleteTestimonial('${t.id}')" style="padding: 6px 12px; font-size: 0.85rem; background: #ef4444; border-color: #ef4444; color: white;">Delete</button>
                        </div>
                    `;
                    container.appendChild(div);
                });
            }
        }

        // Testimonial Modal hooks
        const testimonialFormContainer = document.getElementById('testimonial-form-container');
        const testimonialFormTitle = document.getElementById('testimonial-form-title');

        if (document.getElementById('btn-add-testimonial')) {
            document.getElementById('btn-add-testimonial').addEventListener('click', () => {
                document.getElementById('testimonial-id').value = '';
                document.getElementById('testimonial-name').value = '';
                document.getElementById('testimonial-role').value = '';
                document.getElementById('testimonial-company').value = '';
                document.getElementById('testimonial-link').value = '#';
                document.getElementById('testimonial-review').value = '';
                
                testimonialFormTitle.textContent = 'Add New Testimonial';
                testimonialFormContainer.style.display = 'flex';
                setTimeout(updateAllFloatingLabels, 50);
            });
        }

        document.getElementById('btn-cancel-testimonial').addEventListener('click', () => {
            testimonialFormContainer.style.display = 'none';
        });

        window.editTestimonial = function(id) {
            const t = portfolioData.testimonials.find(x => x.id === id);
            if (t) {
                document.getElementById('testimonial-id').value = t.id;
                document.getElementById('testimonial-name').value = t.name;
                document.getElementById('testimonial-role').value = t.role;
                document.getElementById('testimonial-company').value = t.company;
                document.getElementById('testimonial-link').value = t.link;
                document.getElementById('testimonial-review').value = t.review;
                
                testimonialFormTitle.textContent = 'Edit Testimonial details';
                testimonialFormContainer.style.display = 'flex';
                setTimeout(updateAllFloatingLabels, 50);
            }
        };

        window.deleteTestimonial = function(id) {
            showConfirm('Are you sure you want to delete this testimonial?', () => {
                portfolioData.testimonials = portfolioData.testimonials.filter(x => x.id !== id);
                renderTestimonialsList();
                // Save state instantly to database & localStorage
                localStorage.setItem('AryanJoshiPortfolioData', JSON.stringify(portfolioData));
                fetch('http://127.0.0.1:5000/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(portfolioData)
                }).catch(err => console.error("Error saving testimonial deletion:", err));
            });
        };

        document.getElementById('btn-save-testimonial').addEventListener('click', () => {
            const id = document.getElementById('testimonial-id').value;
            const name = document.getElementById('testimonial-name').value;
            const role = document.getElementById('testimonial-role').value;
            const company = document.getElementById('testimonial-company').value;
            const link = document.getElementById('testimonial-link').value;
            const review = document.getElementById('testimonial-review').value;

            if (!name || !review) {
                alert('Please enter client name and feedback message.');
                return;
            }

            if (id) {
                const idx = portfolioData.testimonials.findIndex(x => x.id === id);
                if (idx !== -1) {
                    portfolioData.testimonials[idx] = { id, name, role, company, link, review };
                }
            } else {
                const newId = String(Date.now());
                portfolioData.testimonials.push({ id: newId, name, role, company, link, review });
            }

            testimonialFormContainer.style.display = 'none';
            renderTestimonialsList();
        });

        // Render project managers list
        function renderProjectsList() {
            const container = document.getElementById('project-list');
            container.innerHTML = '';
            
            portfolioData.projects.forEach(p => {
                const displayImg = (p.image && p.image.includes(',')) ? p.image.split(',')[0] : (p.image || 'assets/images/project1.png?v=original');
                const div = document.createElement('div');
                div.className = 'project-item';
                div.innerHTML = `
                    <div class="project-item-info">
                        <img src="${displayImg}" style="width: 50px; height: 35px; border-radius: 4px; object-fit: cover;">
                        <div>
                            <strong>${p.title}</strong>
                            <span style="font-size: 0.8rem; background: var(--glass-border); padding: 2px 6px; border-radius: 4px; margin-left: 10px; text-transform: uppercase;">${p.category}</span>
                        </div>
                    </div>
                    <div class="project-item-actions">
                        <button class="btn btn-secondary" onclick="editProject('${p.id}')" style="padding: 6px 12px; font-size: 0.85rem;">Edit</button>
                        <button class="btn btn-secondary" onclick="deleteProject('${p.id}')" style="padding: 6px 12px; font-size: 0.85rem; background: #ef4444; border-color: #ef4444; color: white;">Delete</button>
                    </div>
                `;
                container.appendChild(div);
            });
        }

        // Add project button
        const addProjBtn = document.getElementById('btn-add-project');
        const projFormContainer = document.getElementById('project-form-container');
        const formTitle = document.getElementById('project-form-title');

        addProjBtn.addEventListener('click', () => {
            document.getElementById('project-id').value = '';
            document.getElementById('proj-title').value = '';
            document.getElementById('proj-desc').value = '';
            document.getElementById('proj-tech').value = '';
            document.getElementById('proj-features').value = '';
            document.getElementById('proj-demo').value = '#';
            document.getElementById('proj-git').value = '#';
            document.getElementById('proj-challenge').value = '';
            document.getElementById('proj-solution').value = '';
            document.getElementById('proj-metrics').value = '';

            // Empty list on new project creation so no default prefilled image appears
            projectImagesList = [];
            renderProjectImagesPreviews();
            
            formTitle.textContent = 'Add New Project';
            projFormContainer.style.display = 'flex';
            setTimeout(updateAllFloatingLabels, 50);
        });

        // Tag Managers
        let projectTechList = [];
        let projectFeaturesList = [];

        function renderTags(list, containerId, hiddenInputId) {
            const container = document.getElementById(containerId);
            const hiddenInput = document.getElementById(hiddenInputId);
            const inputField = container.querySelector('input');
            
            // Remove existing tags
            container.querySelectorAll('.tag-chip').forEach(el => el.remove());
            
            list.forEach((tag, idx) => {
                const chip = document.createElement('span');
                chip.className = 'tag-chip';
                chip.style.cssText = 'background: rgba(16, 185, 129, 0.15); color: var(--accent-primary); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; font-weight: 500;';
                chip.innerHTML = `${tag} <span class="tag-remove" style="cursor: pointer; opacity: 0.7; font-weight: bold;">✕</span>`;
                chip.querySelector('.tag-remove').onclick = () => {
                    list.splice(idx, 1);
                    renderTags(list, containerId, hiddenInputId);
                };
                container.insertBefore(chip, inputField);
            });
            
            hiddenInput.value = list.join(',');
        }

        function setupTagInput(inputId, containerId, listRef, hiddenInputId) {
            const input = document.getElementById(inputId);
            const container = document.getElementById(containerId);
            
            // Handle clicking container to focus input
            container.onclick = (e) => {
                if (e.target === container) input.focus();
            };

            input.oninput = (e) => {
                const val = e.target.value;
                if (val.includes(',')) {
                    const cleanTags = val.split(',').map(v => v.trim()).filter(v => v);
                    cleanTags.forEach(t => {
                        if (!listRef.includes(t)) listRef.push(t);
                    });
                    input.value = '';
                    renderTags(listRef, containerId, hiddenInputId);
                }
            };

            input.onkeydown = (e) => {
                if (e.key === 'Backspace' && input.value === '' && listRef.length > 0) {
                    listRef.pop();
                    renderTags(listRef, containerId, hiddenInputId);
                }
            };
        }

        setupTagInput('proj-tech-input', 'proj-tech-container', projectTechList, 'proj-tech');
        setupTagInput('proj-features-input', 'proj-features-container', projectFeaturesList, 'proj-features');

        addProjBtn.addEventListener('click', () => {
            document.getElementById('project-id').value = '';
            document.getElementById('proj-title').value = '';
            document.getElementById('proj-desc').value = '';
            document.getElementById('proj-tech').value = '';
            document.getElementById('proj-features').value = '';
            document.getElementById('proj-demo').value = '#';
            document.getElementById('proj-git').value = '#';
            document.getElementById('proj-challenge').value = '';
            document.getElementById('proj-solution').value = '';
            document.getElementById('proj-metrics').value = '';
            
            projectTechList.length = 0;
            projectFeaturesList.length = 0;
            renderTags(projectTechList, 'proj-tech-container', 'proj-tech');
            renderTags(projectFeaturesList, 'proj-features-container', 'proj-features');
            document.getElementById('proj-tech-input').value = '';
            document.getElementById('proj-features-input').value = '';

            // Empty list on new project creation so no default prefilled image appears
            projectImagesList = [];
            renderProjectImagesPreviews();
            
            formTitle.textContent = 'Add New Project';
            projFormContainer.style.display = 'flex';
            setTimeout(updateAllFloatingLabels, 50);
        });

        document.getElementById('btn-cancel-project').addEventListener('click', () => {
            projFormContainer.style.display = 'none';
        });

        // Edit Project
        window.editProject = function(id) {
            const p = portfolioData.projects.find(x => x.id === id);
            if (p) {
                document.getElementById('project-id').value = p.id;
                document.getElementById('proj-title').value = p.title;
                document.getElementById('proj-cat').value = p.category;
                document.getElementById('proj-desc').value = p.desc;
                document.getElementById('proj-tech').value = p.tech;
                document.getElementById('proj-features').value = p.features;
                document.getElementById('proj-demo').value = p.demo;
                document.getElementById('proj-git').value = p.github;
                document.getElementById('proj-challenge').value = p.challenge || '';
                document.getElementById('proj-solution').value = p.solution || '';
                document.getElementById('proj-metrics').value = p.metrics || '';
                
                projectTechList.length = 0;
                if (p.tech) {
                    p.tech.split(',').map(t => t.trim()).filter(t => t).forEach(t => projectTechList.push(t));
                }
                renderTags(projectTechList, 'proj-tech-container', 'proj-tech');
                
                projectFeaturesList.length = 0;
                if (p.features) {
                    p.features.split(',').map(f => f.trim()).filter(f => f).forEach(f => projectFeaturesList.push(f));
                }
                renderTags(projectFeaturesList, 'proj-features-container', 'proj-features');

                document.getElementById('proj-tech-input').value = '';
                document.getElementById('proj-features-input').value = '';

                // If it contains multiple images comma-separated, split them
                if (p.image && p.image.includes(',')) {
                    projectImagesList = p.image.split(',');
                } else {
                    projectImagesList = p.image ? [p.image] : [];
                }
                renderProjectImagesPreviews();
 
                formTitle.textContent = 'Edit Project details';
                projFormContainer.style.display = 'flex';
                setTimeout(updateAllFloatingLabels, 50);
            }
        };

        // Delete Project
        window.deleteProject = function(id) {
            showConfirm('Are you sure you want to delete this project?', () => {
                portfolioData.projects = portfolioData.projects.filter(x => x.id !== id);
                renderProjectsList();
                // Save state instantly to prevent resurrection on refresh
                localStorage.setItem('AryanJoshiPortfolioData', JSON.stringify(portfolioData));
                fetch('http://127.0.0.1:5000/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(portfolioData)
                }).catch(err => console.error("Error saving after delete:", err));
            });
        };

        // Apply Project Changes to Array
        document.getElementById('btn-save-project').addEventListener('click', () => {
            const id = document.getElementById('project-id').value;
            const title = document.getElementById('proj-title').value;
            const category = document.getElementById('proj-cat').value;
            const desc = document.getElementById('proj-desc').value;
            
            // Sync tags to hidden inputs just in case there is half typed text
            const techInput = document.getElementById('proj-tech-input');
            if (techInput && techInput.value.trim()) {
                const val = techInput.value.trim().replace(/,/g, '');
                if (val && !projectTechList.includes(val)) {
                    projectTechList.push(val);
                }
                techInput.value = '';
            }
            renderTags(projectTechList, 'proj-tech-container', 'proj-tech');

            const featInput = document.getElementById('proj-features-input');
            if (featInput && featInput.value.trim()) {
                const val = featInput.value.trim().replace(/,/g, '');
                if (val && !projectFeaturesList.includes(val)) {
                    projectFeaturesList.push(val);
                }
                featInput.value = '';
            }
            renderTags(projectFeaturesList, 'proj-features-container', 'proj-features');

            const tech = document.getElementById('proj-tech').value;
            const features = document.getElementById('proj-features').value;
            const demo = document.getElementById('proj-demo').value;
            const github = document.getElementById('proj-git').value;
            const challenge = document.getElementById('proj-challenge').value;
            const solution = document.getElementById('proj-solution').value;
            const metrics = document.getElementById('proj-metrics').value;
 
            if (!title) {
                alert('Please enter a project name.');
                return;
            }

            // Fallback to placeholder if user didn't upload any image
            const finalImage = projectImagesList.length > 0 ? projectImagesList.join(',') : 'assets/images/project1.png?v=original';
 
            if (id) {
                // Update existing
                const idx = portfolioData.projects.findIndex(x => x.id === id);
                if (idx !== -1) {
                    portfolioData.projects[idx] = { id, title, category, desc, tech, features, image: finalImage, demo, github, challenge, solution, metrics };
                }
            } else {
                // Create new and insert at the very beginning of the array
                const newId = String(Date.now());
                portfolioData.projects.unshift({ id: newId, title, category, desc, tech, features, image: finalImage, demo, github, challenge, solution, metrics });
            }
 
            projFormContainer.style.display = 'none';
            renderProjectsList();

            // Save state instantly to database & localStorage to prevent loss on refresh
            localStorage.setItem('AryanJoshiPortfolioData', JSON.stringify(portfolioData));
            fetch('http://127.0.0.1:5000/api/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(portfolioData)
            }).catch(err => console.error("Error auto-saving project:", err));
        });

        // Global Save & Publish
        document.getElementById('btn-global-save').addEventListener('click', () => {
            portfolioData.profile.name = document.getElementById('profile-name').value;
            portfolioData.profile.title = document.getElementById('profile-title').value;
            portfolioData.profile.description = document.getElementById('profile-desc').value;
            portfolioData.profile.about = document.getElementById('profile-about').value;
            portfolioData.profile.resume = document.getElementById('profile-resume-link').value;

            portfolioData.stats.username = document.getElementById('github-username').value;
            portfolioData.stats.repos = parseInt(document.getElementById('stat-repos').value) || 0;
            portfolioData.stats.followers = parseInt(document.getElementById('stat-followers').value) || 0;
            portfolioData.stats.following = parseInt(document.getElementById('stat-following').value) || 0;

            portfolioData.contact.email = document.getElementById('contact-email').value;
            portfolioData.contact.phone = document.getElementById('contact-phone').value;
            portfolioData.contact.location = document.getElementById('contact-loc').value;

            // Save to localStorage as redundancy
            localStorage.setItem('AryanJoshiPortfolioData', JSON.stringify(portfolioData));

            // Save to Database via Flask API
            fetch('http://127.0.0.1:5000/api/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(portfolioData)
            })
            .then(res => {
                if (!res.ok) throw new Error('API server save error');
                return res.json();
            })
            .then(data => {
                console.log('Database save success:', data);
                showToast();
            })
            .catch(err => {
                console.warn('Database save failed. Data saved to localStorage only:', err);
                showToast('Saved (Local Mode Only)');
            });
        });

        function showToast(message = 'Changes Saved Successfully!') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Theme Switcher & Initialization for Dashboard
        function initAdminTheme() {
            const themeBtn = document.getElementById('theme-toggle');
            const root = document.documentElement;
            const themeIcon = themeBtn.querySelector('svg path');

            const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
            root.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme, themeIcon);

            themeBtn.addEventListener('click', () => {
                const currentTheme = root.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                root.setAttribute('data-theme', newTheme);
                localStorage.setItem('portfolio-theme', newTheme);
                updateThemeIcon(newTheme, themeIcon);
            });
        }

        function updateThemeIcon(theme, pathElement) {
            if (theme === 'light') {
                pathElement.setAttribute('d', 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z');
            } else {
                pathElement.setAttribute('d', 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z');
            }
        }

        // Logout handler
        document.getElementById('btn-logout').addEventListener('click', () => {
            sessionStorage.removeItem('admin-auth');
            document.body.style.overflow = 'hidden';
            window.location.reload();
        });

        // Floating Labels Logic
        function initFloatingLabels() {
            const inputs = document.querySelectorAll('.form-control');
            inputs.forEach(input => {
                const group = input.closest('.form-group');
                if (!group) return;

                const updateClass = () => {
                    if (input.value !== '' || document.activeElement === input) {
                        group.classList.add('floating');
                    } else {
                        group.classList.remove('floating');
                    }
                };

                input.addEventListener('focus', () => {
                    group.classList.add('focused');
                    group.classList.add('floating');
                });

                input.addEventListener('blur', () => {
                    group.classList.remove('focused');
                    updateClass();
                });

                input.addEventListener('input', updateClass);
                input.addEventListener('change', updateClass);
            });
        }

        window.updateAllFloatingLabels = function() {
            const inputs = document.querySelectorAll('.form-control');
            inputs.forEach(input => {
                const group = input.closest('.form-group');
                if (!group) return;
                if (input.value !== '' || document.activeElement === input) {
                    group.classList.add('floating');
                } else {
                    group.classList.remove('floating');
                }
            });
        };

        // Messages Inbox Logic
        window.loadMessages = function() {
            // Hide badge on click
            const badge = document.getElementById('messages-badge');
            if (badge) badge.style.display = 'none';

            const container = document.getElementById('messages-list');
            if (!container) return;
            container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 30px;">Loading messages...</div>';
            
            fetch('http://127.0.0.1:5000/api/messages')
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load messages');
                    return res.json();
                })
                .then(data => {
                    container.innerHTML = '';
                    if (data.length === 0) {
                        container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px; font-size: 0.95rem;">Inbox is empty. No messages received yet.</div>';
                        return;
                    }
                    data.forEach(m => {
                        const dateStr = new Date(m.timestamp).toLocaleString();
                        const card = document.createElement('div');
                        card.className = 'project-item';
                        card.style.flexDirection = 'column';
                        card.style.alignItems = 'stretch';
                        card.style.gap = '15px';
                        card.style.padding = '20px';
                        
                        card.innerHTML = `
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px; margin-bottom: 5px;">
                                <div>
                                    <strong style="font-size: 1.1rem; color: var(--text-primary);">${m.name}</strong>
                                    <a href="mailto:${m.email}" style="font-size: 0.85rem; color: var(--accent-primary); margin-left: 10px; text-decoration: none;">${m.email}</a>
                                </div>
                                <span style="font-size: 0.8rem; color: var(--text-muted);">${dateStr}</span>
                            </div>
                            <div>
                                <div style="font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">Subject: ${m.subject || '(No Subject)'}</div>
                                <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-wrap; margin: 0; background: rgba(255, 255, 255, 0.02); padding: 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.05);">${m.message}</p>
                            </div>
                            <div style="display: flex; justify-content: flex-end; margin-top: 5px;">
                                <button class="btn btn-secondary" onclick="deleteMessage(${m.id})" style="padding: 6px 12px; font-size: 0.85rem; background: #ef4444; border-color: #ef4444; color: white;">Delete Message</button>
                            </div>
                        `;
                        container.appendChild(card);
                    });
                })
                .catch(err => {
                    console.error('Error loading messages:', err);
                    container.innerHTML = '<div style="text-align: center; color: #ef4444; padding: 30px;">Failed to load messages. Please ensure Flask server is running.</div>';
                });
        };

        window.deleteMessage = function(id) {
            showConfirm('Are you sure you want to delete this message?', () => {
                fetch(`http://127.0.0.1:5000/api/messages/${id}`, {
                    method: 'DELETE'
                })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to delete message');
                    loadMessages();
                })
                .catch(err => {
                    alert('Error deleting message: ' + err.message);
                });
            });
        };

        function checkMessagesBadge() {
            fetch('http://127.0.0.1:5000/api/messages')
                .then(res => res.json())
                .then(data => {
                    const badge = document.getElementById('messages-badge');
                    if (badge && data.length > 0) {
                        badge.style.display = 'block';
                    }
                })
                .catch(err => console.warn('Could not check messages count:', err));
        }

        document.getElementById('btn-header-messages').addEventListener('click', () => {
            switchTab('messages');
        });


        const savePricingBtn = document.getElementById('btn-save-pricing');
        if (savePricingBtn) {
            savePricingBtn.addEventListener('click', () => {
                const get = id => parseInt(document.getElementById(id)?.value) || 0;
                portfolioData.pricing = {
                    ui:        { base: get('price-ui-base'),        minDays: get('price-ui-min'),        maxDays: get('price-ui-max') },
                    frontend:  { base: get('price-frontend-base'),  minDays: get('price-frontend-min'),  maxDays: get('price-frontend-max') },
                    fullstack: { base: get('price-fullstack-base'), minDays: get('price-fullstack-min'), maxDays: get('price-fullstack-max') },
                    ai:        { base: get('price-ai-base'),        minDays: get('price-ai-min'),        maxDays: get('price-ai-max') },
                    perPage:    get('price-per-page'),
                    perFeature: get('price-per-feature')
                };
                document.getElementById('btn-global-save').click();
            });
        }

        // Initial setup
        loadSettings();
        initAdminTheme();
        initFloatingLabels();
        updateAllFloatingLabels();
        checkMessagesBadge();
        
        // Restore active tab on load
        const savedTab = sessionStorage.getItem('admin-active-tab') || 'profile';
        switchTab(savedTab);