import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import AboutUs from './containers/AboutUs/AboutUs';
import Home from './containers/Home/Home';
import Dashboard from './containers/Dashboard/Dashboard';
import Layout from "./hoc/Layout/Layout";
import Questionnaire from "./containers/Questionnaire/Questionnaire";
import GeneralAnamnesis from "./containers/GeneralAnamnesis/GeneralAnamnesis";
import SymptomAnamnesis from './containers/SmyptomAnamnesis/SymptomAnamnesis';

class App extends Component {


    render() {

        let routes = (
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about-us" component={AboutUs} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/questionnaire' component={Questionnaire} />
                <Route exact path='/user-info' component={GeneralAnamnesis} />
                <Route exact path='/daily-q' component={SymptomAnamnesis} />
                <Route exact path='/info' render={() => <h1>Info Page</h1>} />
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

export default withRouter(App);

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
