export type AuthParamList = {
    RootAuth: undefined;
    SignIn: undefined
    ForgotPassword: undefined;
    VerifyOtp: {
        email: string,
        verificationToken: string
    }
    ResetPassword: { verificationToken: string };
};

