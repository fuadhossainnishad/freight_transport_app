import { useAuth } from "../../../app/context/Auth.context";
import Screen from "../../../shared/components/Screen";

export default function AuthScreen({ children }: { children: React.ReactNode }) {
    const auth = useAuth()
    return <Screen>{children}</Screen>;
}