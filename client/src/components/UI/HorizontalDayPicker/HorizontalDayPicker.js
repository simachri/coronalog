import React, { Component } from "react";
import ScrollMenu from "react-horizontal-scrolling-menu";

import DayItems from './DayItems/DayItems';
import Arrow from './DayItems/Arrow/Arrow';

import './overwrite.css';
import classes from './HorizontalDayPicker.module.css';

class HorizontalDayPicker extends Component {

    state = {
        selected: null
    };

    onSelect = ( item ) => this.setState({selected: item});


    render() {

        const ArrowLeft = <Arrow text='<' type='arrow-prev' desktopOnly={true} />;
        const ArrowRight = <Arrow text='>' type='arrow-succ' desktopOnly={true}/>;

        const menuItems = DayItems({startToday:true, amountDays:30});

        return (
            <div>
                <div>März</div>
                <ScrollMenu
                    data={menuItems}
                    arrowLeft={ArrowLeft}
                    arrowRight={ArrowRight}
                    selected={this.state.selected}
                    onSelect={this.onSelect}
                />
            </div>
        );
    }

}

export default HorizontalDayPicker;