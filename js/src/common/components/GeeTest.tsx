import app from 'flarum/common/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import load from 'external-load';
import Mithril from 'mithril';
import { EnumProductService, EnumProductServiceInit, productServiceJs } from '@/common/enums/EnumProductService';
import GeeTestCaptchaStates from '@/common/states/GeeTestCaptchaStates';
import { omit } from 'lodash-es';
import CommonSettings from '@/common/utils/Settings';

async function addResources(productService: EnumProductService) {
  // console.log('[productService]', productService);
  if (app.geetestLoaded) return;

  await load.js(`${CommonSettings.getAssetsPath()}/${productServiceJs[productService]}.js`);

  app.geetestLoaded = true;
}

interface GeeTestAttrs extends ComponentAttrs {
  state: GeeTestCaptchaStates;
}

export default class GeeTest extends Component<GeeTestAttrs> {
  oninit(vnode: Mithril.Vnode<any, this>) {
    super.oninit(vnode);
  }

  view() {
    return <div className="Form-group geetest-captcha" {...omit(this.attrs, ['state'])}></div>;
  }

  oncreate(vnode: Mithril.VnodeDOM<any, this>) {
    super.oncreate(vnode);

    addResources(this.attrs.state.config.productService).then(() => {
      const interval = setInterval(() => {
        if (window[EnumProductServiceInit.V4] || window[EnumProductServiceInit.V3]) {
          clearInterval(interval);

          this.attrs.state.render(vnode.dom);
        }
      }, 250);
    });
  }
}
