import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50 text-center flex flex-col items-center">
          
          <h2 className="text-3xl font-serif font-bold tracking-wide mb-8 text-charcoal">
            {t('about.title')}
          </h2>
          
          <div className="space-y-10 flex flex-col items-center w-full">
            
            {/* whitespace-pre-line을 추가하여 json 파일의 \n 줄바꿈이 완벽하게 적용되도록 했습니다 */}
            <div className="text-base md:text-lg leading-relaxed text-charcoal/80 max-w-2xl text-balance whitespace-pre-line">
              {t('about.identity')}
              
              <div className="flex items-center justify-center mt-6">
                <a 
                  href="https://www.linkedin.com/in/hanabeom/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-charcoal/40 hover:text-[#0A66C2] transition-colors duration-300"
                  title="LinkedIn"
                >
                  <span className="mr-1 underline underline-offset-4 text-sm">{t('about.linkedinBtn')}</span>
                  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <p className="text-xs font-light text-charcoal/50 border-l border-charcoal/20 pl-6 py-1 max-w-lg text-left">
              {t('about.compliance')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
