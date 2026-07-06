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
            
            {/* 대표님이 작성하신 호흡(줄바꿈)을 그대로 살린 간격 배치 */}
            <div className="text-base md:text-lg leading-relaxed text-charcoal/80 max-w-2xl text-balance space-y-6">
              <p>
                THÉONÉ는 <strong className="font-semibold text-charcoal">뉴욕주 변호사 출신 대표가 직접 운영하는 크로스보더 실무 운영팀</strong>입니다.
              </p>
              
              <p>
                KOTRA K-Move 멘토 및 NIPA GIP 전문가로 활동하며, 중동을 비롯한 글로벌 시장 진출 기업의 비즈니스 병목 현상을 매끄럽게 풀어나갑니다.
              </p>
              
              <p>
                국내 특장차 제조사의 영문 계약 시스템 구축부터,<br />
                소비재 기업의 글로벌 컴플라이언스 관리까지,<br />
                기술과 규제를 통합한 전략적 비즈니스 실무를 제공하여 막힘 없이 일이 진행되도록 합니다.
              </p>
              
              <p className="flex items-center justify-center flex-wrap gap-2">
                <span>전담 인력 채용 대신, THÉONÉ를 귀사의 특화된 외부 운영팀으로 활용하십시오.</span>
                <a 
                  href="https://www.linkedin.com/in/hanabeom/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex text-charcoal/30 hover:text-[#0A66C2] transition-colors duration-300 ml-1 translate-y-[2px]"
                  title="대표 경력 확인하기 (LinkedIn)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </p>
            </div>
            
            <p className="text-xs font-light text-charcoal/50 border-l border-charcoal/20 pl-6 py-1 max-w-lg text-left">
              본 서비스는 변호사법 제109조에 저촉되지 않는 범위 내에서, 법률 자문이 아닌 비즈니스 행정 및 프로젝트 운영(PMO) 지원을 제공합니다.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
