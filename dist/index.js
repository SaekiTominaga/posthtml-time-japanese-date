export default (options) => {
    const targetElementInfo = {
        element: options.element,
        class: options.class,
    };
    /**
     * Narrowing by class name
     *
     * <p class="foo bar"> → <p class="foo bar"> (return false)
     * <p class="foo TARGET bar"> → <p class="foo bar"> (return true)
     *
     * @param {object} node - Target node
     * @param {string} targetClassName - Searches if the target node contains this class name
     *
     * @returns {boolean} Whether the target node contains the specified class name
     */
    const narrowingClass = (node, targetClassName) => {
        if (targetClassName === undefined) {
            return true;
        }
        const attrs = node.attrs;
        if (attrs?.class === undefined) {
            /* class 属性がない場合 */
            return false;
        }
        const classList = attrs.class.trim().split(/[\t\n\f\r ]+/g);
        if (!classList.includes(targetClassName)) {
            /* 当該クラス名がない場合 */
            return false;
        }
        /* 指定されたクラス名を除去した上で変換する */
        const newClass = classList.filter((className) => className !== targetClassName && className !== '').join(' ');
        attrs.class = newClass !== '' ? newClass : undefined;
        return true;
    };
    return (tree) => {
        tree.match({ tag: targetElementInfo.element }, (node) => {
            const content = node.content;
            const attrs = node.attrs ?? {};
            if (!narrowingClass(node, targetElementInfo.class)) {
                return node;
            }
            if (content === undefined) {
                console.warn('Element content is empty', node);
                return node;
            }
            if (attrs.datetime !== undefined) {
                console.warn('`datetime` attribute already exists', node);
                return node;
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
            console.warn('Does not match the specified Japanese date string format', node);
            return node;
        });
        return tree;
    };
};
//# sourceMappingURL=index.js.map