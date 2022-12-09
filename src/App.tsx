import { UserOutlined, CloseOutlined, ShoppingOutlined, MenuOutlined } from "@ant-design/icons";
import { Layout, MenuProps, Dropdown, Menu, Badge } from "antd";
import { useState, useContext } from "react";
import { NavLink, Routes, Route, } from "react-router-dom";
import Basket from "./components/Basket/Basket";
import { CommandDetail } from "./components/CommandDetail/CommandDetail";
import { Commands } from "./components/Commands/Commands";
import CompanyIntroduction from "./components/CompanyIntroduction/CompanyIntroduction";
import CookieDetail from "./components/CookieDetail/CookieDetail";
import Cookies from "./components/Cookies/Cookies";
import { Login } from "./components/Login/Login";
import Register from "./components/Register/Register";
import AuthContext from "./context/AuthContext";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import "./app.css";
import { Home } from "./components/Home/Home";
import { MyInformation } from "./components/MyInformation/MyInformation";
const logo = require("./utils/logo.png");

const { Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  let { authTokens, logoutUser, basketItemsCount } = useContext(AuthContext);

  const onClickMenu = () => setCollapsed(true);

  const getItems = () => {
    const items: MenuProps['items'] = [
      {
        key: "3",
        label: <NavLink onClick={onClickMenu} to={"/"} >Home</NavLink>,
      },
      {
        key: "1",
        label: <NavLink onClick={onClickMenu} to="cookies">Nos Cookies</NavLink>,
      },
      {
        key: "2",
        label: <NavLink onClick={onClickMenu} to="whoarewe">L'atelier</NavLink>,
      },
    ]
    return items;
  };

  const getNavlinkUser = () => {
    if (!authTokens) return (
      <NavLink to="login" style={{ color: "black" }}>
        <UserOutlined className="header-icon" /><span style={{ marginLeft: "5px" }}>Se connecter</span>
      </NavLink>
    );

    const items = [
      { label: <NavLink to={'my-information'}>Mes informations</NavLink>, key: 'my_information' },
      { label: <NavLink to={'commands'}>Mes Commandes</NavLink>, key: 'commandes' },
      { label: <div onClick={logoutUser} style={{ color: '#d94a62' }}>Déconnexion</div>, key: 'deconnexion' },
    ];

    return (
      <span>
        <Dropdown menu={{ items }} trigger={["hover", "click"]} arrow>
          <span>
            <UserOutlined className="header-icon" /><span style={{ marginLeft: "5px" }}>Mon Compte</span>
          </span>
        </Dropdown>
      </span>)
  };

  const getBasket = () => {
    return (<NavLink to="basket">
      <Badge showZero={true} count={basketItemsCount}>
        <ShoppingOutlined className="header-icon" />
      </Badge>
    </NavLink>)
  }

  const getMenuPhone = () => {
    const items = getItems();
    if (!authTokens) {
      items.push(
        {
          key: "4",
          label: <NavLink to="login" onClick={onClickMenu}>Se connecter</NavLink>,
          icon: <UserOutlined />
        },
      )
    } else {
      items.push(
        {
          key: "4",
          label: "Mon compte",
          icon: <UserOutlined />,
          children: [{
            key: "my_information",
            label: <NavLink onClick={onClickMenu} to="/my-information">Mes informations</NavLink>,
          }, {
            key: "5",
            label: <NavLink onClick={onClickMenu} to="commands">Mes Commandes</NavLink>,
          }, {
            label: <div onClick={() => { logoutUser(); setCollapsed(true); }} style={{ color: '#d94a62' }}>Déconnexion</div>, key: 'deconnexion'
          },
          ]
        },
      )
    }
    return items;
  }

  return (
    <div className="container">
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
          collapsedWidth="0"
          width="100%"
          className="sider"
        >
          <div className="close" onClick={onClickMenu}>
            <CloseOutlined /> Fermer
          </div>
          <Menu className="menu" mode="inline" items={getMenuPhone()} />
        </Sider>
        <Layout>
          <div className='header-large'>
            <NavLink to='/'>
              <img className="logo" src={logo} alt="Logo" />
            </NavLink>
            <Menu className="menu" mode="horizontal" items={getItems()} />
            <span className="icons">
              {getBasket()}
              {getNavlinkUser()}
            </span>
          </div>
          <div className="header-mini">
            <MenuOutlined className="menu-icon" onClick={() => setCollapsed(false)} />
            <NavLink to='cookies'>
              <img className="logo" src={logo} alt="Logo" />
            </NavLink>
            <span className="icons">
              {getBasket()}
            </span>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <div className="content">
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/basket" element={<Basket />} />
                <Route path="/commands" element={<Commands />} />
                <Route path="/my-information" element={<MyInformation />} />
                <Route path="/commands/:id" element={<CommandDetail />} />
              </Route>
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/cookies/:id" element={<CookieDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/whoarewe" element={<CompanyIntroduction />} />
              <Route path="login/register" element={<Register />} />
            </Routes>
          </div>
          <Footer style={{ textAlign: 'center', }}> ©2022 by Cookies Shop Homemade & healthy</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;