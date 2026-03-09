import { cn } from 'shared/lib/utils';

const Elements = [
  {
    description: (
      <>
        사용자의 니즈를 고민하고 모든 일에 <br />
        높은 비즈니스 임팩트를 창출해요 🚀
      </>
    ),
  },
  {
    description: (
      <>
        사용자의 순간을 한층 더 혁신하는데 <br />
        최적의 장소 ⛳️
      </>
    ),
  },
  {
    description: (
      <>
        사용자의 순간을 깊이 통찰하고, <br />
        순간의 가치를 비춰내요 🌟
      </>
    ),
  },
] as const;

const TeamSection3 = () => {
  return (
    <div
      className={cn(
        'flex',
        'flex-col',
        'items-center',
        'md:items-start',
        'w-full',
        'bg-[#F3F6FF]',
        'py-[15rem]',
        'sm:gap-[7.5rem]',
        'gap-[5rem]',
      )}
    >
      <h1
        className={cn(
          'text-[#473B6B]',
          'xs:text-[2.75rem]/[3.85rem]',
          'text-[1.75rem]/[2.75rem]',
          'font-bold',
          'px-0',
          'sm:px-[3.75rem]',
          'md:px-[8rem]',
          'xl:px-[12.5rem]',
          'fhd:px-[20rem]',
          'uhd:px-[22.5rem]',
          'text-center',
          'md:text-left',
        )}
      >
        <span className={cn('text-[#7C58E9]')}>더모먼트</span>는
        <br />
        아래의 비전을 가지고 활동해요.
      </h1>
      <div className={cn('flex', 'w-full', 'justify-center')}>
        <div className={cn('flex', 'w-full', 'justify-center', 'flex-wrap', 'gap-4')}>
          {Elements.map((element, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                'justify-left',
                'w-[29.75rem]',
                'sm:h-[12.5rem]',
                'h-fit',
                'rounded-2xl',
                'bg-white',
                'shadow-lg',
                'px-8',
                'py-8',
              )}
            >
              <div
                className={cn(
                  'sm:text-[1.75rem]/[2.8rem]',
                  'text-[1.25rem]/[2.5rem]',
                  'font-bold',
                  'text-left',
                )}
              >
                {element.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSection3;
