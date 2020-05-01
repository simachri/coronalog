import React, { Component } from "react";
import Picker, { TYPE_YEAR } from '../../components/UI/Picker/Picker';

class AboutUs extends Component {

    render() {
        return (
            <div>AboutUs
                <Picker type={TYPE_YEAR} from={1950} to={2010}/>
            </div>
        );
    }

}

export default AboutUs;