this is mcc portal traditional template based rn
file structure
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         9/17/2026  12:28 PM                assets
d-----         9/17/2026  12:28 PM                public
d-----         9/17/2026  12:28 PM                src
-a----         9/17/2026  12:29 PM           4950 apply.html
-a----         9/17/2026  12:29 PM          13380 events.html
-a----         9/17/2026  12:30 PM           2850 executive-community.html
-a----         9/17/2026  12:29 PM           5322 hierarchy.html
-a----         9/17/2026  12:29 PM          13641 index.html
-a----         9/17/2026  12:29 PM           2906 mentions.html

in src
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         9/17/2026  12:28 PM                app
d-----         9/17/2026  12:28 PM                components
d-----         9/17/2026  12:28 PM                lib
-a----         9/17/2026  12:20 PM          15902 globals.css


in assets and public there is only png and solving
in src there are multiple tsx files if u want all tsx in a single md file tell 
like these :
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  Textarea,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  APPLICATION_AGE_MAX,
  APPLICATION_AGE_MIN,
  APPLICATION_DOMAIN_LABELS,
  APPLICATION_DOMAINS,
  MOTIVATION_MAX_LENGTH,
  type ApplicationDomain,
} from "@/lib/applications";
import { submitMembershipApplication } from "@/server/actions/applications";

export default function ApplyClient() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    age: "",
    email: "",
    motivation: "",
    domains: [] as ApplicationDomain[],
    specialty: "",
    website: "",
  });

  const toggleDomain = (domain: ApplicationDomain) => {
    setForm((current) => ({
      ...current,
      domains: current.domains.includes(domain)
        ? current.domains.filter((item) => item !== domain)
        : [...current.domains, domain],
    }));
  };

  if (done) {
    return (
      <Box bg="#FDF7EE" border="1px solid" borderColor="gray.200" borderRadius="xl" p={6}>
        <Text>Application received. We&apos;ll email you if there&apos;s a fit.</Text>
      </Box>
    );
  }

  return (
    <VStack
      align="stretch"
      spacing={4}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={6}
      position="relative"
    >
      {error ? (
        <Text color="red.600" fontSize="sm">
          {error}
        </Text>
      ) : null}
      <FormControl isRequired>
        <FormLabel>Full name</FormLabel>
        <Input
          value={form.fullName}
          onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
          placeholder="Your full name"
          fontSize="16px"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Age</FormLabel>
        <Input
          type="number"
          min={APPLICATION_AGE_MIN}
          max={APPLICATION_AGE_MAX}
          value={form.age}
          onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
          placeholder="18"
          fontSize="16px"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="you@maju.edu.pk or you@gmail.com"
          fontSize="16px"
        />
        <FormHelperText>Institutional or personal is fine.</FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Why MAJU CodeCraft?</FormLabel>
        <Textarea
          value={form.motivation}
          onChange={(event) => setForm((current) => ({ ...current, motivation: event.target.value }))}
          placeholder="What you want to build, learn, or run with us."
          fontSize="16px"
          maxLength={MOTIVATION_MAX_LENGTH}
        />
        <FormHelperText>
          {form.motivation.length}/{MOTIVATION_MAX_LENGTH}
        </FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Domain(s) of interest</FormLabel>
        <Wrap spacing={4}>
          {APPLICATION_DOMAINS.map((domain) => (
            <WrapItem key={domain}>
              <Checkbox
                isChecked={form.domains.includes(domain)}
                onChange={() => toggleDomain(domain)}
                colorScheme="orange"
              >
                {APPLICATION_DOMAIN_LABELS[domain]}
              </Checkbox>
            </WrapItem>
          ))}
        </Wrap>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Specialty / skillset</FormLabel>
        <Input
          value={form.specialty}
          onChange={(event) => setForm((current) => ({ ...current, specialty: event.target.value }))}
          placeholder="React, event ops, poster design…"
          fontSize="16px"
        />
      </FormControl>
      <Input
        value={form.website}
        onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        position="absolute"
        left="-9999px"
        h="0"
        w="0"
        opacity={0}
      />
      <Button
        bg="#FF6A00"
        color="white"
        _hover={{ bg: "#FF8A33" }}
        isDisabled={pending}
        onClick={async () => {
          setError("");
          setPending(true);
          const result = await submitMembershipApplication(form);
          setPending(false);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          setDone(true);
        }}
      >
        Submit application
      </Button>
    </VStack>
  );
}

apply.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join Code Craft | MAJU Society Recruitment</title>
  <meta name="description" content="Apply to join the leadership or departmental teams of MAJU Code Craft Society.">
  <link rel="stylesheet" href="assets/style.css">
  <link rel="icon" href="assets/FAVORicon.jpeg">
