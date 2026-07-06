import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t, i18n } = useTranslation();

  // 현재 언어가 한국어인지 확인 (기본값 포함)
  const isKorean = i18n.language === 'ko' || !i18n.language.startsWith('en');

  return (
    <section id="about" className="py-20 container mx-auto px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* 테두리와 여백을 조절하여 디자인 통일감 부여 */}
        <div className="border border-charcoal/10 p-10 lg:p-14 bg-white/50 text-center flex flex-col items-center">
          
          {/* 타이틀 굵게 처리 */}
          <h2 className="text-3xl font-serif font-bold tracking-wide mb-8 text-charcoal">
            {t('about.title')}
          </h2>
          
          <div className="space-y-10 flex flex-col items-center w-full">
            {isKorean ? (
              /* --- 한국어 버전: 강조 및 링크드인 포함 --- */
              <div className="text-base md:text-lg leading-relaxed text-charcoal/80 max-w-2xl text-balance space-y-6 text-left md:text-center">
                <p>
                  THÉONÉ는 <strong className="font-semibold text-charcoal">뉴욕주 변호사 출신 대표가 직접 운영하는 크로스보더 실무 운영팀</strong>입니다.
                </p>
                <p>
                  저희는 <strong className="font-semibold text-charcoal">KOTRA K-Move 멘토 및 NIPA GIP 전문가</strong>로서, 중동을 비롯한 글로벌 시장 진출 기업의 비즈니스 병목 현상을 즉시 해결합니다. 특장차 제조사의 영문 계약 시스템 구축부터 소비재 기업의 글로벌 컴플라이언스 관리까지, 단순 행정 대행을 넘어 기술과 규제를 통합한 전략적 실무를 제공합니다.
                </p>
                <p>
                  이제 전담 인력 채용 없이, THÉONÉ를 귀사의 외부 운영팀으로 활용하십시오. <br className="hidden md:block" />
                  <a 
                    href="https://www.linkedin.com/in/hanabeom/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-3 md:mt-0 md:ml-2 font-medium text-blue-600 hover:text-blue-800 underline underline-offset-4 transition-colors"
                  >
                    대표자의 전문 경력과 활동 확인하기 (LinkedIn) ↗
                  </a>
                </p>
              </div>
            ) : (
              /* --- 영어 버전: 기존 다국어 텍스트 유지 --- */
              <p className="text-base md:text-lg leading-relaxed text-charcoal/80 max-w-2xl text-balance">
                {t('about.identity')}
              </p>
            )}
            
            {/* 고지 사항 */}
            <p className="text-xs font-light text-charcoal/50 border-l border-charcoal/20 pl-6 py-1 max-w-lg text-left">
              {isKorean 
                ? "*본 서비스는 법률 자문이 아닌 비즈니스 행정 및 프로젝트 운영(PMO) 지원을 제공합니다." 
                : t('about.compliance')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
