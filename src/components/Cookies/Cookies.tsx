import { Skeleton, Image } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { API_URL } from '../../utils/config';
import { Cookie } from "../../utils/types";
import "./cookies.css";
const pin = require("../../utils/pin.png");


export default function Cookies() {
  const [cookiesData, setCookiesData] = useState<Cookie[]>([]);
  const [loading, setLoading] = useState(true);

  const getCookiesData = async () => {
    try {
      await axios.get(`${API_URL}cookies/`).then(res => {
        setCookiesData(res.data);
        setLoading(false);
      })
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getCookiesData();
  }, []);

  return (
    <div>
      <Skeleton loading={loading}>
        <div className="list">
          {cookiesData.map((item) => {
            return (
              <NavLink key={item?.id} to={item.id} style={{ color: "black" }}>
                <div className="item">
                  <div className='pin-container'>
                    <img src={pin} className="pin" />
                  </div>
                  <Image
                    src={item.photo_main_page}
                    alt={item.name}
                    preview={false}
                    className="image"
                  />
                  <div>
                  </div>
                  <div className="cookie-label">
                    <span className="cookie-name">{item.name}</span>
                    <span className="cookie-price">{String(item.price) + " €"}</span>
                  </div>
                </div>
              </NavLink>
            )
          })}
        </div>
      </Skeleton>
    </div>
  )
}
