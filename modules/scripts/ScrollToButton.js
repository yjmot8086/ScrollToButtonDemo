/**
 * @file ScrollToButton、ScrollToTopButton と ScrollToBottomButton クラスのファイルです。
 * 
 * @author MOTOMATSU Yoji
 * @version 1.6.1
 */

import { HTMLUtilities } from './HTMLUtilities.js';
import { Theme } from './Theme.js';

/**
 * ScrollToButton クラスです。
 * 派生クラスの ScrollToTopButton と ScrollToBottomButton クラスを使用します。
 */
export class ScrollToButton {
    /**
     * ボタンの z-index のプロパティです。
     * @property {string} value - css プロパティの値
     */
    static get zIndex() {
        return HTMLUtilities.getRootPropertyValue('--scroll-to-button-z-index');
    }
    static set zIndex(value) {
        HTMLUtilities.setRootPropertyValue('--scroll-to-button-z-index', value);
    }

    /**
     * ボタンの影の z-index のプロパティです。
     * @property {string} value - css プロパティの値
     */
    static get zIndexShadow() {
        return HTMLUtilities.getRootPropertyValue('--scroll-to-button-z-index-shadow');
    }
    static set zIndexShadow(value) {
        HTMLUtilities.setRootPropertyValue('--scroll-to-button-z-index-shadow', value);
    }

    /**
     * コンストラクタです。 
     * @param {sting}  id        - HTML の div 要素オブジェクトの id
     * @param {string} svgRectId - 派生クラスのボタン背景の要素オブジェクトの id
     * @param {string} svgSource - 派生クラスで表示する SVG ソース
     */
    constructor(id, svgRectId, svgSource) {
        // Scroll To Button の div タグを取得します。
        this._element = document.getElementById(id);
        this._element.style.cursor = 'pointer';
        this._element.style.zIndex = ScrollToButton.zIndex;

        // スクロールバーと重ならないように移動します。
        this.translateX(-HTMLUtilities.getScrollbarWidthAsInteger(), '0s');

        this._pushing = false;

        const domParser = new DOMParser();
        const svgDocument = domParser.parseFromString(svgSource, 'image/svg+xml');
        this._svgElement = svgDocument.childNodes[0];
        this._svgElement.style.position = 'absolute';
        this._svgElement.style.left = '0';
        this._svgElement.style.top = '0';
        this._svgElement.style.height = '100%';
        this._svgElement.style.width = '100%';
        this._svgElement.style.border = 'none';
        this._svgElement.style.borderRadius = Theme.defaultBorderRadious;
        this._svgElement.style.zIndex = ScrollToButton.zIndex;
        this._svgRect = this._svgElement.getElementById(svgRectId);

        this._shadowElement = document.createElement('div');
        this._shadowElement.style.position = 'absolute';
        this._shadowElement.style.left = '0';
        this._shadowElement.style.top = '0';
        this._shadowElement.style.height = '100%';
        this._shadowElement.style.width = '100%';
        this._shadowElement.style.border = 'none';
        this._shadowElement.style.borderRadius = Theme.defaultBorderRadious;
        this._shadowElement.style.zIndex = ScrollToButton.zIndexShadow;

        this._element.appendChild(this._svgElement);
        this._element.appendChild(this._shadowElement);

        this._setNormalColor('0s');

        this._element.addEventListener('touchstart', event => {
            // console.log('Scroll To Button touchstart.');
            this._setPushing(true);
        });
        this._element.addEventListener('mousedown', event => {
            // console.log('Scroll To Button mousedown.');
            if (!this._pushing) {
                this._setPushing(true);
            }
        });
        this._element.addEventListener('touchmove', event => {
            // console.log('Scroll To Button touchmove.');
            let rect = this._svgElement.getBoundingClientRect();
            let x = event.touches[0].clientX;
            let y = event.touches[0].clientY;
            if (x < rect.left || rect.right < x || y < rect.top || rect.bottom < y) {
                this._setPushing(false);
            }
        });
        this._element.addEventListener('mouseleave', event => {
            // console.log('Scroll To Button mouseleave.');
            this._setPushing(false);
        });
        this._element.addEventListener('mouseup', event => {
            // console.log('Scroll To Button mouseup.');
            this._setPushing(false);
        });
        this._element.addEventListener('click', event => {
            // console.log('Scroll To Button click.');
        });
    }

    /**
     * HTML の div 要素オブジェクトです。
     * @property {Object} element - div 要素オブジェクト
     * @readonly
     */
    get element() { return this._element; }

    /**
     * ボタンを表示します。
     */
    show() {
        this._element.style.transition =
            `opacity ${Theme.defaultTransitionDuration}, visibility 0s`;
        this._element.style.opacity = '1.0';
        this._element.style.visibility = 'visible';
    }

    /**
     * ボタンを非表示にします。
     */
    hide() {
        this._element.style.transition = `opacity ${Theme.defaultTransitionDuration},
            visibility 0s ${Theme.defaultTransitionDelay}`;
        this._element.style.opacity = '0.0';
        this._element.style.visibility = 'hidden';
    }

    /**
     * ボタンを X 方向に移動します。
     * @param {number} value    - 移動量 (px)
     * @param {string} duration - 移動にかかる時間
     */
    translateX(value, duration = Theme.defaultTransitionDuration) {
        const right = HTMLUtilities.getPropertyValueAsInteger(this._element, 'right');
        this._element.style.transition = `right ${duration}`;
        this._element.style.right = `${right - value}px`;
    }

