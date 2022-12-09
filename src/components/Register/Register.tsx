import { Form, Input, Button, notification, Col, Row } from 'antd'
import axios from 'axios';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/config';
import "./register.css";


export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const createUser = async (createData) => {
    delete createData.confirm;

    try {
      await axios.post(
        `${API_URL}user/`,
        createData,
      )
        .then(res => notification.success({ message: 'Votre compte a été créé !', placement: "top" }));

      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="login-container">
      <div className="login-title">S'enregistrer</div>
      <div className="register-text" style={{ paddingBottom: "30px" }}>
        <span style={{ paddingRight: "8px" }}>J'ai déjà un compte ?</span>
        <NavLink to="/login">Se connecter</NavLink>
      </div>
      <Form
        form={form}
        name="register"
        style={{ width: "100%" }}
        onFinish={createUser}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 8 }}
      >
        <div className="form-register">
          <Form.Item
            label="Prénom"
            name="first_name"
            rules={[{ required: true, message: 'Ce champs est requis', whitespace: true }]}
          >
            <Input placeholder='Prénom' />
          </Form.Item>

          <Form.Item
            label="Nom de famille"
            name="last_name"
            rules={[{ required: true, message: 'Ce champs est requis', whitespace: true }]}
          >
            <Input placeholder='Nom de famille' />
          </Form.Item>


          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Email invalide',
              },
              {
                required: true,
                message: 'Ce champs est requis',
              },
            ]}
          >
            <Input placeholder='Email' />
          </Form.Item>

          <Form.Item

            label="Mot de passe"
            name="password"
            rules={[
              {
                required: true,
                message: 'Ce champs est requis',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('password').length >= 6) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Votre mot de passe doit contenir au moins 6 caractères"));
                },
              }),

            ]}
            hasFeedback
          >
            <Input.Password placeholder='Mot de passe' />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Ce champs est requis',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les deux mots de passe sont différents'));
                },
              }),
            ]}
          >
            <Input.Password placeholder='Confirmez votre mot de passe...' />
          </Form.Item>
        </div>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit">
            S'enregistrer
          </Button>
        </Form.Item>

      </Form>
    </div>
  )
}
