'use client';

import Image from 'next/image';

import { cn } from 'shared/lib/utils';

const Elements = [
  {
    Img: '/images/SoftwareImg.png',
    department: '소프트웨어개발과',
    textColor: 'text-sky-500',
    tagColor: 'bg-sky-50',
    learn: ['운영체제', 'C', 'C++', 'JAVA', '네트워크', '모바일'],
    description: `SW개발의 계획에서부터 분석, 설계, 코딩, 테스팅,
    유지보수까지 전반적인 학습 / 맞춤형 실무교육을 통해 정보
    시스템 개발과 웹/모바일, 콘텐츠 제작이 가능하도록 전문
    인재 양성`,
  },
  {
    Img: '/images/IOTImg.png',
    department: '스마트IoT(Internet of Things)과',
    textColor: 'text-lime-700',
    tagColor: 'bg-lime-50',
    learn: ['리눅스', '라즈베리파이', '아두이노', '하드웨어'],
    description: `사물에 내장된 컴퓨터가 수행할 수 있는 소프트웨어개발 
    사물에 센서를 부착해 실시간으로 데이터를 인터넷으로 
    주고받는 기술인 IT융합 소프트웨어를 설계, 개발이 가능한
    전문 인재를 양성`,
  },
  {
    Img: '/images/AIImg.png',
    department: '인공지능(AI)과',
    textColor: 'text-sky-900',
    tagColor: 'bg-slate-200',
    learn: ['빅데이터', '사물인터넷', '머신러닝', '딥러닝'],
    description: `인공지능, 빅데이터, 사물인터넷을 바탕으로 한 인공지능 
    기반 기술을 교육하여 인공지능 서비스의 요구사항을 
    실현하기 위한 인공지능 플랫폼 구현, 인공지능 서비스 
    기획 전문 인재를 양성`,
  },
] as const;

const Section5 = () => {
  return (
    <div className={cn('flex', 'flex-col', 'bg-white', 'py-[11.25rem]', 'w-full')}>
      <div className={cn('flex', 'justify-center', 'gap-[4.25rem]', 'flex-col')}>
        <div
          className={cn(
            'flex',
            'flex-col',
            'items-center',
            'gap-[1rem]',
            'pl-[8rem]',
            'px-4',
            'xs:px-[3.75rem]',
            'md:px-[8rem]',
            'xl:px-[16rem]',
            'fhd:px-[20rem]',
            'uhd:px-[32.5rem]',
            'xl:items-start',
          )}
        >
          <div className={cn('flex', 'items-end')}>
            <span
              className={cn(
                'text-gray-900',
                'font-semibold',
                'xl:text-left',
                'text-center',
                'text-[1.25rem]/[1.25rem]',
                'xs:text-[1.5rem]/[2rem]',
                'sm:text-[2rem]/[2.5rem]',
              )}
            >
              창의 융합력을 갖춘 <br />
              글로벌 소프트웨어 학과 소개
            </span>
          </div>
          <span className={cn('text-gray-700', 'sm:text-[1.25rem]/[1.75rem]', 'font-normal')}>
            체계적인 교육과정을 제공하는 소프트웨어 학과
          </span>
        </div>

        <div
          className={cn(
            'flex',
            'flex-wrap',
            'w-full',
            'justify-center',
            'items-start',
            'gap-[0.8125rem]',
            'px-4',
            'px-4',
            'xs:px-[3.75rem]',
            'smx:px-[5.75rem]',
            'md:px-[8rem]',
            'max-sm:overflow-x-scroll',
            'max-sm:flex-nowrap',
            'max-sm:justify-start',
            'max-sm:pb-4',
          )}
        >
          {Elements.map((element, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                'w-[26rem]',
                'flex-col',
                'items-start',
                'gap-6',
                'max-sm:flex-shrink-0',
              )}
            >
              <Image
                src={element.Img}
                alt={`${element.department} Image`}
                width={418}
                height={232}
              />
              <div className={cn('w-full', 'flex', 'flex-col', 'flex-start', 'gap-3')}>
                <div className={cn('w-full', 'flex', 'flex-col', 'items-start', 'gap-4')}>
                  <p
                    className={cn(
                      'text-gray-900',
                      'text-[0.75rem]/[1.25rem]',
                      'font-semibold',
                      'sm:text-[1rem]/[1.5rem]',
                      'sm:text-[1.5rem]/[2rem]',
                    )}
                  >
                    {element.department}
                  </p>
                  <div className={cn('flex', 'w-full', 'items-center', 'gap-2')}>
                    {element.learn.map((item, idx) => (
                      <div
                        key={idx}
                        className={cn([
                          'flex',
                          'px-1',
                          'py-1',
                          'justify-center',
                          'items-center',
                          'rounded-[5rem]',
                          'sm:px-2',
                          element.tagColor,
                        ])}
                      >
                        <p
                          className={cn([
                            element.textColor,
                            'text-[0.5rem]/[0.75rem]',
                            'font-normal',
                            'sm:text-[0.75rem]/[1rem]',
                            'sm:text-[0.875rem]/[1.25rem]',
                          ])}
                        >
                          #{item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <span
                  className={cn(
                    'text-gray-600',
                    'text-[0.75rem]/[1.25rem]',
                    'font-normal',
                    'sm:text-[1rem]/[1.5rem]',
                    'sm:text-[1.125rem]/[1.75rem]',
                  )}
                >
                  {element.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section5;