</head>
<body>
  <div class="top-banner">
    <span>✨ <strong>Recruitment Drive:</strong> Applications are open for Fall 2026 tenure!</span>
  </div>

  <div class="nav-wrapper">
    <header class="navbar">
      <a href="index.html" class="brand-logo">
        <span style="font-size: 1.5rem;">⚡</span>
        <span>MAJU Code Craft</span>
        <span class="brand-badge">Apply</span>
      </a>

      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="events.html" class="nav-link">Events</a>
        <a href="hierarchy.html" class="nav-link">Hierarchy</a>
        <a href="mentions.html" class="nav-link">Mentions</a>
        <a href="executive-community.html" class="nav-link">Alumni</a>
        <a href="apply.html" class="btn-apply">Apply</a>
      </nav>
    </header>
  </div>

  <main class="container section" style="max-width: 720px;">
    <div class="section-header">
      <h1 class="section-title">Apply to Join Code Craft</h1>
      <p class="section-subtitle">
        Join the society team that shapes developer culture at MAJU. Select your primary department interest below.
      </p>
    </div>

    <div class="preview-card" style="padding: 36px;">
      <form id="applyForm" onsubmit="handleApply(event)">
        <div class="form-group">
          <label for="appName">Full Name *</label>
          <input type="text" id="appName" class="form-control" placeholder="e.g. Asad Malik" required>
        </div>

        <div class="form-group">
          <label for="appEmail">University Email * (Must be @maju.edu.pk)</label>
          <input type="email" id="appEmail" class="form-control" placeholder="your_id@maju.edu.pk" pattern=".+@maju\.edu\.pk" title="Please enter your official university email (@maju.edu.pk)" required>
        </div>

        <div class="form-group">
          <label for="appRoll">Student Registration / Roll No *</label>
          <input type="text" id="appRoll" class="form-control" placeholder="e.g. BC210200123" required>
        </div>

        <div class="form-group">
          <label for="appDept">Target Department *</label>
          <select id="appDept" class="form-control" required>
            <option value="">Select a department...</option>
            <option value="event">Event Management & Technical Problems</option>
            <option value="operations">Operations & Campus Logistics</option>
            <option value="graphics">Graphics, UI/UX & Media Design</option>
            <option value="awareness">Public Awareness, Social Media & Marketing</option>
          </select>
        </div>

        <div class="form-group">
          <label for="appPortfolio">Portfolio / GitHub / LinkedIn Profile</label>
          <input type="url" id="appPortfolio" class="form-control" placeholder="https://github.com/yourhandle">
        </div>

        <div class="form-group">
          <label for="appMotivation">Why do you want to join MAJU Code Craft? *</label>
          <textarea id="appMotivation" class="form-control" rows="4" placeholder="Tell us about your interests, past projects, or why you'd like to work with this team..." required></textarea>
        </div>

        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 8px;">
          Submit Application
        </button>
      </form>

      <div id="applySuccess" style="display:none; text-align:center; padding: 24px 0;">
        <div style="font-size: 3.5rem; margin-bottom: 12px;">📬</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Application Submitted!</h3>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px;">
          Thank you for applying. The Chairperson and Department Leads will review your submission in the internal recruitment pipeline.
        </p>
        <a href="index.html" class="btn-primary" style="display:inline-block; max-width: 240px;">
          Return to Homepage
        </a>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <div>© 2026 MAJU Code Craft Society. Student Recruitment.</div>
        <div><a href="index.html" style="color: var(--accent);">← Back to Homepage</a></div>
      </div>
    </div>
  </footer>

  <script>
    function handleApply(e) {
      e.preventDefault();
      document.getElementById("applyForm").style.display = "none";
      document.getElementById("applySuccess").style.display = "block";
    }
  </script>
</body>
</html>

events.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Events Directory | MAJU Code Craft</title>
  <meta name="description" content="Browse upcoming hackathons, tech workshops, and speaker sessions at MAJU Code Craft society. No login required to view or register.">
  <link rel="stylesheet" href="assets/style.css">
  <link rel="icon" href="assets/FAVORicon.jpeg">
