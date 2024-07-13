/// <reference types="mithril" />
import Component from 'flarum/common/Component';
export default class ProductHelp extends Component {
    isMouseOver: boolean;
    productMouseTimer: any;
    view(): JSX.Element;
    getProductTooltip(): JSX.Element;
    handleProductMouseEnter(): void;
    handleProductMouseLeave(): void;
}
