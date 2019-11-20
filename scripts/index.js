import {
    ScrollToTopButton,
    ScrollToBottomButton,
} from '../modules/scripts/ScrollToButton.js';

const scrollToTopButton = new ScrollToTopButton('scroll-to-top-button');
const scrollToBottomButton = new ScrollToBottomButton('scroll-to-bottom-button');

window.addEventListener('DOMContentLoaded', () => {
    scrollToTopButton.element.addEventListener('click', () => {
        scrollToTopButton.translateX(100, '0s');
        scrollToBottomButton.translateX(100, '0s');
    });

    scrollToBottomButton.element.addEventListener('click', () => {
        scrollToTopButton.translateX(-100);
        scrollToBottomButton.translateX(-100);
    });
});



