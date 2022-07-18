# Corner smoothing (Squircle) for the web

Apply corner smoothing to render squircles.

[Live demo](TODO)

## React component `Squircle`

```tsx
import { Squircle } from 'corner-smoothing'

<Squircle
  cornerRadius={20}
  style={{
    padding: '1rem 1.25rem',
    backgroundColor: '#7c3aed',
    color: '#fff',
  }}
>
  Lorem ipsum
</Squircle>
```

TODO image here

### `Squircle` props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `cornerRadius` | `number` | | Similar to the CSS property `border-radius`. |
| `cornerSmoothing` | `number` | `1` | The degree of corner smoothing as a number in the range 0–1. 0 is equivalent to no smoothing and looks like normal `border-radius`. 1 indicates maximal smoothing. |
| `preserveSmoothing` | `boolean` | `true` | Allow corner smoothing to work better on large rounded corners. |
| `borderWidth` | `number` | `undefined` | If defined, the [border mode](#squircle-border) is used. |
| `as` | `string \| ReactComponent` | `'div'` | The underlying component that `Squircle` will use. |

Optional props to override corner radius for individual corners.

| Name | Type |
| --- | --- |
| `topLeftCornerRadius` | `number` |
| `topRightCornerRadius` | `number` |
| `bottomRightCornerRadius` | `number` |
| `bottomLeftCornerRadius` | `number` |


## Vanilla function

Zero dependencies.

```ts
import { squircleObserver } from 'auto-text-size'

// squircleObserver runs the returned function directly and
// re-runs it when the element changes size.
const renderSquircle = squircleObserver(element, options)

// There is normally no need to call this manually.
renderSquircle()

// Disconnect the resize observer when done.
renderSquircle.disconnect()
```

One-off:

```ts
import { renderSquircle } from 'corner-smoothing'

renderSquircle(options)
```

The options are the same as for the React component, excluding the `as` property.

## Squircle border

TODO

A squircle border is created by rendering two squircles on top of each other. The inner one being smaller and centered in the outer. The visual border is the region where the outer squircle is not covered by the inner squircle. The inner squircle is rendered with the `::before` pseudo-element.


```tsx
import { Squircle, squircle } from 'corner-smoothing'
import styled from 'styled-components'

const StyledSquircle = styled.div`
  padding: 1rem 1.25rem;
  background-color: #7c3aed; /* Border color */

  ::before {
    background-color: #fff; /* Background color  */
  }
`

// Create a Squircle with the `Squircle` component:
<Squircle
  cornerRadius={20}
  borderWidth={1}
  as={StyledSquircle}
>
  Lorem ipsum
</Squircle>


// Create a Squircle with the `squircle` HOC:
const MySquircle = squircle(StyledSquircle, {
  cornerRadius: 20,
  borderWidth: 1
})
```

## Details

* Uses [TODO](https://github.com/tienphaw/figma-squircle) under the hood.
* [TODO](https://help.figma.com/hc/en-us/articles/360050986854-Adjust-corner-radius-and-smoothing)
* [TODO](https://www.figma.com/blog/desperately-seeking-squircles/)

## Developing

When developing one typically wants to see the output in the example application without having to publish and reinstall. This is achieved by linking the local package into the example app.

Because of [issues with `yarn link`](https://github.com/facebook/react/issues/14257), [Yalc](https://github.com/wclr/yalc) is used instead. A linking approach is preferred over yarn workspaces since we want to use the package as it would appear in the real world.

```sh
npm i yalc -g
yarn
yarn watch

# Other terminal
cd example
yarn
yalc link auto-text-size
yarn dev
```

### Yalc and HMR

Using `yalc link` (or `yalc add--link`) makes it so that Next.js HMR detects updates instantly.

### Publishing

```sh
# Edit package.json to bump the version number
yarn clean && yarn build
npm publish
```
