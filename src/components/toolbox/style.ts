import styled from "styled-components";

interface ToolboxCellProps {
  selected: boolean
}

const ToolboxWrapper = styled.div(props => {
  const {

  } = props;

  return `
    display: flex;
    z-index: inherit;
    background-color: #20232a;
    color: #61dafb;
    padding: 5px;
    border-radius: 5px;
  `}
);

const ToolboxCell = styled.div<ToolboxCellProps>(props => {
  const {
    selected
  } = props;

  return `
    margin: 2px;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${selected ? '#61dafb' : ''};
    color: ${selected ? '#20232a' : '#61dafb'};
    border-radius: 5px;
  `;
})

export { ToolboxWrapper, ToolboxCell };