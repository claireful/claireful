import { InputNumber, Button, notification, Breadcrumb, Form } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../../context/AuthContext';
import { API_URL } from '../../utils/config';
import { getStorageItemsNumber } from '../../utils/helperFunction';
import { Cookie } from '../../utils/types';
import "./cookieDetail.css";

export default function CookieDetail() {
  const params = useParams();
  const { setBasketItemsCount } = useContext(AuthContext);

  const [cookieData, setCookieData] = useState<Cookie>();
  const [inputNumber, setInputNumber] = useState<string | number | null>('1');

  const getCookieData = async () => {
    try {
      await axios.get(`${API_URL}cookies/${params.id}`,).then(res => {
        setCookieData(res.data);
        console.log(cookieData);
      })
    } catch (e) {
      console.log(e);
    }
  }


  useEffect(() => {
    getCookieData();
  }, []);

  const addOrderToSessionStorage = (cookie_id) => {
    const previousCount = sessionStorage.getItem(cookie_id);
    const newCount = previousCount ? String(Number(sessionStorage.getItem(cookie_id)) + Number(inputNumber)) : String(Number(inputNumber));
    sessionStorage.setItem(cookie_id, newCount);
    setBasketItemsCount(getStorageItemsNumber());
  }

  return (
    <div style={{ padding: "10px 5px" }}>
      <Breadcrumb>
        <Breadcrumb.Item>Accueil</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/cookies">Nos Cookies</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{cookieData?.name}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="cookie-detail-content">
        <img className="cookie-detail-image" src={cookieData?.photo_detail} alt={cookieData?.name} />
        <div className="cookie-detail-info">
          <div className="cookie-detail-name">{cookieData?.name}</div>
          <p>{cookieData?.description}</p>
          <p className="cookie-detail-price">{String(cookieData?.price)} €</p>
          <Form.Item label="Quantité">
            <InputNumber min={0} value={inputNumber} onChange={setInputNumber} style={{ display: "flex" }} />
          </Form.Item>
          <div className="button-div">
            <Button className="cookie-detail-button" type="primary"
              onClick={() => {
                addOrderToSessionStorage(cookieData?.id);
                setInputNumber(1);
                notification.success({ message: 'Les articles ont été ajoutés au panier !', placement: "top", duration: 1 })
              }}>
              Ajouter au panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
