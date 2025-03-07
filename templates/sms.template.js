exports.accountRegistrationOtp = (otp) => {
    return `OTP for BE Help account registration is: ${otp}`
}
exports.loginOtpTemplate = (otp) => {
    return `OTP for BE Help login is: ${otp}`
}
exports.addTrustedContactTemplate = (sender,mobile) => {
    return `You’re Trusted! ${sender}, ${mobile} has added you as a Trusted Contact. Please be ready to help by downloading the BE Help app: <app link>. Accept and activate now!`
}
