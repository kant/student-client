import Flux from '@4geeksacademy/react-flux-dash';
import React from "react";
import {Panel, Loading} from '../../components/react-components/src/index';
import OldStore from '../../stores/OldStore';
import Raven from 'raven-js';
import {Session} from 'bc-react-session';

export default class ReplitView extends Flux.View {
  
  constructor(){
    super();
    this.state = {
      loading: true,
      cohort: '',
      error: false
    };
  }
  
  componentWillMount()
  {
    const session = Session.get();
    this.setState({ cohort: session.payload.currentCohort });
  }
  
  getReplitURL(){
    const replit_slug = this.props.match.params.replit_slug;
    const cohort_slug = this.state.cohort.slug;
    const profile_slug = this.state.cohort.profile_slug;
    const url = process.env.REPLIT_URL+replit_slug+'&c='+cohort_slug+'&profile='+profile_slug;
    if(typeof replit_slug === 'undefined' || typeof cohort_slug === 'undefined' || typeof process.env.REPLIT_URL === 'undefined')
      Raven.captureException(new Error(`Invalid Replit URL ${url}`));

    return url;
  }
  
  render() {
    return (
      <Panel padding={false}>
        {
          (!this.state.error) ? 
            (<span><Loading show={this.state.loading} />
              <iframe onLoad={(e)=> {
                this.setState({loading: false});
              }} className="replit-iframe" src={this.getReplitURL()} 
                height="100%" width="100%" frameBorder="0" /></span>)
            : (<div className="alert alert-danger">
                {this.state.error}
              </div>)
        }
      </Panel>
    );
  }
}