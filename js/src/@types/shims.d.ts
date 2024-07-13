import type GeeTestCaptchaStates from '@/common/states/GeeTestCaptchaStates';

export * from 'flarum/forum/ForumApplication';

declare module 'flarum/forum/ForumApplication' {
  export default interface ForumApplication {
    geetestLoaded: boolean;
  }
}

declare module 'flarum/common/Application' {
  export default interface Application {
    geetestLoaded: boolean;
  }
}

type State = {
  geetestCaptcha: GeeTestCaptchaStates;
};

declare module 'flarum/forum/components/LoginModal' {
  export default interface LoginModal {
    state: State;
  }
}

declare module 'flarum/forum/components/SignUpModal' {
  export default interface SignUpModal {
    state: State;
  }
}

declare module 'flarum/forum/components/ForgotPasswordModal' {
  export default interface ForgotPasswordModal {
    state: State;
  }
}

declare global {
  interface Window {
    initGeetest?: (options: any, callback: (captchaObj: any) => void) => void;
    initGeetest4?: (options: any, callback: (captchaObj: any) => void) => void;
  }
}
