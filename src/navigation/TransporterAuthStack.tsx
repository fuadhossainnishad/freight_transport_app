import { useUser } from '../app/context/User.context';
import { FormProvider } from 'react-hook-form';

const TransporterAuthParamList = {};
export default function TransporterAuthStack() {
  const { user } = useUser();
  return <FormProvider>{user.role === 'shipper' ? '' : ''}</FormProvider>;
}
