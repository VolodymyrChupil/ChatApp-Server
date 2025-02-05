export function emailConfirmationTmp(code: string) {
  return `<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;background-repeat:repeat;width:100%; font-size: 16px; line-height:1.5; padding:20px 0;">
         <tr>
            <td align="center">
               <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;">
                  <tr>
                     <td style="padding: 10px; border-top: 7px solid #696969; border-bottom: 7px solid #696969; text-align: left;">
                        <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; vertical-align: middle;">
                           <tr>
                              <td style="padding-right: 10px; vertical-align: middle;">
                                 <img src="https://drive.google.com/uc?id=1EI1SlLh-O9kH-GXyMbqZLKM0yk4h6zDq" alt="ChatApp Logo" style="display: block;">
                              </td>
                              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #333; vertical-align: middle;">
                                 ChatApp
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 18px;">
                        <p>
                           Thank you for registering on our website.
                           To confirm your email follow this <a href="${process.env.SERVER_URL}/register/${code}">link</a>
                        </p>
                        <p>
                            If you did not registered on our website disregard this email.</b>
                        </p>
                        <p>Sincerely, ChatApp.</p>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
}

export function verificationCodeTmp(code: string) {
  return `<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;background-repeat:repeat;width:100%; font-size: 16px; line-height:1.5; padding:20px 0;">
         <tr>
            <td align="center">
               <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;">
                  <tr>
                     <td style="padding: 10px; border-top: 7px solid #696969; border-bottom: 7px solid #696969; text-align: left;">
                        <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; vertical-align: middle;">
                           <tr>
                              <td style="padding-right: 10px; vertical-align: middle;">
                                 <img src="https://drive.google.com/uc?id=1EI1SlLh-O9kH-GXyMbqZLKM0yk4h6zDq" alt="ChatApp Logo" style="display: block;">
                              </td>
                              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #333; vertical-align: middle;">
                                 ChatApp
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 18px;">
                        <p>
                           Hi! Here is a temporary security code for your ChatApp Account. It can only be used once within the next <b>5</b> minutes, after which it will expire:
                        </p>
                        <p style="margin: 15px 0; font-weight: 600;">${code}</p>
                        <p>
                           Did you receive this email without having an active request from ChatApp to enter a verification code? If so, the security of your ChatApp account may be compromised. <b>Change your password as soon as possible.</b>
                        </p>
                        <p>Sincerely, ChatApp.</p>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
}

export function passwordChangeTmp(code: string) {
  return `<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;background-repeat:repeat;width:100%; font-size: 16px; line-heigth:1.3; padding:20px 0">
         <tr>
            <td align="center">
               <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;">
                  <tr>
                     <td style="padding: 10px; border-top: 7px solid #696969; border-bottom: 7px solid #696969; text-align: left;">
                        <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; vertical-align: middle;">
                           <tr>
                              <td style="padding-right: 10px; vertical-align: middle;">
                                 <img src="https://drive.google.com/uc?id=1EI1SlLh-O9kH-GXyMbqZLKM0yk4h6zDq" alt="ChatApp Logo" style="display: block;">
                              </td>
                              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #333; vertical-align: middle;">
                                 ChatApp
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 18px;">
                        <p>
                           Hi! Here is a temporary security code to change a password to your ChatApp Account. It can only be used once within the next <b>5</b> minutes, after which it will expire:
                        </p>
                        </p>
                        <p style="margin: 15px 0; font-weight: 600;">${code}</p>
                        <p>Sincerely, ChatApp.</p>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
}

export function passwordResetTmp(code: string) {
  return `<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;background-repeat:repeat;width:100%; font-size: 16px; line-height:1.5; padding:20px 0;">
         <tr>
            <td align="center">
               <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;">
                  <tr>
                     <td style="padding: 10px; border-top: 7px solid #696969; border-bottom: 7px solid #696969; text-align: left;">
                        <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; vertical-align: middle;">
                           <tr>
                              <td style="padding-right: 10px; vertical-align: middle;">
                                 <img src="https://drive.google.com/uc?id=1EI1SlLh-O9kH-GXyMbqZLKM0yk4h6zDq" alt="ChatApp Logo" style="display: block;">
                              </td>
                              <td style="font-family: Arial, sans-serif; font-size: 20px; font-weight: bold; color: #333; vertical-align: middle;">
                                 ChatApp
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
                  <tr>
                     <td style="padding: 10px; font-family: Arial, sans-serif; font-size: 18px;">
                        <p>
                           We received a request to reset the password for your account.  If you made this request, follow the instructions below to reset your password. If you did not request a password reset, disregard this email.
                        </p>
                        <p>
                           To reset your password, follow this <a href="${process.env.CLIENT_URL}/reset-pwd?code=${code}">link</a>
                        </p>
                        <p>Sincerely, ChatApp.</p>
                     </td>
                  </tr>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
}
