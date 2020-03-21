import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import asyncComponent from './hoc/asyncComponent/asyncComponent';

import AboutUs from './containers/AboutUs/AboutUs';
import Home from './containers/Home/Home';
import Layout from "./hoc/Layout/Layout";

class App extends Component {


    render() {

        let routes = (
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/about-us" component={AboutUs} />
                <Redirect to="/" />
            </Switch>
        );

        return (
            <div>
                <Layout>
                    {routes}
                </Layout>
            </div>
        );
    }

}

export default withRouter(connect()(App));

// function App() {
//
//     const[registrations, setRegistrations] = useState('');
//
//   //  useEffect is called after rendering
//     useEffect(() => {
//         fetch('/registrations').then(res => res.json()).then(data => {
//             setRegistrations(JSON.stringify(data));
//         });
//     }, []);
//
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//           <p>These registrations exists: {registrations}</p>
//       </header>
//     </div>
//   );
// }
//
// export default App;
