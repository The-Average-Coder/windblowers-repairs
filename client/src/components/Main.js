import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import Repairs from './Repairs';
import Customers from './Customers';
import SearchResults from './SearchResults';
import Repair from './Repair';
import Settings from './Settings';
import Customer from './Customer';

function Main(props) {
    return <>
        <Routes>
            <Route exact path='/' element={<Dashboard />} />
            <Route exact path='/dashboard' element={<Dashboard />} />
            <Route exact path='/repairs' element={<Repairs />} />
            <Route exact path='/repairs/new/:customerId' element={<Repairs newRepair={true} />} />
            <Route exact path='/customers' element={<Customers />} />
            <Route exact path='/customers/new' element={<Customers newCustomer={true} />} />
            <Route exact path='/settings' element={<Settings logout={props.logout}/>} />
            <Route exact path='/results/:query' element={<SearchResults />} />
            <Route exact path='/repair/:repairId' element={<Repair />} />
            <Route exact path='/customer/:customerId' element={<Customer />} />
        </Routes>
    </>

    
}

export default Main;