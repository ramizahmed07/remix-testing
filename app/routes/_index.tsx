import { PrismaClient } from '@prisma/client';
import { Form, redirect } from '@remix-run/react';
import type { ActionFunctionArgs } from '@remix-run/node';

const db = new PrismaClient();

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { date, type, text } = Object.fromEntries(formData);
  if (
    typeof date !== 'string' ||
    typeof type !== 'string' ||
    typeof text !== 'string'
  ) {
    throw new Error('Bad request');
  }
  await db.entry.create({
    data: {
      date: new Date(date),
      type,
      text,
    },
  });
  return redirect('/');
}

export default function Index() {
  return (
    <div className='p-10'>
      <h1 className='text-5xl'>Work Journal</h1>
      <p className='mt-2 text-lg text-gray-400'>
        Learnings and doings. Updated weekly.
      </p>

      <div className='my-8 border p-2'>
        <Form method='post'>
          <p className='italic'>Create an entry</p>
          <div>
            <div className='mt-4'>
              <input type='date' name='date' className='text-gray-700' />
            </div>
            <div className='mt-2 space-x-4'>
              <label>
                <input className='mr-1' type='radio' name='type' value='work' />
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
                name='text'
                className='w-full text-gray-700'
                placeholder='Write your entry...'
              />
            </div>
            <div className='mt-1 text-right'>
              <button
                className='bg-blue-500 px-4 py-1 font-medium text-white '
                type='submit'
              >
                Save
              </button>
            </div>
          </div>
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
