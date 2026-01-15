import { FormProvider, useForm } from 'react-hook-form';
import { CompanyRegistrationForm } from '../../domain/auth/Form.type';
export default function AuthFormContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const method = useForm<CompanyRegistrationForm>({
        mode: 'onBlur',
        shouldUnregister: false,
        defaultValues: {
            country: 'China',
        },
    });
    return <FormProvider {...method}>{children}</FormProvider>;
}