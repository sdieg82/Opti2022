import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const dateFilter = () => {
    state={
        fecha: new Date("2021","11","07")
    }
    return(
        <DatePicker selected={this.state.fecha}/>
    )
}

export default dateFilter;