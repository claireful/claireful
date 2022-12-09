import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { API_URL } from '../../utils/config';
import AuthContext from '../../context/AuthContext';
import { Cookie } from '../../utils/types';

interface DataType {
  key: React.Key;
  number_of_articles: string;
  unit_price: string;
  image?: string;
  name?: string;
}

export const CommandDetail = () => {
  const params = useParams();
  let { authTokens } = useContext(AuthContext);

  const [commandData, setCommandData] = useState(null);
  const [data, setData] = useState<DataType[]>([]);
  const [cookiesData, setCookiesData] = useState<Cookie[]>([]);

  const getCookiesData = async () => {
    try {
      await axios.get(`${API_URL}cookies/`).then(res => {
        setCookiesData(res.data);
      })
    } catch (e) {
      console.log(e);
    }
  }

  const getCommandData = async () => {
    try {
      await axios.get(
        `${API_URL}commands/${params.id}/`,
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
    getCommandData();
  }, []);

  useEffect(() => {
    buildTableData();
  }, [commandData]);

  useEffect(() => {
    getCookiesData();
  }, []);

  console.log("commandData", commandData)

  const buildTableData = () => {
    const data_built: DataType[] = [];
    commandData?.command_cookies.forEach((command_cookie) => {
      const corresponding_cookie = cookiesData?.find(cookie => cookie.id == command_cookie.cookie);
      data_built.push({
        key: command_cookie.cookie_id,
        number_of_articles: command_cookie.quantity.toString(),
        image: corresponding_cookie?.photo_main_page,
        name: corresponding_cookie?.name,
        unit_price: `${corresponding_cookie?.price} €`,
      });
    });
    setData(data_built);
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'image',
      width: "80px",
      render: (text) => <img src={text} style={{ width: "80px", height: "90px" }} />
    },
    {
      title: 'Produit',
      dataIndex: 'name',
    },
    {
      title: 'Prix Unitaire',
      dataIndex: 'unit_price',
    },
    {
      title: 'Qté',
      dataIndex: 'number_of_articles',
    },
  ];

  return (
    <>
      <h1 style={{ padding: "5px" }}>Commande {params.id}</h1>
      <Table columns={columns} pagination={false} dataSource={data}/>
    </>
  )
}

