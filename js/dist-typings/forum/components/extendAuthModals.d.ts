import LogInModal from 'flarum/forum/components/LogInModal';
import SignUpModal from 'flarum/forum/components/SignUpModal';
import ForgotPasswordModal from 'flarum/forum/components/ForgotPasswordModal';
import ChangePasswordModal from 'flarum/forum/components/ChangePasswordModal';
import { EnumContextEvent } from '@/common/enums/EnumContextEvent';
export declare const addCaptchaToAuthModal: <T extends typeof LogInModal | typeof SignUpModal | typeof ForgotPasswordModal | typeof ChangePasswordModal>({ modal, contextEvent, dataMethod, }: {
    modal: T;
    contextEvent: EnumContextEvent;
    dataMethod: KeyOfType<T["prototype"], Function> | KeyOfType<T["prototype"], Function>[];
}) => void;
declare const _default: () => void;
export default _default;
