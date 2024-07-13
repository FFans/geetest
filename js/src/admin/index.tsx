import app from 'flarum/admin/app';
import GeeTestPage from './components/GeeTestPage';

app.initializers.add('ffans/geetest', () => {
  console.log('[ffans/geetest] Hello, admin222!');

  app.extensionData.for('ffans-geetest').registerPage(GeeTestPage);
});
