import SlykLogo from 'assets/svg/slyk-logo.svg';

export function AuthFooter(): JSX.Element {
  return (
    <footer className='flex h-24 w-full items-center justify-center border-t'>
      <a
        className='flex items-baseline justify-center gap-2'
        href='https://slyk.io'
        rel='noopener noreferrer'
        target='_blank'
      >
        Powered by
        <SlykLogo aria-label='Slyk' className='h-3' />
      </a>
    </footer>
  );
}
