import ContextEventConfig from '@/admin/components/ContextEventConfig';
import Stream from 'flarum/common/utils/Stream';
import SettingsModal, { ISettingsModalAttrs } from 'flarum/admin/components/SettingsModal';
import Mithril from 'mithril';
import AdminSettings, { getContextEventSettings } from '@/admin/utils/Settings';
import saveSettings from 'flarum/admin/utils/saveSettings';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
import { BaseConfig } from '@/common/utils/Settings';
import { MutableSettings } from 'flarum/admin/components/AdminPage';
import message from '@/common/utils/message';
import Switch from 'flarum/common/components/Switch';
import translate from '@/common/utils/translate';

interface ContextEventConfigModalAttrs extends ISettingsModalAttrs {
  contextEvent: EnumContextEvent;
}

interface Settings extends MutableSettings, BaseConfig {}

export default class ContextEventConfigModal extends SettingsModal<ContextEventConfigModalAttrs> {
  settings: Settings = {} as BaseConfig;

  className() {
    // Custom CSS classes to apply to the modal
    return 'context-event-config-modal';
  }

  title() {
    // Content to show in the modal's title bar
    return (
      <p>
        {translate.admin('settings.config.title', {
          context: translate.admin(`settings.context_event_${this.attrs.contextEvent}_label`),
        })}
      </p>
    );
  }

  oninit(vnode: Mithril.Vnode<ContextEventConfigModalAttrs, this>) {
    super.oninit(vnode);

    const settings = getContextEventSettings(this.attrs.contextEvent);

    Object.keys(settings).forEach((key) => {
      if (key === 'standalone') return;

      const path = this.getSettingPath(key);
      this.settings[path] = Stream(settings[key as keyof typeof settings]);
    });

    this.settings[this.getSettingPath('standalone')] = Stream(settings.standalone === '1');
  }

  getSettingPath(key?: string) {
    return AdminSettings.getPath(this.attrs.contextEvent) + (key ? `.${key}` : '');
  }

  form() {
    return (
      <div className="Form-group">
        <div className="Form-group">
          <label>{translate.admin('settings.config.standalone_label')}</label>
          <div className="helpText">{translate.admin('settings.config.standalone_help_text')}</div>
          <div class="flex ai-c">
            <Switch state={this.settings[this.getSettingPath('standalone')]?.()} onchange={this.settings[this.getSettingPath('standalone')]}>
              {translate.get('core.admin.extension.enabled')}
            </Switch>
          </div>
        </div>
        {this.settings[this.getSettingPath('standalone')]?.() && (
          <ContextEventConfig
            stream={{
              id: this.settings[this.getSettingPath('id')],
              key: this.settings[this.getSettingPath('key')],
              product: this.settings[this.getSettingPath('product')],
            }}
          ></ContextEventConfig>
        )}
      </div>
    );
  }

  onsubmit(e: SubmitEvent) {
    e.preventDefault();

    message.clear();
    this.loading = true;

    saveSettings(this.dirty())
      .then(() => {
        message.saved();
        this.onsaved();
        window.location.reload();
      })
      .finally(() => {
        this.loaded();
      });
  }
}
