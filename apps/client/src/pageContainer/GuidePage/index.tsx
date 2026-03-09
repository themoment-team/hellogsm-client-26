'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'shared';
import { GetMyOneseoType } from 'types';

import { BlueStarIcon, CloverIcon, CopyIcon } from 'client/assets';
import { Footer } from 'client/components';

import { cn } from 'shared/lib/utils';
import { useModalStore } from 'shared/stores';

import { useGetMyAuthInfo, useGetMyMemberInfo, useGetMyOneseo } from 'api/hooks';

const textStyle = ['text-[1.25rem]/[1.75rem]', 'font-semibold'];

const descriptionStyle = ['text-body1', 'font-normal'];

interface ElementType {
  background: string;
  title: string;
  description: React.ReactNode;
  subDescription?: React.ReactNode;
}

const mustReadArticles = [
  <>
    본교 입학전형에 합격한 자가 본교 입학을 포기한 경우(합격 후 등록을 포기한 경우 포함) 당해 연도에
    다른 학교에 지원할 수 없습니다.
    <br />
    (단, 본교에 지원하여 불합격한 자는 전기 특성화고, 후기 고등학교에 지원할 수 있습니다.)
  </>,
  <>
    본교는 SW 영 마이스터를 양성하기 위해 교육부와 과학기술정보통신부에서 지정•운영하는 산업수요
    맞춤형고등학교로서 취업을 목표로 교육과정을 편성, 운영합니다.
  </>,
  <>
    기숙사 생활관은 평일 교육과정을 위하여 운영하는 것을 원칙으로 합니다.
    <br />
    (주말과 공휴일 등 학교 휴무일에 기숙사를 운영하지 않습니다.(예: 금요일 하교 후 퇴사, 일요일 저녁
    입사))
  </>,
  <>
    모든 학생이 기숙사에서 공동생활을 하므로 건강상의 사유로 적응이 어렵다고 판단되는 경우에는
    충분히 고려하여 신중히 응시해야 합니다.
  </>,
  <>
    적법한 절차에 의하여 정상적으로 접수가 완료된 경우, 지원자는 접수를 취소할 수 없으며 제출한
    서류는 일체 반환하지 않습니다.
  </>,
] as const;

const Elements: ElementType[] = [
  {
    background: 'bg-blue-300',
    title: '원서 및 성적 입력',
    description: (
      <>
        절차를 읽고 원서와 성적을 작성해 주시면 입학 신청이 완료됩니다.
        <a
          className={cn('flex', 'items-center', 'gap-3', 'mt-5', 'cursor-pointer', 'w-fit')}
          href={`${process.env.NEXT_PUBLIC_CDN_URL}/입학_원서_작성_요령.hwp`}
        >
          <CopyIcon color="#94A3B8" />
          <span
            className={cn('text-slate-400', 'font-semibold', 'text-[1rem]/[1.5rem]', 'underline')}
          >
            입학 원서 작성 요령 다운로드
          </span>
        </a>
      </>
    ),
  },
  {
    background: 'bg-blue-400',
    title: '입학 원서 제출',
    description: (
      <>
        작성하신 입학 원서와 추가 서류는{' '}
        <strong className={cn('font-semibold')}>마이페이지에서 출력</strong> 가능합니다.
      </>
    ),
    subDescription: (
      <>
        서류를 출력 후 확인 부분에 서명 후{' '}
        <strong className={cn('text-blue-500', 'font-semibold')}>
          10월 20일 ~ 10월 23일 (16:30)까지
        </strong>{' '}
        해당 서류를 원서 접수처에 제출합니다.
      </>
    ),
  },
  {
    background: 'bg-blue-500',
    title: '1차 전형',
    description: (
      <>
        내신과 봉사시간, 출결현황을 점수로 환산하여{' '}
        <strong className={cn('font-semibold')}>정원의 1.3배 인원</strong>을 발표합니다.
      </>
    ),
  },
  {
    background: 'bg-blue-600',
    title: '2차 전형',
    description: (
      <>
        소프트웨어마이스터고등학교 학업수행에 필요한 기본 자질과 능력을 중심으로{' '}
        <strong className={cn('font-semibold')}>역량검사</strong>를 진행합니다.
      </>
    ),
    subDescription: <>역량검사 이후 면접을 통해 지원자의 역량을 확인 후 2차 전형은 마무리됩니다.</>,
  },
  {
    background: 'bg-blue-700',
    title: '결과 발표',
    description: (
      <>
        <strong className={cn('font-semibold')}>
          1차 서류심사(50%)와 2차 역량검사(30%), 심층면접(20%)
        </strong>
        를 통해 최종 합격자를 선발합니다.
      </>
    ),
  },
] as const;

const Steps = ({
  number,
  background,
  text,
}: {
  number: number;
  background: string;
  text: string;
}) => {
  return (
    <div
      className={cn([
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'rounded-full',
        background,
        'md:w-[12.3125rem]',
        'md:h-[12.3125rem]',
        'w-[9.25rem]',
        'h-[9.25rem]',
        'text-[1rem]/[1.75rem]',
        'md:text-[1.25rem]/[2rem]',
        'text-white',
        'font-semibold',
      ])}
    >
      <p>{String(number).padStart(2, '0')}</p>
      <p>{text}</p>
    </div>
  );
};

