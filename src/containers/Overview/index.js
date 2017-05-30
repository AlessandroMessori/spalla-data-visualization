import React from 'react'
import {connect} from 'react-redux'
import {PageHeader, Row, Col} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {overViewData} from '../../selectors'
import Spinner from '../../components/Spinner'
import {getStats} from '../../helpers/analytics'
import {dataFormat} from '../../helpers/utils'
import './index.scss'

const mapStateToProps = (state) => ({
  //questions: state.data.questions,
  data: overViewData(state)
})

const mapDispatchToProps = (dispatch) => ({})

class Teacher extends React.Component {
  render() {

    const {data} = this.props
    const stats = getStats(data.map(item => item.goodVotesPercentage))
    const {min, max, avg} = stats
    const {length} = data

    return (<section className="overViewSection">
      <PageHeader>Panoramica</PageHeader>
      {length < 1 && <Spinner/>}
      {length > 0 &&
      <section>

        <Row className='stats-section'>
          <Col md={4}><h2>Media Massima: {max}%</h2></Col>
          <Col md={4}><h2>Media Minima: {min}%</h2></Col>
          <Col md={4}><h2>Media Scuola: {avg}%</h2></Col>
        </Row>

        <br/>

        <BootstrapTable className='dataTable-overView' data={data} hover={true}>
          <TableHeaderColumn dataField="nomeDocente" isKey={true} dataAlign="center" dataSort={true}>Nome
            Docente</TableHeaderColumn>
          <TableHeaderColumn dataField="goodVotesPercentage" dataAlign="center" dataFormat={dataFormat} dataSort={true}>Valore
            Voti
            Positivi</TableHeaderColumn>
          <TableHeaderColumn dataField="difference" dataAlign="center" dataFormat={dataFormat} dataSort={true}>Delta
            Docente
            Scuola</TableHeaderColumn>
        </BootstrapTable>
      </section>
      }

    </section>)
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Teacher)
