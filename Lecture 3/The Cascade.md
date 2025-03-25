# The Cascade

## Table of Contents

- [Introduction](#introduction)
- [Assignement](#assignement)
- [Submission](#submission)

## Introduction

This documents contain the submission for the assignement of the lecture 3 named "The Cascade".

## Assignement

The full assignemnt can be found [here](./Assignment%2002%20-%20CSS.pdf#page=2).

This is a quick summary of the assignement:

Given the following HTML and CSS code snippets:

```html
1. <div id="container" class="container">
2.   <p>This is a paragraph.</p>
3. </div>
```

```css
1. p {color: green;}
2. div p {color: blue;}
3. #container p {color: red;}
4. .container p {color: orange;}
5. [id] p {color: yellow;}
```

the task is: 

1. compute the specificity for each of the `color` properties defined in the above CSS. Then, sort the properties in decreasing order of specificity, and use the ordering to predict the color of the
paragraph.

1. After that consider the scenario where `<p>` element in the above snippet had a style attribute with the content:`"color: pink;"`? Describe, step-by-step, the application of the cascade algorithm in that scenario.

1. Then Consider the HTML document obtained after adding the style attribute. Suppose you need the to override the pink color on the paragraph with a new CSS rule, and make the color purple. What rule could you write to do so?

1. After that Change the value of the style attribute in the HTML document to "color: pink !important;". What happened in the rendered document? Explain the steps in the cascade algorithm that led to
that result.

1. In the end, Consider now the HTML document obtained after updating the style attribute in the previous step.
Suppose you need to override the pink color on the paragraph with a new color of your choice. How can you do that by adding new rules in the authored CSS? How can you do that by adding new CSS properties in the inline style?

## Submission

### 1. Specificity

The specificity of the CSS rules are as follows:

1. `p {color: green;}`: 0,0,1
1. `div p {color: blue;}`: 0,0,2
1. `#container p {color: red;}`: 1,0,1
1. `.container p {color: orange;}`: 0,1,1
1. `[id] p {color: yellow;}`: 0,1,1

The order of the specificity is as follows:

1. `#container p {color: red;}`
1. `[id] p {color: yellow;}` (tie)
1. `.container p {color: orange;}` (tie)
1. `div p {color: blue;}`
1. `p {color: green;}`

Therefore, the color of the paragraph will be `red`.

### 2. The conquest of the pink

When the `<p>` element in the above snippet had a style attribute with the content: `"color: pink;"`, the cascade algorithm will be applied as follows:

1. **Origin and Importance**: As far as we know, other origin but authored are present, therefore this step does not filter out any option.

2. **Layers**: The style attribute is part of the *Inline style* layer, which is the most specifc, therefore it will be selected as the style to be applied. The cascade algorithm terminate here.

### 3. The uprise of the purple

Being the pink color applied as an inline style (which is the most specific layer), the only way to override it is by either adding another inline style (but it's not what's asked) or by letting the algorith terminate at the **Origin and Importance** step, where the authored CSS is considered.

To do so it's enough to add a rule with the `!important` flag, like this:

```css
p {color: purple !important;}
```

### 4. The revenge of the pink

When the value of the style attribute in the HTML document is changed to `"color: pink !important;"`, the color applied in the rendered document will be pink. This is how the cascade algorithm is applied:

1. **Origin and Importance**: Both the inline `"color: pink !important;"` and the ```p {color: purple !important;}``` belong to the *Authored !important* origin (the most specific that we have here), therefore all the other rules are discarded as potential candidates and the algorithm continue comparing only this two.

2. **Layers**: The inline style is part of the *Inline style* layer, which is the most specific, therefore it will be selected as the style to be applied. The cascade algorithm terminate here.

### 5. The rise of the new color

Unfortunately, is not possible to override the pink color on the paragraph with a new color of your choice by adding new rules in the authored CSS, because the inline style is the most specific layer and it will always be selected.

However, it's possible to override the pink color on the paragraph with a new color of your choice by adding new CSS properties in the inline style, using the ordering, like this (although it's disgusting):

```html
<p style="color: pink !important;color: red !important;">This is a paragraph.</p>
```
