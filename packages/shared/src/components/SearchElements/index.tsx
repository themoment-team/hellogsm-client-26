import { cn } from 'shared/lib/utils';

interface SchoolType {
  SCHUL_NM: string;
  // eslint-disable-next-line @cspell/spellchecker
  ORG_RDNMA: string;
}

interface SearchElementsProps {
  schools: SchoolType[];
  onSelectSchool: (school: SchoolType) => void;
}

const SearchElements = ({ schools, onSelectSchool }: SearchElementsProps) => {
  if (schools.length === 0) return null;

  return (
    <div
      className={cn(
        'absolute',
        'top-full',
        'left-0',
        'right-0',
        'mt-1',
        'flex',
        'flex-col',
        'items-start',
        'rounded-md',
        'border',
        'border-solid',
        'border-zinc-200',
        'bg-white',
        'shadow-md',
        'overflow-y-auto',
        'max-h-32',
      )}
    >
      {schools.map((school, index) => (
        <div
          key={index}
          className={cn(
            'flex',
            'w-full',
            'py-2',
            'px-2.5',
            'items-center',
            'cursor-pointer',
            'hover:bg-zinc-100',
          )}
          onClick={() => onSelectSchool(school)}
        >
          <p className={cn('text-zinc-950', 'text-body1', 'font-normal')}>
            {/* eslint-disable-next-line @cspell/spellchecker */}
            {school.SCHUL_NM} ({school.ORG_RDNMA})
          </p>
        </div>
      ))}
    </div>
  );
};

export default SearchElements;
