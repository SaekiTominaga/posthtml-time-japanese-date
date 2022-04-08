export default (options) => {
    const targetElementInfo = {
        element: options.element,
        class: options.class,
    };
    return (tree) => {
        tree.match({ tag: targetElementInfo.element }, (node) => {
            const content = node.content;
            const attrs = node.attrs ?? {};
            if (content === undefined) {
                console.warn('Element content is empty', node);
                return node;
            }
            if (attrs.datetime !== undefined) {
                console.warn('`datetime` attribute already exists', node);
                return node;
            }
            if (targetElementInfo.class !== undefined && targetElementInfo.class !== '') {
                const CLASS_SEPARATOR = ' ';
                const classList = attrs.class?.split(CLASS_SEPARATOR);
                if (classList === undefined) {
                    /* class 属性なしの要素 e.g. { tag: 'span', class: 'japanese-time' } / <span>foo</span> */
                    return node;
                }
                if (!classList.includes(targetElementInfo.class)) {
                    /* 当該クラス名のない要素 e.g. { tag: 'span', class: 'japanese-time' } / <span class="foo">foo</span> */
                    return node;
                }
                /* 指定されたクラス名を除去した上で変換する */
                const newClassList = classList.filter((className) => className !== targetElementInfo.class && className !== '');
                attrs.class = newClassList.length >= 1 ? newClassList.join(CLASS_SEPARATOR) : undefined;
            }
            const contentString = content.toString();
            /* e.g. 2000年1月1日 */
            const patternMatchYMDgroups = contentString.match(/^(?:[\s]*?)(?<year>\d{4})(?:[\s]*?)年(?:[\s]*?)(?<month>\d{1,2})(?:[\s]*?)月(?:[\s]*?)(?<day>\d{1,2})(?:[\s]*?)日(?:[\s]*?)$/)?.groups;
            if (patternMatchYMDgroups !== undefined) {
                attrs.datetime = `${patternMatchYMDgroups.year}-${patternMatchYMDgroups.month?.padStart(2, '0')}-${patternMatchYMDgroups.day?.padStart(2, '0')}`;
                return {
                    tag: 'time',
                    attrs: attrs,
                    content: content,
                };
            }
            /* e.g. 2000年1月 */
            const patternMatchYMgroups = contentString.match(/^(?:[\s]*?)(?<year>\d{4})(?:[\s]*?)年(?:[\s]*?)(?<month>\d{1,2})(?:[\s]*?)月(?:[\s]*?)$/)?.groups;
            if (patternMatchYMgroups !== undefined) {
                attrs.datetime = `${patternMatchYMgroups.year}-${patternMatchYMgroups.month?.padStart(2, '0')}`;
                return {
                    tag: 'time',
                    attrs: attrs,
                    content: content,
                };
            }
            /* e.g. 2000年 */
            const patternMatchYgroups = contentString.match(/^(?:[\s]*?)(?<year>\d{4})(?:[\s]*?)年(?:[\s]*?)$/)?.groups;
            if (patternMatchYgroups !== undefined) {
                attrs.datetime = patternMatchYgroups.year;
                return {
                    tag: 'time',
                    attrs: attrs,
                    content: content,
                };
            }
            console.warn('`datetime` attribute already exists', node);
            return node;
        });
        return tree;
    };
};
//# sourceMappingURL=index.js.map