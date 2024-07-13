import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import GeeTestCaptchaStates from '../../common/states/GeeTestCaptchaStates';
import Stream from 'flarum/common/utils/Stream';
import { Config } from '@/common/utils/Settings';
type BindSuccessEvent = SubmitEvent & {
    __isBindSuccess: boolean;
};
type GeeTestCaptchaTestAttrs = ComponentAttrs & {
    settings: {
        [p in keyof Config]: Stream<string>;
    };
};
export default class GeeTestCaptchaTest extends Component<GeeTestCaptchaTestAttrs, GeeTestCaptchaStates | null> {
    loading: boolean;
    alertAttrs: any;
    view(vnode: Mithril.Vnode<ComponentAttrs, this>): Mithril.Children;
    destroy(): void;
    initialize(): void;
    onsubmit(e: BindSuccessEvent): Promise<void>;
    onerror(error: any): void;
}
export {};
