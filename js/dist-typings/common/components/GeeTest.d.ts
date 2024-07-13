import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import GeeTestCaptchaStates from '@/common/states/GeeTestCaptchaStates';
interface GeeTestAttrs extends ComponentAttrs {
    state: GeeTestCaptchaStates;
}
export default class GeeTest extends Component<GeeTestAttrs> {
    oninit(vnode: Mithril.Vnode<any, this>): void;
    view(): JSX.Element;
    oncreate(vnode: Mithril.VnodeDOM<any, this>): void;
}
export {};
