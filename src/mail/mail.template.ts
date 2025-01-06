export function emailConfirmationTmp(email: string, code: string) {
  return `To confirm your email follow this <a href="${process.env.SERVER_URL}/register/${code}">link</a>`
}

export function verificationCodeTmp(email: string, code: string) {
  return `Your code is : ${code}`
}

export function passwordChangeTmp(email: string, code: string) {
  return `Your code is : ${code}`
}

export function passwordResetTmp(email: string, code: string) {
  return `To reset your password follow this <a href="${process.env.SERVER_URL}/auth/reset-pwd/${code}">link</a>`
}
