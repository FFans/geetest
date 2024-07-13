import app from 'flarum/admin/app';
import GeeTestPage from './components/GeeTestPage';

app.initializers.add('ffans/geetest', () => {
  app.extensionData.for('ffans-geetest').registerPage(GeeTestPage);
});
