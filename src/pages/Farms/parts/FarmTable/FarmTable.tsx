import { FC } from 'react'
import styled from 'styled-components'
import { borderRadius, colors } from 'styles'
import { IRowProps, Row } from '../Row'

interface IFarmTableProps {
  data: IRowProps[]
}

const StyledRoot = styled.div`
  padding: 10px 14px;
  margin-top: 10px;
  border-radius: ${borderRadius.primary};
  background-color: ${colors.white};
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const StyledBody = styled.tbody`
  width: 100%;
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

export const FarmTable: FC<IFarmTableProps> = ({ data }) => {
  return (
    <StyledRoot>
      <StyledTable>
        <StyledBody>
          {data.map((item, idx) => {
            return <Row key={idx} {...item} />
          })}
        </StyledBody>
      </StyledTable>
    </StyledRoot>
  )
}
