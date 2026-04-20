const toolTabs = document.querySelectorAll(".tool-tab");
const aiForm = document.getElementById("ai-form");
const aiOutput = document.getElementById("ai-output");
const copyButton = document.getElementById("copy-output");
const listingGrid = document.getElementById("listing-grid");
const listingCount = document.getElementById("listing-count");
const locationFilter = document.getElementById("location-filter");
const typeFilter = document.getElementById("type-filter");
const searchInput = document.getElementById("search-input");
const priceFilter = document.getElementById("price-filter");
const priceLabel = document.getElementById("price-label");
const moderationList = document.getElementById("moderation-list");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

const listings = [
    {
        id: 1,
        title: "Skyline Duplex Retreat",
        location: "Lekki, Lagos",
        type: "Duplex",
        price: 420000,
        beds: 3,
        baths: 4,
        agent: "Amina Yusuf",
        summary: "Smart-home duplex with cinema lounge, rooftop seating, and gated parking.",
    },
    {
        id: 2,
        title: "Waterfront Investor Suite",
        location: "Victoria Island, Lagos",
        type: "Apartment",
        price: 315000,
        beds: 2,
        baths: 2,
        agent: "David Cole",
        summary: "Short-let ready waterfront apartment with concierge access and premium finishes.",
    },
    {
        id: 3,
        title: "Garden Family Villa",
        location: "Abuja",
        type: "Villa",
        price: 540000,
        beds: 5,
        baths: 5,
        agent: "Grace Okoro",
        summary: "Quiet estate villa with a private garden, study, and detached staff quarters.",
    },
    {
        id: 4,
        title: "Urban Rental Hub",
        location: "Ikeja, Lagos",
        type: "Apartment",
        price: 145000,
        beds: 2,
        baths: 2,
        agent: "Moses Adeyemi",
        summary: "Modern rental apartment close to business districts, transit, and nightlife.",
    },
    {
        id: 5,
        title: "Executive Terrace Collection",
        location: "Port Harcourt",
        type: "Terrace",
        price: 260000,
        beds: 4,
        baths: 4,
        agent: "Chioma Wike",
        summary: "Freshly finished terrace home with security systems and spacious entertaining areas.",
    },
    {
        id: 6,
        title: "Investor Mini Estate",
        location: "Eko Atlantic",
        type: "Estate",
        price: 890000,
        beds: 8,
        baths: 8,
        agent: "Tunde Balogun",
        summary: "Rare income-producing mini estate designed for premium tenants and global investors.",
    },
];

const moderationQueue = [
    "Review duplicate photos on Skyline Duplex Retreat before boosting.",
    "Verify proof of ownership for Investor Mini Estate listing submission.",
    "Check flagged price inconsistency from Urban Rental Hub edits.",
    "Approve new brokerage team upgrade for Coastline Partners.",
];

const toolTemplates = {
    listing: ({ propertyType, location, details }) => `Headline:
Luxury ${propertyType} in ${location}

Property Description:
Step into a standout ${propertyType.toLowerCase()} positioned in ${location}. This home is designed for buyers who want comfort, prestige, and immediate lifestyle value. Highlights include ${details.toLowerCase()}

Why it sells:
- Premium location with strong buyer appeal
- Lifestyle-focused amenities that help listings convert faster
- Strong story for both family buyers and investors

Call to action:
Book a private tour today with PropNexus and experience the property in person.`,

    response: ({ propertyType, location, clientContext }) => `Hello,

Thank you for your interest in our ${propertyType.toLowerCase()} in ${location}. Based on what you shared, this property fits well because ${clientContext.toLowerCase()}

I would be happy to arrange a viewing, share the full photo gallery, and answer any questions about pricing, neighborhood access, or payment structure. If this weekend works for you, I can reserve a preferred viewing slot.

Best regards,
Your PropNexus Agent`,

    adcopy: ({ propertyType, location, details }) => `Campaign Hook:
Own a premium ${propertyType.toLowerCase()} in ${location}

Short Ad Copy:
Turn every viewing into a serious offer. Discover a refined home featuring ${details.toLowerCase()} Ideal for ambitious buyers who want prestige, convenience, and lasting value.

Social Caption:
Live boldly in ${location}. This ${propertyType.toLowerCase()} blends elegance, security, and strong investment appeal. DM now to schedule a private showing.

CTA:
Message now for price, inspection, and availability.`,
};

