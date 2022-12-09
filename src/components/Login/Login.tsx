import { Button, Form, Input } from 'antd';
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import "./login.css"

export const Login = () => {
  let { loginUser } = useContext(AuthContext);

  return (
    <div className="login-container">
      <div className="login-title">Se connecter</div>
      <div className="register-text">
        <span style={{ paddingRight: "8px" }}>Nouveau sur ce site ?</span>
        <NavLink to="register">S'inscrire</NavLink>
      </div>
      <Form
        className='login-form'
        name="basic"
        onFinish={loginUser}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          required={false}
          rules={[{ required: true, message: 'Please input your username!' }, {
            type: 'email',
            message: 'Adresse email invalide',
          },]}
        >
          <Input style={{ width: "300px" }} placeholder='Entrez votre email...' />
        </Form.Item>

        <Form.Item
          name="password"
          required={false}
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password style={{ width: "300px" }} placeholder='Entrez votre mot de passe...' />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