</head>
<body>

  <!-- Top Announcement Banner -->
  <div class="top-banner">
    <span>💡 <strong>Tip:</strong> Live listings update directly from Event Context. Registration is public for all university students.</span>
  </div>

  <!-- Sticky Navbar -->
  <div class="nav-wrapper">
    <header class="navbar" id="mainNavbar">
      <a href="index.html" class="brand-logo">
        <span style="font-size: 1.5rem;">⚡</span>
        <span>MAJU Code Craft</span>
        <span class="brand-badge">Events</span>
      </a>

      <nav class="nav-links">
        <a href="index.html#about" class="nav-link">About</a>
        <a href="index.html#highlights" class="nav-link">Highlights</a>
        <a href="events.html" class="nav-link active">Events</a>
        <a href="hierarchy.html" class="nav-link">Hierarchy</a>
        <a href="mentions.html" class="nav-link">Mentions</a>
        <a href="executive-community.html" class="nav-link">Alumni</a>
        <a href="apply.html" class="btn-apply">Apply</a>
      </nav>
    </header>
  </div>

  <main class="container section">
    <div class="section-header">
      <h1 class="section-title">
        Upcoming <span style="color: var(--accent); position: relative;">Events</span>
      </h1>
      <p class="section-subtitle">
        Live listings from Event Context. Registration appears when Operations opens sign-ups (at least 14 days before start).
      </p>
    </div>

    <!-- Filters Section -->
    <div style="margin-bottom: 36px;">
      <!-- When Filter -->
      <div class="filter-group" id="whenFilters">
        <button class="filter-btn active" data-filter="when" data-val="upcoming">Upcoming</button>
        <button class="filter-btn" data-filter="when" data-val="past">Past</button>
        <button class="filter-btn" data-filter="when" data-val="all">All Events</button>
      </div>

      <!-- Type Filter -->
      <div class="filter-group" id="typeFilters">
        <button class="filter-btn active" data-filter="type" data-val="all">All Types</button>
        <button class="filter-btn" data-filter="type" data-val="hackathon">Hackathon</button>
        <button class="filter-btn" data-filter="type" data-val="session">Session / Workshop</button>
      </div>

      <!-- Mode Filter -->
      <div class="filter-group" id="modeFilters">
        <button class="filter-btn active" data-filter="mode" data-val="all">Any Mode</button>
        <button class="filter-btn" data-filter="mode" data-val="offline">Offline (On Campus)</button>
        <button class="filter-btn" data-filter="mode" data-val="online">Online</button>
      </div>
    </div>

    <!-- Events Grid Container -->
    <div class="events-grid" id="eventsContainer">
      <!-- Injected by JavaScript -->
    </div>

    <div id="noEventsMsg" style="display: none; text-align: center; padding: 60px 20px; color: var(--text-muted);">
      <h3>No events found matching the selected filters.</h3>
      <p style="margin-top: 8px;">Try switching to 'All' or check back soon after promo goes live.</p>
    </div>
  </main>

  <!-- Registration Modal -->
  <div class="modal-overlay" id="regModal">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modalEventTitle">Event Registration</h3>
        <button onclick="closeModal()" style="font-size: 1.5rem; line-height: 1; color: #666;">&times;</button>
      </div>
      <div class="modal-body">
        <p id="modalEventMeta" style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px; font-weight: 600;"></p>
        <form id="regForm" onsubmit="submitRegistration(event)">
          <div class="form-group">
            <label for="regName">Full Name *</label>
            <input type="text" id="regName" class="form-control" placeholder="e.g. Sara Khan" required>
          </div>
          <div class="form-group">
            <label for="regEmail">Student Email * (@maju.edu.pk or personal)</label>
            <input type="email" id="regEmail" class="form-control" placeholder="sara@maju.edu.pk" required>
          </div>
          <div class="form-group" id="teamField">
            <label for="regTeam">Team Name (Optional for Hackathons)</label>
            <input type="text" id="regTeam" class="form-control" placeholder="e.g. Syntax Squad">
          </div>
          <div class="form-group">
            <label for="regYear">Current Academic Year</label>
            <select id="regYear" class="form-control">
              <option value="1">1st Year / Freshman</option>
              <option value="2">2nd Year / Sophomore</option>
              <option value="3">3rd Year / Junior</option>
              <option value="4">4th Year / Senior</option>
            </select>
          </div>
          <div class="form-group">
            <label for="regQuery">Any question or dietary/accessibility request?</label>
            <input type="text" id="regQuery" class="form-control" placeholder="Optional">
          </div>
          <button type="submit" class="btn-primary" style="width: 100%; margin-top: 8px;">Confirm Registration</button>
        </form>

        <div id="regSuccess" style="display: none; text-align: center; padding: 20px 0;">
          <div style="font-size: 3rem; margin-bottom: 12px;">🎉</div>
          <h4 style="font-size: 1.3rem; margin-bottom: 8px;">You're Registered!</h4>
          <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">
            A confirmation pass has been noted. We look forward to seeing you at MAJU Code Craft!
          </p>
          <button onclick="closeModal()" class="filter-btn" style="background: var(--accent); color: #FFF; width: 100%;">
            Done
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <div>© 2026 MAJU Code Craft Society. Public Events Directory.</div>
        <div><a href="index.html" style="color: var(--accent);">← Back to Homepage</a></div>
      </div>
    </div>
  </footer>

  <script>
    // Mock events dataset matching the project's event models & public statuses
    const mockEvents = [
      {
        id: "ev-1",
        title: "Code Incognito 2026: Campus Hackathon",
        type: "hackathon",
        mode: "offline",
        status: "registration_open",
        startsAt: "2026-10-10T09:00:00+05:00",
        venue: "MAJU Main Auditorium & Lab 4",
        description: "24-hour sprint to build AI-powered solutions, developer productivity tooling, and mobile apps. Cash prizes, food, and mentorship included.",
        coverBg: "#FFE4CC",
        typeBadge: "Hackathon · Offline",
        isPast: false
      },
      {
        id: "ev-2",
        title: "Building Full-Stack Next.js 15 Apps with TypeScript",
        type: "session",
        mode: "offline",
        status: "registration_open",
        startsAt: "2026-09-28T15:00:00+05:00",
        venue: "CS Lab 2, 3rd Floor",
        description: "Hands-on masterclass covering Server Components, Drizzle ORM, state management, and deploying to Vercel.",
        coverBg: "#E0F2FE",
        typeBadge: "Session · Offline",
        isPast: false
      },
      {
        id: "ev-3",
        title: "Decentralized Systems & Web3 Architecture Talk",
        type: "session",
        mode: "online",
        status: "promo_live",
        startsAt: "2026-10-24T18:00:00+05:00",
        venue: "Google Meet",
        description: "Exploring peer-to-peer protocols, consensus mechanisms, and how distributed computing operates at global scale.",
        coverBg: "#FEF3C7",
        typeBadge: "Session · Online",
        isPast: false
      },
      {
        id: "ev-4",
        title: "Summer Algorithm Sprint 2026",
        type: "hackathon",
        mode: "offline",
        status: "wrapped",
        startsAt: "2026-06-15T10:00:00+05:00",
        venue: "Auditorium",
        description: "Speed problem-solving contest testing graph algorithms, dynamic programming, and data structures.",
        coverBg: "#E5E7EB",
        typeBadge: "Hackathon · Offline",
        isPast: true
      },
      {
        id: "ev-5",
        title: "Git, GitHub & Open Source Contribution 101",
        type: "session",
        mode: "offline",
        status: "wrapped",
        startsAt: "2026-05-20T14:00:00+05:00",
        venue: "CS Lab 1",
        description: "Introductory workshop on version control, pull requests, branching strategies, and open-source etiquette.",
        coverBg: "#E5E7EB",
        typeBadge: "Session · Offline",
        isPast: true
      }
    ];

    let currentFilters = {
      when: "upcoming",
      type: "all",
      mode: "all"
    };

    function renderEvents() {
      const container = document.getElementById("eventsContainer");
      const noMsg = document.getElementById("noEventsMsg");
      container.innerHTML = "";

      const filtered = mockEvents.filter(ev => {
        if (currentFilters.when === "upcoming" && ev.isPast) return false;
        if (currentFilters.when === "past" && !ev.isPast) return false;
        if (currentFilters.type !== "all" && ev.type !== currentFilters.type) return false;
        if (currentFilters.mode !== "all" && ev.mode !== currentFilters.mode) return false;
        return true;
      });

      if (filtered.length === 0) {
        noMsg.style.display = "block";
        return;
      }
      noMsg.style.display = "none";

      filtered.forEach(ev => {
        const dateStr = new Intl.DateTimeFormat("en-PK", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Karachi"
        }).format(new Date(ev.startsAt));

        let statusHtml = "";
        let actionBtn = "";

        if (ev.status === "registration_open") {
          statusHtml = `<span class="event-status-pill status-open">Registration Open</span>`;
          actionBtn = `<button class="btn-register" onclick="openModal('${ev.id}')">Register for Event</button>`;
        } else if (ev.status === "promo_live") {
          statusHtml = `<span class="event-status-pill status-promo">Promo Live</span>`;
          actionBtn = `<div style="font-size: 13px; color: #888; text-align: center; padding: 8px;">Registration opening soon</div>`;
        } else {
          statusHtml = `<span class="event-status-pill status-wrapped">Wrapped</span>`;
          actionBtn = `<div style="font-size: 13px; color: #888; text-align: center; padding: 8px;">Event concluded</div>`;
        }

        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
          <div class="event-image" style="background: ${ev.coverBg};">
            ${ev.type.toUpperCase()} · ${ev.mode.toUpperCase()}
          </div>
          <div class="event-body">
            <div class="event-badge-row">
              <span class="event-type-badge">${ev.typeBadge}</span>
              ${statusHtml}
            </div>
            <h3 class="event-title">${ev.title}</h3>
            <p class="event-meta">🗓️ ${dateStr} · 📍 ${ev.venue}</p>
            <p class="event-desc">${ev.description}</p>
            ${actionBtn}
          </div>
        `;
        container.appendChild(card);
      });
    }

    // Attach filter button listeners
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const filterType = btn.getAttribute("data-filter");
        const val = btn.getAttribute("data-val");

        // Clear active in same group
        btn.parentElement.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilters[filterType] = val;
        renderEvents();
      });
    });

    // Registration Modal
    let activeEventId = null;
    function openModal(id) {
      activeEventId = id;
      const ev = mockEvents.find(e => e.id === id);
      if (!ev) return;

      document.getElementById("modalEventTitle").textContent = ev.title;
      document.getElementById("modalEventMeta").textContent = `📍 ${ev.venue} | Mode: ${ev.mode.toUpperCase()}`;
      document.getElementById("teamField").style.display = ev.type === "hackathon" ? "block" : "none";
      document.getElementById("regForm").reset();
      document.getElementById("regForm").style.display = "block";
      document.getElementById("regSuccess").style.display = "none";
      document.getElementById("regModal").classList.add("active");
    }

    function closeModal() {
      document.getElementById("regModal").classList.remove("active");
    }

    function submitRegistration(e) {
      e.preventDefault();
      document.getElementById("regForm").style.display = "none";
      document.getElementById("regSuccess").style.display = "block";
    }

    // Initial render
    renderEvents();
  </script>
</body>
</html>


executive-community.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Executive Community & Alumni | MAJU Code Craft</title>
  <link rel="stylesheet" href="assets/style.css">
  <link rel="icon" href="assets/FAVORicon.jpeg">
</head>
<body>
  <div class="nav-wrapper">
    <header class="navbar">
      <a href="index.html" class="brand-logo">
        <span style="font-size: 1.5rem;">⚡</span>
        <span>MAJU Code Craft</span>
        <span class="brand-badge">Alumni</span>
      </a>
      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="events.html" class="nav-link">Events</a>
        <a href="hierarchy.html" class="nav-link">Hierarchy</a>
        <a href="mentions.html" class="nav-link">Mentions</a>
        <a href="executive-community.html" class="nav-link active">Alumni</a>
        <a href="apply.html" class="btn-apply">Apply</a>
      </nav>
    </header>
  </div>

  <main class="container section">
    <div class="section-header">
      <h1 class="section-title">Executive Alumni Community</h1>
      <p class="section-subtitle">
        Our alumni network connects past Code Craft leaders now driving engineering at top technology companies worldwide.
      </p>
    </div>

    <div class="preview-grid">
      <div class="preview-card">
        <div class="card-tag">CLASS OF 2024 · PAST CHAIRPERSON</div>
        <h3>Syed Taha Ali</h3>
        <p style="font-size: 13px; color: var(--accent); font-weight: 700; margin-bottom: 8px;">Software Engineer @ Careem</p>
        <p>Mentors campus hackathon participants and regularly conducts mock coding interviews for final year students.</p>
      </div>

      <div class="preview-card">
        <div class="card-tag">CLASS OF 2023 · PAST EVENT LEAD</div>
        <h3>Marium Jawed</h3>
        <p style="font-size: 13px; color: var(--accent); font-weight: 700; margin-bottom: 8px;">Cloud Solutions Architect @ 10Pearls</p>
        <p>Guest speaker on DevOps, Kubernetes deployments, and cloud native architectures.</p>
      </div>

      <div class="preview-card">
        <div class="card-tag">CLASS OF 2022 · PAST GRAPHICS HEAD</div>
        <h3>Rehan Sheikh</h3>
        <p style="font-size: 13px; color: var(--accent); font-weight: 700; margin-bottom: 8px;">Product Designer @ FinTech Lab</p>
        <p>Curator of the MAJU UI/UX Design sprint curriculum and design critique workshops.</p>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <div>© 2026 MAJU Code Craft Society. Executive Community & Alumni.</div>
        <div><a href="index.html" style="color: var(--accent);">← Back to Homepage</a></div>
      </div>
    </div>
  </footer>
</body>
</html>


hierarchy.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leadership & Hierarchy | MAJU Code Craft</title>
  <meta name="description" content="Meet the executive council and departmental leads powering MAJU Code Craft Society.">
  <link rel="stylesheet" href="assets/style.css">
  <link rel="icon" href="assets/FAVORicon.jpeg">
</head>
<body>
  <div class="top-banner">
    <span>🏛️ <strong>Governance:</strong> MAJU Code Craft executive leadership structure & departmental council.</span>
  </div>

  <div class="nav-wrapper">
    <header class="navbar">
      <a href="index.html" class="brand-logo">
        <span style="font-size: 1.5rem;">⚡</span>
        <span>MAJU Code Craft</span>
        <span class="brand-badge">Hierarchy</span>
      </a>

      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="events.html" class="nav-link">Events</a>
        <a href="hierarchy.html" class="nav-link active">Hierarchy</a>
        <a href="mentions.html" class="nav-link">Mentions</a>
        <a href="executive-community.html" class="nav-link">Alumni</a>
        <a href="apply.html" class="btn-apply">Apply</a>
      </nav>
    </header>
  </div>

  <main class="container section">
    <div class="section-header">
      <h1 class="section-title">Society Hierarchy</h1>
      <p class="section-subtitle">
        The team orchestrating tech conferences, sprint hacks, and workshops at Muhammad Ali Jinnah University.
      </p>
    </div>

    <!-- Tier 1: Chairperson -->
    <div style="margin-bottom: 40px; text-align: center;">
      <div class="card-tag" style="margin-bottom: 12px;">EXECUTIVE HEAD</div>
      <div class="tree-node">
        <div class="tree-avatar">👑</div>
        <h3 style="font-size: 1.25rem; font-weight: 800;">Farhan Qazi</h3>
        <p style="color: var(--accent); font-weight: 700; font-size: 14px;">Chairperson</p>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">Strategic Direction & University Liaison</p>
      </div>
    </div>

    <!-- Tier 2: Vice Chair & Secretary -->
    <div style="margin-bottom: 48px;">
      <div class="card-tag" style="text-align: center; margin-bottom: 16px;">EXECUTIVE BOARD</div>
      <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap;">
        <div class="tree-node">
          <div class="tree-avatar" style="background: #E0F2FE; color: #0284C7;">🛡️</div>
          <h3 style="font-size: 1.15rem; font-weight: 800;">Areeba Tariq</h3>
          <p style="color: #0284C7; font-weight: 700; font-size: 14px;">Vice Chairperson</p>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">Operations & Cross-Team Synergy</p>
        </div>
        <div class="tree-node">
          <div class="tree-avatar" style="background: #FEF3C7; color: #B45309;">📜</div>
          <h3 style="font-size: 1.15rem; font-weight: 800;">Hamza Siddiqui</h3>
          <p style="color: #B45309; font-weight: 700; font-size: 14px;">General Secretary</p>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">Governance, Records & Rules</p>
        </div>
      </div>
    </div>

    <!-- Tier 3: Departments -->
    <div>
      <div class="card-tag" style="text-align: center; margin-bottom: 16px;">DEPARTMENTAL LEADS</div>
      <div class="preview-grid">
        <div class="preview-card">
          <div class="card-tag">⚙️ OPERATIONS</div>
          <h3>Operations & Logistics</h3>
          <p style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Lead: Daniyal Ahmed</p>
          <p>Manages venue bookings, lab allocations, permissions, hardware equipment, and event day execution.</p>
        </div>

        <div class="preview-card">
          <div class="card-tag">📢 AWARENESS</div>
          <h3>Awareness & Marketing</h3>
          <p style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Lead: Fatima Noor</p>
          <p>Public promotions, social media campaigns, campus outreach, student engagement, and announcement bulletins.</p>
        </div>

        <div class="preview-card">
          <div class="card-tag">🎨 GRAPHICS</div>
          <h3>Graphics & Creative Media</h3>
          <p style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Lead: Zaid Sheikh</p>
          <p>Keynotes, event branding, posters, merchandise design, digital badges, and promotional motion design.</p>
        </div>

        <div class="preview-card">
          <div class="card-tag">💻 EVENT CONTEXT</div>
          <h3>Technical & Event Master</h3>
          <p style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">Lead: Bilal Rehman</p>
          <p>Problem statement creation, hackathon judging criteria, test suites, and technical workshop mentorship.</p>
        </div>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <div>© 2026 MAJU Code Craft Society. Leadership & Hierarchy.</div>
        <div><a href="index.html" style="color: var(--accent);">← Back to Homepage</a></div>
      </div>
    </div>
  </footer>
</body>
</html>

index.html 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MAJU Code Craft | Campus Computing Society</title>
  <meta name="description" content="Maju Code Craft is the campus society for students who like shipping things. Hackathons, workshops, and weekend sessions — no login required.">
  <link rel="stylesheet" href="assets/style.css">
  <link rel="icon" href="assets/FAVORicon.jpeg">
</head>
<body>

  <!-- Top Announcement Banner -->
  <div class="top-banner">
    <span>🚀 <strong>Next Flagship:</strong> Code Incognito 2026 registration is now live!</span>
    <a href="events.html">View Details →</a>
  </div>

  <!-- Sticky Navbar -->
  <div class="nav-wrapper">
    <header class="navbar" id="mainNavbar">
      <a href="index.html" class="brand-logo">
        <span style="font-size: 1.5rem;">⚡</span>
        <span>MAJU Code Craft</span>
        <span class="brand-badge">Public Portal</span>
      </a>

      <nav class="nav-links">
        <a href="#about" class="nav-link">About</a>
        <a href="#highlights" class="nav-link">Highlights</a>
        <a href="#what-we-run" class="nav-link">What We Run</a>
        <a href="events.html" class="nav-link">Events</a>
        <a href="hierarchy.html" class="nav-link">Hierarchy</a>
        <a href="mentions.html" class="nav-link">Mentions</a>
        <a href="executive-community.html" class="nav-link">Alumni</a>
        <a href="#contact" class="nav-link">Contact</a>
        <a href="apply.html" class="btn-apply">Apply</a>
      </nav>
    </header>
  </div>

  <!-- Main Container -->
  <main class="container">
    <!-- Hero Section -->
    <section class="hero-box">
      <div class="hero-society-pill">MUHAMMAD ALI JINNAH UNIVERSITY</div>
      <h1 class="hero-title">
        Build, compete,<br>
        hang out at <span class="highlight">MCC</span>
      </h1>
      <p class="hero-description">
        Maju Code Craft is the campus society for people who like shipping things. Hackathons, workshops, and weekend sessions — show up and jump in. No login required.
      </p>

      <!-- Scrambler Component -->
      <div class="scramble-card" id="scrambleDisplay" title="Click to view all events">
        Hackathon
      </div>

      <div class="hero-actions">
        <a href="events.html" class="btn-primary">See Events</a>
        <a href="apply.html" class="hero-link">Apply to join the society →</a>
      </div>

      <!-- Feature Preview Panels -->
      <div class="preview-grid" id="highlights">
        <div class="preview-card">
          <div class="card-tag">⚡ COMPETITIVE</div>
          <h3>Flagship Hackathons</h3>
          <p>24-to-48 hour sprints solving real problems with faculty and industry mentors on campus.</p>
        </div>
        <div class="preview-card">
          <div class="card-tag">🛠️ HANDS-ON</div>
          <h3>Technical Workshops</h3>
          <p>Full-stack web, AI toolkits, systems programming, and cloud architecture deep-dives.</p>
        </div>
        <div class="preview-card">
          <div class="card-tag">🤝 NETWORKING</div>
          <h3>Alumni & Industry Mixers</h3>
          <p>Connect directly with MAJU engineering alumni working across top global tech firms.</p>
        </div>
      </div>
    </section>
  </main>

  <!-- About Section -->
  <section class="section" id="about">
    <div class="container">
      <div class="section-header">
        <div class="card-tag" style="text-align: center;">ABOUT THE SOCIETY</div>
        <h2 class="section-title">Built by students, for builders.</h2>
        <p class="section-subtitle">
          Code Craft bridges the gap between academic theory and high-impact software engineering. Everything we organize is open to all university students.
        </p>
      </div>

      <div class="preview-grid">
        <div class="preview-card">
          <div style="font-size: 2rem; margin-bottom: 12px;">🎯</div>
          <h3>Open Access</h3>
          <p>Every event listing, speaker deck, and registration form is public. No gated accounts for university attendees.</p>
        </div>
        <div class="preview-card">
          <div style="font-size: 2rem; margin-bottom: 12px;">🏆</div>
          <h3>Practical Sprints</h3>
          <p>Focus on working code, Git commits, live demos, and deployable prototypes over slide decks.</p>
        </div>
        <div class="preview-card">
          <div style="font-size: 2rem; margin-bottom: 12px;">🚀</div>
          <h3>Leadership Track</h3>
          <p>Members manage real logistics, creative design, public awareness, and budget allocation.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- What We Run Section -->
  <section class="section bg-warm" id="what-we-run">
    <div class="container">
      <div class="section-header">
        <div class="card-tag" style="text-align: center;">OUR PROGRAMS</div>
        <h2 class="section-title">What We Run Throughout the Year</h2>
        <p class="section-subtitle">
          From fast-paced hack sprints to technical bootcamps, here is how you can participate:
        </p>
      </div>

      <div class="events-grid">
        <div class="event-card">
          <div class="event-image" style="background: #FFE4CC; color: #D95A00;">
            HACKATHONS
          </div>
          <div class="event-body">
            <div class="event-badge-row">
              <span class="event-type-badge">Competitive · Offline</span>
              <span class="event-status-pill status-open">Active Season</span>
            </div>
            <h3 class="event-title">Code Incognito</h3>
            <p class="event-meta">📍 MAJU Main Campus Auditorium</p>
            <p class="event-desc">Our flagship multi-track coding battle where student teams build production-grade web apps, games, and tools under a countdown timer.</p>
            <a href="events.html" class="btn-register">Browse Schedule</a>
          </div>
        </div>

        <div class="event-card">
          <div class="event-image" style="background: #E0F2FE; color: #0284C7;">
            WORKSHOPS
          </div>
          <div class="event-body">
            <div class="event-badge-row">
              <span class="event-type-badge">Hands-on · Hybrid</span>
              <span class="event-status-pill status-open">Bi-Weekly</span>
            </div>
            <h3 class="event-title">Craft Lab Sessions</h3>
            <p class="event-meta">📍 CS Computer Labs & Discord</p>
            <p class="event-desc">Interactive 2-hour Saturday bootcamps on Next.js, Rust fundamentals, PostgreSQL databases, Docker containerization, and modern Git flows.</p>
            <a href="events.html" class="btn-register">Explore Topics</a>
          </div>
        </div>

        <div class="event-card">
          <div class="event-image" style="background: #DCFCE7; color: #15803D;">
            TALKS
          </div>
          <div class="event-body">
            <div class="event-badge-row">
              <span class="event-type-badge">Guest Speaker · Online</span>
              <span class="event-status-pill status-promo">Monthly</span>
            </div>
            <h3 class="event-title">Industry Radar</h3>
            <p class="event-meta">📍 Google Meet / YouTube Live</p>
            <p class="event-desc">Senior engineers and tech founders dissect how high-scale products are built, how to pass technical interviews, and how to contribute to open-source.</p>
            <a href="events.html" class="btn-register">View Archive</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">500+</div>
          <div class="stat-label">Event Attendees</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">24+</div>
          <div class="stat-label">Workshops & Sprints</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">12+</div>
          <div class="stat-label">Industry Partners</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">100%</div>
          <div class="stat-label">Student Led</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact & Join Section -->
  <section class="section bg-warm" id="contact">
    <div class="container" style="max-width: 700px;">
      <div class="preview-card" style="padding: 36px;">
        <div class="card-tag" style="text-align: center;">GET IN TOUCH</div>
        <h2 class="section-title" style="text-align: center; margin-bottom: 8px;">Have questions?</h2>
        <p class="section-subtitle" style="text-align: center; margin-bottom: 28px;">
          Reach out to the Code Craft executive council or enquire about upcoming event partnerships.
        </p>

        <form id="contactForm" onsubmit="handleContact(event)">
          <div class="form-group">
            <label for="cName">Your Name</label>
            <input type="text" id="cName" class="form-control" placeholder="e.g. Ali Ahmed" required>
          </div>
          <div class="form-group">
            <label for="cEmail">University Email</label>
            <input type="email" id="cEmail" class="form-control" placeholder="student@maju.edu.pk" required>
          </div>
          <div class="form-group">
            <label for="cMessage">Message or Query</label>
            <textarea id="cMessage" class="form-control" rows="4" placeholder="How can we help you?" required></textarea>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%;">Send Message</button>
        </form>
        <div id="contactSuccess" style="display:none; margin-top: 16px; padding: 12px; background: #DCFCE7; border: 1.5px solid #16A34A; border-radius: 8px; color: #166534; font-weight: 600; text-align: center;">
          ✅ Thank you! Your message has been received. A council member will reply shortly.
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h4>⚡ MAJU Code Craft</h4>
          <p>The student-run computing and software development society at Muhammad Ali Jinnah University, Karachi.</p>
          <p style="margin-top: 12px; font-size: 13px;">Free and open to all university students.</p>
        </div>
        <div class="footer-col">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="events.html">Public Events</a></li>
            <li><a href="hierarchy.html">Leadership Tree</a></li>
            <li><a href="apply.html">Join Code Craft</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Community</h5>
          <ul>
            <li><a href="mentions.html">Honourable Mentions</a></li>
            <li><a href="executive-community.html">Alumni Network</a></li>
            <li><a href="#contact">Contact Council</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>Internal Portal</h5>
          <p style="font-size: 13px; margin-bottom: 12px;">For executives and department teams to plan, assign, and track operations:</p>
          <a href="../dynamic_doc/index.html" style="display: inline-block; background: #FF6A00; color: #FFF; padding: 6px 14px; border-radius: 6px; font-weight: 700; font-size: 12px;">
            Open Internal System →
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <div>© 2026 MAJU Code Craft Society. All rights reserved.</div>
        <div>Offline Static Preview — No Server Required</div>
      </div>
    </div>
  </footer>

  <!-- Scrambler & Navigation Script -->
  <script>
    // Scrambler effect matching original hero.tsx
    const eventTypes = ["Hackathon", "Session", "Workshop", "Talk", "Meetup", "Bootcamp"];
    const scrambleChars = "!<>-_/[]{}—=+*^?#________";
    let typeIndex = 0;
    const scrambleEl = document.getElementById("scrambleDisplay");

    function scrambleText(text) {
      return text.split("").map(c => c === " " ? " " : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]).join("");
    }

    function runScramble(targetWord) {
      let frame = 0;
      const totalFrames = 15;
      const interval = setInterval(() => {
        if (frame < totalFrames) {
          scrambleEl.textContent = scrambleText(targetWord);
          frame++;
        } else {
          scrambleEl.textContent = targetWord;
          clearInterval(interval);
        }
      }, 35);
    }

    setInterval(() => {
      typeIndex = (typeIndex + 1) % eventTypes.length;
      runScramble(eventTypes[typeIndex]);
    }, 2500);

    scrambleEl.addEventListener("click", () => {
      window.location.href = "events.html";
    });

    // Navbar scroll shadow
    window.addEventListener("scroll", () => {
      const nav = document.getElementById("mainNavbar");
      if (window.scrollY > 20) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    });

    // Contact form feedback
    function handleContact(e) {
      e.preventDefault();
      document.getElementById("contactForm").reset();
      document.getElementById("contactSuccess").style.display = "block";
    }
  </script>
</body>
</html>


mentions.html 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Honourable Mentions | MAJU Code Craft</title>
  <link rel="stylesheet" href="assets/style.css">
  <link rel="icon" href="assets/FAVORicon.jpeg">
</head>
<body>
  <div class="nav-wrapper">
    <header class="navbar">
      <a href="index.html" class="brand-logo">
        <span style="font-size: 1.5rem;">⚡</span>
        <span>MAJU Code Craft</span>
        <span class="brand-badge">Mentions</span>
      </a>
      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="events.html" class="nav-link">Events</a>
        <a href="hierarchy.html" class="nav-link">Hierarchy</a>
        <a href="mentions.html" class="nav-link active">Mentions</a>
        <a href="executive-community.html" class="nav-link">Alumni</a>
        <a href="apply.html" class="btn-apply">Apply</a>
      </nav>
    </header>
  </div>

  <main class="container section">
    <div class="section-header">
      <h1 class="section-title">Honourable Mentions</h1>
      <p class="section-subtitle">
        Celebrating society members and student teams who have brought accolades to MAJU at national hackathons and contests.
      </p>
    </div>

    <div class="preview-grid">
      <div class="preview-card">
        <div class="card-tag">🏆 1ST PLACE · NATIONAL HACKATHON 2025</div>
        <h3>Team NeuroCraft</h3>
        <p style="font-size: 13px; color: var(--accent); font-weight: 700; margin-bottom: 8px;">Project: AI Stroke Detection Assistant</p>
        <p>Built a real-time computer vision and CT analysis model deployed on edge hardware in under 36 hours.</p>
      </div>

      <div class="preview-card">
        <div class="card-tag">🥈 RUNNER UP · SPEED PROGRAMMING CONTEST</div>
        <h3>Muhammad Zohaib & Saad Farooq</h3>
        <p style="font-size: 13px; color: var(--accent); font-weight: 700; margin-bottom: 8px;">ICPC Regional Qualifier</p>
        <p>Solved 8 algorithmic challenges in competitive C++ during the collegiate regional championship.</p>
      </div>

      <div class="preview-card">
        <div class="card-tag">🌟 BEST OPEN SOURCE CONTRIBUTION</div>
        <h3>Ayesha Siddiqua</h3>
        <p style="font-size: 13px; color: var(--accent); font-weight: 700; margin-bottom: 8px;">Contributor to Rust Ecosystem</p>
        <p>Authored async networking patches merged into upstream web frameworks, representing MAJU on global repositories.</p>
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <div>© 2026 MAJU Code Craft Society. Honourable Mentions.</div>
        <div><a href="index.html" style="color: var(--accent);">← Back to Homepage</a></div>
      </div>
    </div>
  </footer>
</body>
</html>
