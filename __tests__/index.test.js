import posthtmlTimeJapaneseDate from '../dist/index.js';
import posthtml from 'posthtml';
import { describe, expect, test } from '@jest/globals';

describe('正常系', () => {
	test('年月日', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process(`
					<x-japanese-date>2022年1月2日</x-japanese-date>
					<x-japanese-date>2022年10月11日</x-japanese-date>`)
			).html
		).toBe(`
					<time datetime="2022-01-02">2022年1月2日</time>
					<time datetime="2022-10-11">2022年10月11日</time>`);
	});
	test('年月日・スペース', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process(`
					<x-japanese-date> 2022 年 1 月 2 日 </x-japanese-date>
					<x-japanese-date> 2022 年 10 月 11 日 </x-japanese-date>`)
			).html
		).toBe(`
					<time datetime="2022-01-02"> 2022 年 1 月 2 日 </time>
					<time datetime="2022-10-11"> 2022 年 10 月 11 日 </time>`);
	});
	test('年月', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process(`
					<x-japanese-date>2022年1月</x-japanese-date>
					<x-japanese-date>2022年10月</x-japanese-date>`)
			).html
		).toBe(`
					<time datetime="2022-01">2022年1月</time>
					<time datetime="2022-10">2022年10月</time>`);
	});
	test('年月・スペース', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process(`
					<x-japanese-date> 2022 年 1 月 </x-japanese-date>
					<x-japanese-date> 2022 年 10 月 </x-japanese-date>`)
			).html
		).toBe(`
					<time datetime="2022-01"> 2022 年 1 月 </time>
					<time datetime="2022-10"> 2022 年 10 月 </time>`);
	});
	test('年', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process('<x-japanese-date>2022年</x-japanese-date>')).html).toBe(
			'<time datetime="2022">2022年</time>'
		);
	});
	test('年・スペース', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process('<x-japanese-date> 2022 年 </x-japanese-date>')).html).toBe(
			'<time datetime="2022"> 2022 年 </time>'
		);
	});
	test('他の属性', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process('<x-japanese-date lang="ja">2022年1月2日</x-japanese-date>')).html
		).toBe('<time lang="ja" datetime="2022-01-02">2022年1月2日</time>');
	});
});

describe('正常系・class指定', () => {
	test('年月日', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process(`
					<span class="japanese-date">2022年1月2日</span>
					<span class="japanese-date">2022年10月11日</span>`)
			).html
		).toBe(`
					<time datetime="2022-01-02">2022年1月2日</time>
					<time datetime="2022-10-11">2022年10月11日</time>`);
	});
	test('年月日・スペース', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process(`
					<span class="japanese-date"> 2022 年 1 月 2 日 </span>
					<span class="japanese-date"> 2022 年 10 月 11 日 </span>`)
			).html
		).toBe(`
					<time datetime="2022-01-02"> 2022 年 1 月 2 日 </time>
					<time datetime="2022-10-11"> 2022 年 10 月 11 日 </time>`);
	});
	test('年月', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process(`
					<span class="japanese-date">2022年1月</span>
					<span class="japanese-date">2022年10月</span>`
				)
			).html
		).toBe(`
					<time datetime="2022-01">2022年1月</time>
					<time datetime="2022-10">2022年10月</time>`);
	});
	test('年月・スペース', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process(`
					<span class="japanese-date"> 2022 年 1 月 </span>
					<span class="japanese-date"> 2022 年 10 月 </span>`
				)
			).html
		).toBe(`
					<time datetime="2022-01"> 2022 年 1 月 </time>
					<time datetime="2022-10"> 2022 年 10 月 </time>`);
	});
	test('年', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process('<span class="japanese-date">2022年</span>')).html
		).toBe('<time datetime="2022">2022年</time>');
	});
	test('年・スペース', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process('<span class="japanese-date"> 2022 年 </span>')).html
		).toBe('<time datetime="2022"> 2022 年 </time>');
	});
	test('他の属性', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process(
					'<span class="japanese-date" lang="ja">2022年1月2日</span>'
				)
			).html
		).toBe('<time lang="ja" datetime="2022-01-02">2022年1月2日</time>');
	});
});

describe('変換しない', () => {
	test('空文字', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process('<x-japanese-date></x-japanese-date>')).html).toBe(
			'<x-japanese-date></x-japanese-date>'
		);
	});
	test('不正なフォーマット', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process('<x-japanese-date>2022年123月2日</x-japanese-date>')).html).toBe(
			'<x-japanese-date>2022年123月2日</x-japanese-date>'
		);
	});
	test('datetime属性が既にある', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })]).process(
					'<x-japanese-date datetime="2022-12-31">2022年1月2日</x-japanese-date>'
				)
			).html
		).toBe('<x-japanese-date datetime="2022-12-31">2022年1月2日</x-japanese-date>');
	});
});

describe('変換しない・class指定', () => {
	test('クラス名マッチしない', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process(`
					<span>2022年1月2日</span>
					<span class="foo bar">2022年1月2日</span>`)
			).html
		).toBe(`
					<span>2022年1月2日</span>
					<span class="foo bar">2022年1月2日</span>`);
	});
	test('空文字', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process('<span class="japanese-date"></span>')).html).toBe(
			'<span></span>'
		);
	});
	test('不正なフォーマット', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process('<span class="japanese-date">2022年123月2日</span>'))
				.html
		).toBe('<span>2022年123月2日</span>');
	});
	test('datetime属性が既にある', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ element: 'span', class: 'japanese-date' })]).process(
					'<span class="japanese-date" datetime="2022-12-31">2022年1月2日</span>'
				)
			).html
		).toBe('<span datetime="2022-12-31">2022年1月2日</span>');
	});
});
