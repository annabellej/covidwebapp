import React, {useState, useEffect} from 'react';
import {NativeSelect, FormControl} from '@material-ui/core';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';

import styles from './CountryPicker.module.css';

import {fetchCountries} from '../../api';

const theme = createMuiTheme({
    typography: {
      fontFamily:[
        'Courier', 'monospace'
      ]
    },
  })

const CountryPicker = ({handleCountryChange}) => {
    const [fetchedCountries, setFetchedCountries] = useState([]);

    useEffect (() => {
        const fetchAPI = async () => {
            setFetchedCountries(await fetchCountries());
        }

        fetchAPI();
    }, [setFetchedCountries]);

    return (
        <ThemeProvider theme = {theme}>
        <FormControl className = {styles.formControl}>
            <NativeSelect defaultValue = "" onChange = {(e) => handleCountryChange(e.target.value)}>
                <option value = "">Global</option>
                {fetchedCountries.map((country, i) => <option key = {i} value = {country}>{country}</option>)}
            </NativeSelect>
        </FormControl>
        </ThemeProvider>
    )
}

export default CountryPicker;