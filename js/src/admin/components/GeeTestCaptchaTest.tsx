import type Mithril from 'mithril';
import app from 'flarum/admin/app';

import Component, { ComponentAttrs } from 'flarum/common/Component';
import GeeTestCaptchaStates from '../../common/states/GeeTestCaptchaStates';
import Button from 'flarum/common/components/Button';
import Alert from 'flarum/common/components/Alert';
import classList from 'flarum/common/utils/classList';
import GeeTest from '@/common/components/GeeTest';
import Stream from 'flarum/common/utils/Stream';
import AdminSettings from '@/admin/utils/Settings';
import { Config } from '@/common/utils/Settings';
import translate from '@/common/utils/translate';

type BindSuccessEvent = SubmitEvent & { __isBindSuccess: boolean };

type GeeTestCaptchaTestAttrs = ComponentAttrs & {
  settings: {
    [p in keyof Config]: Stream<string>;
  };
};

export default class GeeTestCaptchaTest extends Component<GeeTestCaptchaTestAttrs, GeeTestCaptchaStates | null> {
  loading = false;
  alertAttrs: any;

  view(vnode: Mithril.Vnode<ComponentAttrs, this>): Mithril.Children {
    return (
      <div className="RecaptchaPage-geetest">
        <div class="ExtensionPage-permissions-header">
          <div class="container">
            <h2 className="ExtensionTitle">{translate.admin('test.title')}</h2>
          </div>
        </div>
        <div class="container">
          <form onsubmit={this.onsubmit.bind(this)} className={classList('FoFReCaptchaTestForm', this.state?.isBind && 'isInvisible')}>
            <div class="Form-group Form-group--geetest">
              <p class="helpText">{translate.admin('test.help_text')}</p>

              {this.alertAttrs && <Alert {...this.alertAttrs} dismissible={false} />}

              {this.state && <GeeTest state={this.state} style="width: 260px;" />}
            </div>

            <div class="Form-group">
              <div class="ButtonGroup">
                <Button className="Button Button--primary" type="submit" loading={this.loading}>
                  {this.state ? translate.admin('test.submit_button') : translate.admin('test.load_button')}
                </Button>

                {this.state && (
                  <Button className="Button" onclick={this.initialize.bind(this)}>
                    {translate.admin('test.reload_button')}
                  </Button>
                )}
              </div>
            </div>

            <div class="Form-group"></div>
          </form>
        </div>
      </div>
    );
  }

  destroy() {
    this.state = null;
    this.alertAttrs = null;
    this.loading = false;

    m.redraw.sync();
  }

  initialize() {
    this.destroy();

    const data = this.attrs.settings || AdminSettings.getDefaultConfig();

    this.loading = true;
    this.state = new GeeTestCaptchaStates(
      data,
      () => {
        this.loading = false;
        m.redraw();
      },
      () => {
        if (this.state?.isBind) {
          // onsubmit is caught when isBind, so we need to emit it again after validate
          // Create "fake" event so this works when other extensions extend onsubmit as well
          const event = new Event('submit') as BindSuccessEvent;
          event.__isBindSuccess = true;
          this.onsubmit(event);
        }
        this.loading = false;
        m.redraw();
      },
      (alertAttrs) => {
        // Removes the spinner on the submit button so we can try again
        this.alertAttrs = alertAttrs;
        this.loading = false;
        m.redraw();
      }
    );
  }

  async onsubmit(e: BindSuccessEvent) {
    e.preventDefault();

    if (!this.state) {
      return this.initialize();
    }

    if (this.state.isBind && !e.__isBindSuccess) {
      // When geetest is bind to button, onsubmit will be called two times
      // First time with normal event, we will call geetest.show()
      // Second time is called from geetest callback with a special __isBindSuccess attribute
      e.preventDefault();
      this.state.show();
      return;
    }

    this.alertAttrs = null;
    this.loading = true;
    m.redraw();

    const body = {
      'ffans-geetest-result': this.state.getValidate(),
    };

    try {
      await app.request({
        method: 'POST',
        url: `${app.forum.attribute('apiUrl')}/ffans/geetest/test`,
        body,
        errorHandler: () => {},
      });
    } catch (e) {
      return this.onerror(e);
    }

    this.loading = false;
    this.alertAttrs = {
      type: 'success',
      content: translate.lib('verify.success_message'),
    };
    this.state.reset();
    m.redraw();
  }

  onerror(error: any) {
    const alert = error.alert || error;

    this.loading = false;
    this.alertAttrs = alert;
    this.state?.reset();
    m.redraw();
  }
}
