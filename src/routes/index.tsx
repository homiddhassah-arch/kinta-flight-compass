import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Luggage,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
} from "lucide-react";

import americanAirlinesLogo from "@/assets/american-airlines-logo.png.asset.json";
import tripComLogo from "@/assets/trip-com-logo.png.asset.json";
import flightHero from "@/assets/flight-lookup-hero.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function FlightTrackerPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  function submitTrackingNumber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isValidDemoTrackingNumber(trackingNumber)) {
      setHasSearched(false);
      setError("We couldn't find that tracking number. Please check it and try again.");
      return;
    }

    setHasSearched(true);
  }

  function returnToSearch() {
    setHasSearched(false);
    setError("");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="site-header">
        <a className="brand-link" href="https://www.trip.com/" aria-label="Trip.com home">
          <img className="brand-logo" src={tripComLogo.url} alt="Trip.com" width={150} height={37} />
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
              <span className="eyebrow"><Plane aria-hidden="true" size={15} /> TRAVEL, MADE EASY</span>
              <h1 id="hero-title">A little closer to takeoff.</h1>
              <p>Your flight details, right when you need them.</p>
            </div>
          </section>

          <section className="lookup-section" aria-labelledby="lookup-title">
            <div className="lookup-intro">
              <div>
                <p className="section-kicker">FLIGHT DETAILS</p>
                <h2 id="lookup-title">Find your trip</h2>
                <p className="lookup-description">Enter your tracking number to view your itinerary.</p>
              </div>
              <span className="secure-note"><ShieldCheck aria-hidden="true" size={16} /> Secure lookup</span>
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
              <Button className="lookup-button" type="submit" size="lg">
                Find my flight <ArrowRight aria-hidden="true" size={17} />
              </Button>
            </form>
            {error ? (
              <p className="tracking-error" id="tracking-error" role="alert">
                {error}
              </p>
            ) : null}
          </section>
          <footer className="page-footer">
            <p>Questions about your booking? Get in touch with your travel provider.</p>
            <span>Plan less. Travel more.</span>
          </footer>
        </>
      ) : (
        <FlightDetails onBack={returnToSearch} />
      )}
    </main>
  );
}

function FlightDetails({ onBack }: { onBack: () => void }) {
  return (
    <section className="details-page" aria-labelledby="details-title">
      <button className="back-link" type="button" onClick={onBack}>
        <ArrowLeft aria-hidden="true" size={16} /> Back to flight lookup
      </button>

      <div className="details-heading">
        <div>
          <p className="section-kicker">YOUR TRIP</p>
          <h1 id="details-title">You're going to Indianapolis.</h1>
          <p className="traveler-line">Itinerary for <strong>Kinta Cox</strong></p>
        </div>
        <span className="booking-date"><span>SATURDAY</span> 5 December <span>·</span> 12:00</span>
      </div>

      <div className="demo-notice" role="note">
        <ShieldCheck aria-hidden="true" size={19} />
        <p><strong>Sample itinerary</strong><span>For educational purposes only. This is not live airline or flight status information.</span></p>
      </div>

      <article className="flight-card" aria-label="Flight details from Miami to Indianapolis">
        <div className="flight-card__top">
          <div className="route-heading">
            <p className="section-kicker">YOUR FLIGHT</p>
            <h2>Miami <span>MIA</span><ArrowRight aria-hidden="true" size={17} /> Indianapolis <span>IND</span></h2>
          </div>
          <span className="nonstop-pill"><Check aria-hidden="true" size={15} /> Non-stop</span>
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
            <div className="route-line"><span><Plane aria-hidden="true" size={16} /></span></div>
            <span>Direct flight</span>
          </div>
          <div className="route-endpoint route-endpoint--arrival">
            <span className="airport-time">11:17</span>
            <span className="airport-code">IND</span>
            <strong>Indianapolis International Airport</strong>
            <span className="airport-address">Indianapolis, Indiana</span>
          </div>
        </div>
        <p className="local-time-note"><Clock3 aria-hidden="true" size={13} /> Flight times shown in local time</p>

        <div className="flight-card__footer">
          <div className="airline-block">
            <img className="airline-logo" src={americanAirlinesLogo.url} alt="American Airlines" width={42} height={42} />
            <div><strong>American Airlines</strong><span>Flight AA 1224</span></div>
          </div>
          <span className="flight-detail"><Plane aria-hidden="true" size={17} /><span><strong>Boeing 737</strong><small>Aircraft</small></span></span>
          <span className="flight-detail"><Luggage aria-hidden="true" size={17} /><span><strong>Economy</strong><small>Cabin</small></span></span>
          <span className="flight-detail"><MapPin aria-hidden="true" size={17} /><span><strong>Non-stop</strong><small>Route</small></span></span>
        </div>
      </article>

      <div className="below-flight-note">
        <span className="notice-icon"><Clock3 aria-hidden="true" size={19} /></span>
        <p><strong>Heading to the airport?</strong><span>Check with American Airlines for current gate, check-in, and departure information.</span></p>
        <ArrowRight aria-hidden="true" className="note-arrow" size={18} />
      </div>

      <div className="details-footer"><span>Flight details for Kinta Cox · 5 December</span><img src={tripComLogo.url} alt="Trip.com" width={110} height={27} /></div>
    </section>
  );
}
