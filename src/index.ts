import { Node } from 'posthtml';

interface Options {
	tag: string;
	class?: string;
}

export default (options: Options) => {
	return (tree: Node): Node => {
		tree.match({ tag: options.tag }, (node) => {
			const content = node.content;
			const attrs = node.attrs ?? {};

			if (content === undefined) {
				console.warn('Element content is empty.', node);
				return node;
			}
			if (attrs.datetime !== undefined) {
				console.warn('`datetime` attribute already exists', node);
				return node;
			}

			if (options.class !== undefined && options.class !== '') {
				const CLASS_SEPARATOR = ' ';

				const classList = attrs.class?.split(CLASS_SEPARATOR);
				if (classList === undefined) {
					/* class 属性なしの要素 e.g. { tag: 'span', class: 'japanese-time' } / <span>foo</span> */
					return node;
				}
				if (!classList.includes(options.class)) {
					/* 当該クラス名のない要素 e.g. { tag: 'span', class: 'japanese-time' } / <span class="foo">foo</span> */
					return node;
				}

				/* クラス名を除去した上で変換する */
				attrs.class = classList.filter((className) => className !== options.class).join(CLASS_SEPARATOR);
			}

			const contentString = content.toString();

			/* e.g. 2000年1月1日 */
			const patternMatchYMD = contentString.match(/^([\s]*?)(\d{4})([\s]*?)年([\s]*?)(\d{1,2})([\s]*?)月([\s]*?)(\d{1,2})([\s]*?)日([\s]*?)$/);
			if (patternMatchYMD !== null) {
				const year = patternMatchYMD[2];
				const month = patternMatchYMD[5];
				const day = patternMatchYMD[8];

				attrs.datetime = `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(-2)}`;

				return {
					tag: 'time',
					attrs: attrs,
					content: content,
				};
			}

			/* e.g. 2000年1月 */
			const patternMatchYM = contentString.match(/^([\s]*?)(\d{4})([\s]*?)年([\s]*?)(\d{1,2})([\s]*?)月([\s]*?)$/);
			if (patternMatchYM !== null) {
				const year = patternMatchYM[2];
				const month = patternMatchYM[5];

				attrs.datetime = `${year}-${`0${month}`.slice(-2)}`;

				return {
					tag: 'time',
					attrs: attrs,
					content: content,
				};
			}

			/* e.g. 2000年 */
			const patternMatchY = contentString.match(/^([\s]*?)(\d{4})([\s]*?)年([\s]*?)$/);
			if (patternMatchY !== null) {
				const year = patternMatchY[2];

				attrs.datetime = year;

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
