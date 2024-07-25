import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const NetworkPageContainer = styled.div`
  height: 100%;
  width: calc(100vw - 115px);
  overflow: auto;
`

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 4px;
  padding-right: 10px;
`

export const SearchLabel = styled.p`
  padding: 0 10px;
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
`

export const SearchInput = styled.input`
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
`

export const ButtonContainer = styled.div`
  padding: 10px;
  cursor: pointer;
`

export const NetworkContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 100%;
`

export const NetworkInspector = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 400px;
  resize: horizontal;
  max-width: 600px;
  box-shadow: 0px 0px 1px 0px #ffffff36;
`

export const WaterfallContainer = styled.div`
  position: relative;
  height: 50px;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const WaterfallBar = styled.div<{ width: number; left: number; fill?: string }>`
  position: absolute;
  height: 100%;
  background-color: ${(props) => props.fill || props.theme.foreground};
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
`
