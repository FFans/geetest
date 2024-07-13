import SettingsModal, { ISettingsModalAttrs } from 'flarum/admin/components/SettingsModal';
import Mithril from 'mithril';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
import { BaseConfig } from '@/common/utils/Settings';
import { MutableSettings } from 'flarum/admin/components/AdminPage';
interface ContextEventConfigModalAttrs extends ISettingsModalAttrs {
    contextEvent: EnumContextEvent;
}
interface Settings extends MutableSettings, BaseConfig {
}
export default class ContextEventConfigModal extends SettingsModal<ContextEventConfigModalAttrs> {
    settings: Settings;
    className(): string;
    title(): JSX.Element;
    oninit(vnode: Mithril.Vnode<ContextEventConfigModalAttrs, this>): void;
    getSettingPath(key?: string): string;
    form(): JSX.Element;
    onsubmit(e: SubmitEvent): void;
}
export {};
