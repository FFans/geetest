import Mithril from 'mithril';

export function vnode2InnerHtml(vnode: Mithril.Vnode) {
  const div = document.createElement('div');
  m.render(div, vnode);

  return div.innerHTML;
}
