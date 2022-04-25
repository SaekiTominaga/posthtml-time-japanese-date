import * as PostHTML from 'posthtml';
import PostHTMLMatchClass from '@saekitominaga/posthtml-match-class';

interface Options {
	readonly element: string;
	readonly class?: string;
}

export default (options: Options) => {
	const targetElementInfo = {
		element: options.element,
		class: options.class,
	};

	return (tree: PostHTML.Node): PostHTML.Node => {
		tree.match({ tag: targetElementInfo.element }, (node) => {
			const content = node.content;
			const attrs = node.attrs ?? {};

			const postHTMLMatchClass = new PostHTMLMatchClass(node);

			if (targetElementInfo.class !== undefined && !postHTMLMatchClass.refine(targetElementInfo.class)) {
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
			const patternMatchYMDgroups = contentString.match(
				/^(?:[\s]*?)(?<year>\d{4})(?:[\s]*?)年(?:[\s]*?)(?<month>\d{1,2})(?:[\s]*?)月(?:[\s]*?)(?<day>\d{1,2})(?:[\s]*?)日(?:[\s]*?)$/
			)?.groups;
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
