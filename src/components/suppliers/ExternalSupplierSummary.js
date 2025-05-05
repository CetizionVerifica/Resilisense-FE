import React from 'react';
import {Row, Col, Select, Cascader, message} from 'antd';
import {get, find, values, round, uniq} from 'lodash';
import Box from '../utility/box';
import styled from "styled-components";
import { ActionCell } from '../../common/helperCells';
import axios from 'axios';

export default function({supplierName, supplierEmail, date, phone, assesmentResult, assesmentPlatformMethod, isHighConcern, refetch, _id}) {
  return (
        <Box>
        <Row type="flex" justify="space-between" >
          <Col>
            <ColumnTitle>
                Contact Person
            </ColumnTitle>
            <Text>{"Name:  "}{supplierName}</Text>
            <Text>{"e-mail:"}{supplierEmail}</Text>
            <Text>{"Phone: "}{phone}</Text>            
          </Col>
          <Col>
            <ColumnTitle>
                Assesment Platform/Method Used
            </ColumnTitle>
            <Text>{assesmentPlatformMethod}</Text>                          
          </Col>
          <Col>
            <ColumnTitle>
              Assesment result
            </ColumnTitle>
            <Row type="flex" justify="space-around">
              <Col>
              <Text>{assesmentResult}</Text>           
              </Col>
              <Col>
                {ActionCell([{
                  key: 'file',
                  onClick: () => {},
                  link: '#',
                  icon: 'file',
                  }])}
              </Col>
            </Row>
          </Col>
          <Col>
            <ColumnTitle>
              Assesment Date
            </ColumnTitle>
            <Text>{new Date(date).toLocaleDateString("en-US")}</Text>             
          </Col>    
          <Col>
            <ColumnTitle>
              High Concern
            </ColumnTitle>
            <Row type="flex" justify="space-around">
              <Col>
                {ActionCell([{
                  key: 'file',
                  onClick: async () => {
                    try {
                      const _isHighConcern = !isHighConcern;
                      await axios.patch('/api/supplier/external', {
                        "id": _id,
                        "isHighConcern" : _isHighConcern,
                      }, { headers: {authorization: localStorage.getItem('token')} });
                      refetch();
                      if (_isHighConcern) {
                        message.info("Supplier added to High concern list");
                      } else {
                        message.info("Supplier unmarked");
                      }
                    } catch (error) {
                      message.error("Something goes wrong");
                    }
                  },
                  link: '#',
                  icon: 'file',
                  iconColor: isHighConcern ? '#52c41a' : 'blue',
                  }])}
              </Col>
            </Row>          
          </Col>                                    
        </Row>
        </Box>
    )
}

const ColumnTitle = styled.h1`
  padding: 5px;
  font-weight: bold;
`;

const Text = styled.p`
  padding: 1px;
`;


// (text, record, index) => ActionCell([
//   {
//     key: 'file',
//     onClick: async () => {
//       try {
//         const isHighConcern = !text.isHighConcern;
//         const result = await axios.patch('/api/supplier/external', {
//           "id": text._id,
//           "isHighConcern" : isHighConcern,
//         }, { headers: {authorization: localStorage.getItem('token')} });
//         refetch();
//         if (isHighConcern) {
//           message.info("Supplier added to High concern list");
//         } else {
//           message.info("Supplier unmarked");
//         }
//       } catch (error) {
//         message.error("Something goes wrong");
//       }
//     },
//     link: '#',
//     icon: 'file',
//     iconColor: text.isHighConcern ? '#52c41a' : 'blue',
//   },
// ])