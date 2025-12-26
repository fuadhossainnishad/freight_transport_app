import CompanyProfileIcon from '../assets/icons/companyProfile.svg';
import AppColorIcon from '../assets/icons/appColor.svg';
import UserIcon from '../assets/icons/user.svg';
import RoleIcon from '../assets/icons/role.svg';
import MailIcon from '../assets/icons/mail.svg';
import SubscriptionIcon from '../assets/icons/subscription.svg';
import AboutIcon from '../assets/icons/about.svg';
import RateIcon from '../assets/icons/rate.svg';
import PPIcon from '../assets/icons/pp.svg';
import { JSX } from 'react';
import { SettingsStackParamList } from '../navigation/SettingsNavigator';

export type SettingItem =
  | {
      name: string;
      icon: JSX.Element;
      route: Exclude<keyof SettingsStackParamList, 'InfoScreen'>;
    }
  | {
      name: string;
      icon: JSX.Element;
      route: 'InfoScreen';
      params: { title: string; slug: string; content: string };
    }
  | {
      name: string;
      icon: JSX.Element;
      route: 'InfoScreen';
      params: { title: string; slug: string; content: string };
    };

export const BusinessSettingsArray: SettingItem[] = [
  {
    name: 'Company Profile',
    icon: <CompanyProfileIcon height={24} width={24} />,
    route: 'Profile',
  },
  {
    name: 'App Color',
    icon: <AppColorIcon height={24} width={24} />,
    route: 'Appcolor',
  },
  {
    name: 'Users',
    icon: <UserIcon height={24} width={24} />,
    route: 'Users',
  },
  {
    name: 'Roles',
    icon: <RoleIcon height={24} width={24} />,
    route: 'RolePermission',
  },
  {
    name: 'Email Settings',
    icon: <MailIcon height={24} width={24} />,
    route: 'MailSettings',
  },
  {
    name: 'Subscription',
    icon: <SubscriptionIcon height={24} width={24} />,
    route: 'Subscription',
  },
];

export const OthersSettingsArray: SettingItem[] = [
  {
    name: 'About App',
    icon: <AboutIcon height={24} width={24} />,
    route: 'InfoScreen',
    params: {
      content: 'This is About App',
      slug: 'about-us',
      title: 'About App',
    },
  },
  {
    name: 'Rate App',
    icon: <RateIcon height={24} width={24} />,
    route: 'MailSettings',
  },

  {
    name: 'Privacy Policy',
    icon: <PPIcon height={24} width={24} />,
    route: 'InfoScreen',
    params: {
      content: 'This is Privacy Policy',
      slug: 'privacy-policy',
      title: 'Privacy Policy',
    },
  },
  {
    name: 'Terms & Conditions',
    icon: <PPIcon height={24} width={24} />,
    route: 'InfoScreen',
    params: {
      content: 'This is Terms & Conditions',
      slug: 'terms-conditions',
      title: 'Terms & Conditions',
    },
  },
];
