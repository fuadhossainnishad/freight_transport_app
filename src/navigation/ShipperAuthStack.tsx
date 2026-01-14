import { useUser } from '../app/context/User.context';
import { FormProvider } from 'react-hook-form';

const ShipperAuthParamList = {};
export default function ShipperAuthStack() {
  const { user } = useUser();
  return <FormProvider>{user.role === 'shipper'?  }</FormProvider>;
}
