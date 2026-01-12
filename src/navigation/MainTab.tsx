import { useUser } from '../app/context/User.context';
import ShipperTab from './ShipperTab';
import TransporterTab from './TransporterTab';

export default function MainTab() {
  const { user } = useUser();
  return user?.role === 'shipper' ? <ShipperTab /> : <TransporterTab />;
}
