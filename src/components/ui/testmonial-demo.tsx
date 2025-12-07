import { TestimonialsSection } from "./testmonials-with-marquee"
import BlurText from "./blur-text"


const testimonials = [
  {
    author: {
      name: "Younes Ait hamou",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Kanet expérience bzzaf chaba m3a Mindak Studio. F kol ma ykhes la production, la décoration, la qualité, wel accompagnement… y3tihom saha vraiment 3la kamel le travail li darouh m3ana. Merci !"
  },
  {
    author: {
      name: "Manel belkadi",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Taajebni bzzaf Mindak Agency, ou hadi machi ma première expérience m3ahom. N conseils kamel mes amis bach yjou ykhedmou m3ahom. Franchement, décoration bzzaf chaba, lighting mlih, la qualité koulech top !"
  },
  {
    author: {
      name: "Chemsedine sahraoui",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Je suis très satisfait du rendement et du professionnalisme de Mindak Studio. La qualité du studio, des caméras, du son… tout était impeccable. Et surtout, le personnel présent était attentif aux moindres détails. Je les remercie sincèrement et je recommande fortement Mindak Studio"
  },
  {
    author: {
      name: "Sarah",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Koulech kan mlih : le lighting, l’espace, la qualité, le décor kan hayel. W l’équipe vraiment friendly, souriante et très professionnelle. Ils veillent sur le moindre détail et méprisent bien leur travail"
  },
  {
    author: {
      name: "Adem",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "jewezt une tres bonne experiance m3a mindak je me suis pas sentie e tournage l’equipe ma mis tres alaise je recomande vraiment"
  },
  {
    author: {
      name: "Mehdi",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "la qualitee de travail le decor et toute lequipe une equipe tres bienveillante une experiance que jai adoree"
  },
  {
    author: {
      name: "Minaz",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "sah ki jit l Mindak hassit rohi fi haja profetionel materiel decors et le personnel kifech yste9blok kifech yet3amlo m3ak c’est sur marahch tkon ma derniere experiance m3ahom, bon courage mindak"
  },
  {
    author: {
      name: "Nabila",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "kanet ma premiere experience et kanet magnifique 3jebniiii bzef le studio la decoration et surtout lighting jai aimer kol haja chaque detail merci beaucoup"
  },
  {
    author: {
      name: "Raouf",
      handle: "",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Le meilleur studio podcast li tournit m3ah j’ai eu beaucoup d’experiance mais sah hadi kanet la meilleur men kol jiha Qualitee de service la gentiellece de lequipe les option qui propose le materiels la decoration je recommande vraiment"
  }
]

export function TestimonialsSectionDemo() {
  return (
    <section className="bg-black text-white py-12 sm:py-24 md:py-32 px-0">
      {/* Headline */}
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-[40px] md:text-[56px] lg:text-[72px] font-medium text-white leading-[0.95] mb-12 md:mb-16 lg:mb-20 tracking-tighter flex flex-col items-center gap-2">
            <BlurText
              text="Hear from those"
              className="font-custom-sans text-[40px] md:text-[56px] lg:text-[72px] font-medium text-white leading-[0.95] tracking-tighter"
              delay={50}
              animateBy="letters"
            />
            <BlurText
              text="who trusted us!"
              className="font-emphasis text-[40px] md:text-[56px] lg:text-[72px] font-bold text-white leading-[0.95] tracking-tighter italic"
              delay={50}
              animateBy="letters"
            />
          </h2>
        </div>
      </div>

      <TestimonialsSection
        testimonials={testimonials}
        renderSection={false}
      />
    </section>
  )
}