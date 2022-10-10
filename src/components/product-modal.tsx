import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import { Asset } from 'types/asset';
import { Product } from 'types/product';
import { formatAssetValue } from 'utils/assets';
import { Field, SingleField } from './form-fields';
import { Modal, ModalProps } from './modal';

type BuyButtonProps = {
  isFree: boolean;
  type: 'button' | 'submit';
};

function BuyButton({ isFree, type }: BuyButtonProps) {
  return (
    <button
      disabled
      type={type}
      className='mt-6 w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-25'
    >
      {isFree ? 'Get' : 'Buy (coming soon)'}
    </button>
  );
}

type Props = Omit<ModalProps, 'children'> & {
  product: Product;
  asset: Asset;
};

export function ProductModal(props: Props) {
  const { product, asset, isVisible, onClose } = props;
  const router = useRouter();
  const hasOptions =
    product.allowChoosingQuantity || product.questions?.length > 0;
  const isFree = new BigNumber(product.price).isEqualTo(0);

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className='w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:gap-x-8'>
        <div className='aspect-3/4 bg-gray-100 overflow-hidden sm:col-span-4 lg:col-span-5'>
          <img
            className='h-full object-center object-cover'
            src={product.gallery?.[0]?.image.url}
            alt=''
          />
        </div>
        <div className='self-stretch flex flex-col sm:col-span-8 lg:col-span-7'>
          <h2 className='mb-2 text-2xl font-extrabold text-gray-900 sm:pr-12'>
            {product.name}
          </h2>

          <section
            aria-labelledby='information-heading'
            className='flex-1 flex flex-col gap-4'
          >
            <h3 id='information-heading' className='sr-only'>
              Product information
            </h3>

            {!isFree && (
              <p className='text-2xl text-gray-900'>
                {asset.symbol ?? asset.code + ''}
                {formatAssetValue(product.price, asset, BigNumber.ROUND_UP)}
              </p>
            )}

            {product.description && (
              <p className='text-md text-gray-600'>{product.description}</p>
            )}
          </section>

          {hasOptions ? (
            <section aria-labelledby='options-heading' className='mt-10'>
              <h3 id='options-heading' className='sr-only'>
                Product options
              </h3>

              <form
                method={'GET'}
                action={'/checkout'}
                onSubmit={event => {
                  event.preventDefault();
                  const formData = new FormData(
                    event.target as HTMLFormElement
                  );
                  const params = new URLSearchParams(formData as any);
                  router.push(`/checkout?${params.toString()}`);
                }}
              >
                <input type='hidden' name='productId' value={product.id} />

                {product.allowChoosingQuantity && (
                  <div className='mb-10'>
                    <h4 className='mb-1 text-sm text-gray-900 font-medium'>
                      Quantity
                    </h4>

                    <div>
                      <Field
                        label='Quantity'
                        name='quantity'
                        required
                        defaultValue='1'
                      />
                    </div>
                  </div>
                )}

                {product.questions.map(question => (
                  <div key={question.id} className='mb-10'>
                    <h4 className='mb-1 text-sm text-gray-900 font-medium'>
                      Color
                    </h4>

                    <fieldset className='mb-4'>
                      <legend className='sr-only'>Choose a color</legend>
                      <span className='flex items-center space-x-3'>
                        <label className='-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-400'>
                          <input
                            type='radio'
                            name='color-choice'
                            value='White'
                            className='sr-only'
                            aria-labelledby='color-choice-0-label'
                          />
                          <span id='color-choice-0-label' className='sr-only'>
                            {' '}
                            White{' '}
                          </span>
                          <span
                            aria-hidden='true'
                            className='h-8 w-8 bg-white border border-black border-opacity-10 rounded-full'
                          ></span>
                        </label>

                        <label className='-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-400'>
                          <input
                            type='radio'
                            name='color-choice'
                            value='Gray'
                            className='sr-only'
                            aria-labelledby='color-choice-1-label'
                          />
                          <span id='color-choice-1-label' className='sr-only'>
                            Gray
                          </span>
                          <span
                            aria-hidden='true'
                            className='h-8 w-8 bg-gray-200 border border-black border-opacity-10 rounded-full'
                          ></span>
                        </label>

                        <label className='-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-900'>
                          <input
                            type='radio'
                            name='color-choice'
                            value='Black'
                            className='sr-only'
                            aria-labelledby='color-choice-2-label'
                          />
                          <span id='color-choice-2-label' className='sr-only'>
                            Black
                          </span>
                          <span
                            aria-hidden='true'
                            className='h-8 w-8 bg-gray-900 border border-black border-opacity-10 rounded-full'
                          ></span>
                        </label>
                      </span>
                    </fieldset>
                  </div>
                ))}

                {/* <div className='mb-6'>
                  <h4 className='mb-1 text-sm text-gray-900 font-medium'>
                    Size
                  </h4>

                  <fieldset className='mb-4'>
                    <legend className='sr-only'>Choose a size</legend>
                    <div className='grid grid-cols-4 gap-4'>
                      <label className='group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer'>
                        <input
                          type='radio'
                          name='size-choice'
                          value='XXS'
                          className='sr-only'
                          aria-labelledby='size-choice-0-label'
                        />
                        <span id='size-choice-0-label'> XXS </span>
                        <span
                          className='absolute -inset-px rounded-md pointer-events-none'
                          aria-hidden='true'
                        ></span>
                      </label>

                      <label className='group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer'>
                        <input
                          type='radio'
                          name='size-choice'
                          value='XS'
                          className='sr-only'
                          aria-labelledby='size-choice-1-label'
                        />
                        <span id='size-choice-1-label'> XS </span>
                        <span
                          className='absolute -inset-px rounded-md pointer-events-none'
                          aria-hidden='true'
                        ></span>
                      </label>

                      <label className='group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer'>
                        <input
                          type='radio'
                          name='size-choice'
                          value='S'
                          className='sr-only'
                          aria-labelledby='size-choice-2-label'
                        />
                        <span id='size-choice-2-label'> S </span>
                        <span
                          className='absolute -inset-px rounded-md pointer-events-none'
                          aria-hidden='true'
                        ></span>
                      </label>

                      <label className='group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer'>
                        <input
                          type='radio'
                          name='size-choice'
                          value='M'
                          className='sr-only'
                          aria-labelledby='size-choice-3-label'
                        />
                        <span id='size-choice-3-label'> M </span>
                        <span
                          className='absolute -inset-px rounded-md pointer-events-none'
                          aria-hidden='true'
                        ></span>
                      </label>

                      <label className='group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer'>
                        <input
                          type='radio'
                          name='size-choice'
                          value='L'
                          className='sr-only'
                          aria-labelledby='size-choice-4-label'
                        />
                        <span id='size-choice-4-label'> L </span>
                        <span
                          className='absolute -inset-px rounded-md pointer-events-none'
                          aria-hidden='true'
                        ></span>
                      </label>

                      <label className='group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer'>
                        <input
                          type='radio'
                          name='size-choice'
                          value='XL'
                          className='sr-only'
                          aria-labelledby='size-choice-5-label'
                        />
                        <span id='size-choice-5-label'> XL </span>
                        <span
                          className='absolute -inset-px rounded-md pointer-events-none'
                          aria-hidden='true'
                        ></span>
                      </label>

                      <label className='group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer'>
                        <input
                          type='radio'
                          name='size-choice'
                          value='XXL'
                          className='sr-only'
                          aria-labelledby='size-choice-6-label'
                        />
                        <span id='size-choice-6-label'> XXL </span>
                        <span
                          className='absolute -inset-px rounded-md pointer-events-none'
                          aria-hidden='true'
                        ></span>
                      </label>

                      <label className='group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-gray-50 text-gray-200 cursor-not-allowed'>
                        <input
                          type='radio'
                          name='size-choice'
                          value='XXXL'
                          disabled
                          className='sr-only'
                          aria-labelledby='size-choice-7-label'
                        />
                        <span id='size-choice-7-label'> XXXL </span>

                        <span
                          aria-hidden='true'
                          className='absolute -inset-px rounded-md border-2 border-gray-200 pointer-events-none'
                        >
                          <svg
                            className='absolute inset-0 w-full h-full text-gray-200 stroke-2'
                            viewBox='0 0 100 100'
                            preserveAspectRatio='none'
                            stroke='currentColor'
                          >
                            <line
                              x1='0'
                              y1='100'
                              x2='100'
                              y2='0'
                              vectorEffect='non-scaling-stroke'
                            />
                          </svg>
                        </span>
                      </label>
                    </div>
                  </fieldset>
                </div> */}

                <BuyButton type='submit' isFree={isFree} />
              </form>
            </section>
          ) : (
            <div className='mt-10'>
              <BuyButton type='button' isFree={isFree} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
