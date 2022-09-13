import { Field } from 'components/form-fields';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { AuthFooter } from 'components/auth-footer';

const SignUp: NextPage = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <main
        className={
          'flex w-full flex-1 flex-col items-center justify-center px-20 text-center text-gray-900'
        }
      >
        <h2 className='mt-6 text-center text-3xl font-bold'>
          Create an account
        </h2>

        <form
          className='mt-8 space-y-6'
          onSubmit={async event => {
            event.preventDefault();
            setSubmitting(true);
            try {
              const formData = new FormData(event.target as HTMLFormElement);
              const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: formData.get('name'),
                  email: formData.get('email'),
                  password: formData.get('password'),
                }),
              });
              const user = await response.json();
              await router.push('/sign-up/success');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <input defaultValue='true' name='remember' type='hidden' hidden />
          <div className='rounded-md shadow-sm -space-y-px'>
            <Field
              label='Name'
              name='name'
              placeholder='Your full name'
              required
              type='text'
            />

            <Field
              autoComplete='email'
              label='Email address'
              name='email'
              placeholder='Email address'
              required
              type='email'
            />

            <Field
              autoComplete='password'
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
              Sign up
            </button>

            <div className='flex items-center justify-center'>
              <Link href='/'>
                <a className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                  Sign in
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

export default SignUp;
