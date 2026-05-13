import Link from "next/link";
import { Star } from "lucide-react";
import styles from "./page.module.css";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import FAQ from "@/components/FAQ/FAQ";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Tech without the <span className={styles.highlight}>price tag</span>.
          </h1>
          <p className={styles.subtitle}>
            Rent premium laptops, cameras, drones, and more for a fraction of the cost.
            Delivered to your door.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/category/all" className={styles.primaryBtn}>
              Start Renting
            </Link>
            <Link href="/compare" className={styles.secondaryBtn}>
              Compare Devices
            </Link>
            <Link href="/owner" className={styles.secondaryBtn}>
              List Your Device
            </Link>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <img src="/chatgpt.png" alt="Electronic devices" className={styles.heroImage} />
        </div>
      </section>

      {/* Community Listings Conveyor */}
      <section className={styles.conveyor}>
        <div className={styles.conveyorTrack}>
          {/* Original set */}
          <div className={`${styles.listingCard} ${styles.cardYellow}`}>
            <span className={styles.adTag}>🔥 Top Rated</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/anthony-roberts-5WJhuXkqCkc-unsplash.jpg" alt="Gaming PC" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>Amit&apos;s Electronics</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Custom gaming PC with RTX 4080 — rent for LAN parties or video editing at ₹1500/day!&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardPink}`}>
            <span className={styles.adTag}>🎧 Music Lovers</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/earphones.jpg" alt="Earphones" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>SkyView Rentals</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Premium earphones for music lovers. Crystal clear audio at just ₹100/day.&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardBlue}`}>
            <span className={styles.adTag}>✈️ Travel Ready</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/headphone.jpg" alt="Sony Headphones" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>Rahul S.</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Sony WH-1000XM5 headphones — noise cancelling, perfect for travel. ₹200/day.&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardGreen}`}>
            <span className={styles.adTag}>⌚ Steal Deal</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/watch.jpg" alt="Apple Watch" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>Priya&apos;s Gadget Hub</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Apple Watch Series 9 — short-term rentals. Best deal at ₹350/day!&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardLavender}`}>
            <span className={styles.adTag}>🎮 Pro Gear</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/anthony-roberts-5WJhuXkqCkc-unsplash.jpg" alt="Gaming PC" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>GameZone Store</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;High-end gaming rig with dual monitors. Perfect for weekend tournaments at ₹2000/day.&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardYellow}`}>
            <span className={styles.adTag}>🎙️ Creators</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/earphones.jpg" alt="Earphones" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>TechBuddy Rentals</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Studio-grade earphones — ideal for podcasting and music production. ₹150/day.&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          {/* Duplicate set for seamless loop */}
          <div className={`${styles.listingCard} ${styles.cardYellow}`}>
            <span className={styles.adTag}>🔥 Top Rated</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/anthony-roberts-5WJhuXkqCkc-unsplash.jpg" alt="Gaming PC" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>Amit&apos;s Electronics</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Custom gaming PC with RTX 4080 — rent for LAN parties or video editing at ₹1500/day!&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardPink}`}>
            <span className={styles.adTag}>🎧 Music Lovers</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/earphones.jpg" alt="Earphones" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>SkyView Rentals</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Premium earphones for music lovers. Crystal clear audio at just ₹100/day.&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardBlue}`}>
            <span className={styles.adTag}>✈️ Travel Ready</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/headphone.jpg" alt="Sony Headphones" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>Rahul S.</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Sony WH-1000XM5 headphones — noise cancelling, perfect for travel. ₹200/day.&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardGreen}`}>
            <span className={styles.adTag}>⌚ Steal Deal</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/watch.jpg" alt="Apple Watch" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>Priya&apos;s Gadget Hub</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Apple Watch Series 9 — short-term rentals. Best deal at ₹350/day!&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardLavender}`}>
            <span className={styles.adTag}>🎮 Pro Gear</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/anthony-roberts-5WJhuXkqCkc-unsplash.jpg" alt="Gaming PC" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>GameZone Store</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;High-end gaming rig with dual monitors. Perfect for weekend tournaments at ₹2000/day.&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>

          <div className={`${styles.listingCard} ${styles.cardYellow}`}>
            <span className={styles.adTag}>🎙️ Creators</span>
            <div className={styles.deviceHeader}>
              <div className={styles.deviceCircle}><img src="/earphones.jpg" alt="Earphones" className={styles.deviceImg} /></div>
              <span className={styles.listingAuthor}>TechBuddy Rentals</span>
            </div>
            <div className={styles.listingContent}>
              <p className={styles.listingComment}>&quot;Studio-grade earphones — ideal for podcasting and music production. ₹150/day.&quot;</p>
            </div>
            <div className={styles.stars}>
              <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <HowItWorks />

      {/* Features Section */}
      <section className={styles.features}>
        {/* Feature 1: Text left, Image right */}
        <div className={styles.featureBlock}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Lightning fast delivery</h2>
            <p className={styles.featureDesc}>
              Get your rented device delivered to your doorstep within hours, not days.
              Our hyperlocal network ensures you never wait too long.
            </p>
            <ul className={styles.featureList}>
              <li>→ Same-day delivery in metro cities</li>
              <li>→ Real-time tracking on every order</li>
              <li>→ Secure, tamper-proof packaging</li>
              <li>→ Free pickup when you&apos;re done</li>
            </ul>
          </div>
          <div className={`${styles.featureImgWrap} ${styles.featureImgOrange}`}>
            <img src="/woman.jpeg" alt="Fast delivery" className={styles.featureImg} />
          </div>
        </div>

        {/* Feature 2: Image left, Text right */}
        <div className={`${styles.featureBlock} ${styles.featureBlockReversed}`}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Effortless process</h2>
            <p className={styles.featureDesc}>
              From browsing to booking to returning — every step is designed to be
              frictionless. No paperwork, no hassle, just tech when you need it.
            </p>
            <ul className={styles.featureList}>
              <li>→ One-tap booking with instant confirmation</li>
              <li>→ Aadhaar-verified owners you can trust</li>
              <li>→ Flexible daily, weekly & monthly plans</li>
              <li>→ Instant refundable deposits</li>
            </ul>
          </div>
          <div className={`${styles.featureImgWrap} ${styles.featureImgLavender}`}>
            <img src="/flowers.jpeg" alt="Easy process" className={styles.featureImg} />
          </div>
        </div>

        {/* Feature 3: Text left, Image right */}
        <div className={styles.featureBlock}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Sustainable choice</h2>
            <p className={styles.featureDesc}>
              Renting instead of buying reduces electronic waste and promotes a circular economy. 
              Join thousands of others in making a smarter choice for the planet.
            </p>
            <ul className={styles.featureList}>
              <li>→ 80% lower carbon footprint per use</li>
              <li>→ Certified refurbishing partners</li>
              <li>→ Zero-waste packaging initiative</li>
              <li>→ Recycling rewards for active renters</li>
            </ul>
          </div>
          <div className={`${styles.featureImgWrap} ${styles.featureImgLime}`}>
            <img src="/building.jpeg" alt="Sustainability" className={styles.featureImg} />
          </div>
        </div>

        {/* Feature 4: Image left, Text right */}
        <div className={`${styles.featureBlock} ${styles.featureBlockReversed}`}>
          <div className={styles.featureText}>
            <h2 className={styles.featureTitle}>Community driven</h2>
            <p className={styles.featureDesc}>
              Gizzmo is built on trust. Our peer-to-peer network connects tech enthusiasts 
              who care about their gear and the people who use it.
            </p>
            <ul className={styles.featureList}>
              <li>→ 24/7 localized support team</li>
              <li>→ In-person handovers available</li>
              <li>→ Community events and workshops</li>
              <li>→ Damage protection on every rental</li>
            </ul>
          </div>
          <div className={`${styles.featureImgWrap} ${styles.featureImgBlue}`}>
            <img src="/run.jpg" alt="Community" className={styles.featureImg} />
          </div>
        </div>
      </section>

      {/* Trusted Community Section */}
      <section className={styles.communitySection}>
        <div className={styles.communityPill}>
          <img src="/community.png" alt="Community building" className={styles.communityImg} />
        </div>
        <div className={styles.communityFeatures}>
          <div className={styles.communityFeature}>
            <h3>Verified profiles</h3>
            <p>Every renter and owner is Aadhaar-verified for a safe, trustworthy marketplace.</p>
          </div>
          <div className={styles.communityFeature}>
            <h3>Ratings & reviews</h3>
            <p>Transparent feedback system so you always know who you&apos;re dealing with.</p>
          </div>
          <div className={styles.communityFeature}>
            <h3>Community first</h3>
            <p>Built by people who believe sharing tech is better than hoarding it.</p>
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What our users say</h2>
        <div className={styles.reviews}>
          <div className={styles.review}>
            <div className={styles.stars}>
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
            </div>
            <p>"Needed a Macbook for a hackathon. Gizzmo saved my life! Super smooth process and the device was brand new."</p>
            <h4>- Rahul S. (Student)</h4>
          </div>
          <div className={styles.review}>
            <div className={styles.stars}>
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
            </div>
            <p>"As a store owner, my unsold inventory was gathering dust. Now I make passive income every week! Highly recommend."</p>
            <h4>- Amit's Electronics</h4>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaIcon}>
          <img src="/run.jpg" alt="Run Icon" className={styles.ctaIconImg} />
        </div>
        <h2 className={styles.ctaHeading}>
          Ready to rent smarter,<br />not harder?
        </h2>
        <p className={styles.ctaSub}>
          Give yourself access to premium tech without the commitment&mdash;rent, use, return, repeat.
        </p>
        <Link href="/category/all" className={styles.ctaButton}>
          Get started
        </Link>
      </section>
    </div>
  );
}
