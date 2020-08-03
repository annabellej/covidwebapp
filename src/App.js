import React from 'react';
import axios from "axios";

import {coordinates} from './patch/country_coordinates'
import Map from "./components/Map";

import {Cards, Chart, CountryPicker} from './components';
import styles from './App.module.css';
import {fetchData} from './api';

import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/core/styles';

import title from './images/image.png';

//set font for materialUI components
const theme = createMuiTheme({
  typography: {
    fontFamily:[
      'Courier', 'monospace'
    ]
  }
})

class App extends React.Component {
  state = {
    data: {},
    country: '',
    colors: [
      "rgba(255, 0, 0, 0.5)",
      "rgba(0,0,0,0.7)",
      "rgba(0,0,0,0.7)"
    ],
    countries_data: [],
    data_loaded: false,
    fields: ["infected", "deaths", "recovered"],
    query: "infected"
  }

  async componentDidMount() {
    const fetchedData = await fetchData();

    this.setState({data: fetchedData})
    this.fetchCountryData();
  }

  fetchCountryData = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://corona-api.com/countries"
      });

      const countries_data = this.processData(response.data.data);
  
      this.setState({
        countries_data,
        data_loaded: true
      });
    } 
    catch (e) {
      console.log("unable to retrieve data", e);
    }
  };

  processData = (data) => {
    let processed = [];
  
    for (const d of data) {
      let obj = {
        name: d.name,
        code: d.code,
        updated_at: d.updated_at,
        infected: d.latest_data.confirmed,
        deaths: d.latest_data.deaths,
        recovered: d.latest_data.recovered
      };
  
      obj['coordinates'] = {
        latitude:
          coordinates.find(f => f.country_code === d.code) !== undefined
            ? coordinates.find(f => f.country_code === d.code).latlng[0]: 0,
        longitude:
          coordinates.find(f => f.country_code === d.code) !== undefined
            ? coordinates.find(f => f.country_code === d.code).latlng[1]: 0
      }
  
      processed.push(obj);
    }
  
    return processed;
  };

  handleCountryChange = async (country) => {
    const fetchedData = await fetchData(country);
    this.setState({data: fetchedData, country: country})
  }

  handleSetQuery = (query) => {
    this.setState({
      query
    });
  };

  render() {
    const {data, country, colors, countries_data, data_loaded, fields, query} = this.state;

    return data_loaded ? (
      <ThemeProvider theme = {theme}>
        <div className = {styles.statistics}>
          <img className = {styles.image} src = {title} alt = "COVID-19"/>
          <Cards data = {data}/>
          <CountryPicker handleCountryChange = {this.handleCountryChange}/>
          <Chart data = {data} country = {country}/>
        </div>
        
        <div className = {styles.map}>
          <Map
            colors={colors}
            data={countries_data}
            fields={fields}
            query={query}
          />
        </div>
      </ThemeProvider>
    ) : null;
  }
}

export default App;