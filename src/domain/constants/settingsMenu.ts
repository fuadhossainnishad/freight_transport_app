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



export const SETTINGS_MENU = [
  { id: "edit_profile", label: "Edit Profile Details", Icon: Edit },
  { id: "change_password", label: "Change Password", Icon: ChangePassword },
  {
    id: "my_vehicles",
    label: "My Vehicles",
    Icon: Vehicle,
    roles: ["TRANSPORTER"],
  },

  {
    id: "driver_profiles",
    label: "Driver Profiles",
    Icon: Profile,
    roles: ["TRANSPORTER"],
  },

  {
    id: "earning_overview",
    label: "Earning Overview",
    Icon: Earning,
    roles: ["TRANSPORTER"],
  },
  { id: "bank_details", label: "Bank Details", Icon: Bank },
  { id: "issue_report", label: "Issue Reported", Icon: Issue },
  { id: "about", label: "About Us", Icon: About },
  { id: "privacy", label: "Privacy & Security", Icon: Privacy },
  { id: "terms", label: "Terms & Conditions", Icon: Terms },
  { id: "hiring", label: "Lawpantruck is Hiring", Icon: Hiring },
  { id: "carrier_data", label: "Your Carrier Data", Icon: Carrier },
  { id: "faq", label: "FAQ", Icon: Faq },


];