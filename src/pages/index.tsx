import { Field } from 'components/form-fields';
import { useSession } from 'components/session-provider';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { AuthFooter } from 'components/auth-footer';

const Home: NextPage = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const { setUser } = useSession();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <main
        className={
          'flex w-full flex-1 flex-col items-center justify-center px-20 text-center text-gray-900'
        }
      >
        <h2 className='mt-6 text-center text-3xl font-bold'>
          Sign in to your account
        </h2>

        <form
          className='mt-8 space-y-6'
          onSubmit={async event => {
            event.preventDefault();
            setSubmitting(true);
            try {
              const formData = new FormData(event.target as HTMLFormElement);
              const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: formData.get('email'),
                  password: formData.get('password'),
                }),
              });
              if (response.ok) {
                const user = await response.json();
                setUser(user);
                await router.push('/overview');
              } else {
                throw await response.json();
              }
            } catch (error) {
              console.log('Error logging in', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <input hidden defaultValue='true' name='remember' type='hidden' />
          <div className='rounded-md shadow-sm -space-y-px'>
            <Field
              autoComplete='email'
              label='Email address'
              name='email'
              placeholder='Email address'
              required
              type='email'
            />

            <Field
              autoComplete='current-password'
              label='Password'
              name='password'
              placeholder='Password'
              required
              type='password'
            />
          </div>

          <div className='space-y-3'>
            <button
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300'
              type='submit'
              disabled={isSubmitting}
            >
              Sign in
            </button>

            <div className='flex items-center justify-center'>
              <a
                className='text-sm font-medium text-blue-600 hover:text-blue-500'
                href='#'
              >
                Forgot your password?
              </a>
            </div>

            <div className='flex items-center justify-center'>
              <Link href='/sign-up'>
                <a className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                  Create an account
                </a>
              </Link>
            </div>
          </div>
        </form>
      </main>

      <AuthFooter />
    </div>
  );
};

export default Home;
