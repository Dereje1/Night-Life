"use strict"//dumb component constructs a single venue
import React, { Component } from 'react';
import {Col,Image,Button} from 'react-bootstrap'

class Singlevenue extends Component {

  render() {
    let businessName = this.props.business.name
    let yelpId = this.props.business.id
    //sometimes there are no images returned from yelp
    let thumbSource = (this.props.business.image_url==='') ? '/images/NO-IMAGE.png' : this.props.business.image_url
    let yelpLink = this.props.business.url
    let description = this.props.business.categories.map((c)=>{
      return c.alias
    }).join(' / ')
    let buttonColor = (this.props.going[1]>0) ? {"backgroundColor":"#b5b008"} : {"backgroundColor":"#ab99af"}
    buttonColor = (this.props.going[0]>0) ?{"backgroundColor":"#ff0018"} : buttonColor
    return (
      <Col className="venuecol" xs={12} sm={6} md={4} lg={3}>
          <Button className="goingButton" block style={buttonColor} onClick={()=>this.props.onClick(yelpId)} >{this.props.going[0]+this.props.going[1]} Going</Button>
          <a href={yelpLink} target="_blank">
            <Image className="venueimg center-block" src={thumbSource} rounded />
          </a>
          <h5 className="text-center">{businessName}</h5>
          <p className="text-center">{description}</p>
      </Col>
    );
  }

}
export default Singlevenue
