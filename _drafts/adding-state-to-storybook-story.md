https://github.com/storybook-eol/react-storybook-addon-info/issues/18

https://github.com/storybooks/storybook/issues/315

```javascript
function withState(WrappedComponent) {
  return class extends React.Component {
    state = { selectedIndex: this.props.selectedIndex } // eslint-disable-line react/prop-types

    handleFocus = (index) => this.setState({ selectedIndex: index })

    render() {
      return <WrappedComponent {...this.props} handleFocus={this.handleFocus} selectedIndex={this.state.selectedIndex} />;
    }
  };
}
const DropdownWithState = withState(Dropdown);
```
