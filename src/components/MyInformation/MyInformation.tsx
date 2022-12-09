import { Button, Form, Input, notification, Select } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext';
import { API_URL } from '../../utils/config';
import { countries } from 'country-list-json';
import "./myInformation.css";

export const MyInformation = () => {
    const { user, authTokens } = useContext(AuthContext);
    const [userData, setUserData] = useState(undefined);

    const countryNames = countries.map(country => {
        return {
            label: country.name,
            value: country.name,
        }
    })

    const getUserData = async () => {
        try {
            await axios.get(
                `${API_URL}user/${user.user_id}/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                },
            )
                .then(res => {
                    setUserData(res.data);
                });

        } catch (e) {
            console.log(e);
        }
    }



    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        form.setFieldsValue(userData);
    }, [userData])

    const putUser = async (values) => {
        try {
            await axios.put(
                `${API_URL}user/${user.user_id}/`,
                JSON.stringify(values),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                },
            )
                .then(res => notification.success({ message: 'Vos informations ont été modifiées !', placement: "top" }));
        } catch (e) {
            console.log(e);
        }
    }

    const [form] = Form.useForm();


    return (
        <div>
            <h1>Mes informations</h1>
            <div className="email-and-form">
                <div style={{ paddingBottom: "20px" }}>Mon email: {userData?.email}</div>
                <Form
                    form={form}
                    name="update"
                    onFinish={putUser}
                >
                    <div className="first-last-name">
                        <Form.Item
                            name="first_name"
                            label="Prénom"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="last_name"
                            label="Nom de famille"
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="address_line"
                        label="Adresse"
                        wrapperCol={{ span: 16 }}
                    >
                        <Input />
                    </Form.Item>

                    <div className='postal-code-city'>
                        <Form.Item
                            name="postal_code"
                            label="Code postal"
                            wrapperCol={{ span: 3 }}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="city"
                            label="Ville"
                            wrapperCol={{ span: 8 }}
                        >
                            <Input />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="country"
                        label="Pays"
                        wrapperCol={{ span: 8 }}
                    >
                        <Select showSearch options={countryNames} />
                    </Form.Item>

                    <Form.Item wrapperCol={{ span: 12, offset: 1 }}>
                        <Button type="primary" htmlType="submit">Mettre à jour</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
