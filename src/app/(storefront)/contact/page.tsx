import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { ContactForm } from "@/features/storefront/components/contact-form";
import { ScrollAnimate } from "@/components/scroll-animate";

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">

      <section className="py-24">
        <ScrollAnimate delay={100}>
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">
              Contact US!
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Contact Info */}
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  Reg Address:
                </h2>
                <div className="space-y-2 text-text-secondary pl-7">
                  <p className="font-medium text-text-primary">Granny Diets Private Limited</p>
                  <p>Plot no – 337/2 Sarkara Chakrajmal</p>
                  <p>Teh Dhampur Distt Bijnor,</p>
                  <p>Uttar Pradesh, 246761</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-primary" />
                  Call Us At-
                </h2>
                <p className="text-text-secondary pl-7">+91 7017509340</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Us
                </h2>
                <div className="space-y-2 text-text-secondary pl-7">
                  <p>grannydiets70@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Right: Map */}
            <div className="w-full h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps?q=Sarkara+Chakrajmal+Teh+Dhampur+Distt+Bijnor,+Uttar+Pradesh,+246761&output=embed"
                loading="lazy"
                className="w-full h-full rounded-xl border border-border shadow-sm"
              />
            </div>
          </div>
        </div>
        </ScrollAnimate>
      </section>

      <section className="pb-24">
        <ScrollAnimate delay={200}>
        <div className="container mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
             <h2 className="text-3xl font-bold text-text-primary">
               Send us a Message
             </h2>
             <p className="text-text-secondary mt-2">Fill out the form below and we'll get back to you shortly.</p>
          </div>
          <ContactForm />
        </div>
        </ScrollAnimate>
      </section>

    </div>
  );
}

