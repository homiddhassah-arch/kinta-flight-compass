import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BaggageClaim,
  CalendarPlus,
  Check,
  Clock3,
  Copy,
  DoorOpen,
  Globe2,
  Loader2,
  Luggage,
  MapPin,
  Plane,
  Printer,
  Search,
  ShieldCheck,
  Ticket,
  Usb,
  Utensils,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

import americanAirlinesLogo from "@/assets/american-airlines-logo.png";
import tripComLogo from "@/assets/trip-com-logo.png";
import tripIcon from "@/assets/trip-icon.png";
import flightHero from "@/assets/flight-lookup-hero.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { isValidDemoTrackingNumber } from "@/lib/flight-tracking";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flight tracker | Trip.com" },
      {
        name: "description",
        content: "Look up your Trip.com flight itinerary with a booking tracking number.",
      },
      { property: "og:title", content: "Flight tracker | Trip.com" },
      {
        property: "og:description",
        content: "Find your flight itinerary and review the details for your trip.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FlightTrackerPage,
});

const LOOKUP_STEPS = [
  "Checking your tracking number",
  "Finding your booking",
  "Preparing your itinerary",
];

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function FlightTrackerPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const busy = loadingMessage !== null;

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 700);
    return () => clearTimeout(timer);
  }, []);

  async function submitTrackingNumber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");

    if (!trackingNumber.trim()) {
      setError("Please enter your tracking number.");
      return;
    }

    for (const step of LOOKUP_STEPS) {
      setLoadingMessage(step);
      await wait(550);
    }
    setLoadingMessage(null);

    if (!isValidDemoTrackingNumber(trackingNumber)) {
      setHasSearched(false);
      setError("We couldn't find that tracking number. Please check it and try again.");
      return;
    }

    setHasSearched(true);
    window.scrollTo({ top: 0 });
  }

  async function returnToSearch() {
    if (busy) return;
    setLoadingMessage("Returning to flight lookup");
    await wait(500);
    setLoadingMessage(null);
    setHasSearched(false);
    setError("");
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="min-h-screen bg-background text-foreground" aria-busy={busy || isBooting}>
      <Toaster position="top-center" richColors />
      {isBooting ? <FlightLoader message="Loading" variant="splash" /> : null}
      {loadingMessage ? <FlightLoader message={loadingMessage} /> : null}
      <header className="site-header">
        <a className="brand-link" href="https://www.trip.com/" aria-label="Trip.com home">
          <img className="brand-logo" src={tripComLogo} alt="Trip.com" width={150} height={37} />
        </a>
        <span className="header-promise">
          <ShieldCheck aria-hidden="true" size={16} />
          Your trip, all in one place
        </span>
      </header>

      {!hasSearched ? (
        <>
          <section className="flight-hero" aria-labelledby="hero-title">
            <img
              className="flight-hero__photo"
              src={flightHero}
              alt="Airplane waiting at a sunny airport gate"
              width={1536}
              height={1024}
              fetchPriority="high"
            />
            <div className="flight-hero__content">
              <span className="eyebrow">
                <Plane aria-hidden="true" size={15} /> TRAVEL, MADE EASY
              </span>
              <h1 id="hero-title">A little closer to takeoff.</h1>
              <p>Your flight details, right when you need them.</p>
            </div>
          </section>

          <section className="lookup-section" aria-labelledby="lookup-title">
            <div className="lookup-intro">
              <div>
                <p className="section-kicker">FLIGHT DETAILS</p>
                <h2 id="lookup-title">Find your trip</h2>
                <p className="lookup-description">
                  Enter your tracking number to view your itinerary.
                </p>
              </div>
              <span className="secure-note">
                <ShieldCheck aria-hidden="true" size={16} /> Secure lookup
              </span>
            </div>

            <form className="lookup-form" onSubmit={submitTrackingNumber} noValidate>
              <label className="tracking-field" htmlFor="tracking-number">
                <span>Tracking number</span>
                <span className="tracking-input-wrap">
                  <Search aria-hidden="true" className="tracking-search-icon" size={19} />
                  <Input
                    id="tracking-number"
                    name="tracking-number"
                    autoComplete="off"
                    spellCheck={false}
                    value={trackingNumber}
                    disabled={busy}
                    onChange={(event) => {
                      setTrackingNumber(event.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Enter your tracking number"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "tracking-error" : undefined}
                    className="tracking-input"
                  />
                </span>
              </label>
              <Button className="lookup-button" type="submit" size="lg" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" size={17} /> Searching…
                  </>
                ) : (
                  <>
                    Find my flight <ArrowRight aria-hidden="true" size={17} />
                  </>
                )}
              </Button>
            </form>
            {error ? (
              <p className="tracking-error" id="tracking-error" role="alert">
                {error}
              </p>
            ) : null}
          </section>

          <section className="perks-row" aria-label="Why use flight lookup">
            <div className="perk">
              <span className="perk-icon">
                <Ticket aria-hidden="true" size={18} />
              </span>
              <p>
                <strong>All your details</strong>
                <span>Route, times and cabin in one view.</span>
              </p>
            </div>
            <div className="perk">
              <span className="perk-icon">
                <ShieldCheck aria-hidden="true" size={18} />
              </span>
              <p>
                <strong>Private lookup</strong>
                <span>Only your tracking number is needed.</span>
              </p>
            </div>
            <div className="perk">
              <span className="perk-icon">
                <Globe2 aria-hidden="true" size={18} />
              </span>
              <p>
                <strong>Travel ready</strong>
                <span>Helpful tips before you head out.</span>
              </p>
            </div>
          </section>

          <footer className="page-footer">
            <p>Questions about your booking? Get in touch with your travel provider.</p>
            <span>Plan less. Travel more.</span>
          </footer>
        </>
      ) : (
        <FlightDetails onBack={returnToSearch} busy={busy} />
      )}
    </main>
  );
}

