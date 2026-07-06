import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();

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
            {/* 
              1. max-w를 3xl로 늘려 여유 확보 
              2. text-balance로 기기별 동적 줄바꿈 최적화
              3. space-y-5를 추가하여 문단 간의 자연스러운 여백 생성
            */}
            <div className="text-base md:text-lg leading-relaxed text-charcoal/80 max-w-2xl text-balance space-y-5">
              <p>
                THÉONÉ는 <strong className="font-semibold text-charcoal">뉴욕주 변호사 출신 대표가 직접 운영하는 크로스보더 실무 운영팀</strong>입니다.
              </p>
              <p>
                저희는 <strong className="font-semibold text-charcoal">KOTRA K-Move 멘토 및 NIPA GIP 전문가</strong>로서, 중동을 비롯한 글로벌 시장 진출 기업의 비즈니스 병목 현상을 즉시 해결합니다. 특장차 제조사의 영문 계약 시스템 구축부터 소비재 기업의 글로벌 컴플라이언스 관리까지, 단순 행정 대행을 넘어 기술과 규제를 통합한 전략적 실무를 제공합니다.
              </p>
              <p className="flex items-center justify-center flex-wrap gap-2">
                <span>이제 전담 인력 채용 없이, THÉONÉ를 귀사의 외부 운영팀으로 활용하십시오.</span>
                {/* 링크드인 아이콘 (끝에 살짝, 마우스 오버 시 파란색) */}
                <a 
                  href="https://www.linkedin.com/in/hanabeom/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex text-charcoal/30 hover:text-[#0A66C2] transition-colors duration-300 ml-1"
                  title="대표 경력 확인하기 (LinkedIn)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </p>
            </div>
            
            {/* 고지 사항은 왼쪽 정렬을 기본으로 하여 문장 끊김 방지 */}
            <p className="text-xs font-light text-charcoal/50 border-l border-charcoal/20 pl-6 py-1 max-w-lg text-left">
              본 서비스는 변호사법 제109조에 저촉되지 않는 범위 내에서, 법률 자문이 아닌 비즈니스 행정 및 프로젝트 운영(PMO) 지원을 제공합니다.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
