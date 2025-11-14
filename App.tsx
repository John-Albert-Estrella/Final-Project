import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Services } from "./components/services";
import { Doctors } from "./components/doctors";
import { Appointment } from "./components/appointment";
import { Contact } from "./components/contact";
import { Footer } from "./components/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Services />
        <Doctors />
        <Appointment />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
