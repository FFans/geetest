import Mithril from 'mithril';
import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
import ItemList from 'flarum/common/utils/ItemList';
export default class GeeTestPage extends ExtensionPage {
    oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>): void;
    content(): JSX.Element;
    sections(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): ItemList<unknown>;
    handleOpenContextEventConfig(contextEvent: EnumContextEvent): void;
}
