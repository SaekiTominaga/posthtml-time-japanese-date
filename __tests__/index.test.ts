import posthtml = require('posthtml');
import posthtmlTimeJapaneseDate from '../src';

describe('正常系', () => {
	test('年月日', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date>2022年1月2日</x-japanese-date>')).html
		).toBe('<!DOCTYPE html><time datetime="2022-01-02">2022年1月2日</time>');
	});
	test('年月日・スペース', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date> 2022 年 1 月 2 日 </x-japanese-date>')).html
		).toBe('<!DOCTYPE html><time datetime="2022-01-02"> 2022 年 1 月 2 日 </time>');
	});
	test('年月', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date>2022年1月</x-japanese-date>')).html).toBe(
			'<!DOCTYPE html><time datetime="2022-01">2022年1月</time>'
		);
	});
	test('年月・スペース', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date> 2022 年 1 月 </x-japanese-date>')).html
		).toBe('<!DOCTYPE html><time datetime="2022-01"> 2022 年 1 月 </time>');
	});
	test('年', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date>2022年</x-japanese-date>')).html).toBe(
			'<!DOCTYPE html><time datetime="2022">2022年</time>'
		);
	});
	test('年・スペース', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date> 2022 年 </x-japanese-date>')).html).toBe(
			'<!DOCTYPE html><time datetime="2022"> 2022 年 </time>'
		);
	});
	test('他の属性', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date lang="ja">2022年1月2日</x-japanese-date>')).html
		).toBe('<!DOCTYPE html><time lang="ja" datetime="2022-01-02">2022年1月2日</time>');
	});
});

describe('変換しない', () => {
	test('空文字', async () => {
		expect((await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date></x-japanese-date>')).html).toBe(
			'<!DOCTYPE html><x-japanese-date></x-japanese-date>'
		);
	});
	test('不正なフォーマット', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process('<!DOCTYPE html><x-japanese-date>2022年123月2日</x-japanese-date>')).html
		).toBe('<!DOCTYPE html><x-japanese-date>2022年123月2日</x-japanese-date>');
	});
	test('datetime属性が既にある', async () => {
		expect(
			(
				await posthtml([posthtmlTimeJapaneseDate({ tag: 'x-japanese-date' })]).process(
					'<!DOCTYPE html><x-japanese-date datetime="2022-12-31">2022年1月2日</x-japanese-date>'
				)
			).html
		).toBe('<!DOCTYPE html><x-japanese-date datetime="2022-12-31">2022年1月2日</x-japanese-date>');
	});
});

describe('class指定', () => {
	test('年月日', async () => {
		expect(
			(await posthtml([posthtmlTimeJapaneseDate({ tag: 'span', class: 'japanese-date' })]).process('<!DOCTYPE html><span>2022年1月2日</span><span class="foo bar">2022年1月2日</span><span class="foo japanese-date bar">2022年1月2日</span>')).html
			).toBe('<!DOCTYPE html><span>2022年1月2日</span><span class="foo bar">2022年1月2日</span><time class="foo bar" datetime="2022-01-02">2022年1月2日</time>');
	});
});
