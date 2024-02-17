import { create } from "zustand";

// Amplify
import { Auth } from "aws-amplify";

type AuthStoreState = {
  isLoading: boolean;
  user: any;
  signInForm: SignInForm;
  newPassword: string;
  smsCode: string;
  updateSignInForm: (name: string, value: string) => void;
  updateNewPassword: (value: string) => void;
  updateSmsCode: (value: string) => void;
  signIn: () => Promise<string>;
  completeNewPassword: () => Promise<string>;
  completeSmsMfa: () => Promise<string>;
};

type SignInForm = {
  username: string;
  password: string;
};

const useAuthStore = create<AuthStoreState>((set) => ({
  isLoading: false,
  user: {},
  signInForm: { username: "", password: "" },
  newPassword: "",
  smsCode: "",
  updateSignInForm: (name: string, value: string) =>
    set((state) => ({
      signInForm: { ...state.signInForm, [name]: value },
    })),
  updateNewPassword: (value: string) =>
    set((state) => ({
      newPassword: value,
    })),
  signIn: async () => {
    try {
      set(() => ({ isLoading: true }));

      const user = await Auth.signIn(
        useAuthStore.getState().signInForm.username,
        useAuthStore.getState().signInForm.password
      );

      console.log(user);
      set(() => ({ user: user }));

      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        set(() => ({ isLoading: false }));
        return "changePassword";
      }
      //   SMS MFA
      else if (
        user.challengeName === "SMS_MFA" ||
        user.challengeName === "SOFTWARE_TOKEN_MFA"
      ) {
        return "smsMfa";
      } else {
        set(() => ({ isLoading: false }));
        return "home";
      }
    } catch (error) {
      set(() => ({ isLoading: false }));
      console.log("error signing in", error);
      return "error";
    }
  },
  completeNewPassword: async () => {
    try {
      const user = useAuthStore.getState().user;
      console.log(user);

      const res = await Auth.completeNewPassword(
        user,
        useAuthStore.getState().newPassword
        // {
        //   email: user.challengeParam.userAttributes.email,
        //   // phone_number: user.challengeParam.userAttributes.phone_number,
        // }
      );

      console.log(res);

      //   SMS MFA
      if (
        user.challengeName === "SMS_MFA" ||
        user.challengeName === "SOFTWARE_TOKEN_MFA"
      ) {
        return "smsMfa";
      } else {
        set(() => ({ isLoading: false }));
        return "home";
      }
    } catch (error) {
      set(() => ({ isLoading: false }));
      console.log("error signing in", error);
      return "error";
    }
  },
  updateSmsCode: (value: string) => {
    set((state) => ({
      smsCode: value,
    }));
  },
  completeSmsMfa: async () => {
    try {
      const user = useAuthStore.getState().user;
      console.log(user);

      const loggedUser = await Auth.confirmSignIn(
        user,
        useAuthStore.getState().smsCode, // Code
        user.challengeName // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
      );

      console.log(loggedUser);

      return "loggedUser";
    } catch (error) {
      console.log(error);
      return "error";
    }
  },
}));

export default useAuthStore;
