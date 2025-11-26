import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import UseCases from '../components/UseCases';
import TrustSection from '../components/TrustSection';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <UseCases />
      <TrustSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
