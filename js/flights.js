
/* AEROEASE FLIGHT SYSTEM — DEMO DATA */

const flights = [
  {
    id: "AE101",
    airline: "IndiGo",
    code: "6E 214",
    from: "Mumbai",
    to: "Delhi",
    depart: "06:20",
    arrive: "08:35",
    duration: "2h 15m",
    price: 4899
  },
  {
    id: "AE102",
    airline: "Air India",
    code: "AI 624",
    from: "Mumbai",
    to: "Delhi",
    depart: "10:10",
    arrive: "12:25",
    duration: "2h 15m",
    price: 6299
  },
  {
    id: "AE103",
    airline: "Akasa Air",
    code: "QP 1422",
    from: "Mumbai",
    to: "Delhi",
    depart: "14:35",
    arrive: "16:50",
    duration: "2h 15m",
    price: 5399
  },
  {
    id: "AE104",
    airline: "IndiGo",
    code: "6E 802",
    from: "Mumbai",
    to: "Goa",
    depart: "08:10",
    arrive: "09:25",
    duration: "1h 15m",
    price: 4399
  },
  {
    id: "AE105",
    airline: "Air India",
    code: "AI 691",
    from: "Delhi",
    to: "Goa",
    depart: "11:30",
    arrive: "14:05",
    duration: "2h 35m",
    price: 5799
  },
  {
    id: "AE106",
    airline: "Air India Express",
    code: "IX 1102",
    from: "Mumbai",
    to: "Bengaluru",
    depart: "09:00",
    arrive: "10:50",
    duration: "1h 50m",
    price: 3999
  }
];

function money(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function tripTab(button) {
  document.querySelectorAll(".tabs button").forEach(tab => {
    tab.classList.remove("on");
  });

  button.classList.add("on");
  tripType = button.textContent.trim();

  if (tripType !== "One Way") {
    notify(
      "This demo searches one-way flights only. " +
      "Round-trip and multi-city search need API integration."
    );
  }
}

function searchFlights() {
  const from = $("from").value;
  const to = $("to").value;

  if (from === to) {
    notify("Choose different departure and destination cities.");
    return;
  }

  if (!$("search-consent").checked) {
    notify("Please accept the demo terms to continue.");
    return;
  }

  $("flight-from").value = from;
  $("flight-to").value = to;
  $("flight-date").value = $("departure").value;

  go("flights");
}

function renderFlights() {
  const from = $("flight-from").value;
  const to = $("flight-to").value;
  const date = $("flight-date").value;

  const results = $("flight-results");

  if (!date || date < getLocalDate(1)) {
    results.innerHTML = `
      <div class="glass empty">
        Please select a valid future departure date.
      </div>
    `;
    return;
  }

  const matched = flights.filter(flight =>
    flight.from === from && flight.to === to
  );

  if (!matched.length) {
    results.innerHTML = `
      <div class="glass empty">
        <h3>No sample flights for this route</h3>
        <p>Try Mumbai → Delhi, Mumbai → Goa,
           Mumbai → Bengaluru or Delhi → Goa.</p>
      </div>
    `;
    return;
  }

  results.innerHTML = matched.map(flight => `
    <div class="glass flight-result">

      <div class="airline">
        <span class="airline-logo">✈</span>
        <div>
          <strong>${flight.airline}</strong>
          <small>${flight.code}</small>
        </div>
      </div>

      <div class="times">
        <div>
          <strong>${flight.depart}</strong>
          <small>${flight.from}</small>
        </div>

        <div class="duration">
          ${flight.duration}
          <div class="route-line"></div>
          Non-stop
        </div>

        <div>
          <strong>${flight.arrive}</strong>
          <small>${flight.to}</small>
        </div>
      </div>

      <div class="price">
        <small>From / person</small>
        <strong>${money(flight.price)}</strong>
        <button class="btn primary"
                onclick="openBooking('${flight.id}')">
          Select →
        </button>
      </div>

    </div>
  `).join("");
}

function openBooking(flightId) {
  selectedFlight = flights.find(f => f.id === flightId);

  if (!selectedFlight) return;

  const f = selectedFlight;

  $("modal-details").innerHTML = `
    <p class="muted">${f.airline} · ${f.code}</p>
    <h3>${f.from} ✈ ${f.to}</h3>
    <p class="muted">
      ${$("flight-date").value} ·
      ${f.depart} – ${f.arrive}
    </p>
    <h2>${money(f.price)}</h2>
  `;

  $("modal").classList.add("open");
}

function closeModal() {
  $("modal").classList.remove("open");
}

function confirmBooking() {
  if (!selectedFlight) return;

  if (!user) {
    closeModal();
    notify("Create a demo profile before saving your trip.");
    go("login");
    return;
  }

  const booking = {
    id: "AE-" + Date.now().toString().slice(-7),
    flight: { ...selectedFlight },
    date: $("flight-date").value,
    passenger: user.name,
    email: user.email
  };

  bookings.unshift(booking);
  put("ae_bookings", bookings);

  selectedFlight = null;
  closeModal();
  go("bookings");

  notify("Demo journey saved successfully!");
}

function renderBookings() {
  const list = $("booking-list");

  // Show only bookings belonging to the current demo profile.
  const ownBookings = user
    ? bookings.filter(b => b.email === user.email)
    : [];

  if (!ownBookings.length) {
    list.innerHTML = `
      <div class="glass empty">
        <h3>No Trips Yet ✈</h3>
        <p>Explore flights and save your first demo journey.</p>
        <button class="btn primary" onclick="go('flights')">
          Explore Flights →
        </button>
      </div>
    `;
    return;
  }

  list.replaceChildren();

  ownBookings.forEach(booking => {
    const card = document.createElement("div");
    card.className = "panel glass";

    const heading = document.createElement("h2");
    heading.textContent =
      `${booking.flight.from} ✈ ${booking.flight.to}`;

    const details = document.createElement("p");
    details.className = "muted";
    details.textContent =
      `${booking.flight.airline} · ${booking.flight.code} · ${booking.date}`;

    const price = document.createElement("strong");
    price.textContent = money(booking.flight.price);

    const note = document.createElement("p");
    note.className = "notice";
    note.textContent =
      `${booking.passenger} · Demo booking ${booking.id} — not a valid ticket.`;

    card.append(heading, details, price, note);
    list.appendChild(card);
  });
}
