import { NextPage } from 'next';
import Link from 'next/link';
import { AuthFooter } from 'components/auth-footer';

const SignUpSuccess: NextPage = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <main
        className={
          'flex w-full flex-1 flex-col items-center justify-center px-20 text-center text-gray-900'
        }
      >
        <h2 className='mt-6 text-center text-3xl font-bold'>Welcome</h2>

        <div className='mt-8 space-y-6'>
          <p>
            Your account has been successfully created. You can now sign in.
          </p>
          <div className='flex items-center justify-center'>
            <Link href='/'>
              <a className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                Sign in
              </a>
            </Link>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default SignUpSuccess;