let currentTool = "listing";

function formatPrice(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);
}

function populateFilters() {
    const locations = [...new Set(listings.map((listing) => listing.location))];
    const types = [...new Set(listings.map((listing) => listing.type))];

    locations.forEach((location) => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });

    types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
}

function renderListings() {
    const term = searchInput.value.trim().toLowerCase();
    const selectedLocation = locationFilter.value;
    const selectedType = typeFilter.value;
    const maxPrice = Number(priceFilter.value);

    const filtered = listings.filter((listing) => {
        const matchesTerm =
            !term ||
            listing.title.toLowerCase().includes(term) ||
            listing.location.toLowerCase().includes(term) ||
            listing.type.toLowerCase().includes(term) ||
            listing.summary.toLowerCase().includes(term);

        const matchesLocation = selectedLocation === "all" || listing.location === selectedLocation;
        const matchesType = selectedType === "all" || listing.type === selectedType;
        const matchesPrice = listing.price <= maxPrice;

        return matchesTerm && matchesLocation && matchesType && matchesPrice;
    });

    listingCount.textContent = `${filtered.length} ${filtered.length === 1 ? "property" : "properties"}`;
    listingGrid.innerHTML = "";

    if (!filtered.length) {
        const emptyState = document.createElement("article");
        emptyState.className = "panel";
        emptyState.innerHTML = `
            <span class="panel-kicker">No matches</span>
            <h3>Try widening your filters</h3>
            <p>No listings match the current search. Increase the price range or switch location/type.</p>
        `;
        listingGrid.appendChild(emptyState);
        return;
    }

    filtered.forEach((listing) => {
        const card = document.createElement("article");
        card.className = "listing-card fade-in";
        card.innerHTML = `
            <div class="listing-visual">
                <div>
                    <span class="panel-kicker">Verified listing</span>
                    <h3>${listing.title}</h3>
                </div>
            </div>
            <div class="listing-meta">
                <div class="listing-topline">
                    <strong class="listing-price">${formatPrice(listing.price)}</strong>
                    <span>${listing.agent}</span>
                </div>
                <p>${listing.summary}</p>
                <div class="listing-tags">
                    <span>${listing.location}</span>
                    <span>${listing.type}</span>
                    <span>${listing.beds} beds</span>
                    <span>${listing.baths} baths</span>
                </div>
                <a class="button button-secondary" href="#contact">Contact agent</a>
            </div>
        `;
        listingGrid.appendChild(card);
    });

    observeFadeIns();
}

function renderModerationQueue() {
    moderationList.innerHTML = "";
    moderationQueue.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        moderationList.appendChild(li);
    });
}

function generateOutput() {
    const formData = new FormData(aiForm);
    const payload = Object.fromEntries(formData.entries());
    const template = toolTemplates[currentTool];
    aiOutput.textContent = template(payload);
}

function setActiveTool(tool) {
    currentTool = tool;
    toolTabs.forEach((tab) => {
        const isActive = tab.dataset.tool === tool;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });
    generateOutput();
}

function observeFadeIns() {
    const animatedBlocks = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
        }
    );

    animatedBlocks.forEach((block) => observer.observe(block));
}

toolTabs.forEach((tab) => {
    tab.addEventListener("click", () => setActiveTool(tab.dataset.tool));
});

aiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    generateOutput();
});

copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(aiOutput.textContent);
        copyButton.textContent = "Copied";
        setTimeout(() => {
            copyButton.textContent = "Copy text";
        }, 1500);
    } catch (error) {
        copyButton.textContent = "Copy failed";
        setTimeout(() => {
            copyButton.textContent = "Copy text";
        }, 1500);
    }
});

[locationFilter, typeFilter, searchInput, priceFilter].forEach((control) => {
    control.addEventListener("input", renderListings);
});

priceFilter.addEventListener("input", () => {
    priceLabel.textContent = formatPrice(Number(priceFilter.value));
});

navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".section, .hero-copy, .hero-panel, .pricing-card").forEach((element) => {
    element.classList.add("fade-in");
});

populateFilters();
renderListings();
renderModerationQueue();
generateOutput();
observeFadeIns();