import app from 'flarum/forum/app';
import extendAuthModals from '@/forum/components/extendAuthModals';

app.initializers.add('ffans/geetest', () => {
  app.geetestLoaded = false;

  extendAuthModals();
});
