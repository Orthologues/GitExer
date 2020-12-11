import React from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';


    function RenderDish({dish}) {
        if (dish != null) {

            return(
                <Card key={dish.id}>
                    <CardImg top src={dish.image} alt={dish.name} />
                    <CardBody>
                      <CardTitle>{dish.name}</CardTitle>
                      <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            );
        } else{
            return(
                <div></div>
            );
        }
    }


    function RenderComments({ comments }) {
        if (comments != null){

            return (
                <ul class="list-unstyled">
                    <h4>Comments</h4>
                    {comments.map(commentObj=>{
                        return (
                        <div>
                            <li>{commentObj.comment}</li>
                            <li>-- {commentObj.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(commentObj.date)))}</li>
                        </div>
                );
            })}
                </ul>
            );
        } else{
            return (<div></div>);
        }
    }

    const DishDetail = (props) => {

        return (
            <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>                
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments} />
                </div>
            </div>
            </div>
        );
    }
        

export default DishDetail;