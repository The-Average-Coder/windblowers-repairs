import { useEffect, useState } from 'react';
import '../stylesheets/SearchResults.css';
import fluteIcon from '../images/fluteIcon.png';
import oboeIcon from '../images/oboeIcon.png';
import clarinetIcon from '../images/clarinetIcon.png';
import bassoonIcon from '../images/bassoonIcon.png';
import saxophoneIcon from '../images/saxophoneIcon.png';
import { useParams, Link } from "react-router-dom";
import Axios from 'axios';

function SearchResults() {
    const { query } = useParams();

    const [repairList, setRepairList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [filteredCustomerList, setFilteredCustomerList] = useState([]);

    const instrumentSymbol = { 
        'concert flute': fluteIcon,
        'piccolo': fluteIcon,
        'alto flute': fluteIcon,
        'bass flute': fluteIcon,
        'flute (other)': fluteIcon,
        'oboe': oboeIcon,
        'cor anglais': oboeIcon,
        'oboe (other)': oboeIcon,
        'b♭ clarinet': clarinetIcon,
        'a clarinet': clarinetIcon,
        'e♭ clarinet': clarinetIcon,
        'alto clarinet': clarinetIcon,
        'bass clarinet': clarinetIcon,
        'contrabass clarinet': clarinetIcon,
        'clarinet (other)': clarinetIcon,
        'soprano recorder': clarinetIcon,
        'alto recorder': clarinetIcon,
        'tenor recorder': clarinetIcon,
        'bass recorder': clarinetIcon,
        'recorder (other)': clarinetIcon,
        'bassoon': bassoonIcon,
        'bassoon (other)': bassoonIcon,
        'soprano saxophone': saxophoneIcon,
        'alto saxophone': saxophoneIcon,
        'tenor saxophone': saxophoneIcon,
        'baritone saxophone': saxophoneIcon,
        'bass saxophone': saxophoneIcon,
        'saxophone (other)': saxophoneIcon,
    }

    const statusColor = {
        'assessment / quote': 'red',
        'open': 'orange',
        'closed': 'gray',
        'complete': 'limegreen',
        'collected': 'black'
    }

    useEffect(() => {
        loadCustomers();
    }, [query]);
    

    const loadRepairs = (customerList) => {
        Axios.get("/api/repairs/get").then((response) => {
            setRepairList(response.data.filter(repair => `${repair.instrument.toLowerCase()} ${repair.manufacturer.toLowerCase()} ${repair.model.toLowerCase()} ${repair.serial_number.toLowerCase()} ${repair.job_number.toLowerCase()} ${getCustomerName(repair.customer_id, customerList).toLowerCase()}`.includes(query.toLowerCase())));
        })
    }
    
      const loadCustomers = () => {
        Axios.get("/api/customers/get").then((response) => {
            setCustomerList(response.data);
            setFilteredCustomerList(response.data.filter(customer => `${customer.firstname.toLowerCase()} ${customer.surname.toLowerCase()} ${customer.telephone.toLowerCase()} ${customer.email.toLowerCase()} ${customer.address.toLowerCase()}`.includes(query.toLowerCase())));
            loadRepairs(response.data);
        })
    }

    const titleCase = (str) => {
        return str.toLowerCase().split(' ').map(function(word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }

    const getCustomerName = (id, customerList) => {
        let name = "";
        customerList.forEach(element => {
          if (element.id === id) {
            name = `${element.firstname} ${element.surname}`;
          }
        })
        if (name.length > 0) {
          return name;
        }
        return "<no customer>";
    }

    return <div className='searchresults__page'>
        <div className='searchResultsBox'>
            <p className='repairsListTitle'>Results for '{query}'</p>
            <p style={{marginTop: '80px', marginBottom: '0', marginLeft: '30px', fontSize: '24px'}}>Repairs:</p>
            <div className='repairsList' style={{marginTop: '10px', paddingTop: '0'}}>
                {repairList.length > 0 ? <>
                    <p style={{margin: '10px'}}>Found {repairList.length} results</p>
                    {repairList.map((val) => {
                        return [
                            <Link className='repairsListElement' to={`/repair/${val.id}`}>
                                <img className='repairsListElementIcon' src={instrumentSymbol[val.instrument]} alt='' />
                                <div className='repairsListElementStatus' style={{backgroundColor: statusColor[val.status]}} />
                                <p className='repairsListElementTitle'>{titleCase(val.instrument)}</p>
                                <p className='repairsListElementManufacturer'>{val.manufacturer}</p>
                                <p className='repairsListElementModel'>{val.model}</p>
                                <p className='repairsListElementSerialNumber'>{val.job_number}</p>
                                <p className='repairsListElementCustomer'>{getCustomerName(val.customer_id, customerList)}</p>
                            </Link>
                        ];
                    })}
            </> : <p style={{marginLeft: '10px'}}>No Results In Repairs</p> }
            </div>
            
            <p style={{marginTop: '80px', marginLeft: '30px', fontSize: '24px'}}>Customers:</p>
            <div className='repairsList' style={{marginTop: '10px', paddingTop: '0'}}>
                {filteredCustomerList.length > 0 ? <>
                    <p style={{margin: '0 10px'}}>Found {filteredCustomerList.length} results</p>
                    {filteredCustomerList.map((val) => {
                    return [
                    <Link className='customers__customerElement' to={`/customer/${val.id}`}>
                        <p className='customers__customerElementTitle'>{val.firstname} <span>{val.surname}</span></p>
                        <p className='customers__customerElementTelephone'>{val.telephone}</p>
                        <p className='customers__customerElementEmail'>{val.email.length > 0 ? val.email : "<no email>"}</p>
                        <p className='customers__customerElementAddress'>{val.address.length > 0 ? val.address : "<no address>"}</p>
                    </Link>
                    ];
                })}
                </> : <p style={{marginLeft: '10px'}}>No Results In Customers</p> }
            </div>
        </div>
    </div>
}

export default SearchResults;