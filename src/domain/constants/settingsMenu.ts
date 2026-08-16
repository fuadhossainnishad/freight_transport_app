import type { FC } from 'react'
import type { SvgProps } from 'react-native-svg'
import type { ParseKeys } from 'i18next'

import Edit from '../../../assets/icons/edit2.svg'
import ChangePassword from '../../../assets/icons/change_password.svg'
import Bank from '../../../assets/icons/bank.svg'
import Issue from '../../../assets/icons/issue.svg'
import About from '../../../assets/icons/about.svg'
import Terms from '../../../assets/icons/term.svg'
import Hiring from '../../../assets/icons/hiting.svg'
import Carrier from '../../../assets/icons/carrier.svg'
import Faq from '../../../assets/icons/faq2.svg'
import Privacy from '../../../assets/icons/privacy.svg'
import Vehicle from '../../../assets/icons/truck.svg'
import Earning from '../../../assets/icons/earning.svg'
import Profile from '../../../assets/icons/User.svg'

export type SettingsMenuItem = {
  /** Navigation switch key in SettingsScreen — never translate. */
  id: string
  /** Resolved with t() at the render site; module scope has no hook access.
   *  Typed as ParseKeys so a bad key fails the build. */
  labelKey: ParseKeys
  Icon: FC<SvgProps>
  roles?: string[]
}

export const SETTINGS_MENU: SettingsMenuItem[] = [
  { id: "edit_profile", labelKey: "settings.menu.editProfile", Icon: Edit },
  { id: "change_password", labelKey: "settings.menu.changePassword", Icon: ChangePassword },
  {
    id: "my_vehicles",
    labelKey: "settings.menu.myVehicles",
    Icon: Vehicle,
    roles: ["TRANSPORTER"],
  },

  {
    id: "driver_profiles",
    labelKey: "settings.menu.myDrivers",
    Icon: Profile,
    roles: ["TRANSPORTER"],
  },

  {
    id: "earning_overview",
    labelKey: "settings.menu.earningOverview",
    Icon: Earning,
    roles: ["TRANSPORTER"],
  },
  { id: "bank_details", labelKey: "settings.menu.bankDetails", Icon: Bank },
  { id: "issue_report", labelKey: "settings.menu.issueReported", Icon: Issue },
  { id: "about", labelKey: "settings.menu.about", Icon: About },
  { id: "privacy", labelKey: "settings.menu.privacy", Icon: Privacy },
  { id: "terms", labelKey: "settings.menu.terms", Icon: Terms },
  { id: "hiring", labelKey: "settings.menu.hiring", Icon: Hiring },
  { id: "carrier_data", labelKey: "settings.menu.carrierData", Icon: Carrier },
  { id: "faq", labelKey: "settings.menu.faq", Icon: Faq },
];
