import { extend, override } from 'flarum/common/extend';
import LogInModal from 'flarum/forum/components/LogInModal';

import ForumSettings from '@/forum/utils/Settings';
import GeeTest from '@/common/components/GeeTest';
import GeeTestCaptchaStates from '@/common/states/GeeTestCaptchaStates';
import SignUpModal from 'flarum/forum/components/SignUpModal';
import ForgotPasswordModal from 'flarum/forum/components/ForgotPasswordModal';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
import translate from '@/common/utils/translate';

type BindSuccessEvent = SubmitEvent & { __isBindSuccess: boolean };

export const addCaptchaToAuthModal = <T extends typeof LogInModal | typeof SignUpModal | typeof ForgotPasswordModal>({
  modal,
  contextEvent,
  dataMethod,
}: {
  modal: T;
  contextEvent: EnumContextEvent;
  dataMethod: KeyOfType<T['prototype'], Function> | KeyOfType<T['prototype'], Function>[];
}) => {
  extend(modal.prototype, 'oninit', function () {
    const config = ForumSettings.getConfig(contextEvent);

    console.log('[config]', contextEvent, config);

    if (!config) return;

    this.loading = true;

    this.state = this.state || {};
    this.state.geetestCaptcha = new GeeTestCaptchaStates(
      config,
      () => {
        this.loaded();
      },
      () => {
        if (this.state.geetestCaptcha.isBind) {
          // onsubmit is caught when isBind, so we need to emit it again after validate
          // Create "fake" event so this works when other extensions extend onsubmit as well
          const event = new Event('submit') as BindSuccessEvent;
          event.__isBindSuccess = true;
          this.onsubmit(event);
        }
      },
      (alertAttrs) => {
        // Removes the spinner on the submit button so we can try again
        this.loaded();
        this.alertAttrs = alertAttrs;
      }
    );

    console.log('[state.geetestCaptcha]', this.state.geetestCaptcha);
  });

  extend(modal.prototype, dataMethod, function (data) {
    const config = ForumSettings.getConfig(contextEvent);
    if (!config) return;

    data['ffans-geetest-result'] = this.state.geetestCaptcha.getValidate() || '';
  });
  //
  extend(modal.prototype, 'fields', function (fields) {
    const config = ForumSettings.getConfig(contextEvent);
    if (!config) return;

    fields.add('geetest', <GeeTest state={this.state.geetestCaptcha} />, -5);
  });

  extend(modal.prototype, 'onerror', function (_, error) {
    const config = ForumSettings.getConfig(contextEvent);
    if (!config) return;

    this.state.geetestCaptcha.reset();

    // Set custom error message during login because no error comes back from /login when recaptcha fails
    if (contextEvent === EnumContextEvent.LOGIN && error.alert && (!error.alert.content || !error.alert.content.length)) {
      error.alert.content = translate.lib('verify.error_retry_message') as string;
    }
  });

  override(modal.prototype, 'onsubmit', function (original, e: SubmitEvent | BindSuccessEvent, ...args) {
    const config = ForumSettings.getConfig(contextEvent);

    // When geetest is bind to button, onsubmit will be called two times
    if (config && !this.loading && this.state.geetestCaptcha.isBind && !('__isBindSuccess' in e && e.__isBindSuccess)) {
      try {
        this.state.geetestCaptcha.show();
      } finally {
        e.stopPropagation();
        e.preventDefault();
        console.log('isBind');
      }
      return;
    }
    return original(e);
  });
};

export default () => {
  addCaptchaToAuthModal({ modal: LogInModal, contextEvent: EnumContextEvent.LOGIN, dataMethod: 'loginParams' });
  addCaptchaToAuthModal({ modal: SignUpModal, contextEvent: EnumContextEvent.SIGNUP, dataMethod: 'submitData' });
  addCaptchaToAuthModal({ modal: ForgotPasswordModal, contextEvent: EnumContextEvent.FORGOT, dataMethod: 'requestParams' });
};
