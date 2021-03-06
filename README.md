# posthtml-time-japanese-date

[![npm version](https://badge.fury.io/js/posthtml-time-japanese-date.svg)](https://badge.fury.io/js/posthtml-time-japanese-date)
[![Build Status](https://app.travis-ci.com/SaekiTominaga/posthtml-time-japanese-date.svg?branch=main)](https://app.travis-ci.com/SaekiTominaga/posthtml-time-japanese-date)
[![Coverage Status](https://coveralls.io/repos/github/SaekiTominaga/posthtml-time-japanese-date/badge.svg)](https://coveralls.io/github/SaekiTominaga/posthtml-time-japanese-date)

<img src="https://posthtml.github.io/posthtml/logo.svg" alt="PostHTML logo" height="100">

Transform Japanese date notation to `<time>` element using PostHTML

Before:
``` html
<p><x-japanese-date>2022年1月2日</x-japanese-date></p>
<p><x-japanese-date>2022年1月</x-japanese-date></p>
<p><x-japanese-date>2022年</x-japanese-date></p>
<p><x-japanese-date lang="ja"> 2022 年 1 月 2 日 </x-japanese-date></p>

<!-- ↓ not transform -->
<p><x-japanese-date>2022年123月2日</x-japanese-date></p><!-- Incorrect format -->
<p><x-japanese-date datetime="2022-01-02">2022年1月2日</x-japanese-date></p><!-- Do not include the `datetime` attribute -->

<!-- ↓ It is possible to set the transform to occur only when a specific class name is included -->
<p><span class="japanese-date">2022年1月2日</span></p>
<p><span class="foo japanese-date bar">2022年1月2日</span></p>
```

After:
``` html
<p><time datetime="2022-01-02">2022年1月2日</time></p>
<p><time datetime="2022-01">2022年1月</time></p>
<p><time datetime="2022">2022年</time></p>
<p><time lang="ja" datetime="2022-01-02"> 2022 年 1 月 2 日 </time></p>

<p><x-japanese-date>2022年123月2日</x-japanese-date></p>
<p><x-japanese-date datetime="2022-01-02">2022年1月2日</x-japanese-date></p>

<p><time datetime="2022-01-02">2022年1月2日</time></p>
<p><time class="foo bar" datetime="2022-01-02">2022年1月2日</time></p>
```

## Install

```bash
npm i -D posthtml-time-japanese-date
```

## Usage

``` js
import posthtml from 'posthtml';
import posthtmlTimeJapaneseDate from 'posthtml-time-japanese-date';

const beforeHtml = '<!DOCTYPE html>...';

const result = posthtml([
	posthtmlTimeJapaneseDate({ element: 'x-japanese-date' })
]).process(beforeHtml);

const afterHtml = result.html;
```

## Options

<dl>
<dt><code>element</code> [Required]</dt>
<dd>Element name</dd>
<dt><code>class</code> [Optional]</dt>
<dd>Class name</dd>
</dl>

e.g. `{ element: 'x-japanese-date' }`, `{ element: 'span', class: 'japanese-date' }`
