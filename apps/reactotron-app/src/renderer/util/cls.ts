import classNames from 'classnames';
// import { twMerge } from 'tailwind-merge';

export type ClassNameParams = Parameters<typeof classNames>;

export const cls = (...inputs: ClassNameParams) => {
  return classNames(...inputs);
};