    _setPushing(value) {
        this._pushing = value;
        if (this._pushing) {
            this._setPushedColor('0s');
        } else {
            this._setNormalColor(Theme.defaultTransitionDuration);
        }
    }

    _setNormalColor(duration) {
        this._shadowElement.style.transition = `box-shadow ${duration}`;
        this._shadowElement.style.boxShadow = Theme.defaultBoxShadow;
        this._svgRect.style.transition = `fill ${duration}`;
        this._svgRect.style.fill = Theme.transparentMainColor;
    }

    _setPushedColor(duration) {
        this._shadowElement.style.transition = `box-shadow ${duration}`;
        this._shadowElement.style.boxShadow = `${Theme.defaultBoxShadow} inset`;
        this._svgRect.style.transition = `fill ${duration}`;
        this._svgRect.style.fill = Theme.transparentAccentColor;
    }
}

/**
 * ScrollToTopButton クラスです。
 * @example
 * css の設定例です。right は、スクロールバーと重ならないように移動されます。
 * div#scroll-to-top-button {
 *   position: fixed;
 *   bottom: 10.8rem;
 *   right:   1.0rem;
 *   height:  5.4rem;
 *   width:   3.6rem;
 * }
 */
export class ScrollToTopButton extends ScrollToButton {
    /**
     * コンストラクタです。
     * @param {sting} id - HTML の div 要素オブジェクトの id
     */
    constructor(id) {
        // Scroll To Top Button のバーは、上下の隙間 = 16、左右の隙間（半径部を除く）= 10、
        // 太さ = 4、半径 = 2、バーの長さ（半径部を除く）= 52 で設定しています。
        const svgRectId = 'svg-rect';
        const svgSource = `<svg viewBox="0 0 72 108"
                xmlns="http://www.w3.org/2000/svg">
                <path id="${svgRectId}" d="M 0 0 L 0 108 L 72 108 L 72 0 Z
                    M 62 16 A 2 2 0 1 1 62 20 L 10 20 A 2 2 0 1 1 10 16 Z
                    M 63.7321 70.0333 A 2 2 0 1 1 60.2680 72.0333 L 38.0 33.4640
                    L 38.0 90.0 A 2 2 0 1 1 34.0 90.0 L 34.0 33.4640
                    L 11.7320 72.0333 A 2 2 0 1 1 8.2679 70.0333 L 34.2679 25.0
                    A 2 2 0 0 1 37.7321 25.0 Z" stroke-width="0" />
                <path d="M 62 16 A 2 2 0 1 1 62 20 L 10 20 A 2 2 0 1 1 10 16 Z"
                    stroke-width="0" fill="rgba(255, 255, 255, 0.6)" />
                <path d="M 63.7321 70.0333 A 2 2 0 1 1 60.2680 72.0333 L 38.0 33.4640
                    L 38.0 90.0 A 2 2 0 1 1 34.0 90.0 L 34.0 33.4640
                    L 11.7320 72.0333 A 2 2 0 1 1 8.2679 70.0333 L 34.2679 25.0
                    A 2 2 0 0 1 37.7321 25.0 Z" stroke-width="0" fill="rgba(255, 255, 255, 0.6)" />
            </svg>`;
        super(id, svgRectId, svgSource);
    }
}

/**
 * ScrollToBottomButton クラスです。
 * @example
 * css の設定例です。right は、スクロールバーと重ならないように移動されます。
 * div#scroll-to-top-button {
 *   position: fixed;
 *   bottom: 3.6rem;
 *   right:  1.0rem;
 *   height: 5.4rem;
 *   width:  3.6rem;
 * }
 */
export class ScrollToBottomButton extends ScrollToButton {
    /**
     * コンストラクタです。
     * @param {sting} id - HTML の div 要素オブジェクトの id
     */
    constructor(id) {
        // Scroll To Bottom Button のバーは、上下の隙間 = 16、左右の隙間（半径部を除く）= 10、
        // 太さ = 4、半径 = 2、バーの長さ（半径部を除く）= 52 で設定しています。
        const svgRectId = 'svg-rect';
        const svgSource = `<svg viewBox="0 0 72 108"
                xmlns="http://www.w3.org/2000/svg">
                <path id="${svgRectId}" d="M 0 0 L 0 108 L 72 108 L 72 0 Z
                    M 62 88 A 2 2 0 1 1 62 92 L 10 92 A 2 2 0 1 1 10 88 Z
                    M 8.2679 37.9667 A 2 2 0 1 1 11.732 35.9667 L 34.0 74.536
                    L 34.0 18.0 A 2 2 0 1 1 38.0 18.0 L 38.0 74.536
                    L 60.2680 35.9667 A 2 2 0 1 1 63.7321 37.9667 L 37.7321 83.0
                    A 2 2 0 0 1 34.2674 83.0 Z" stroke-width="0" />
                <path d="M 62 88 A 2 2 0 1 1 62 92 L 10 92 A 2 2 0 1 1 10 88 Z"
                    stroke-width="0" fill="rgba(255, 255, 255, 0.6)" />
                <path d="M 8.2679 37.9667 A 2 2 0 1 1 11.732 35.9667 L 34.0 74.536
                    L 34.0 18.0 A 2 2 0 1 1 38.0 18.0 L 38.0 74.536
                    L 60.2680 35.9667 A 2 2 0 1 1 63.7321 37.9667 L 37.7321 83.0
                    A 2 2 0 0 1 34.2674 83.0 Z" stroke-width="0" fill="rgba(255, 255, 255, 0.6)" />
            </svg>`;
        super(id, svgRectId, svgSource);
    }
}
