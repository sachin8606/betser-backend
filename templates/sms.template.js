exports.accountRegistrationOtp = (otp,user_name) => {
    return `${otp} is OTP for Be Help App Sign Up by ${user_name}`
}
exports.loginOtpTemplate = (otp,user_name) => {
    return `${otp} is OTP for Be Help App Sign In by ${user_name}`
}
exports.addTrustedContactTemplate = (sender,mobile) => {
    return `You’re Trusted! ${sender}, ${mobile} has added you as a Trusted Contact. Please be ready to help by downloading the BE Help app: <app link>. Accept and activate now!`
}
