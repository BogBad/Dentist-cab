import { redirect } from 'next/navigation';
import { auth } from '../../auth';
import * as React from 'react';
import UserAuthForm from './components/user-auth-form';

const HomePage = async () => {
  const session = await auth();
  if (session?.user) {
    return redirect('/dashboard');
  }

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Вхід / Реєстрація
        </h1>
        <p className="text-md">Введіть свою електронну пошту та пароль</p>
        <p className="text-sm text-muted-foreground">
          При введені нової пошти створюється новий аккаут
        </p>
      </div>
      <UserAuthForm />
    </>
  );
};

export default HomePage;