function FlightLoader({
  message,
  variant = "overlay",
}: {
  message: string;
  variant?: "overlay" | "splash";
}) {
  return (
    <div className={`flight-loader flight-loader--${variant}`} role="status" aria-live="polite">
      <div className="flight-loader__card">
        <div className="flight-loader__orbit">
          <img src={tripIcon} alt="" width={44} height={44} />
          <span className="flight-loader__plane">
            <Plane aria-hidden="true" size={16} />
          </span>
        </div>
        <p>
          {message}
          <span className="flight-loader__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </p>
        <div className="flight-loader__bar">
          <span />
        </div>
      </div>
    </div>
  );
}

const ITINERARY_TEXT = [
  "Sample itinerary (not live flight status)",
  "Traveler: Kinta Cox",
  "Saturday, 5 December",
  "American Airlines AA 1224 · Boeing 737 · Economy",
  "Depart 08:20 Miami International Airport (MIA)",
  "Arrive 11:17 Indianapolis International Airport (IND)",
  "Non-stop · 2 hrs 57 min",
].join("\n");

type ActionKey = "copy" | "calendar" | "print";

function FlightDetails({ onBack, busy }: { onBack: () => void; busy: boolean }) {
  const [pendingAction, setPendingAction] = useState<ActionKey | null>(null);
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  async function runAction(key: ActionKey, task: () => void | Promise<void>, success: string) {
    if (pendingAction) return;
    setPendingAction(key);
    try {
      await Promise.all([task(), wait(600)]);
      toast.success(success);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      if (mounted.current) setPendingAction(null);
    }
  }

  function copyItinerary() {
    return runAction(
      "copy",
      () => navigator.clipboard.writeText(ITINERARY_TEXT),
      "Itinerary copied to clipboard",
    );
  }

  function downloadCalendar() {
    return runAction(
      "calendar",
      () => {
        const ics = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Flight lookup//EN",
          "BEGIN:VEVENT",
          "UID:aa1224-mia-ind@flight-lookup",
          "DTSTART;TZID=America/New_York:20261205T082000",
          "DTEND;TZID=America/New_York:20261205T111700",
          "SUMMARY:Flight AA 1224 Miami (MIA) to Indianapolis (IND)",
          "LOCATION:Miami International Airport",
          "DESCRIPTION:Sample itinerary. Check with American Airlines for current flight information.",
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\r\n");
        const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "flight-aa1224.ics";
        link.click();
        URL.revokeObjectURL(url);
      },
      "Calendar event downloaded",
    );
  }

  function printItinerary() {
    return runAction("print", () => window.print(), "Print dialog opened");
  }

  const actions: { key: ActionKey; label: string; icon: typeof Copy; onClick: () => void }[] = [
    { key: "copy", label: "Copy details", icon: Copy, onClick: copyItinerary },
    { key: "calendar", label: "Add to calendar", icon: CalendarPlus, onClick: downloadCalendar },
    { key: "print", label: "Print", icon: Printer, onClick: printItinerary },
  ];

  return (
    <section className="details-page" aria-labelledby="details-title">
      <div className="details-toolbar">
        <button className="back-link" type="button" onClick={onBack} disabled={busy}>
          {busy ? (
            <Loader2 aria-hidden="true" className="animate-spin" size={16} />
          ) : (
            <ArrowLeft aria-hidden="true" size={16} />
          )}{" "}
          Back to flight lookup
        </button>
        <div className="details-actions">
          {actions.map(({ key, label, icon: Icon, onClick }) => (
            <button
              key={key}
              type="button"
              className="action-chip"
              onClick={onClick}
              disabled={pendingAction !== null}
            >
              {pendingAction === key ? (
                <Loader2 aria-hidden="true" className="animate-spin" size={14} />
              ) : (
                <Icon aria-hidden="true" size={14} />
              )}
              <span>{pendingAction === key ? "Working…" : label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="details-heading">
        <div>
          <p className="section-kicker">YOUR TRIP</p>
          <h1 id="details-title">You're going to Indianapolis.</h1>
          <p className="traveler-line">
            Itinerary for <strong>Kinta Cox</strong>
          </p>
        </div>
        <span className="booking-date">
          <span>SATURDAY</span> 5 December <span>·</span> 12:00
        </span>
      </div>

      <div className="demo-notice" role="note">
        <ShieldCheck aria-hidden="true" size={19} />
        <p>
          <strong>Sample itinerary</strong>
          <span>
            For educational purposes only. This is not live airline or flight status information.
          </span>
        </p>
      </div>

      <article className="flight-card" aria-label="Flight details from Miami to Indianapolis">
        <div className="flight-card__top">
          <div className="route-heading">
            <p className="section-kicker">YOUR FLIGHT</p>
            <h2>
              Miami <span>MIA</span>
              <ArrowRight aria-hidden="true" size={17} /> Indianapolis <span>IND</span>
            </h2>
          </div>
          <span className="nonstop-pill">
            <Check aria-hidden="true" size={15} /> Non-stop
          </span>
        </div>

        <div className="flight-route">
          <div className="route-endpoint">
            <span className="airport-time">08:20</span>
            <span className="airport-code">MIA</span>
            <strong>Miami International Airport</strong>
            <span className="airport-address">2100 NW 42nd Ave, Miami, FL 33142</span>
          </div>
          <div className="route-duration" aria-label="Flight duration: 2 hours 57 minutes">
            <span>2 hrs 57 min</span>
            <div className="route-line">
              <span>
                <Plane aria-hidden="true" size={16} />
              </span>
            </div>
            <span>Direct flight</span>
          </div>
          <div className="route-endpoint route-endpoint--arrival">
            <span className="airport-time">11:17</span>
            <span className="airport-code">IND</span>
            <strong>Indianapolis International Airport</strong>
            <span className="airport-address">Indianapolis, Indiana</span>
          </div>
        </div>
        <p className="local-time-note">
          <Clock3 aria-hidden="true" size={13} /> Flight times shown in local time
        </p>

        <div className="flight-card__footer">
          <div className="airline-block">
            <img
              className="airline-logo"
              src={americanAirlinesLogo}
              alt="American Airlines"
              width={42}
              height={42}
            />
            <div>
              <strong>American Airlines</strong>
              <span>Flight AA 1224</span>
            </div>
          </div>
          <span className="flight-detail">
            <Plane aria-hidden="true" size={17} />
            <span>
              <strong>Boeing 737</strong>
              <small>Aircraft</small>
            </span>
          </span>
          <span className="flight-detail">
            <Luggage aria-hidden="true" size={17} />
            <span>
              <strong>Economy</strong>
              <small>Cabin</small>
            </span>
          </span>
          <span className="flight-detail">
            <MapPin aria-hidden="true" size={17} />
            <span>
              <strong>Non-stop</strong>
              <small>Route</small>
            </span>
          </span>
        </div>
      </article>

      <section className="info-grid" aria-label="Airport information">
        <div className="info-tile">
          <Ticket aria-hidden="true" size={18} />
          <span>Check-in</span>
          <strong>Opens 24 hrs before</strong>
          <small>Online or at the airline counter</small>
        </div>
        <div className="info-tile">
          <DoorOpen aria-hidden="true" size={18} />
          <span>Gate</span>
          <strong>—</strong>
          <small>Shown by the airline on the day</small>
        </div>
        <div className="info-tile">
          <BaggageClaim aria-hidden="true" size={18} />
          <span>Baggage claim</span>
          <strong>—</strong>
          <small>Displayed at arrival</small>
        </div>
      </section>

      <div className="extras-grid">
        <section className="extras-card" aria-labelledby="aircraft-title">
          <p className="section-kicker">ON BOARD</p>
          <h3 id="aircraft-title">Boeing 737</h3>
          <p className="extras-sub">Typical amenities, for reference only</p>
          <ul className="amenity-list">
            <li>
              <Utensils aria-hidden="true" size={15} /> Snacks and drinks
            </li>
            <li>
              <Wifi aria-hidden="true" size={15} /> Wi‑Fi (may be extra)
            </li>
            <li>
              <Usb aria-hidden="true" size={15} /> Power or USB ports
            </li>
            <li>
              <Luggage aria-hidden="true" size={15} /> Overhead cabin storage
            </li>
          </ul>
        </section>
        <section className="extras-card" aria-labelledby="know-title">
          <p className="section-kicker">GOOD TO KNOW</p>
          <h3 id="know-title">Before you fly</h3>
          <ul className="tips-list">
            <li>
              <Clock3 aria-hidden="true" size={15} />
              <span>
                <strong>No time difference</strong>Miami and Indianapolis both use Eastern Time.
              </span>
            </li>
            <li>
              <MapPin aria-hidden="true" size={15} />
              <span>
                <strong>Arrive early</strong>Plan to reach the airport about 2 hours before
                departure.
              </span>
            </li>
            <li>
              <ShieldCheck aria-hidden="true" size={15} />
              <span>
                <strong>Bring your ID</strong>A valid government-issued photo ID is required.
              </span>
            </li>
          </ul>
        </section>
      </div>

      <div className="below-flight-note">
        <span className="notice-icon">
          <Clock3 aria-hidden="true" size={19} />
        </span>
        <p>
          <strong>Heading to the airport?</strong>
          <span>
            Check with American Airlines for current gate, check-in, and departure information.
          </span>
        </p>
        <ArrowRight aria-hidden="true" className="note-arrow" size={18} />
      </div>

      <div className="details-footer">
        <span>Flight details for Kinta Cox · 5 December</span>
        <img src={tripComLogo} alt="Trip.com" width={110} height={27} />
      </div>
    </section>
  );
}
