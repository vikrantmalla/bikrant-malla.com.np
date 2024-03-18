declare namespace Forms {
  interface LogInSubmitForm {
    loginEmail: string
    loginPassword: string
  }

  interface SignUpSubmitForm {
    signupEmail: string
    signupPassword: string
    signupConfirmPassword: string
  }
}


export = Forms
