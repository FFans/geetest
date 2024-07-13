import Component, { ComponentAttrs } from 'flarum/common/Component';
import Stream from 'flarum/common/utils/Stream';
import Mithril from 'mithril';
import { StreamConfig } from '@/common/utils/Settings';
interface ContextEventConfigAttrs extends ComponentAttrs {
    stream: StreamConfig;
    showHelp?: boolean;
}
export default class ContextEventConfig extends Component<ContextEventConfigAttrs> {
    product: Stream<string>;
    id: Stream<string>;
    key: Stream<string>;
    oninit(vnode: Mithril.Vnode<ContextEventConfigAttrs, this>): void;
    view(): JSX.Element;
    handleTrimInput(target: typeof Stream, e: InputEvent): void;
}
export {};
