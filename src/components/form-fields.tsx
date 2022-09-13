import { InputHTMLAttributes } from 'react';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  label: string;
};

export function Field(props: FieldProps) {
  const { className = '', label, name, id = name, ...rest } = props;
  return (
    <div className={`field ${className}`}>
      <label className='sr-only' htmlFor={id}>
        {label}
      </label>
      <input
        className='appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 transition-colors focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
        id={id}
        name={name}
        {...rest}
      />
    </div>
  );
}

export function SingleField(props: FieldProps) {
  const { className, label, name, id = name, ...rest } = props;

  return (
    <div className={className}>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        Price
      </label>
      <div className='mt-1 relative rounded-md shadow-sm'>
        <input
          className='focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md'
          id={id}
          name={name}
          {...rest}
        />
      </div>
    </div>
  );
}
