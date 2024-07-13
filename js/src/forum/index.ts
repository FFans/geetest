import app from 'flarum/forum/app';
import extendAuthModals from '@/forum/components/extendAuthModals';

app.initializers.add('ffans/geetest', () => {
  console.log('[ffans/geetest] Hello, forum!');
  app.geetestLoaded = false;

  extendAuthModals();
});
