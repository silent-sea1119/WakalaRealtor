# React Sticky Content

## Idea

Fork form (originally developed)
https://github.com/codecks-io/react-sticky-box

With the original package, we can not pass dynamic top offset. With this change a top offset can be passed. Changes made on top of original package.

## See it in action

[codesandbox.io/s/9jyjjn05q4](https://codesandbox.io/s/9jyjjn05q4)

## Installation

`npm install react-sticky-content`

## Usage

```jsx
import StickyBox from "react-sticky-content";

//...

<SomeContainer>
  <StickyBox bottom={false|true} style={{top: "100"}}>
    <div className="sidebar">...sidebar...</div>
  </StickyBox>
  <div className="main">...lots of content...</div>
</SomeContainer>
```
