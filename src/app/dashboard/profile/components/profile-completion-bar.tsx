import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Progress } from '../../../../components/ui/progress';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';

interface IndexedUser extends User {
  [key: string]: any;
}

const ProfileCompletionBar = () => {
  const { data } = useSession();
  const user = data?.user as IndexedUser;

  const requiredFields = ['image', 'name', 'surname', 'birthDate', 'email'];
  const completedFields = requiredFields.filter((field) => user[field]);
  const value = (completedFields.length / requiredFields.length) * 100;

  return (
    <Card className="col-start-1 row-start-2">
      <CardHeader>
        <CardTitle>Заповнення профілю</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={value} />
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionBar;
