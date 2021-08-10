// From https://blog.hackages.io/conditionally-wrap-an-element-in-react-a8b9a47fab2
export default ({ condition, wrapper, children }) => 
  condition ? wrapper(children) : children;