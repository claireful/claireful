import { DeleteOutlined } from '@ant-design/icons';
import { Button, notification, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { API_URL } from '../../utils/config';
import AuthContext from '../../context/AuthContext';
import { BasketItem, Cookie } from '../../utils/types';
import { getStorageItemsNumber } from '../../utils/helperFunction';
import { NavLink } from 'react-router-dom';
import "./basket.css";

interface DataType {
  key: React.Key;
  delete: string;
  image?: string;
  name_price?: Object;
  amount?: string | null;
}

export default function Basket() {
  let { authTokens, setBasketItemsCount } = useContext(AuthContext);

  const [cookiesData, setCookiesData] = useState<Cookie[]>([]);
  const [data, setData] = useState<DataType[]>([]);


  const getCookiesData = async () => {
    try {
      await axios.get(`${API_URL}cookies/`).then(res => {
        setCookiesData(res.data);
      })
    } catch (e) {
      console.log(e);
    }
  }

  const buildBasketData = (): BasketItem[] => {
    const basketData = [];
    Object.keys(sessionStorage).forEach((cookie_id) => {
      basketData.push({
        cookie: cookie_id,
        quantity: sessionStorage.getItem(cookie_id),
      })
    })
    return basketData;
  }

  const getTotalSessionStorage = () => {
    let total_price = 0;
    for (const [key, value] of Object.entries(sessionStorage)) {
      const corresponding_cookie = cookiesData.filter((cookie) => cookie.id === key)[0]
      const cookie_price = corresponding_cookie?.price
      total_price += Number(value) * Number(cookie_price)
    }
    return total_price;
  }

  const postCommand = async () => {
    try {
      await axios.post(
        `${API_URL}commands/`,
        {
          "command_cookies": buildBasketData(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`
          }
        },
      )
        .then(res => notification.success({ message: 'Votre panier a été validé !', placement: "top" }));
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getCookiesData();
  }, []);

  useEffect(() => {
    buildTableData();
  }, [cookiesData]);


  const buildTableData = () => {
    const data_built = [];
    Object.keys(sessionStorage).forEach((cookie_id) => {
      const cookieData = cookiesData?.find(c => c.id == cookie_id);
      data_built.push({
        key: cookie_id,
        image: cookieData?.photo_main_page,
        name_price: { name: cookieData?.name, price: cookieData?.price },
        amount: sessionStorage.getItem(cookie_id),
        delete: cookie_id,
      })
    })
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
      dataIndex: 'name_price',
      render: (obj) =>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>{obj.name}</span>
          <span>{obj.price} €</span>
        </div>
    },
    {
      title: 'Quantité',
      dataIndex: 'amount',
    },
    {
      title: '',
      dataIndex: 'delete',
      render: (id) => <DeleteOutlined onClick={() => {
        sessionStorage.removeItem(id);
        buildTableData();
        setBasketItemsCount(getStorageItemsNumber())
      }} />
    },
  ];

  return (
    <div>
      <h1 style={{ padding: "5px" }}>Votre Panier</h1>
      {sessionStorage.length == 0 && (
        <div className='basket-return-div'>
          <div>Votre panier est vide.</div>
          <NavLink to={'/cookies'} className='basket-return-button'>
            <Button type="primary">Retourner à la boutique</Button>
          </NavLink>
        </div>
      )}
      {sessionStorage.length !== 0 && (
        <div className='basket-not-empty'>
          <div>
            <Table columns={columns} dataSource={data} pagination={false} />
          </div>
          <div className='total-div'>
            <div className='price-texts'>
              <span className='total-label'>Total</span>
              <span className='total-price-text'>{getTotalSessionStorage()} €</span>
            </div>
            <Button className="validate-button" type="primary" onClick={() => { postCommand(); sessionStorage.clear(); setBasketItemsCount(0); }}>Valider le panier</Button>
          </div>
        </div>
      )}
    </div>
  )
}
