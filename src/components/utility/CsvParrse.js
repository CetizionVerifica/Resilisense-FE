import React from 'react'
import PropTypes from 'prop-types'


import Papa from 'papaparse'
import { apply, compose, lift, splitAt, zipObj } from 'ramda'

const _ = require("lodash");

class CsvParse extends React.Component {
  handleFile = file => {
    const keys = this.props.keys
    const onDataUploaded = this.props.onDataUploaded
    const onError = this.props.onError

    Papa.parse(file, {
      skipEmptyLines: true,
      error: function (err, file, inputElem, reason) {
        onError({ err, file, inputElem, reason })
      },
      complete: function (results, file) {
        const data = results.data

        // remove display headers
        data.shift()

        // add api headers
        data.unshift(keys)

        // convert arrays to objects
        const formatedResult = compose(
          apply(lift(zipObj)),
          splitAt(1),
        )(data)

        //Check required fields
        var iz =0;
        var fieldcheck =0;
        _.forEach(data, function (item) {
          if (iz> 0) {
            if (item[0] =='' || item[1] =='' || item[2] ==''|| item[3] =='') {
              fieldcheck++;
            }
          }
          iz++;

        })
        if(fieldcheck>0){
          onError('Required fields cannot be blank!', file);
        }

        //Check for invalid email format 
        var checks = 0;
        var ix = 0;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        _.forEach(data, function (item) {
          if (ix > 0) {
            if (!re.test(String(item[3]).toLowerCase())) {
              checks++;
            }
          }
          ix++;

        })
        if (checks > 0) {
          onError('Invalid email format detected in file!', file);
        } 

        const result = _.flow([
          arr => _.groupBy(arr, 3), // group elements by 3 (index for email column)
          g => _.filter(g, o => o.length > 1), // remove groups that have less than two members
          _.flatten // flatten the results to a single array
        ])(data);

        if (result.length > 0) {
          // send error data to state
          onError('Duplicate email:' + result[1][3], file);

        }
       if(result.length == 0 && checks ==0 && fieldcheck == 0) {
          // send result to state
          onDataUploaded(formatedResult)
        }
        // console.log("Parsing complete:", results);
        // onError('dup',file);

      },
    })
  }

  render() {
    return this.props.render(this.handleFile)
  }
}

CsvParse.propTypes = {
  keys: PropTypes.array.isRequired,
  onDataUploaded: PropTypes.func.isRequired,
  onError: PropTypes.func,
}

export default CsvParse
