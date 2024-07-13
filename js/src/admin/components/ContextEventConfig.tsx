import Component, { ComponentAttrs } from 'flarum/common/Component';
import Select from 'flarum/common/components/Select';
import { getOptionsProduct } from '@/common/enums/EnumProduct';
import Stream from 'flarum/common/utils/Stream';
import Mithril from 'mithril';
import ProductHelp from '@/admin/components/ProductHelp';
import { StreamConfig } from '@/common/utils/Settings';
import translate from '@/common/utils/translate';

interface ContextEventConfigAttrs extends ComponentAttrs {
  stream: StreamConfig;
  showHelp?: boolean;
}

export default class ContextEventConfig extends Component<ContextEventConfigAttrs> {
  product: Stream<string>;
  id: Stream<string>;
  key: Stream<string>;

  oninit(vnode: Mithril.Vnode<ContextEventConfigAttrs, this>) {
    super.oninit(vnode);
    this.product = this.attrs.stream.product;
    this.id = this.attrs.stream.id;
    this.key = this.attrs.stream.key;
  }

  view() {
    return (
      <div className="Form-group">
        <div className="Form-group">
          <label>{translate.admin('settings.config.product_label')}</label>
          <div className="helpText">
            {translate.admin('settings.config.product_help_text')} {this.attrs.showHelp && <ProductHelp />}
          </div>
          <Select options={getOptionsProduct()} value={this.product?.()} onchange={this.product}></Select>
        </div>
        <div className="Form-group">
          <label>{translate.admin('settings.config.id_label')}</label>
          <div className="helpText">
            {translate.admin('settings.config.id_help_text', {
              a: <a href="https://auth.geetest.com/product" tabindex="-1" target="_blank" />,
            })}
          </div>
          <input type="text" className="FormControl" bidi={this.id} />
        </div>
        <div className="Form-group">
          <label>{translate.admin('settings.config.key_label')}</label>
          <div className="helpText">
            {translate.admin('settings.config.key_help_text', {
              a: <a href="https://auth.geetest.com/product" tabindex="-1" target="_blank" />,
            })}
          </div>
          <input type="password" autocomplete="off" className="FormControl" bidi={this.key} />
        </div>
      </div>
    );
  }

  handleTrimInput(target: typeof Stream, e: InputEvent) {
    const value = e.target?.value;
    if (value) {
      target(value.trim());
    } else {
      target('');
    }
  }
}
