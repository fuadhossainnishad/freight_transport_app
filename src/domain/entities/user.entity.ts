import { PickedFile } from "../../shared/components/DocPicker";

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    avatar?: PickedFile | null

}

export interface ChangePassword {
    current_pasword: string
    new_pasword: string
    confirmed_pasword: string

}