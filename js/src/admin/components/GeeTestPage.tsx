import Mithril from 'mithril';

import app from 'flarum/admin/app';
import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';

import { getOptionsProductService } from '@/common/enums/EnumProductService';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';
import ContextEventConfigModal from '@/admin/components/ContextEventConfigModal';
import ContextEventConfig from '@/admin/components/ContextEventConfig';
import AdminSettings from '@/admin/utils/Settings';
import { CONFIG } from '@/common/utils/Settings';
import ItemList from 'flarum/common/utils/ItemList';
import GeeTestCaptchaTest from '@/admin/components/GeeTestCaptchaTest';
import { camelCase, snakeCase } from 'lodash-es';
import translate from '@/common/utils/translate';

export default class GeeTestPage extends ExtensionPage {
  oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);

    // settings
    CONFIG.forEach((key) => {
      const settingKey = snakeCase(key);
      this.settings[AdminSettings.getPath(settingKey)] = Stream(AdminSettings.get(settingKey));
    });

    // context enabled status
    Object.keys(EnumContextEvent).forEach((enumKey) => {
      const key = EnumContextEvent[enumKey as keyof typeof EnumContextEvent];
      const path = AdminSettings.getPath(key);
      const value = this.settings[path]();
      this.settings[path](value === '1');
    });

    // console.log('[this.settings]', this.settings);
  }

  content() {
    return (
      <div className="geetest-page ExtensionPage-settings">
        <div className="container">
          <div className="Form">
            <div className="Form-group">
              <label>{translate.admin('settings.product_service_label')}</label>
              <div className="helpText">{translate.admin('settings.product_service_help_text')}</div>
              <Select
                options={getOptionsProductService()}
                value={this.settings[AdminSettings.getPath(snakeCase('productService'))]()}
                onchange={this.settings[AdminSettings.getPath(snakeCase('productService'))]}
              ></Select>
            </div>

            <ContextEventConfig
              stream={{
                product: this.settings[AdminSettings.getPath('product')],
                id: this.settings[AdminSettings.getPath('id')],
                key: this.settings[AdminSettings.getPath('key')],
              }}
              showHelp={true}
            ></ContextEventConfig>

            <div className="Form-group">
              <label>{translate.admin('settings.context_event_label')}</label>
              <div className="helpText">{translate.admin('settings.context_event_help_text')}</div>
              {Object.values(EnumContextEvent).map((contextEvent) => {
                const path = AdminSettings.getPath(contextEvent);

                return (
                  <div class="flex ai-c gap-4">
                    <Switch state={this.settings[path]()} onchange={this.settings[path]}>
                      {translate.admin(`settings.context_event_${contextEvent}_label`)}
                    </Switch>
                    {this.settings[path]() && (
                      <Button
                        type="button"
                        aria-label={`Config ${contextEvent}`}
                        class="Button Button--rounded Button--flat w-36 py-8 px-0"
                        onclick={this.handleOpenContextEventConfig.bind(this, contextEvent)}
                      >
                        <i class="icon fas fa-cog"></i>
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="Form-group">{this.submitButton()}</div>
          </div>
        </div>
      </div>
    );
  }

  sections(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): ItemList<unknown> {
    const items = super.sections(vnode);

    const settings = { ...this.settings };

    // console.log('[page settings]', settings);

    // format current normal config
    for (const key in settings) {
      if (settings[key] instanceof Function) {
        const camelCaseKey = camelCase(key.replace(AdminSettings.PREFIX + '.', ''));
        // make sure the Stream value is binding this
        settings[camelCaseKey] = settings[key].call(this);
        delete settings[key];
      }
    }

    // console.log('[test settings]', settings);

    items.add('geetest', <GeeTestCaptchaTest settings={settings} />);

    items.setPriority('permissions', -1);

    return items;
  }

  handleOpenContextEventConfig(contextEvent: EnumContextEvent) {
    app.modal.show(
      ContextEventConfigModal,
      {
        contextEvent: contextEvent,
      },
      true
    );
  }
}
