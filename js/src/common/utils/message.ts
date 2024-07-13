import Alert from 'flarum/common/components/Alert';
import app from 'flarum/common/app';
import translate from '@/common/utils/translate';

let alertInstance: number | null = null;

export default {
  clear() {
    app.alerts.dismiss(alertInstance);
  },
  saved() {
    alertInstance = app.alerts.show(Alert, { type: 'success' }, translate.get('core.admin.settings.saved_message'));
    return alertInstance;
  },
};
