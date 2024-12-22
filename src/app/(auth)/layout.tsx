import * as React from 'react';
import { FC, PropsWithChildren } from 'react';
import { Cross } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';
import { ModeToggle } from '../../components/mode-toggle';

export const metadata: Metadata = {
  title: 'Авторизація',
};

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <ModeToggle className="absolute right-7 top-7" />
      <div className="ml-7 my-7 relative hidden h-[90vh] rounded-2xl flex-col bg-muted p-10 text-white lg:flex dark:border-r bg-gradient-to-b from-[#0039CC] to-[#0072F8] shadow-xl">
        <Image
          src="/images/auth-grid.svg"
          alt="Auth Grid"
          className="absolute object-cover z-30 w-full h-full rounded-2xl inset-0"
          width={1000}
          height={1000}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Cross className="size-8 mr-2" />
          <div className="grid flex-1 text-left text-lg leading-tight">
            <span className="truncate font-semibold">DentistCab</span>
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">Сяйво вашої посмішки — наша турбота!</p>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
