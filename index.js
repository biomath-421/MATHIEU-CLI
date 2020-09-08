#!/usr/bin/env node
const axios = require("axios");
const countrylist = require("country-list");
const chalk = require("chalk");
const boxen = require("boxen");
const ora = require("ora");
const figlet = require("figlet");

let args = process.argv.slice(2);
var today = new Date();
var yyyy = today.getFullYear();
let chosenyear;
let isacountry = false;
const allcountries = countrylist.getNames();
let countrycode;

if (args[1] != null) {
    chosenyear = args[1]
} else {
    chosenyear = yyyy
};

allcountries.forEach(Element => {
    if (args[0] == Element) {
        isacountry = true;
    }
});

if (isacountry) {
    countrycode = countrylist.getCode();
} else {
    console.log("Error: this is not a country name. /n Try again!")
    return process.exit;
};

async function axiosGetHolidaysForOneCountry(year, countryCode) {
    try {
        return await axios.get("https://date.nager.at/api/v2/publicholidays/" + year + "/" + countryCode);
    } catch (error) {
        console.error(error);
    }
};

figlet("Welcome to holidates!", {
    horizontalLayout: 'full',
    verticalLayout: 'full',
},
    function (err, data) {
        if (err) {
            console.log("something goes wrong");
            console.dir(err);
            return;
        }
        console.log(data)
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