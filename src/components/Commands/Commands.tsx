import { Table, } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { API_URL } from '../../utils/config';
import AuthContext from '../../context/AuthContext';
import { Command } from '../../utils/types';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

interface DataType {
  key: React.Key;
  amount?: string;
  date?: string;
  number_of_articles: string;
  command_identifier: string;
  see_details: string;
}

export const Commands = () => {
  let { authTokens } = useContext(AuthContext);

  const [commandData, setCommandData] = useState<Command[]>([]);
  const [data, setData] = useState<DataType[]>([]);

  const getCommandsData = async () => {
    try {
      await axios.get(
        `${API_URL}commands/`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          }
        },
      ).then(res => {
        setCommandData(res.data);
        console.log(commandData);
      })
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getCommandsData();
  }, []);

  useEffect(() => {
    buildTableData();
  }, [commandData]);



  const buildTableData = () => {
    const data_built: DataType[] = [];
    commandData.forEach((command) => {
      data_built.push({
        key: command?.id,
        date: moment(command?.created_at).format('L'),
        amount: command?.total_cost_command.toString(),
        number_of_articles: command?.command_cookies.length.toString(),
        command_identifier: command?.id,
        see_details: command?.id,
      })
    });
    setData(data_built);
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'id',
      dataIndex: 'command_identifier',
    },
    {
      title: "Date de commande",
      dataIndex: 'date',

    },
    {
      title: "Nombre d'articles",
      dataIndex: 'number_of_articles',
      responsive: ['lg'],
    },
    {
      title: 'Prix total',
      dataIndex: 'amount',
      responsive: ['lg'],
    },
    {
      title: "",
      dataIndex: 'see_details',
      render: (id) => <NavLink to={`${id}`} >Voir le détail</NavLink>
    },
  ];

  return (
    <div>
      <h1 style={{ padding: "5px" }}>Mes commandes</h1>
      {commandData.length == 0 && <div>Vous n'avez pas encore effectué de commandes !</div>}
      {commandData.length !== 0 && <Table pagination={false} columns={columns} dataSource={data} />}
    </div>
  )
}
