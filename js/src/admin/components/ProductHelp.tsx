import Component from 'flarum/common/Component';
import { EnumProduct } from '@/common/enums/EnumProduct';
import { camelCase } from 'lodash-es';
import CommonSettings from '@/common/utils/Settings';
import translate from '@/common/utils/translate';

export default class ProductHelp extends Component {
  isMouseOver = false;
  productMouseTimer: any;

  view() {
    return (
      <i
        aria-hidden="true"
        className={'icon fas fa-question-circle Button-icon ffans-geetest--product-help'.concat(this.isMouseOver ? ' is-hover' : '')}
        onmouseenter={this.handleProductMouseEnter.bind(this)}
        onmouseleave={this.handleProductMouseLeave.bind(this)}
      >
        {this.getProductTooltip()}
      </i>
    );
  }

  getProductTooltip() {
    return (
      <div className="dl-tooltip">
        {Object.keys(EnumProduct).map((enumKey) => {
          const key = camelCase(EnumProduct[enumKey as keyof typeof EnumProduct]);
          return (
            <dl>
              <dt>{translate.admin(`settings.config.product_${key}_label`)}</dt>
              <dd>{translate.admin(`settings.config.product_${key}_help_text`)}</dd>
              <dd>
                <img alt={key} src={`${CommonSettings.getAssetsPath()}/images/${key}.gif`} />
              </dd>
            </dl>
          );
        })}

        <a target="_blank" href="https://console.geetest.com/sensbot/set/interface/baseinterface/">
          <i aria-hidden="true" class="icon fas fa-question-circle Button-icon" />
          <span>{translate.admin(`settings.config.product_learn_more_link`)}</span>
        </a>
      </div>
    );
  }

  handleProductMouseEnter() {
    clearTimeout(this.productMouseTimer);
    this.isMouseOver = true;
    m.redraw();
  }

  handleProductMouseLeave() {
    clearTimeout(this.productMouseTimer);
    this.productMouseTimer = setTimeout(() => {
      this.isMouseOver = false;
      m.redraw();
    }, 100);
  }
}