const List = ({
  number,
  title,
  description,
  subDescription,
}: {
  number: number;
  title: string;
  description: React.ReactNode;
  subDescription?: React.ReactNode;
}) => {
  return (
    <div className={cn('w-full', 'flex', 'flex-col', 'gap-10')}>
      <div className={cn('flex', 'flex-col', 'items-start', 'gap-2')}>
        <div className={cn('flex', 'flex-row')}>
          <p className={cn([...textStyle, 'text-blue-600'])}>
            {String(number).padStart(2, '0')}.&nbsp;
          </p>
          <p className={cn([...textStyle, 'text-gray-900'])}>{title}</p>
        </div>
        <ul className={cn('pl-2')}>
          <div className={cn([...descriptionStyle, 'text-gray-900', 'flex', 'gap-1'])}>
            &middot; <span>{description}</span>
          </div>
          {subDescription && (
            <div className={cn([...descriptionStyle, 'text-gray-900', 'flex', 'gap-1'])}>
              &middot; <span>{subDescription}</span>
            </div>
          )}
        </ul>
      </div>
      <div className={cn('w-full', 'h-[0.0625rem]', 'bg-gray-200')} />
    </div>
  );
};

interface GuideProps {
  initialData: GetMyOneseoType | undefined;
  isOneseoWrite: boolean;
}

const GuidePage = ({ initialData, isOneseoWrite }: GuideProps) => {
  const { setLoginRequiredModal } = useModalStore();
  const { data: authInfo } = useGetMyAuthInfo();
  const { data: memberInfo } = useGetMyMemberInfo();

  const { data } = useGetMyOneseo({
    initialData: initialData,
  });

  const [buttonText, buttonVariant]: [string, 'submit' | 'fill' | 'reverseFill'] = (() => {
    if (!isOneseoWrite) return ['원서 작성을 할 수 없는 기간입니다.', 'submit'];

    if (!data) return ['원서 작성하기', 'fill'];

    if (data && data.step) return ['원서 이어서 작성하기', 'fill'];

    if (data && !data.step) return ['최종제출을 이미 완료하였습니다.', 'reverseFill'];

    return ['원서 작성하기', 'fill'];
  })();

  const isTempOneseo = data && !data.step;

  const { push } = useRouter();

  return (
    <div className={cn('w-full', 'flex', 'flex-col', 'justify-center', 'items-center')}>
      <div
        className={cn(
          'relative',
          'w-full',
          'flex',
          'h-[15.62rem]',
          'bg-[#2F68C5]',
          'justify-center',
          'items-center',
          'text-white',
          'text-[2.125rem]/[3.125rem]',
          'font-semibold',
        )}
      >
        <div className={cn('absolute', 'top-0', 'left-[15%]')}>
          <BlueStarIcon />
        </div>
        <div className={cn('absolute', 'bottom-0', 'right-[15%]')}>
          <CloverIcon />
        </div>
        원서 접수 및 내용 안내
      </div>
      <div
        className={cn(
          'md:w-[66.5625rem]',
          'w-full',
          'px-[2rem]',
          'px-[4rem]',
          'md:px-0',
          'flex',
          'flex-col',
          'items-start',
          'gap-20',
          'pt-[6.25rem]',
          'pb-[7.5rem]',
        )}
      >
        <div
          className={cn(
            'w-full',
            'flex',
            'items-center',
            'flex-wrap',
            'gap-4',
            'md:gap-5',
            'justify-center',
          )}
        >
          {Elements.map((element, index) => (
            <Steps
              key={index}
              number={index + 1}
              background={element.background}
              text={element.title}
            />
          ))}
        </div>
        <div className={cn('w-full', 'flex', 'flex-col', 'items-start', 'gap-10')}>
          {Elements.map((element, index) => (
            <List
              key={index}
              number={index + 1}
              title={element.title}
              description={element.description}
              subDescription={element.subDescription}
            />
          ))}

          <div className={cn('w-full', 'flex', 'flex-col', 'gap-5')}>
            <p className={cn([...textStyle, 'text-gray-900'])}>원서 접수 전 꼭 읽어주세요!</p>
            <div className={cn([...descriptionStyle, '[&>span]:font-semibold'])}>
              {mustReadArticles.map((article, idx) => (
                <div className={cn('flex')} key={idx}>
                  <li />
                  <div>{article}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        variant={buttonVariant}
        disabled={buttonVariant === 'fill' ? false : true}
        className={cn([
          'sticky',
          'bottom-10',
          'w-[20rem]',
          'h-[3.25rem]',
          'md:w-[31.25rem]',
          'md:h-[4.25rem]',
          'z-10',
          'mb-[10rem]',
          'text-[1.25rem]/[1.75rem]',
          'rounded-[0.75rem]',
          isTempOneseo && ['cursor-not-allowed', 'opacity-100'],
        ])}
        onClick={() => {
          if (!authInfo?.authReferrerType) {
            setLoginRequiredModal(true);
            return;
          }
          if (!memberInfo?.name) {
            push('/signup');
            return;
          }
          push('/register?step=1');
        }}
      >
        {buttonText}
      </Button>
      <Footer />
    </div>
  );
};

export default GuidePage;
