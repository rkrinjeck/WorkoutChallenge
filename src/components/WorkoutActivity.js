import React, {Component} from 'react';
import { Badge } from 'primereact/badge';


class WorkoutActivity extends React.Component {
    render() {
      return <div className='flex-auto flex align-items-center justify-content-center' style={{ position: 'relative'}}>
        <div style={{padding:'4px' }}>

        <Badge value={(this.props.activityCount)} size="large" severity="success"></Badge>
      <p>
        {this.props.activityName}
      </p>
      </div>
      </div>;
    }
  }

  export default WorkoutActivity;