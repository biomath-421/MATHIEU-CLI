#!/usr/bin/env node

// Definitions of modules constants
const axios = require('axios');
const countryList = require('country-list');
const chalk = require('chalk');
const boxen = require('boxen');
const ora = require('ora');
var figlet = require('figlet');

// Definitions of variables
let args = process.argv.slice(2);
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let chosenYear;
let isACountry = false;
const allCountries = countryList.getNames();
let countryCode;

// Check if a second argument, the chosen year, has been given ; default is current year
if (args[1] != null) {
    chosenYear = args[1];
} else {
    chosenYear = currentYear;
}

// If chosen country exists, transform it onto a two-letters country code
allCountries.forEach(element => {
    if (args[0] == element) {
        isACountry = true;
    }
});

if (isACountry) {
    countryCode = countryList.getCode(args[0]);
} else {
    console.log("The country name given does not exist.\nPlease try again.");
    return process.exit();
}

// HTTP request to the API of the nager.date service
async function axiosGetHolidaysForOneCountry(year, countryCode) {
    try {
        return await axios.get("https://date.nager.at/api/v2/publicholidays/" + year + "/" + countryCode);
    } catch (error) {
        console.error(error);
    }
}

// Print results

// Title as figlet
figlet("Welcome!",
    {
        horizontalLayout: 'full',
        verticalLayout: 'full',
    },
    function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});

axiosGetHolidaysForOneCountry(chosenYear, countryCode)
    .then(holidays => {
        const spinner = ora('Loading results...\n').start();

        for (let i = 0; i < holidays['data'].length; i++) {
            // Show the results (a list of holidays dates for the current year) in a readable way in the terminal
            console.log(
                chalk.green(
                    boxen(
                        chalk.cyan.bold(holidays['data'][i]["date"]) + ": " + chalk.white(holidays['data'][i]["name"]),
                        {
                            padding: 1,
                            margin: 0,
                            borderStyle: "round"
                        }
                    )
                )
            );
        }
        spinner.succeed("Results ready.");
        spinner.stop();
    })
    .catch(error => consgitole.error(error));