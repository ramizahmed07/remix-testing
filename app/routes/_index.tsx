import { PrismaClient } from '@prisma/client';
import { useFetcher } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/node';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

const db = new PrismaClient();

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { date, type, text } = Object.fromEntries(formData);
  await new Promise((res) => setTimeout(res, 1000));
  if (
    typeof date !== 'string' ||
    typeof type !== 'string' ||
    typeof text !== 'string'
  ) {
    throw new Error('Bad request');
  }
  return await db.entry.create({
    data: {
      date: new Date(date),
      type,
      text,
    },
  });
}

export default function Index() {
  const { Form, state } = useFetcher();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state === 'idle' && textareaRef?.current) {
      textareaRef.current.value = '';
      textareaRef.current.focus();
    }
  }, [state]);

  return (
    <div className='p-10'>
      <h1 className='text-5xl'>Work Journal</h1>
      <p className='mt-2 text-lg text-gray-400'>
        Learnings and doings. Updated weekly.
      </p>

      <div className='my-8 border p-2'>
        <p className='italic'>Create an entry</p>
        <Form method='post'>
          <fieldset
            className='disabled:opacity-70'
            disabled={state === 'submitting'}
          >
            <div>
              <div className='mt-4'>
                <input
                  type='date'
                  name='date'
                  required
                  className='text-gray-700'
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className='mt-2 space-x-4'>
                <label>
                  <input
                    className='mr-1'
                    type='radio'
                    name='type'
                    value='work'
                    required
                    defaultChecked
                  />
                  Work
                </label>
                <label>
                  <input
                    className='mr-1'
                    type='radio'
                    name='type'
                    value='learning'
                  />
                  Learning
                </label>
                <label>
                  <input
                    className='mr-1'
                    type='radio'
                    name='type'
                    value='interesting-thing'
                  />
                  Interesting thing
                </label>
              </div>
              <div className='mt-2'>
                <textarea
                  ref={textareaRef}
                  name='text'
                  className='w-full text-gray-700'
                  placeholder='Write your entry...'
                  required
                />
              </div>
              <div className='mt-1 text-right'>
                <button
                  className='bg-blue-500 px-4 py-1 font-medium text-white '
                  type='submit'
                >
                  {state === 'submitting' ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </fieldset>
        </Form>
      </div>

      <div className='mt-6'>
        <p className='font-bold'>
          Week of March 30<sup>th</sup>
        </p>

        <div className='mt-3 space-y-4'>
          <div>
            <p>Work</p>
            <ul className='ml-8 list-disc '>
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Learnings</p>
            <ul className='ml-8 list-disc '>
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Interesting things</p>
            <ul className='ml-8 list-disc '>
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
